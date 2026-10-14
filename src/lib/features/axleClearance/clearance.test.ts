import { describe, expect, it } from 'vitest';
import {
  calculateClearance,
  compareClearance,
  defaultSettings,
  differentialClearance,
  effectiveTireRadius,
  compareSetups,
  isTrustedAbsolute,
  weakerStatus
} from './clearance';
import { danaSuper60Ford } from './data/danaSuper60Ford';
import type { AxleConfiguration, Dimension, PortalGeometry } from './types';
import { BASELINE_TIRE_DIAMETER, supportedDiameters, tireForDiameter } from './tires';

const axle = danaSuper60Ford;
const baseline = tireForDiameter(BASELINE_TIRE_DIAMETER);

describe('effectiveTireRadius', () => {
  it('is half the nominal diameter with no deflection', () => {
    expect(effectiveTireRadius(37, 0)).toBe(18.5);
  });

  it('subtracts loaded-radius deflection', () => {
    expect(effectiveTireRadius(32, 1.4)).toBeCloseTo(14.6, 12);
  });

  it('rejects impossible inputs', () => {
    expect(() => effectiveTireRadius(0, 0)).toThrow(RangeError);
    expect(() => effectiveTireRadius(33, -1)).toThrow(RangeError);
    expect(() => effectiveTireRadius(33, 17)).toThrow(RangeError);
  });
});

describe('differentialClearance', () => {
  it('is effective radius minus housing drop', () => {
    expect(differentialClearance(18.5, 6.5)).toBe(12);
  });
});

describe('clearance across tire sizes', () => {
  const settings = defaultSettings(axle);

  it('gains exactly 5.5 in going from 33 to 44 in tires', () => {
    const cmp = compareClearance(axle, baseline, tireForDiameter(44), settings);
    expect(cmp.clearanceDelta).toBe(5.5);
    expect(cmp.diameterDelta).toBe(11);
  });

  it('gains 5.5 in with any shared deflection and any housing drop', () => {
    for (const loadedRadiusDeflection of [0, 0.75, 1.4, 2]) {
      for (const housingDrop of [5, 6.5, 7.25]) {
        const s = { loadedRadiusDeflection, housingDrop, housingDropCalibrated: true };
        const cmp = compareClearance(axle, baseline, tireForDiameter(44), s);
        expect(cmp.clearanceDelta).toBeCloseTo(5.5, 12);
      }
    }
  });

  it('gains half the diameter change for every supported size', () => {
    for (const d of supportedDiameters()) {
      const cmp = compareClearance(axle, baseline, tireForDiameter(d), settings);
      expect(cmp.clearanceDelta).toBe((d - 33) / 2);
      expect(cmp.selected.effectiveTireRadius).toBe(d / 2);
      expect(cmp.selected.differentialClearance).toBe(d / 2 - settings.housingDrop);
    }
  });

  it('reports a loss for tires smaller than the baseline', () => {
    const cmp = compareClearance(axle, baseline, tireForDiameter(31), settings);
    expect(cmp.clearanceDelta).toBe(-1);
  });

  it('keeps full precision internally', () => {
    const s = { loadedRadiusDeflection: 0.333, housingDrop: 6.4375, housingDropCalibrated: true };
    const r = calculateClearance(axle, tireForDiameter(35), s);
    expect(r.differentialClearance).toBe(17.5 - 0.333 - 6.4375);
  });
});

describe('verification status of the absolute clearance', () => {
  it('inherits the status of the stored housing drop', () => {
    const r = calculateClearance(axle, baseline, defaultSettings(axle));
    expect(r.clearanceStatus).toBe(axle.housing.centerSection.dropBelowCenterline.status);
  });

  it('is not trusted while the drop is an estimate', () => {
    expect(axle.housing.centerSection.dropBelowCenterline.status).toBe('estimated');
    const r = calculateClearance(axle, baseline, defaultSettings(axle));
    expect(isTrustedAbsolute(r.clearanceStatus)).toBe(false);
  });

  it('becomes calibrated when the user supplies a measured drop', () => {
    const s = { loadedRadiusDeflection: 0, housingDrop: 6.25, housingDropCalibrated: true };
    const r = calculateClearance(axle, baseline, s);
    expect(r.clearanceStatus).toBe('calibrated');
    expect(isTrustedAbsolute(r.clearanceStatus)).toBe(true);
  });
});

describe('comparing two different axles', () => {
  const otherDrop: Dimension = {
    ...axle.housing.centerSection.dropBelowCenterline,
    value: 5,
    status: 'community'
  };
  const other: AxleConfiguration = {
    ...axle,
    id: 'other-axle',
    housing: {
      ...axle.housing,
      centerSection: { ...axle.housing.centerSection, dropBelowCenterline: otherDrop }
    }
  };

  it('is exact for the same axle and inexact across axles', () => {
    const same = compareClearance(axle, baseline, tireForDiameter(37), defaultSettings(axle));
    expect(same.deltaStatus).toBe('exact');
    expect(same.sameAxle).toBe(true);

    const cross = compareSetups(
      { axle: other, tire: tireForDiameter(37), settings: defaultSettings(other) },
      { axle, tire: tireForDiameter(37), settings: defaultSettings(axle) }
    );
    expect(cross.sameAxle).toBe(false);
    // Same tire, different drops: the difference is the drop difference.
    expect(cross.clearanceDelta).toBeCloseTo(5 - 6.5, 12);
    // Weaker of community (other) and estimated (Super 60).
    expect(cross.deltaStatus).toBe('estimated');
  });

  it('ranks trust with calibrated alongside derived', () => {
    expect(weakerStatus('verified', 'estimated')).toBe('estimated');
    expect(weakerStatus('calibrated', 'community')).toBe('community');
    expect(weakerStatus('derived', 'calibrated')).toBe('calibrated');
  });
});

describe('portal axles', () => {
  const portal: PortalGeometry = {
    drop: { value: 4.5, status: 'verified', sourceIds: [] },
    boxWidth: { value: 3, status: 'schematic', sourceIds: [] },
    boxHeight: { value: 11, status: 'schematic', sourceIds: [] }
  };
  const portalAxle: AxleConfiguration = { ...axle, id: 'portal-test', portal };

  it('adds the portal drop to a solid axle', () => {
    const r = calculateClearance(portalAxle, tireForDiameter(37), defaultSettings(portalAxle));
    expect(r.axleCenterlineHeight).toBe(18.5 + 4.5);
    expect(r.differentialClearance).toBe(18.5 + 4.5 - 6.5);
  });

  it('still gains exactly half the diameter change', () => {
    const cmp = compareClearance(
      portalAxle,
      baseline,
      tireForDiameter(44),
      defaultSettings(portalAxle)
    );
    expect(cmp.clearanceDelta).toBe(5.5);
    expect(cmp.deltaStatus).toBe('exact');
  });

  it('is only as trusted as the weaker of the drop and the portal drop', () => {
    const calibrated = { loadedRadiusDeflection: 0, housingDrop: 6, housingDropCalibrated: true };
    const unverifiedPortal: AxleConfiguration = {
      ...portalAxle,
      portal: { ...portal, drop: { value: 4.5, status: 'estimated', sourceIds: [] } }
    };
    expect(calculateClearance(portalAxle, baseline, calibrated).clearanceStatus).toBe('calibrated');
    expect(calculateClearance(unverifiedPortal, baseline, calibrated).clearanceStatus).toBe(
      'estimated'
    );
  });
});
