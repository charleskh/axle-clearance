/**
 * Builds a complete elevation scene in SVG drawing units.
 *
 * World space is physical inches: x from the vehicle centerline, y up from the
 * ground. One fixed scale and one fixed viewport cover every supported tire
 * size, so switching tires moves geometry inside the frame instead of
 * rescaling the frame. Drawing units are `SCALE` per inch.
 */

import { MAX_TIRE_DIAMETER, tireForDiameter } from '../tires';
import { effectiveTireRadius, portalLift } from '../clearance';
import type { AxleConfiguration, TireSpec } from '../types';
import { buildAssembly, buildTire, type AssemblyDrawing, type PartRole } from './assembly';
import {
  line,
  mapPath,
  pt,
  toD,
  translate,
  type Point,
  type Segment,
  type Transform
} from './path';

/** Drawing units per inch. Fixed: never derived from the tire. */
export const SCALE = 10;

export type ViewMode = 'single' | 'side-by-side' | 'overlay';
export type Variant = 'selected' | 'baseline';

export interface ScenePath {
  id: string;
  role: PartRole;
  d: string;
  schematic: boolean;
}

export interface SceneLayer {
  id: string;
  variant: Variant;
  paths: ScenePath[];
}

export type DimensionTone = 'clearance' | 'reference' | 'baseline' | 'delta';

/** An engineering dimension: two witness points and a dimension line between them. */
export interface SceneDimension {
  id: string;
  tone: DimensionTone;
  orientation: 'vertical' | 'horizontal';
  /** Dimension line endpoints, drawing units. */
  a: Point;
  b: Point;
  /** Witness (extension) lines from the feature to the dimension line. */
  witness: { from: Point; to: Point }[];
  /** Label anchor, drawing units; the renderer offsets text from here. */
  label: Point;
  labelSide: 'left' | 'right' | 'above';
  text: string;
  subtext?: string;
}

export interface SceneCenterline {
  id: string;
  kind: 'axle' | 'vehicle' | 'wheel';
  variant: Variant;
  d: string;
}

export interface SceneTag {
  x: number;
  y: number;
  text: string;
  variant: Variant;
  anchor: 'start' | 'middle' | 'end';
}

export interface Scene {
  /** Which side the axle is drawn from: front axles from ahead, rear axles from behind. */
  view: 'front' | 'rear';
  viewBox: { x: number; y: number; width: number; height: number };
  scale: number;
  groundY: number;
  groundX: [number, number];
  layers: SceneLayer[];
  centerlines: SceneCenterline[];
  dimensions: SceneDimension[];
  tags: SceneTag[];
  /** Drawing-unit points tests can check invariants against. */
  anchors: {
    selected: SceneAnchors;
    baseline?: SceneAnchors;
  };
}

export interface SceneAnchors {
  axleCenterlineY: number;
  /** Same as axleCenterlineY except on a solid portal axle. */
  wheelCenterlineY: number;
  housingLowPoint: Point;
  wheelCenterX: { passenger: number; driver: number };
  panelOffsetX: number;
}

export interface SceneInput {
  axle: AxleConfiguration;
  mode: ViewMode;
  /** Tire being drawn. May be an in-between tire while a transition animates. */
  selected: TireSpec;
  baseline: TireSpec;
  loadedRadiusDeflection: number;
  /** Housing drop used for the drawing; the calibrated value when the user set one. */
  housingDrop: number;
  /** Axle under the baseline tire. Defaults to `axle`; set it to compare two axles. */
  baselineAxle?: AxleConfiguration;
  /** Housing drop for the baseline axle. Defaults to `housingDrop`. */
  baselineHousingDrop?: number;
  /** Exact values shown in labels. Kept separate so an animating drawing never shows rounded-in-flight numbers. */
  labels: {
    selectedClearance: string;
    baselineClearance: string;
    clearanceDelta: string;
    selectedRadius: string;
    baselineRadius: string;
    selectedDiameter: string;
    baselineDiameter: string;
    drop: string;
    dropStatus: string;
    clearanceStatus: string;
    /** Axle names for panel tags; empty when both panels show the same axle. */
    selectedName?: string;
    baselineName?: string;
  };
}

/** Axles are drawn from the side their cover faces: front axles from ahead, rear from behind. */
export function viewFrom(axle: AxleConfiguration): 'front' | 'rear' {
  return axle.position === 'rear' ? 'rear' : 'front';
}

