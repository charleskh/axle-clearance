import { describe, expect, it } from 'vitest';
import type { AxleConfiguration } from '../types';
import { validateAxle } from './index';
import { suzukiSamuraiFront } from './suzukiSamuraiFront';
import { suzukiSamuraiRear } from './suzukiSamuraiRear';

const axles: AxleConfiguration[] = [suzukiSamuraiFront, suzukiSamuraiRear];
const AUTHORITATIVE = new Set(['manufacturer', 'supplier']);

describe('Suzuki', () => {
  for (const axle of axles) {
    it(`${axle.id} is structurally valid`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });

    it(`${axle.id} uses the Suzuki picker group`, () => {
      expect(axle.group).toBe('Suzuki');
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

  it('models both Samurai axles as third-member housings with a welded dome', () => {
    for (const axle of axles) {
      expect(axle.housing.centerSection.style).toBe('third-member');
      expect(axle.housing.centerSection.cover.boltCount).toBe(0);
    }
  });

  it('uses a closed knuckle in front and a semi-float rear', () => {
    const f = suzukiSamuraiFront.housing.wheelEnds;
    const r = suzukiSamuraiRear.housing.wheelEnds;
    expect(f.kind === 'steer' && f.knuckle).toBe('closed-knuckle');
    expect(r.kind === 'rear' && r.floating).toBe('semi-float');
  });
});
