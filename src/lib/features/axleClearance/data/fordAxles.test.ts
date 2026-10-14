import { describe, expect, it } from 'vitest';
import type { AxleConfiguration } from '../types';
import { validateAxle } from './index';
import { fordSterling1025Rear } from './fordSterling1025Rear';
import { fordSterling105Rear } from './fordSterling105Rear';
import { fordDana60KingpinFront } from './fordDana60KingpinFront';
import { fordBroncoDana44HpFront } from './fordBroncoDana44HpFront';
import { fordF250Dana44HpFront } from './fordF250Dana44HpFront';

const fordAxles: AxleConfiguration[] = [
  fordSterling1025Rear,
  fordSterling105Rear,
  fordDana60KingpinFront,
  fordBroncoDana44HpFront,
  fordF250Dana44HpFront
];

const AUTHORITATIVE = new Set(['manufacturer', 'supplier']);

describe('Ford group axles', () => {
  it('have unique ids and the Ford group', () => {
    expect(new Set(fordAxles.map((a) => a.id)).size).toBe(fordAxles.length);
    for (const axle of fordAxles) expect(axle.group).toBe('Ford');
  });

  for (const axle of fordAxles) {
    describe(axle.id, () => {
      it('is structurally valid', () => {
        expect(validateAxle(axle)).toEqual([]);
      });

      it('does not present the housing drop as verified without an authoritative source', () => {
        const drop = axle.housing.centerSection.dropBelowCenterline;
        if (drop.status === 'verified') {
          const kinds = drop.sourceIds.map(
            (id) => axle.sources.find((s) => s.id === id)?.kind ?? ''
          );
          expect(kinds.some((k) => AUTHORITATIVE.has(k))).toBe(true);
        }
        // No Ford, Dana or supplier source found for any of these drops. Change only with a cited figure.
        expect(drop.status).not.toBe('verified');
      });

      it('keeps the ring gear distinct from the housing drop', () => {
        const cs = axle.housing.centerSection;
        expect(cs.dropBelowCenterline.value).toBeGreaterThan(cs.ringGearDiameter.value / 2);
      });
    });
  }

  it('places Sterling rears toward the passenger side and Ford fronts toward the driver side', () => {
    expect(fordSterling1025Rear.housing.centerSection.offsetFromVehicleCenter.value).toBeLessThan(
      0
    );
    expect(fordSterling105Rear.housing.centerSection.offsetFromVehicleCenter.value).toBeLessThan(0);
    expect(
      fordDana60KingpinFront.housing.centerSection.offsetFromVehicleCenter.value
    ).toBeGreaterThan(0);
    expect(
      fordBroncoDana44HpFront.housing.centerSection.offsetFromVehicleCenter.value
    ).toBeGreaterThan(0);
  });
});