/** Half-width of one panel in inches. Sized for the widest supported tire. */
function panelHalfWidth(axle: AxleConfiguration): number {
  const widest = tireForDiameter(MAX_TIRE_DIAMETER).sectionWidth;
  const trackHalf = axle.housing.wheelEnds.wmsWidth.value / 2 - axle.wheel.offset.value;
  // Room outside the tire for the diameter and radius dimension lines.
  return trackHalf + widest / 2 + 14;
}

const GROUND_DEPTH = 5;
const TOP_MARGIN = 12;

/**
 * Fixed world-space frame for the axles on screen and the mode. Independent of
 * the tire. With two axles, both panels take the wider one's width so they
 * share one scale and one ground line.
 */
export function viewportInches(axles: AxleConfiguration[], mode: ViewMode) {
  const half = Math.max(...axles.map(panelHalfWidth));
  const panels = mode === 'side-by-side' ? 2 : 1;
  return {
    minX: -half,
    maxX: -half + panels * 2 * half,
    minY: -GROUND_DEPTH,
    maxY: MAX_TIRE_DIAMETER + TOP_MARGIN,
    panelWidth: 2 * half
  };
}

/**
 * Housing drop override: the drawing follows the calibrated drop so the
 * dimension line always lands on the drawn low point.
 */
const withDropCache = new WeakMap<AxleConfiguration, Map<number, AxleConfiguration>>();

function axleWithDrop(axle: AxleConfiguration, drop: number): AxleConfiguration {
  const cs = axle.housing.centerSection;
  if (cs.dropBelowCenterline.value === drop) return axle;
  // Same object for the same (axle, drop), so the assembly cache below hits
  // on every animation frame instead of rebuilding the housing.
  let byDrop = withDropCache.get(axle);
  if (!byDrop) {
    byDrop = new Map();
    withDropCache.set(axle, byDrop);
  }
  const cached = byDrop.get(drop);
  if (cached) return cached;
  const next: AxleConfiguration = {
    ...axle,
    housing: {
      ...axle.housing,
      centerSection: { ...cs, dropBelowCenterline: { ...cs.dropBelowCenterline, value: drop } }
    }
  };
  byDrop.set(drop, next);
  return next;
}

/** The housing does not depend on the tire, so build it once per axle object. */
const assemblyCache = new WeakMap<AxleConfiguration, AssemblyDrawing>();

function assemblyFor(axle: AxleConfiguration): AssemblyDrawing {
  const cached = assemblyCache.get(axle);
  if (cached) return cached;
  const built = buildAssembly(axle);
  assemblyCache.set(axle, built);
  return built;
}

interface PanelResult {
  axle: AxleConfiguration;
  layer: SceneLayer;
  anchors: SceneAnchors;
  centerlines: SceneCenterline[];
  /** Outer tire edges in drawing units, by screen side. */
  tireOuterX: { left: number; right: number };
  tireTopY: number;
  tireBottomY: number;
  radius: number;
}

