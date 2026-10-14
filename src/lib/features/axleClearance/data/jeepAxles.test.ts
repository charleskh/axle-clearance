import { describe, expect, it } from 'vitest';
import type { AxleConfiguration } from '../types';
import { validateAxle } from './index';
import { jeepTjRubiconDana44Front } from './jeepTjRubiconDana44Front';
import { jeepTjRubiconDana44Rear } from './jeepTjRubiconDana44Rear';
import { jeepJkRubiconDana44Front } from './jeepJkRubiconDana44Front';
import { jeepJkDana44Rear } from './jeepJkDana44Rear';
import { jeepJlRubiconDana44Front } from './jeepJlRubiconDana44Front';
import { jeepJlRubiconDana44Rear } from './jeepJlRubiconDana44Rear';

const jeepAxles: AxleConfiguration[] = [
  jeepTjRubiconDana44Front,
  jeepTjRubiconDana44Rear,
  jeepJkRubiconDana44Front,
  jeepJkDana44Rear,
  jeepJlRubiconDana44Front,
  jeepJlRubiconDana44Rear
];

describe('Jeep axle data', () => {
  for (const axle of jeepAxles) {
    it(`${axle.id} is structurally valid`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });

    it(`${axle.id} is in the Jeep group`, () => {
      expect(axle.group).toBe('Jeep');
    });

    it(`${axle.id} does not present the housing drop as verified`, () => {
      // No manufacturer or supplier source states the drop for any of these axles.
      // Change this only with a cited measurement.
      expect(axle.housing.centerSection.dropBelowCenterline.status).not.toBe('verified');
    });

    it(`${axle.id} keeps the ring gear distinct from the housing drop`, () => {
      const cs = axle.housing.centerSection;
      expect(cs.dropBelowCenterline.value).toBeGreaterThan(cs.ringGearDiameter.value / 2);
    });
  }

  it('has unique ids', () => {
    expect(new Set(jeepAxles.map((a) => a.id)).size).toBe(jeepAxles.length);
  });

  it('puts the front carriers on the driver side, per supplier shaft lengths', () => {
    for (const a of [
      jeepTjRubiconDana44Front,
      jeepJkRubiconDana44Front,
      jeepJlRubiconDana44Front
    ]) {
      expect(a.housing.centerSection.offsetFromVehicleCenter.value, a.id).toBeGreaterThan(5);
    }
  });

  it('uses the Jeep-published tracks', () => {
    expect(jeepJkRubiconDana44Front.wheel.trackWidth.value).toBeCloseTo(61.9, 1);
    expect(jeepJkDana44Rear.wheel.trackWidth.value).toBeCloseTo(61.9, 1);
    expect(jeepJlRubiconDana44Front.wheel.trackWidth.value).toBeCloseTo(64.4, 1);
    expect(jeepJlRubiconDana44Rear.wheel.trackWidth.value).toBeCloseTo(64.4, 1);
  });

  it('records the AdvanTEK ring gear sizes in millimetres', () => {
    expect(jeepJlRubiconDana44Front.housing.centerSection.ringGearDiameter.value).toBeCloseTo(
      8.27,
      2
    );
    expect(jeepJlRubiconDana44Rear.housing.centerSection.ringGearDiameter.value).toBeCloseTo(
      8.66,
      2
    );
  });
});
