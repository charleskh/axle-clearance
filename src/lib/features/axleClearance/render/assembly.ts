/**
 * Elevation geometry of an axle assembly and its tires, in inches, seen from
 * the cover side.
 *
 * Assembly coordinates: x from the vehicle centerline (positive = driver side;
 * the scene mirrors rear axles, which are viewed from behind), y from the axle centerline
 * (positive = up). Nothing here depends on tire size except `buildTire`, which
 * is why the housing cannot change size when the tire does.
 */

import type {
  AxleConfiguration,
  IfsGeometry,
  PortalGeometry,
  RearWheelEnd,
  SteerWheelEnd,
  TireSpec
} from '../types';
import {
  circle,
  ellipse,
  line,
  polyline,
  pt,
  rect,
  roundedRect,
  translate,
  mapPath,
  type Point,
  type Segment
} from './path';

/** Visual role of a part. The renderer maps each role to one stroke style. */
export type PartRole =
  | 'casting'
  | 'tube'
  | 'cover'
  | 'bolt'
  | 'knuckle'
  | 'hub'
  | 'detail'
  | 'hidden'
  | 'tire'
  | 'tread';

export interface Part {
  id: string;
  role: PartRole;
  path: Segment[];
  /** True for parts drawn from schematic, not measured, geometry. */
  schematic: boolean;
}

export interface AssemblyDrawing {
  parts: Part[];
  /** Lowest point of the differential housing, assembly coordinates. */
  housingLowPoint: Point;
  /** Wheel centerline x for each side. */
  wheelCenters: { passenger: number; driver: number };
  /**
   * Wheel centerline height in assembly coordinates. 0 except on a solid
   * portal axle, where the wheel sits the portal drop below the tubes.
   */
  wheelCenterY: number;
  /** Wheel mounting surface x for each side. */
  wmsX: { passenger: number; driver: number };
  diffCenterX: number;
}

/**
 * Housing outline: four quarter-ellipse arcs around the cover center. The
 * bottom arc meets at (cx, -drop) with a horizontal tangent, so the outline's
 * lowest point is exactly the stored drop, never a control-point overshoot.
 */
function centerSectionOutline(axle: AxleConfiguration): Segment[] {
  const cs = axle.housing.centerSection;
  const cx = cs.offsetFromVehicleCenter.value;
  const cy = cs.coverCenterHeight.value;
  const rx = cs.width.value / 2;
  const up = cs.riseAboveCenterline.value - cy;
  const down = cs.dropBelowCenterline.value + cy;
  // A slightly squarer lower half reads as the cast ring-gear bowl, not a ball.
  const k = 0.62;
  return [
    { op: 'M', p: pt(cx + rx, cy) },
    {
      op: 'C',
      c1: pt(cx + rx, cy + up * 0.56),
      c2: pt(cx + rx * 0.56, cy + up),
      p: pt(cx, cy + up)
    },
    {
      op: 'C',
      c1: pt(cx - rx * 0.56, cy + up),
      c2: pt(cx - rx, cy + up * 0.56),
      p: pt(cx - rx, cy)
    },
    {
      op: 'C',
      c1: pt(cx - rx, cy - down * k),
      c2: pt(cx - rx * k, cy - down),
      p: pt(cx, cy - down)
    },
    { op: 'C', c1: pt(cx + rx * k, cy - down), c2: pt(cx + rx, cy - down * k), p: pt(cx + rx, cy) },
    { op: 'Z' }
  ];
}

/**
 * Cover outline: a rounded-square superellipse approximation, the familiar
 * Dana shape seen face-on from in front of a front axle.
 */
function coverOutline(cx: number, cy: number, rx: number, ry: number): Segment[] {
  const k = 0.78;
  return [
    { op: 'M', p: pt(cx + rx, cy) },
    { op: 'C', c1: pt(cx + rx, cy + ry * k), c2: pt(cx + rx * k, cy + ry), p: pt(cx, cy + ry) },
    { op: 'C', c1: pt(cx - rx * k, cy + ry), c2: pt(cx - rx, cy + ry * k), p: pt(cx - rx, cy) },
    { op: 'C', c1: pt(cx - rx, cy - ry * k), c2: pt(cx - rx * k, cy - ry), p: pt(cx, cy - ry) },
    { op: 'C', c1: pt(cx + rx * k, cy - ry), c2: pt(cx + rx, cy - ry * k), p: pt(cx + rx, cy) },
    { op: 'Z' }
  ];
}