function buildPanel(
  axle: AxleConfiguration,
  tire: TireSpec,
  deflection: number,
  variant: Variant,
  panelOffsetX: number,
  toSvg: Transform,
  view: 'front' | 'rear'
): PanelResult {
  const radius = effectiveTireRadius(tire.nominalDiameter, deflection);
  const assembly = assemblyFor(axle);
  // Assembly space has y = 0 on the axle centerline; lift it by the axle
  // centerline height (the loaded radius, plus the portal drop on a solid
  // portal axle). A rear axle is seen from behind, so x is mirrored.
  const lift = radius + portalLift(axle);
  const wheelY = assembly.wheelCenterY;
  const mirror = view === 'rear' ? -1 : 1;
  const place: Transform = (p) => toSvg(pt(mirror * p.x + panelOffsetX, p.y + lift));
  const onWheelAxis = translate(0, wheelY);

  const tires = [
    ...buildTire(axle, tire, assembly.wheelCenters.passenger, deflection, `${variant}-passenger`),
    ...buildTire(axle, tire, assembly.wheelCenters.driver, deflection, `${variant}-driver`)
  ].map((p) => ({ ...p, path: mapPath(p.path, onWheelAxis) }));
  // Paint order: solid assembly, then the tires over it (the tread face hides
  // whatever sits inside the wheel), then hidden lines on top, dashed.
  const parts = [
    ...assembly.parts.filter((p) => p.role !== 'hidden'),
    ...tires.filter((p) => p.role !== 'hidden'),
    ...assembly.parts.filter((p) => p.role === 'hidden'),
    ...tires.filter((p) => p.role === 'hidden')
  ];

  const paths: ScenePath[] = parts.map((part) => ({
    id: part.id,
    role: part.role,
    d: toD(mapPath(part.path, place)),
    schematic: part.schematic
  }));

  const half = panelHalfWidth(axle);
  const cl = (kind: SceneCenterline['kind'], id: string, path: Segment[]): SceneCenterline => ({
    id: `${variant}-${id}`,
    kind,
    variant,
    d: toD(mapPath(path, place))
  });
  const topY = wheelY + tire.nominalDiameter / 2 + 1.5;
  const centerlines = [
    cl('axle', 'axle-cl', line(pt(-half + 1, 0), pt(half - 1, 0))),
    cl('vehicle', 'vehicle-cl', line(pt(0, -lift - 1), pt(0, MAX_TIRE_DIAMETER + 4 - lift))),
    cl(
      'wheel',
      'wheel-cl-passenger',
      line(pt(assembly.wheelCenters.passenger, -lift), pt(assembly.wheelCenters.passenger, topY))
    ),
    cl(
      'wheel',
      'wheel-cl-driver',
      line(pt(assembly.wheelCenters.driver, -lift), pt(assembly.wheelCenters.driver, topY))
    ),
    // A portal axle's wheels turn on their own, lower axis.
    ...(wheelY !== 0
      ? [cl('axle', 'wheel-axis', line(pt(-half + 1, wheelY), pt(half - 1, wheelY)))]
      : [])
  ];

  const low = place(assembly.housingLowPoint);
  const halfW = tire.sectionWidth / 2;
  const centersX = [
    place(pt(assembly.wheelCenters.passenger, 0)).x,
    place(pt(assembly.wheelCenters.driver, 0)).x
  ];
  return {
    axle,
    layer: { id: `${variant}-assembly`, variant, paths },
    centerlines,
    anchors: {
      axleCenterlineY: place(pt(0, 0)).y,
      wheelCenterlineY: place(pt(0, wheelY)).y,
      housingLowPoint: low,
      wheelCenterX: {
        passenger: place(pt(assembly.wheelCenters.passenger, 0)).x,
        driver: place(pt(assembly.wheelCenters.driver, 0)).x
      },
      panelOffsetX: panelOffsetX * SCALE
    },
    tireOuterX: {
      left: Math.min(...centersX) - halfW * SCALE,
      right: Math.max(...centersX) + halfW * SCALE
    },
    tireTopY: place(pt(0, wheelY + tire.nominalDiameter / 2)).y,
    tireBottomY: place(pt(0, wheelY - tire.nominalDiameter / 2)).y,
    radius
  };
}

function vertical(
  id: string,
  tone: DimensionTone,
  x: number,
  y0: number,
  y1: number,
  witnessFromX: number[],
  labelSide: 'left' | 'right',
  text: string,
  subtext?: string,
  /** Label height when the midpoint would collide with other geometry. */
  labelY?: number
): SceneDimension {
  const [ya, yb] = [y0, y1];
  return {
    id,
    tone,
    orientation: 'vertical',
    a: pt(x, ya),
    b: pt(x, yb),
    witness: witnessFromX.map((wx, i) => {
      const y = i === 0 ? ya : yb;
      return { from: pt(wx, y), to: pt(x, y) };
    }),
    label: pt(x, labelY ?? (ya + yb) / 2),
    labelSide,
    text,
    subtext
  };
}

