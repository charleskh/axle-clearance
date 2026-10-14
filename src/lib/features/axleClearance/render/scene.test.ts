import { describe, expect, it } from 'vitest';
import { danaSuper60Ford } from '../data/danaSuper60Ford';
import { supportedDiameters, tireForDiameter } from '../tires';
import { buildAssembly } from './assembly';
import { bounds, minY } from './path';
import { buildScene, SCALE, type Scene, type SceneInput, type ViewMode } from './scene';

const axle = danaSuper60Ford;
const drop = axle.housing.centerSection.dropBelowCenterline.value;

const labels: SceneInput['labels'] = {
  selectedClearance: '',
  baselineClearance: '',
  clearanceDelta: '',
  selectedRadius: '',
  baselineRadius: '',
  selectedDiameter: '',
  baselineDiameter: '',
  drop: '',
  dropStatus: '',
  clearanceStatus: ''
};

function scene(
  diameter: number,
  mode: ViewMode = 'single',
  deflection = 0,
  housingDrop = drop
): Scene {
  return buildScene({
    axle,
    mode,
    selected: tireForDiameter(diameter),
    baseline: tireForDiameter(33),
    loadedRadiusDeflection: deflection,
    housingDrop,
    labels
  });
}

/** Parse every coordinate pair out of an SVG path string. */
function coords(d: string): { x: number; y: number }[] {
  const nums = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i];
    const y = nums[i + 1];
    if (x !== undefined && y !== undefined) out.push({ x, y });
  }
  return out;
}