function coverBolts(axle: AxleConfiguration): Part[] {
  const cs = axle.housing.centerSection;
  const cover = cs.cover;
  const cx = cs.offsetFromVehicleCenter.value;
  const cy = cs.coverCenterHeight.value;
  // Bolts sit on the flange, inset from the cover edge by the same margin all round.
  const inset = (cover.width.value - cover.boltCircle.value) / 2;
  const rx = cover.width.value / 2 - inset;
  const ry = cover.height.value / 2 - inset;
  const parts: Part[] = [];
  for (let i = 0; i < cover.boltCount; i++) {
    // Start at the top and walk around evenly, the way the cover is drilled.
    const a = Math.PI / 2 + (i * 2 * Math.PI) / cover.boltCount;
    parts.push({
      id: `cover-bolt-${i + 1}`,
      role: 'bolt',
      path: circle(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, 0.28),
      schematic: cover.boltCircle.status === 'schematic'
    });
  }
  return parts;
}

type Side = 'passenger' | 'driver';

function sideX(side: Side, magnitude: number): number {
  return side === 'driver' ? magnitude : -magnitude;
}

/** Distance from the vehicle centerline to where the tube ends and the wheel end begins. */
function tubeEndX(axle: AxleConfiguration): number {
  const we = axle.housing.wheelEnds;
  const wms = we.wmsWidth.value / 2;
  if (we.kind === 'rear') return wms - we.hubLength.value;
  if (we.knuckle === 'closed-knuckle') return wms - we.hubLength.value - we.knuckleWidth.value;
  return wms - we.hubLength.value - we.knuckleWidth.value - we.cEndWidth.value * 0.35;
}

/** Hub, rotor, studs and locking hub between the knuckle and the wheel mounting surface. */
function steerHub(we: SteerWheelEnd, side: Side): Part[] {
  const sx = (m: number) => sideX(side, m);
  const wms = we.wmsWidth.value / 2;
  const hubR = we.hubDiameter.value / 2;
  const hubInner = wms - we.hubLength.value;
  const hub = rect(sx(hubInner), -hubR, sx(wms - 0.6), hubR);
  const flangeR = Math.max(hubR + 1.2, 4.2);
  const flange = rect(sx(wms - 0.6), -flangeR, sx(wms), flangeR);
  const rotorR = Math.max(flangeR + 1.6, 5.4);
  const rotor = rect(sx(wms - 2.3), -rotorR, sx(wms - 1.1), rotorR);
  const studs: Segment[] = [];
  for (const y of [-flangeR + 0.9, flangeR - 0.9]) {
    studs.push(...line(pt(sx(wms), y), pt(sx(wms + 1.4), y)));
  }
  // Locking hub cap protrudes past the mounting face, inside the wheel.
  const lockR = hubR * 0.85;
  const lock = rect(sx(wms), -lockR, sx(wms + 2.6), lockR);
  return [
    { id: `${side}-rotor`, role: 'detail', path: rotor, schematic: true },
    { id: `${side}-hub`, role: 'hub', path: hub, schematic: we.hubDiameter.status === 'schematic' },
    { id: `${side}-hub-flange`, role: 'hub', path: flange, schematic: true },
    { id: `${side}-studs`, role: 'detail', path: studs, schematic: true },
    { id: `${side}-hub-lock`, role: 'hidden', path: lock, schematic: true }
  ];
}

/** Kingpin cap: a flat bolted plate on the knuckle arm, the tell of a kingpin axle. */
function kingpinCap(side: Side, x: number, y: number, dir: 1 | -1): Segment[] {
  const sx = (m: number) => sideX(side, m);
  const capY = y + dir * 0.7;
  const segs = rect(sx(x - 1.5), y, sx(x + 1.5), capY);
  for (const bx of [x - 1, x + 1]) segs.push(...circle(sx(bx), y + dir * 0.35, 0.16));
  return segs;
}