export function buildScene(input: SceneInput): Scene {
  const { mode, selected, baseline, loadedRadiusDeflection: deflection, labels } = input;
  const axle = axleWithDrop(input.axle, input.housingDrop);
  const baseAxle = axleWithDrop(
    input.baselineAxle ?? input.axle,
    input.baselineHousingDrop ?? input.housingDrop
  );
  const vp = viewportInches(mode === 'single' ? [axle] : [axle, baseAxle], mode);
  const toSvg: Transform = (p) => pt((p.x - vp.minX) * SCALE, (vp.maxY - p.y) * SCALE);
  const groundY = toSvg(pt(0, 0)).y;
  const view = viewFrom(axle);

  const layers: SceneLayer[] = [];
  const centerlines: SceneCenterline[] = [];
  const dimensions: SceneDimension[] = [];
  const tags: SceneTag[] = [];

  const sideBySide = mode === 'side-by-side';
  const selOffset = sideBySide ? vp.panelWidth : 0;
  const sel = buildPanel(axle, selected, deflection, 'selected', selOffset, toSvg, view);

  let base: PanelResult | undefined;
  if (mode !== 'single') {
    // The baseline is drawn with the selected axle's sides so that DRIVER and
    // PASSENGER mean the same thing on both. A rear baseline under a front
    // selection is therefore seen from ahead, cover side toward the viewer.
    base = buildPanel(baseAxle, baseline, deflection, 'baseline', 0, toSvg, view);
    if (sideBySide) centerlines.push(...base.centerlines);
  }
  layers.push(sel.layer);
  // Overlay draws the baseline last, as a dashed outline with no fill, so it
  // stays visible through the selected tires.
  if (base) layers.push(base.layer);
  centerlines.push(...sel.centerlines);

  const low = sel.anchors.housingLowPoint;
  const step = 2.4 * SCALE;

  // Primary measurement: ground to housing low point.
  dimensions.push(
    vertical(
      'clearance-selected',
      'clearance',
      low.x,
      groundY,
      low.y,
      [],
      'right',
      labels.selectedClearance,
      labels.clearanceStatus
    )
  );

  // Drop: axle centerline to housing low point, beside the cover.
  const coverEdge = low.x + (axle.housing.centerSection.cover.width.value / 2 + 2.6) * SCALE;
  dimensions.push(
    vertical(
      'drop',
      'reference',
      coverEdge,
      sel.anchors.axleCenterlineY,
      low.y,
      [low.x + 4 * SCALE, low.x],
      'right',
      labels.drop,
      labels.dropStatus,
      // Below the tube and radius-arm mounts, level with the low point.
      low.y - 0.4 * SCALE
    )
  );

  // Loaded radius = axle centerline height, outboard of the driver tire.
  const rx = sel.tireOuterX.right + step;
  dimensions.push(
    vertical(
      'radius-selected',
      'reference',
      rx,
      groundY,
      sel.anchors.wheelCenterlineY,
      [sel.tireOuterX.right, sel.tireOuterX.right + SCALE],
      'right',
      labels.selectedRadius,
      sel.anchors.wheelCenterlineY === sel.anchors.axleCenterlineY ? 'axle CL' : 'wheel CL'
    )
  );

  // Solid portal: the tubes ride above the wheel by the portal drop. Chain it
  // onto the radius dimension so the two add up to the axle centerline height.
  if (axle.portal && sel.anchors.wheelCenterlineY !== sel.anchors.axleCenterlineY) {
    dimensions.push(
      vertical(
        'portal-drop',
        'reference',
        rx,
        sel.anchors.wheelCenterlineY,
        sel.anchors.axleCenterlineY,
        [sel.tireOuterX.right, sel.tireOuterX.right + SCALE],
        'right',
        `${axle.portal.drop.value.toFixed(2)}"`,
        'portal drop'
      )
    );
  }

  // Nominal tire diameter, outboard of the passenger tire.
  const dx = sel.tireOuterX.left - step;
  dimensions.push(
    vertical(
      'diameter-selected',
      'reference',
      dx,
      sel.tireBottomY,
      sel.tireTopY,
      [sel.tireOuterX.left + step, sel.tireOuterX.left + step],
      'left',
      labels.selectedDiameter,
      'tire dia.'
    )
  );

  if (base) {
    const bLow = base.anchors.housingLowPoint;
    if (sideBySide) {
      dimensions.push(
        vertical(
          'clearance-baseline',
          'baseline',
          bLow.x,
          groundY,
          bLow.y,
          [],
          'right',
          labels.baselineClearance,
          'baseline'
        )
      );
      dimensions.push(
        vertical(
          'radius-baseline',
          'baseline',
          base.tireOuterX.right + step,
          groundY,
          base.anchors.wheelCenterlineY,
          [base.tireOuterX.right, base.tireOuterX.right + SCALE],
          'right',
          labels.baselineRadius,
          base.anchors.wheelCenterlineY === base.anchors.axleCenterlineY ? 'axle CL' : 'wheel CL'
        )
      );
      if (baseAxle.portal && base.anchors.wheelCenterlineY !== base.anchors.axleCenterlineY) {
        dimensions.push(
          vertical(
            'portal-drop-baseline',
            'baseline',
            base.tireOuterX.right + step,
            base.anchors.wheelCenterlineY,
            base.anchors.axleCenterlineY,
            [base.tireOuterX.right, base.tireOuterX.right + SCALE],
            'right',
            `${baseAxle.portal.drop.value.toFixed(2)}"`,
            'portal drop'
          )
        );
      }
      dimensions.push(
        vertical(
          'diameter-baseline',
          'baseline',
          base.tireOuterX.left - step,
          base.tireBottomY,
          base.tireTopY,
          [base.tireOuterX.left + step, base.tireOuterX.left + step],
          'left',
          labels.baselineDiameter,
          'tire dia.'
        )
      );
      tags.push({
        x: vp.panelWidth * 0.5 * SCALE,
        y: groundY + 3.4 * SCALE,
        text: ['BASELINE', labels.baselineName, labels.baselineDiameter]
          .filter(Boolean)
          .join(' \u00b7 '),
        variant: 'baseline',
        anchor: 'middle'
      });
      tags.push({
        x: vp.panelWidth * 1.5 * SCALE,
        y: groundY + 3.4 * SCALE,
        text: ['SELECTED', labels.selectedName, labels.selectedDiameter]
          .filter(Boolean)
          .join(' \u00b7 '),
        variant: 'selected',
        anchor: 'middle'
      });
    } else {
      // Overlay: baseline clearance just left of the selected one, and the gain between low points.
      const bx = bLow.x - 3.2 * SCALE;
      dimensions.push(
        vertical(
          'clearance-baseline',
          'baseline',
          bx,
          groundY,
          bLow.y,
          [bLow.x],
          'left',
          labels.baselineClearance,
          'baseline'
        )
      );
      if (Math.abs(bLow.y - low.y) > 0.01) {
        const gx = low.x - 8.5 * SCALE;
        dimensions.push(
          vertical(
            'clearance-delta',
            'delta',
            gx,
            bLow.y,
            low.y,
            [bLow.x - 3.2 * SCALE, low.x],
            'left',
            labels.clearanceDelta,
            bLow.y > low.y ? 'gained' : 'lost'
          )
        );
      }
    }
  }

  // Track: wheel center to wheel center, above the tallest tire. Fixed height so it never jumps.
  const trackY = toSvg(pt(0, MAX_TIRE_DIAMETER + 4.5)).y;
  for (const panel of sideBySide && base ? [base, sel] : [sel]) {
    const { passenger, driver } = panel.anchors.wheelCenterX;
    dimensions.push({
      id: `track-${panel.layer.variant}`,
      tone: 'reference',
      orientation: 'horizontal',
      a: pt(passenger, trackY),
      b: pt(driver, trackY),
      witness: [
        { from: pt(passenger, panel.tireTopY - SCALE), to: pt(passenger, trackY - SCALE) },
        { from: pt(driver, panel.tireTopY - SCALE), to: pt(driver, trackY - SCALE) }
      ],
      label: pt((passenger + driver) / 2, trackY),
      labelSide: 'above',
      text: `${panel.axle.wheel.trackWidth.value.toFixed(1)}" track`,
      subtext: 'wheel centers fixed'
    });
  }

  if (!sideBySide) {
    const leftX = toSvg(pt(-vp.panelWidth / 2 + 1.5, 0)).x;
    const rightX = toSvg(pt(vp.panelWidth / 2 - 1.5, 0)).x;
    const y = 3 * SCALE;
    const [left, right] = view === 'front' ? ['PASSENGER', 'DRIVER'] : ['DRIVER', 'PASSENGER'];
    tags.push({ x: leftX, y, text: `\u2190 ${left}`, variant: 'selected', anchor: 'start' });
    tags.push({ x: rightX, y, text: `${right} \u2192`, variant: 'selected', anchor: 'end' });
  }

  const width = (vp.maxX - vp.minX) * SCALE;
  return {
    view,
    viewBox: { x: 0, y: 0, width, height: (vp.maxY - vp.minY) * SCALE },
    scale: SCALE,
    groundY,
    groundX: [0, width],
    layers,
    centerlines,
    dimensions,
    tags,
    anchors: { selected: sel.anchors, baseline: base?.anchors }
  };
}
