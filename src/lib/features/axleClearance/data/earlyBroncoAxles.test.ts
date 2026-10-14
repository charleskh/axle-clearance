import { describe, expect, it } from 'vitest';
import type { AxleConfiguration } from '../types';
import { validateAxle } from './index';
import { earlyBroncoDana30Front } from './earlyBroncoDana30Front';
import { earlyBroncoDana44Front } from './earlyBroncoDana44Front';

const axles: AxleConfiguration[] = [earlyBroncoDana30Front, earlyBroncoDana44Front];
const AUTHORITATIVE = new Set(['manufacturer', 'supplier']);

describe('Ford', () => {
  for (const axle of axles) {
    it(`${axle.id} is structurally valid`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });

    it(`${axle.id} uses the Ford picker group`, () => {
      expect(axle.group).toBe('Ford');
    });

    it(`${axle.id} does not present the housing drop as verified without an authoritative source`, () => {
      // No manufacturer or supplier figure was found for these drops. Change only with a cited measurement.
      const drop = axle.housing.centerSection.dropBelowCenterline;
      const cited = drop.sourceIds.map((id) => axle.sources.find((s) => s.id === id));
      if (drop.status === 'verified') {
        expect(cited.some((s) => s !== undefined && AUTHORITATIVE.has(s.kind))).toBe(true);
      }
      expect(drop.status).not.toBe('verified');
    });

    it(`${axle.id} keeps the ring gear distinct from the housing drop`, () => {
      const cs = axle.housing.centerSection;
      expect(cs.dropBelowCenterline.value).toBeGreaterThan(cs.ringGearDiameter.value / 2);
    });
  }

  it('puts both early Bronco front pumpkins on the driver side', () => {
    for (const axle of axles)
      expect(axle.housing.centerSection.offsetFromVehicleCenter.value).toBeGreaterThan(0);
  });

  it('uses kingpins on the Dana 30 and ball joints on the Dana 44', () => {
    const k30 = earlyBroncoDana30Front.housing.wheelEnds;
    const k44 = earlyBroncoDana44Front.housing.wheelEnds;
    expect(k30.kind === 'steer' && k30.knuckle).toBe('kingpin');
    expect(k44.kind === 'steer' && k44.knuckle).toBe('ball-joint');
  });
});