/** Open knuckle in an inner C, on ball joints or kingpins. */
function openKnuckle(axle: AxleConfiguration, we: SteerWheelEnd, side: Side): Part[] {
  const tubeR = axle.housing.tubes.outerDiameter.value / 2;
  const wms = we.wmsWidth.value / 2;
  const knW = we.knuckleWidth.value;
  const cW = we.cEndWidth.value;
  const span = we.pivotSpan.value / 2;
  const sx = (m: number) => sideX(side, m);
  const schematic = we.cEndWidth.status === 'schematic';

  const knuckleOuter = wms - we.hubLength.value;
  const knuckleInner = knuckleOuter - knW;
  const cInner = knuckleInner - cW * 0.35;
  const armTop = span + 0.9;
  const armBottom = -span - 0.9;

  // Inner C: a vertical web at the tube end with arms reaching outboard over
  // and under the knuckle to the steering pivots.
  const cOuter = knuckleInner + knW * 0.55;
  const cPath = polyline([
    pt(sx(cInner), tubeR),
    pt(sx(cInner), armTop - 1.1),
    pt(sx(cInner + 0.7), armTop),
    pt(sx(cOuter), armTop),
    pt(sx(cOuter), armTop - 1.4),
    pt(sx(cInner + cW * 0.35), armTop - 1.6),
    pt(sx(cInner + cW * 0.35), armBottom + 1.6),
    pt(sx(cOuter), armBottom + 1.4),
    pt(sx(cOuter), armBottom),
    pt(sx(cInner + 0.7), armBottom),
    pt(sx(cInner), armBottom + 1.1),
    pt(sx(cInner), -tubeR)
  ]);

  const knuckle = roundedRect(sx(knuckleInner + 0.6), -span + 0.3, sx(knuckleOuter), span - 0.3, {
    top: 1,
    bottom: 1
  });

  const pivotX = knuckleInner + knW * 0.3 + 0.7;
  const pivots: Part[] =
    we.knuckle === 'kingpin'
      ? [
          {
            id: `${side}-kingpin-upper`,
            role: 'detail',
            path: kingpinCap(side, pivotX, armTop, 1),
            schematic: true
          },
          {
            id: `${side}-kingpin-lower`,
            role: 'detail',
            path: kingpinCap(side, pivotX, armBottom, -1),
            schematic: true
          }
        ]
      : [
          {
            id: `${side}-ball-joint-upper`,
            role: 'detail',
            path: rect(sx(pivotX - 0.7), span - 0.2, sx(pivotX + 0.7), span + 1.1),
            schematic: true
          },
          {
            id: `${side}-ball-joint-lower`,
            role: 'detail',
            path: rect(sx(pivotX - 0.7), -span + 0.2, sx(pivotX + 0.7), -span - 1.1),
            schematic: true
          }
        ];

  // Steering arm boss on top of the knuckle; the tie rod runs across above it.
  const arm = polyline([
    pt(sx(knuckleInner + knW * 0.45), armTop),
    pt(sx(knuckleInner + knW * 0.6), armTop + 2.2),
    pt(sx(knuckleOuter - 0.3), armTop + 2.2),
    pt(sx(knuckleOuter - 0.3), armTop)
  ]);

  return [
    { id: `${side}-c-end`, role: 'casting', path: cPath, schematic },
    ...pivots,
    { id: `${side}-knuckle`, role: 'knuckle', path: knuckle, schematic },
    { id: `${side}-steering-arm`, role: 'knuckle', path: arm, schematic: true },
    ...steerHub(we, side)
  ];
}

/**
 * Closed (Birfield) knuckle: the tube ends in a flange carrying a large
 * spherical knuckle ball; the steering knuckle wraps its outer half and turns
 * on kingpin bearings top and bottom.
 */
function closedKnuckle(axle: AxleConfiguration, we: SteerWheelEnd, side: Side): Part[] {
  const sx = (m: number) => sideX(side, m);
  const tubeR = axle.housing.tubes.outerDiameter.value / 2;
  const wms = we.wmsWidth.value / 2;
  const ballR = we.knuckleWidth.value / 2;
  const span = we.pivotSpan.value / 2;
  const schematic = we.knuckleWidth.status === 'schematic';
  const outer = wms - we.hubLength.value;
  const ballX = outer - ballR;
  const flangeX = ballX - ballR * 0.92;
  const flange = rect(sx(flangeX - 0.6), -tubeR - 1.2, sx(flangeX), tubeR + 1.2);
  const ball = circle(sx(ballX), 0, ballR);
  // Steering knuckle housing: wraps the outboard half of the ball.
  const housingTop = Math.max(span, ballR * 0.9);
  const housing = roundedRect(sx(ballX - ballR * 0.1), -housingTop, sx(outer + 0.2), housingTop, {
    top: 1.2,
    bottom: 1.2
  });
  const capX = ballX + ballR * 0.35;
  const arm = polyline([
    pt(sx(capX - 0.8), housingTop + 0.7),
    pt(sx(capX - 0.4), housingTop + 2.4),
    pt(sx(outer - 0.2), housingTop + 2.4),
    pt(sx(outer - 0.2), housingTop)
  ]);
  return [
    { id: `${side}-knuckle-flange`, role: 'casting', path: flange, schematic: true },
    { id: `${side}-knuckle-ball`, role: 'casting', path: ball, schematic },
    { id: `${side}-knuckle`, role: 'knuckle', path: housing, schematic: true },
    {
      id: `${side}-kingpin-upper`,
      role: 'detail',
      path: kingpinCap(side, capX, housingTop, 1),
      schematic: true
    },
    {
      id: `${side}-kingpin-lower`,
      role: 'detail',
      path: kingpinCap(side, capX, -housingTop, -1),
      schematic: true
    },
    { id: `${side}-steering-arm`, role: 'knuckle', path: arm, schematic: true },
    ...steerHub(we, side)
  ];
}

