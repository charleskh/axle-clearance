import { describe, expect, it } from 'vitest';
import type { AxleConfiguration } from '../types';
import { validateAxle } from './index';
import { toyotaPickup8Front } from './toyotaPickup8Front';
import { toyotaPickup8Rear } from './toyotaPickup8Rear';
import { toyotaFzj80Front } from './toyotaFzj80Front';
import { toyotaFzj80Rear } from './toyotaFzj80Rear';

const toyota: AxleConfiguration[] = [
  toyotaPickup8Front,
  toyotaPickup8Rear,
  toyotaFzj80Front,
  toyotaFzj80Rear
];

describe('Toyota axles', () => {
  for (const axle of toyota) {
    it(`${axle.id} passes validateAxle`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });

    it(`${axle.id} does not claim a verified drop`, () => {
      // No Toyota or supplier source found states the axle centerline to housing low point.
      expect(axle.housing.centerSection.dropBelowCenterline.status).not.toBe('verified');
    });
  }

  it('uses the Toyota group, third-member housings and unique ids', () => {
    expect(new Set(toyota.map((a) => a.id)).size).toBe(toyota.length);
    for (const a of toyota) {
      expect(a.group).toBe('Toyota');
      expect(a.housing.centerSection.style).toBe('third-member');
      expect(a.housing.centerSection.cover.boltCount).toBe(0);
    }
  });

  it('puts the solid fronts on the passenger side', () => {
    expect(toyotaPickup8Front.housing.centerSection.offsetFromVehicleCenter.value).toBeLessThan(0);
    expect(toyotaFzj80Front.housing.centerSection.offsetFromVehicleCenter.value).toBeLessThan(0);
  });
});
