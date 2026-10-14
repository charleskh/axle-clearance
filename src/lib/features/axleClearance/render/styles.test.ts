import { describe, expect, it } from 'vitest';
import { axles } from '../data';
import { danaSuper60Ford } from '../data/danaSuper60Ford';
import { dim } from '../data/helpers';
import { supportedDiameters, tireForDiameter } from '../tires';
import type { AxleConfiguration, SteerWheelEnd } from '../types';
import { buildAssembly } from './assembly';
import { bounds, minY } from './path';
import { buildScene, SCALE, type SceneInput } from './scene';

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

const base = danaSuper60Ford;
const est = (v: number) => dim(v, 'schematic', ['engineering-estimate']);

function steer(knuckle: SteerWheelEnd['knuckle']): AxleConfiguration {
  if (base.housing.wheelEnds.kind !== 'steer') throw new Error('template must be a steer axle');
  return {
    ...base,
    id: `test-${knuckle}`,
    housing: { ...base.housing, wheelEnds: { ...base.housing.wheelEnds, knuckle } }
  };
}

function rear(floating: 'semi-float' | 'full-float'): AxleConfiguration {
  return {
    ...base,
    id: `test-rear-${floating}`,
    position: 'rear',
    housing: {
      ...base.housing,
      centerSection: {
        ...base.housing.centerSection,
        style: 'third-member',
        offsetFromVehicleCenter: dim(-2, 'schematic', ['engineering-estimate']),
        cover: { ...base.housing.centerSection.cover, boltCount: 0 }
      },
      wheelEnds: {
        kind: 'rear',
        floating,
        wmsWidth: base.housing.wheelEnds.wmsWidth,
        brakeDiameter: est(13),
        flangeDiameter: est(7),
        hubDiameter: est(8),
        hubLength: est(4),
        boltPattern: '8x170 mm'
      }
    }
  };
}

const rearThirdMember = rear('full-float');

const ifsFront: AxleConfiguration = {
  ...base,
  id: 'test-ifs',
  kind: 'ifs',
  housing: {
    ...base.housing,
    centerSection: {
      ...base.housing.centerSection,
      style: 'third-member',
      dropBelowCenterline: dim(4.5, 'estimated', ['engineering-estimate']),
      cover: { ...base.housing.centerSection.cover, boltCount: 0 }
    }
  },
  ifs: {
    carrierHeight: est(1.5),
    lowerArmInnerPivot: { x: est(14), y: est(-3) },
    upperArmInnerPivot: { x: est(17), y: est(6) },
    lowerBallJointHeight: est(-4.5),
    upperBallJointHeight: est(5.5),
    halfShaftDiameter: est(1.4)
  }
};

const portal = { drop: est(4), boxWidth: est(3.5), boxHeight: est(11) };
const solidPortal: AxleConfiguration = { ...steer('ball-joint'), id: 'test-solid-portal', portal };
const ifsPortal: AxleConfiguration = { ...ifsFront, id: 'test-ifs-portal', portal };

const variants: AxleConfiguration[] = [
  steer('ball-joint'),
  steer('kingpin'),
  steer('closed-knuckle'),
  rearThirdMember,
  rear('semi-float'),
  ifsFront,
  solidPortal,
  ifsPortal
];

function scene(axle: AxleConfiguration, d: number, mode: SceneInput['mode'] = 'single') {
  return buildScene({
    axle,
    mode,
    selected: tireForDiameter(d),
    baseline: tireForDiameter(33),
    loadedRadiusDeflection: 0,
    housingDrop: axle.housing.centerSection.dropBelowCenterline.value,
    labels
  });
}