/** Rear wheel end: housing flange, brake, axle flange or full-float hub. */
function rearWheelEnd(we: RearWheelEnd, side: Side): Part[] {
  const sx = (m: number) => sideX(side, m);
  const wms = we.wmsWidth.value / 2;
  const flangeX = wms - we.hubLength.value;
  const flangeR = we.flangeDiameter.value / 2;
  const brakeR = we.brakeDiameter.value / 2;
  const hubR = we.hubDiameter.value / 2;
  const flange = rect(sx(flangeX - 0.5), -flangeR, sx(flangeX), flangeR);
  const brakeIn = flangeX + 0.4;
  const brakeOut = Math.max(brakeIn + 0.8, wms - 0.5);
  const brake = roundedRect(sx(brakeIn), -brakeR, sx(brakeOut), brakeR, { top: 0.4, bottom: 0.4 });
  const parts: Part[] = [
    {
      id: `${side}-housing-flange`,
      role: 'casting',
      path: flange,
      schematic: we.flangeDiameter.status === 'schematic'
    },
    {
      id: `${side}-brake`,
      role: 'detail',
      path: brake,
      schematic: we.brakeDiameter.status === 'schematic'
    },
    {
      id: `${side}-axle-flange`,
      role: 'hub',
      path: rect(sx(wms - 0.5), -hubR, sx(wms), hubR),
      schematic: we.hubDiameter.status === 'schematic'
    }
  ];
  const studs: Segment[] = [];
  for (const y of [-hubR + 0.9, hubR - 0.9])
    studs.push(...line(pt(sx(wms), y), pt(sx(wms + 1.4), y)));
  parts.push({ id: `${side}-studs`, role: 'detail', path: studs, schematic: true });
  if (we.floating === 'full-float') {
    // Full-float hub nose and shaft flange stand proud of the mounting face.
    const noseR = hubR * 0.55;
    parts.push({
      id: `${side}-hub-nose`,
      role: 'hidden',
      path: rect(sx(wms), -noseR, sx(wms + 3), noseR),
      schematic: true
    });
  }
  return parts;
}

function wheelEnd(axle: AxleConfiguration, side: Side): Part[] {
  const we = axle.housing.wheelEnds;
  if (we.kind === 'rear') return rearWheelEnd(we, side);
  if (we.knuckle === 'closed-knuckle') return closedKnuckle(axle, we, side);
  return openKnuckle(axle, we, side);
}

/** Tube from the center section to the wheel end on one side, with its spring seat. */
function tube(axle: AxleConfiguration, side: Side): Part[] {
  const cs = axle.housing.centerSection;
  const r = axle.housing.tubes.outerDiameter.value / 2;
  const cx = cs.offsetFromVehicleCenter.value;
  const halfW = cs.width.value / 2;
  const end = tubeEndX(axle);
  const inner = side === 'driver' ? cx + halfW * 0.8 : -(cx - halfW * 0.8);
  // Inner end is buried in the center section casting; the outline hides it.
  const x0 = sideX(side, Math.max(0, inner));
  const x1 = sideX(side, end);
  // Spring seat sits inboard of the wheel end, clear of the center section.
  const seatMag = Math.max(end - 7, Math.abs(cx) + halfW + 3.5);
  const seatX = sideX(side, Math.min(seatMag, end - 3));
  const seat = polyline([
    pt(seatX - 2.6, r),
    pt(seatX - 2.1, r + 0.9),
    pt(seatX + 2.1, r + 0.9),
    pt(seatX + 2.6, r)
  ]);
  // Front: radius-arm or leaf bracket hanging below. Rear: U-bolt plate.
  const mount =
    axle.position === 'front'
      ? polyline([
          pt(seatX - 2.2, -r),
          pt(seatX - 1.4, -r - 2.4),
          pt(seatX + 1.4, -r - 2.4),
          pt(seatX + 2.2, -r)
        ])
      : rect(seatX - 2.4, -r, seatX + 2.4, -r - 0.6);
  return [
    {
      id: `${side}-tube`,
      role: 'tube',
      path: rect(x0, -r, x1, r),
      schematic: axle.housing.tubes.outerDiameter.status === 'schematic'
    },
    { id: `${side}-spring-seat`, role: 'detail', path: seat, schematic: true },
    {
      id: `${side}-${axle.position === 'front' ? 'radius-arm-mount' : 'u-bolt-plate'}`,
      role: 'detail',
      path: mount,
      schematic: true
    }
  ];
}