function pathBox(s: Scene, id: string) {
  const p = s.layers.flatMap((l) => l.paths).find((x) => x.id === id);
  if (!p) throw new Error(`missing ${id}`);
  const c = coords(p.d);
  const xs = c.map((q) => q.x);
  const ys = c.map((q) => q.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

describe('fixed physical scale', () => {
  it('uses the same viewport and scale for every tire size', () => {
    const first = scene(31);
    for (const d of supportedDiameters()) {
      const s = scene(d);
      expect(s.viewBox).toEqual(first.viewBox);
      expect(s.scale).toBe(SCALE);
      expect(s.groundY).toBe(first.groundY);
    }
  });

  it('draws every tire diameter at SCALE units per inch', () => {
    for (const d of supportedDiameters()) {
      const box = pathBox(scene(d), 'selected-driver-tire');
      expect(box.maxY - box.minY).toBeCloseTo(d * SCALE, 1);
    }
  });

  it('sits every tire on the ground', () => {
    for (const d of supportedDiameters()) {
      const s = scene(d);
      expect(pathBox(s, 'selected-passenger-tire').maxY).toBeCloseTo(s.groundY, 1);
    }
  });

  it('keeps the whole drawing inside the viewport at the largest tire', () => {
    const s = scene(44, 'side-by-side');
    for (const layer of s.layers) {
      for (const p of layer.paths) {
        for (const c of coords(p.d)) {
          expect(c.x).toBeGreaterThanOrEqual(0);
          expect(c.x).toBeLessThanOrEqual(s.viewBox.width);
          expect(c.y).toBeGreaterThanOrEqual(0);
          expect(c.y).toBeLessThanOrEqual(s.viewBox.height);
        }
      }
    }
  });
});

describe('the axle does not change with the tire', () => {
  const housingParts = [
    'center-section',
    'cover',
    'passenger-tube',
    'driver-tube',
    'driver-knuckle',
    'passenger-c-end'
  ];

  it('keeps housing and tube sizes identical for every tire', () => {
    const ref = scene(33);
    for (const d of supportedDiameters()) {
      const s = scene(d);
      for (const id of housingParts) {
        const a = pathBox(ref, id);
        const b = pathBox(s, id);
        expect(b.maxX - b.minX, `${id} width at ${d}"`).toBeCloseTo(a.maxX - a.minX, 1);
        expect(b.maxY - b.minY, `${id} height at ${d}"`).toBeCloseTo(a.maxY - a.minY, 1);
        expect(b.minX, `${id} x at ${d}"`).toBeCloseTo(a.minX, 1);
      }
    }
  });

  it('raises the whole assembly by exactly the radius change', () => {
    const ref = scene(33);
    for (const d of supportedDiameters()) {
      const s = scene(d);
      const rise = ((d - 33) / 2) * SCALE;
      expect(ref.anchors.selected.axleCenterlineY - s.anchors.selected.axleCenterlineY).toBeCloseTo(
        rise,
        9
      );
      expect(pathBox(ref, 'cover').minY - pathBox(s, 'cover').minY).toBeCloseTo(rise, 1);
    }
  });

  it('keeps wheel centers fixed at the published track', () => {
    for (const d of supportedDiameters()) {
      const { passenger, driver } = scene(d).anchors.selected.wheelCenterX;
      expect((driver - passenger) / SCALE).toBeCloseTo(axle.wheel.trackWidth.value, 9);
    }
  });
});

describe('clearance geometry', () => {
  it('places the housing low point at the stored drop', () => {
    const asm = buildAssembly(axle);
    const outline = asm.parts.find((p) => p.id === 'center-section');
    expect(outline).toBeDefined();
    if (outline) expect(minY(outline.path)).toBeCloseTo(-drop, 12);
    // Nothing between the wheels hangs below the stored low point. Rotors and
    // hubs sit inside the wheel, so the tire, not the housing, protects them.
    const between = new Set(['casting', 'tube', 'cover', 'bolt', 'knuckle']);
    const housing = asm.parts.filter((p) => between.has(p.role) || p.id.includes('radius-arm'));
    expect(bounds(housing.map((p) => p.path)).minY).toBeGreaterThanOrEqual(-drop - 1e-9);
  });

  it('measures ground to low point as radius minus drop', () => {
    for (const d of supportedDiameters()) {
      for (const deflection of [0, 1.25]) {
        const s = scene(d, 'single', deflection);
        const dim = s.dimensions.find((x) => x.id === 'clearance-selected');
        expect(dim).toBeDefined();
        if (!dim) continue;
        expect((dim.a.y - dim.b.y) / SCALE).toBeCloseTo(d / 2 - deflection - drop, 9);
      }
    }
  });

  it('follows a calibrated drop', () => {
    const s = scene(37, 'single', 0, 5.75);
    const dim = s.dimensions.find((x) => x.id === 'clearance-selected');
    expect(dim && (dim.a.y - dim.b.y) / SCALE).toBeCloseTo(18.5 - 5.75, 9);
    expect(pathBox(s, 'center-section').maxY).toBeCloseTo(dim?.b.y ?? NaN, 1);
  });
});

describe('comparison modes', () => {
  it('overlay draws both configurations on one ground with the gain dimensioned', () => {
    const s = scene(44, 'overlay');
    expect(s.layers.map((l) => l.variant)).toEqual(['selected', 'baseline']);
    const base = s.anchors.baseline;
    expect(base).toBeDefined();
    if (!base) return;
    expect(base.panelOffsetX).toBe(s.anchors.selected.panelOffsetX);
    const gain = s.dimensions.find((x) => x.id === 'clearance-delta');
    expect(gain && Math.abs(gain.a.y - gain.b.y) / SCALE).toBeCloseTo(5.5, 9);
  });

  it('side by side uses identical scale and a shared ground', () => {
    const s = scene(40, 'side-by-side');
    const single = scene(40);
    expect(s.viewBox.width).toBeCloseTo(single.viewBox.width * 2, 9);
    expect(s.viewBox.height).toBe(single.viewBox.height);
    const base = s.anchors.baseline;
    expect(base).toBeDefined();
    if (!base) return;
    const sel = s.anchors.selected;
    // Same axle, same track, different tire: only height changes.
    expect(sel.wheelCenterX.driver - sel.wheelCenterX.passenger).toBeCloseTo(
      base.wheelCenterX.driver - base.wheelCenterX.passenger,
      9
    );
    expect(base.axleCenterlineY - sel.axleCenterlineY).toBeCloseTo(3.5 * SCALE, 9);
    expect(pathBox(s, 'selected-driver-tire').maxY).toBeCloseTo(s.groundY, 1);
  });
});
