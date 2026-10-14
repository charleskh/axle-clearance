import { describe, expect, it } from 'vitest';
import type { AxleConfiguration } from '../types';
import { validateAxle } from './index';
import { dodgeDana60KingpinFront } from './dodgeDana60KingpinFront';
import { gmDana60KingpinFront } from './gmDana60KingpinFront';
import { toyotaFj40Fj60Front } from './toyotaFj40Fj60Front';
import { jeepJlRubicon2024Dana44HdRear } from './jeepJlRubicon2024Dana44HdRear';

const axles: AxleConfiguration[] = [
  dodgeDana60KingpinFront,
  gmDana60KingpinFront,
  toyotaFj40Fj60Front,
  jeepJlRubicon2024Dana44HdRear
];

describe('more solid axles', () => {
  for (const axle of axles) {
    it(`${axle.id} passes validateAxle`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });

    it(`${axle.id} does not claim a verified drop`, () => {
      // No manufacturer or supplier source found states axle centerline to housing low point.
      expect(axle.housing.centerSection.dropBelowCenterline.status).not.toBe('verified');
    });
  }

  it('uses the assigned groups and unique ids', () => {
    expect(new Set(axles.map((a) => a.id)).size).toBe(axles.length);
    expect(dodgeDana60KingpinFront.group).toBe('Dodge');
    expect(gmDana60KingpinFront.group).toBe('GM');
    expect(toyotaFj40Fj60Front.group).toBe('Toyota');
    expect(jeepJlRubicon2024Dana44HdRear.group).toBe('Jeep');
  });

  it('puts the kingpin and Land Cruiser fronts on the passenger side', () => {
    for (const a of [dodgeDana60KingpinFront, gmDana60KingpinFront, toyotaFj40Fj60Front]) {
      expect(a.housing.centerSection.offsetFromVehicleCenter.value).toBeLessThan(0);
    }
  });

  it('models the 2024 Rubicon rear as full float', () => {
    const we = jeepJlRubicon2024Dana44HdRear.housing.wheelEnds;
    expect(we.kind === 'rear' && we.floating).toBe('full-float');
  });
});