/** The center section, cover or welded dome, bolts and hidden ring gear. */
function centerSection(axle: AxleConfiguration): Part[] {
  const cs = axle.housing.centerSection;
  const cx = cs.offsetFromVehicleCenter.value;
  const cy = cs.coverCenterHeight.value;
  const tubeR = axle.housing.tubes.outerDiameter.value / 2;
  const halfW = cs.width.value / 2;
  const coverRx = cs.cover.width.value / 2;
  const coverRy = cs.cover.height.value / 2;
  const ringR = cs.ringGearDiameter.value / 2;
  const bossR = tubeR + 0.55;
  const coverSchematic = cs.cover.width.status === 'schematic';

  const common: Part[] = [
    {
      id: 'tube-boss-passenger',
      role: 'casting',
      path: rect(cx - halfW - 1.1, -bossR, cx - halfW + 1, bossR),
      schematic: true
    },
    {
      id: 'tube-boss-driver',
      role: 'casting',
      path: rect(cx + halfW - 1, -bossR, cx + halfW + 1.1, bossR),
      schematic: true
    },
    {
      id: 'center-section',
      role: 'casting',
      path: centerSectionOutline(axle),
      schematic: cs.width.status === 'schematic'
    },
    {
      id: 'ring-gear',
      role: 'hidden',
      path: circle(cx, 0, ringR),
      schematic: cs.ringGearDiameter.status === 'schematic'
    }
  ];

  if (cs.style === 'third-member') {
    // Welded banjo: a pressed dome with a weld seam ring, no bolts.
    return [
      ...common,
      {
        id: 'weld-seam',
        role: 'detail',
        path: ellipse(cx, cy, coverRx + 0.35, coverRy + 0.35),
        schematic: true
      },
      {
        id: 'cover',
        role: 'cover',
        path: ellipse(cx, cy, coverRx, coverRy),
        schematic: coverSchematic
      },
      {
        id: 'dome-crown',
        role: 'detail',
        path: ellipse(cx, cy, coverRx * 0.45, coverRy * 0.45),
        schematic: true
      },
      {
        id: 'fill-plug',
        role: 'detail',
        path: circle(cx + coverRx * 0.55, cy - coverRy * 0.1, 0.42),
        schematic: true
      }
    ];
  }
  return [
    ...common,
    {
      id: 'cover',
      role: 'cover',
      path: coverOutline(cx, cy, coverRx, coverRy),
      schematic: coverSchematic
    },
    // Raised stiffening ring stamped into the cover face.
    {
      id: 'cover-rib',
      role: 'detail',
      path: coverOutline(cx, cy, coverRx * 0.72, coverRy * 0.72),
      schematic: true
    },
    {
      id: 'fill-plug',
      role: 'detail',
      path: circle(cx + coverRx * 0.42, cy - coverRy * 0.08, 0.42),
      schematic: true
    },
    ...coverBolts(axle)
  ];
}

function tieRod(we: SteerWheelEnd): Part {
  const wms = we.wmsWidth.value / 2;
  const x = wms - we.hubLength.value - we.knuckleWidth.value * 0.4;
  const y = we.pivotSpan.value / 2 + 0.9 + 1.7;
  return {
    id: 'tie-rod',
    role: 'detail',
    path: rect(-x, y - 0.45, x, y + 0.45),
    schematic: true
  };
}

/**
 * Shear for a half-shaft: points rise in proportion to how far out they are,
 * from 0 at the carrier (`inner`) to `rise` at the hub (`outer`).
 */
function liftOuterEnd(inner: number, outer: number, rise: number): (p: Point) => Point {
  const span = outer - inner || 1;
  return (p) => pt(p.x, p.y + rise * Math.min(1, Math.max(0, (Math.abs(p.x) - inner) / span)));
}