function numbers(d: string): number[] {
  return (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
}

for (const axle of [...axles, ...variants]) {
  describe(`${axle.id}`, () => {
    const drop = axle.housing.centerSection.dropBelowCenterline.value;

    it('places the housing low point exactly at the stored drop', () => {
      const asm = buildAssembly(axle);
      const outline = asm.parts.find((p) => p.id === 'center-section');
      expect(outline).toBeDefined();
      if (outline) expect(minY(outline.path)).toBeCloseTo(-drop, 9);
      // Measured housing parts only. Schematic wheel-end shapes (C-ends,
      // knuckles) are drawing aids and may sit near or below the low point.
      const between = new Set(['casting', 'tube', 'cover', 'bolt']);
      const tubes = asm.parts.filter(
        (p) =>
          between.has(p.role) &&
          !p.schematic &&
          !p.id.includes('knuckle') &&
          !p.id.includes('flange')
      );
      expect(bounds(tubes.map((p) => p.path)).minY).toBeGreaterThanOrEqual(-drop - 1e-9);
    });

    it('keeps the frame fixed and the drawing inside it at every tire size', () => {
      const ref = scene(axle, 33);
      for (const d of supportedDiameters()) {
        const s = scene(axle, d, 'side-by-side');
        expect(scene(axle, d).viewBox).toEqual(ref.viewBox);
        for (const layer of s.layers) {
          for (const p of layer.paths) {
            const n = numbers(p.d);
            for (let i = 0; i + 1 < n.length; i += 2) {
              const x = n[i] ?? NaN;
              const y = n[i + 1] ?? NaN;
              expect(x).toBeGreaterThanOrEqual(0);
              expect(x).toBeLessThanOrEqual(s.viewBox.width);
              expect(y).toBeGreaterThanOrEqual(0);
              expect(y).toBeLessThanOrEqual(s.viewBox.height);
            }
          }
        }
      }
    });

    it('puts wheel centers on the stored track and measures clearance as radius minus drop', () => {
      const s = scene(axle, 37);
      const { passenger, driver } = s.anchors.selected.wheelCenterX;
      expect(Math.abs(driver - passenger) / SCALE).toBeCloseTo(axle.wheel.trackWidth.value, 0);
      const dimLine = s.dimensions.find((x) => x.id === 'clearance-selected');
      const lift = axle.kind === 'solid' && axle.portal ? axle.portal.drop.value : 0;
      expect(dimLine && (dimLine.a.y - dimLine.b.y) / SCALE).toBeCloseTo(18.5 + lift - drop, 9);
    });

    it('draws from the cover side, mirroring rear axles', () => {
      const s = scene(axle, 35);
      const { passenger, driver } = s.anchors.selected.wheelCenterX;
      if (axle.position === 'rear') {
        expect(s.view).toBe('rear');
        expect(driver).toBeLessThan(passenger);
      } else {
        expect(s.view).toBe('front');
        expect(driver).toBeGreaterThan(passenger);
      }
    });
  });
}

describe('IFS', () => {
  it('passes validation', async () => {
    const { validateAxle } = await import('../data');
    expect(validateAxle(ifsFront)).toEqual([]);
  });

  it('draws arms and half-shafts and no axle tubes', () => {
    const list = buildAssembly(ifsFront).parts.map((p) => p.id);
    expect(list).toContain('driver-lower-arm');
    expect(list).toContain('passenger-half-shaft');
    expect(list).not.toContain('driver-tube');
    expect(list).not.toContain('tie-rod');
  });
});

describe('portal axles', () => {
  it('lifts a solid portal housing by the portal drop and keeps tires on the ground', () => {
    const plain = scene(steer('ball-joint'), 37);
    const lifted = scene(solidPortal, 37);
    expect(
      (plain.anchors.selected.axleCenterlineY - lifted.anchors.selected.axleCenterlineY) / SCALE
    ).toBeCloseTo(4, 9);
    // Wheels still turn on the loaded radius above the ground.
    expect((lifted.groundY - lifted.anchors.selected.wheelCenterlineY) / SCALE).toBeCloseTo(
      18.5,
      9
    );
    expect(lifted.dimensions.some((d) => d.id === 'portal-drop')).toBe(true);
  });

  it('leaves IFS portal clearance on the wheel-centerline convention', () => {
    const plain = scene(ifsFront, 37);
    const geared = scene(ifsPortal, 37);
    const c = (s: typeof plain) => s.dimensions.find((d) => d.id === 'clearance-selected');
    expect(c(geared)?.b.y).toBeCloseTo(c(plain)?.b.y ?? NaN, 9);
    expect(buildAssembly(ifsPortal).parts.map((p) => p.id)).toContain('driver-portal-box');
  });

  it('validates', async () => {
    const { validateAxle } = await import('../data');
    expect(validateAxle(solidPortal)).toEqual([]);
    expect(validateAxle(ifsPortal)).toEqual([]);
  });
});

describe('comparing a front axle with a rear axle', () => {
  it("draws both with the selected axle's sides, so driver means the same on each", () => {
    const s = buildScene({
      axle: steer('ball-joint'),
      baselineAxle: rearThirdMember,
      mode: 'side-by-side',
      selected: tireForDiameter(37),
      baseline: tireForDiameter(37),
      loadedRadiusDeflection: 0,
      housingDrop: 6.5,
      labels
    });
    const sel = s.anchors.selected.wheelCenterX;
    const base = s.anchors.baseline?.wheelCenterX;
    expect(sel.driver).toBeGreaterThan(sel.passenger);
    expect(base && base.driver > base.passenger).toBe(true);
  });
});

describe('style-specific parts', () => {
  const ids = (a: AxleConfiguration) => buildAssembly(a).parts.map((p) => p.id);

  it('draws kingpin caps on a kingpin axle and ball joints otherwise', () => {
    expect(ids(steer('kingpin'))).toContain('driver-kingpin-upper');
    expect(ids(steer('ball-joint'))).toContain('driver-ball-joint-upper');
    expect(ids(steer('ball-joint'))).not.toContain('driver-kingpin-upper');
  });

  it('draws a knuckle ball on a closed knuckle', () => {
    expect(ids(steer('closed-knuckle'))).toContain('passenger-knuckle-ball');
  });

  it('draws a welded dome with no bolts on a third-member housing', () => {
    const list = ids(rearThirdMember);
    expect(list).toContain('weld-seam');
    expect(list.some((id) => id.startsWith('cover-bolt'))).toBe(false);
    expect(list).not.toContain('tie-rod');
    expect(list).toContain('driver-hub-nose');
  });
});