/** A straight bar of thickness `t` from a to b, as a closed outline. */
function bar(a: Point, b: Point, t: number): Segment[] {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const nx = (-(b.y - a.y) / len) * (t / 2);
  const ny = ((b.x - a.x) / len) * (t / 2);
  return polyline(
    [
      pt(a.x + nx, a.y + ny),
      pt(b.x + nx, b.y + ny),
      pt(b.x - nx, b.y - ny),
      pt(a.x - nx, a.y - ny)
    ],
    true
  );
}

/** Upper and lower A-arms, knuckle upright and CV half-shaft for one side of an IFS front. */
function ifsCorner(
  axle: AxleConfiguration,
  ifs: IfsGeometry,
  we: SteerWheelEnd,
  side: Side
): Part[] {
  const sx = (m: number) => sideX(side, m);
  const cs = axle.housing.centerSection;
  const wms = we.wmsWidth.value / 2;
  const knW = we.knuckleWidth.value;
  const knuckleOuter = wms - we.hubLength.value;
  const bjX = knuckleOuter - knW * 0.55;
  const lowerBj = pt(sx(bjX), ifs.lowerBallJointHeight.value);
  const upperBj = pt(sx(bjX + knW * 0.15), ifs.upperBallJointHeight.value);
  const lowerPivot = pt(sx(ifs.lowerArmInnerPivot.x.value), ifs.lowerArmInnerPivot.y.value);
  const upperPivot = pt(sx(ifs.upperArmInnerPivot.x.value), ifs.upperArmInnerPivot.y.value);
  const armSchematic = ifs.lowerArmInnerPivot.x.status === 'schematic';

  // Half-shaft runs from the carrier side gear to the hub on the wheel centerline.
  const carrierSide = Math.abs(
    cs.offsetFromVehicleCenter.value * (side === 'driver' ? 1 : -1) + cs.width.value / 2
  );
  const inner = pt(sx(carrierSide), ifs.carrierHeight.value);
  const outer = pt(sx(knuckleOuter - knW * 0.2), 0);
  const shaftT = ifs.halfShaftDiameter.value;
  const bootR = shaftT * 1.6;
  const knuckle = roundedRect(
    sx(knuckleOuter - knW),
    ifs.lowerBallJointHeight.value + 0.4,
    sx(knuckleOuter),
    ifs.upperBallJointHeight.value - 0.4,
    { top: 1, bottom: 1 }
  );
  return [
    {
      id: `${side}-half-shaft`,
      role: 'tube',
      path: bar(inner, outer, shaftT),
      schematic: ifs.halfShaftDiameter.status === 'schematic'
    },
    {
      id: `${side}-cv-boot-inner`,
      role: 'detail',
      path: ellipse(
        inner.x + (outer.x - inner.x) * 0.12,
        inner.y + (outer.y - inner.y) * 0.12,
        bootR,
        bootR
      ),
      schematic: true
    },
    {
      id: `${side}-cv-boot-outer`,
      role: 'detail',
      path: ellipse(
        inner.x + (outer.x - inner.x) * 0.86,
        inner.y + (outer.y - inner.y) * 0.86,
        bootR,
        bootR
      ),
      schematic: true
    },
    {
      id: `${side}-lower-arm`,
      role: 'casting',
      path: bar(lowerPivot, lowerBj, 1.6),
      schematic: armSchematic
    },
    {
      id: `${side}-upper-arm`,
      role: 'casting',
      path: bar(upperPivot, upperBj, 1.2),
      schematic: armSchematic
    },
    {
      id: `${side}-lower-pivot`,
      role: 'bolt',
      path: circle(lowerPivot.x, lowerPivot.y, 0.6),
      schematic: armSchematic
    },
    {
      id: `${side}-upper-pivot`,
      role: 'bolt',
      path: circle(upperPivot.x, upperPivot.y, 0.5),
      schematic: armSchematic
    },
    { id: `${side}-knuckle`, role: 'knuckle', path: knuckle, schematic: true },
    {
      id: `${side}-ball-joint-lower`,
      role: 'detail',
      path: circle(lowerBj.x, lowerBj.y, 0.55),
      schematic: true
    },
    {
      id: `${side}-ball-joint-upper`,
      role: 'detail',
      path: circle(upperBj.x, upperBj.y, 0.5),
      schematic: true
    },
    ...steerHub(we, side)
  ];
}

/**
 * IFS front: the differential hangs from the frame at the carrier height, with
 * no tubes. The housing is built around the carrier center, then lifted into
 * wheel-centerline coordinates so its low point lands exactly on the stored
 * drop below the wheel centerline.
 */
function buildIfsAssembly(axle: AxleConfiguration, ifs: IfsGeometry, we: SteerWheelEnd): Part[] {
  const cs = axle.housing.centerSection;
  const lift = ifs.carrierHeight.value;
  const aroundCarrier: AxleConfiguration = {
    ...axle,
    housing: {
      ...axle.housing,
      centerSection: {
        ...cs,
        dropBelowCenterline: {
          ...cs.dropBelowCenterline,
          value: cs.dropBelowCenterline.value + lift
        }
      }
    }
  };
  const housing = centerSection(aroundCarrier)
    // Tube bosses belong to solid axles; the IFS carrier has output flanges instead.
    .filter((p) => !p.id.startsWith('tube-boss'))
    .map((p) => ({ ...p, path: mapPath(p.path, translate(0, lift)) }));
  const cx = cs.offsetFromVehicleCenter.value;
  const top = lift + cs.riseAboveCenterline.value;
  // Frame mounting ears on top of the carrier.
  const ears: Part[] = [-1, 1].map((d) => ({
    id: `frame-ear-${d < 0 ? 'left' : 'right'}`,
    role: 'detail',
    path: polyline([
      pt(cx + d * 2.2, top - 0.6),
      pt(cx + d * 3.2, top + 1.6),
      pt(cx + d * 5.4, top + 1.6),
      pt(cx + d * 5.6, top - 1.4)
    ]),
    schematic: true
  }));
  return [
    ...ifsCorner(axle, ifs, we, 'passenger'),
    ...ifsCorner(axle, ifs, we, 'driver'),
    ...ears,
    ...housing
  ];
}

/** Ids of wheel-end parts that turn with the wheel and so sit on the wheel centerline. */
const WHEEL_AXIS_PART = /-(hub|hub-flange|hub-lock|hub-nose|rotor|studs|brake|axle-flange)$/;

/**
 * Portal box for one side: a tall housing between the knuckle face and the
 * wheel, with the input gear on the shaft axis (inputY) and the output gear
 * on the wheel axis (outputY).
 */
function portalBox(
  axle: AxleConfiguration,
  portal: PortalGeometry,
  side: Side,
  inputY: number,
  outputY: number
): Part[] {
  const sx = (m: number) => sideX(side, m);
  const we = axle.housing.wheelEnds;
  const wms = we.wmsWidth.value / 2;
  const inner = wms - we.hubLength.value;
  const outer = Math.min(inner + portal.boxWidth.value, wms - 0.6);
  const mid = (inputY + outputY) / 2;
  const half = portal.boxHeight.value / 2;
  const gearR = Math.max(1, (portal.boxHeight.value - Math.abs(inputY - outputY)) / 2 - 0.4);
  const schematic = portal.boxHeight.status === 'schematic';
  return [
    {
      id: `${side}-portal-box`,
      role: 'casting',
      path: roundedRect(sx(inner), mid - half, sx(outer), mid + half, { top: 2.2, bottom: 2.2 }),
      schematic
    },
    {
      id: `${side}-portal-input-gear`,
      role: 'hidden',
      path: circle(sx((inner + outer) / 2), inputY, gearR * 0.75),
      schematic: true
    },
    {
      id: `${side}-portal-output-gear`,
      role: 'hidden',
      path: circle(sx((inner + outer) / 2), outputY, gearR),
      schematic: true
    }
  ];
}

export function buildAssembly(axle: AxleConfiguration): AssemblyDrawing {
  const cs = axle.housing.centerSection;
  const we = axle.housing.wheelEnds;
  const wms = we.wmsWidth.value / 2;
  const wheelCenter = wms - axle.wheel.offset.value;

  let parts: Part[];
  let wheelCenterY = 0;
  if (axle.kind === 'ifs') {
    if (!axle.ifs || we.kind !== 'steer')
      throw new Error(`${axle.id}: IFS needs ifs geometry and steer wheel ends`);
    parts = buildIfsAssembly(axle, axle.ifs, we);
    if (axle.portal) {
      // Geared hubs: the half-shaft enters the box above the wheel centerline.
      const input = axle.portal.drop.value;
      const cs = axle.housing.centerSection;
      const shear = liftOuterEnd(
        Math.abs(cs.offsetFromVehicleCenter.value) + cs.width.value / 2,
        we.wmsWidth.value / 2 - we.hubLength.value,
        input
      );
      parts = [
        ...parts.map((p) =>
          p.id.endsWith('-half-shaft') || p.id.includes('-cv-boot-')
            ? { ...p, path: mapPath(p.path, shear) }
            : p
        ),
        ...portalBox(axle, axle.portal, 'passenger', input, 0),
        ...portalBox(axle, axle.portal, 'driver', input, 0)
      ];
    }
  } else if (axle.portal) {
    // Solid portal: tubes and knuckles on the axle centerline, everything that
    // turns with the wheel moved down onto the wheel centerline.
    wheelCenterY = -axle.portal.drop.value;
    const down = translate(0, wheelCenterY);
    const ends = [...wheelEnd(axle, 'passenger'), ...wheelEnd(axle, 'driver')].map((p) =>
      WHEEL_AXIS_PART.test(p.id) ? { ...p, path: mapPath(p.path, down) } : p
    );
    parts = [
      ...tube(axle, 'passenger'),
      ...tube(axle, 'driver'),
      ...(we.kind === 'steer' ? [tieRod(we)] : []),
      ...ends,
      ...portalBox(axle, axle.portal, 'passenger', 0, wheelCenterY),
      ...portalBox(axle, axle.portal, 'driver', 0, wheelCenterY),
      ...centerSection(axle)
    ];
  } else {
    parts = [
      ...tube(axle, 'passenger'),
      ...tube(axle, 'driver'),
      ...(we.kind === 'steer' ? [tieRod(we)] : []),
      ...wheelEnd(axle, 'passenger'),
      ...wheelEnd(axle, 'driver'),
      ...centerSection(axle)
    ];
  }

  return {
    parts,
    housingLowPoint: pt(cs.offsetFromVehicleCenter.value, -cs.dropBelowCenterline.value),
    wheelCenters: { passenger: -wheelCenter, driver: wheelCenter },
    wheelCenterY,
    wmsX: { passenger: -wms, driver: wms },
    diffCenterX: cs.offsetFromVehicleCenter.value
  };
}

/**
 * Tire and wheel for one side, centered on the wheel centerline at the axle
 * centerline. In a front elevation a tire is not a circle: it is an upright
 * band, section width wide and diameter tall, with rounded tread shoulders.
 *
 * `deflection` flattens the bottom: the loaded radius is shorter than the
 * nominal radius, so the contact patch sits `radius - deflection` below center.
 */
export function buildTire(
  axle: AxleConfiguration,
  tire: TireSpec,
  wheelCenterX: number,
  deflection: number,
  idPrefix: string
): Part[] {
  const r = tire.nominalDiameter / 2;
  const halfW = tire.sectionWidth / 2;
  const loaded = r - deflection;
  const shoulder = Math.min(tire.sectionWidth * 0.24, 3.2);
  const x0 = wheelCenterX - halfW;
  const x1 = wheelCenterX + halfW;
  const outline = roundedRect(x0, -loaded, x1, r, {
    top: shoulder,
    // A loaded tire squats onto a flat patch; the lower shoulder tightens.
    bottom: Math.max(shoulder - deflection * 0.8, shoulder * 0.45)
  });

  // Circumferential grooves seen end-on: vertical lines across the tread face,
  // stopping short of the shoulders where the tread wraps out of view.
  const grooves: Segment[] = [];
  for (const f of [-0.3, 0, 0.3]) {
    const x = wheelCenterX + f * tire.sectionWidth;
    grooves.push(...line(pt(x, r - shoulder * 0.9), pt(x, -loaded + shoulder * 0.9)));
  }
  // Shoulder lugs: the tread block edges where the face meets the sidewall.
  for (const sx of [x0 + shoulder * 0.55, x1 - shoulder * 0.55]) {
    grooves.push(...line(pt(sx, r - shoulder * 1.6), pt(sx, -loaded + shoulder * 1.6)));
  }

  const rimR = axle.wheel.diameter.value / 2 + 0.6;
  const rimHalf = axle.wheel.width.value / 2 + 0.5;
  const rim = rect(wheelCenterX - rimHalf, -rimR, wheelCenterX + rimHalf, rimR);

  return [
    { id: `${idPrefix}-tire`, role: 'tire', path: outline, schematic: false },
    { id: `${idPrefix}-tread`, role: 'tread', path: grooves, schematic: true },
    { id: `${idPrefix}-wheel`, role: 'hidden', path: rim, schematic: false }
  ];
}
