import { describe, expect, it } from 'vitest';
import type { AxleConfiguration } from '../types';
import { validateAxle } from './index';
import { toyotaIfs75Front } from './toyotaIfs75Front';
import { toyotaTacomaIfsFront } from './toyotaTacomaIfsFront';

const toyotaIfs: AxleConfiguration[] = [toyotaIfs75Front, toyotaTacomaIfsFront];

describe('Toyota IFS front axles', () => {
  for (const axle of toyotaIfs) {
    it(`${axle.id} passes validateAxle`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });

    it(`${axle.id} does not claim a verified drop`, () => {
      // No Toyota or supplier source found states wheel centerline to diff low point.
      expect(axle.housing.centerSection.dropBelowCenterline.status).not.toBe('verified');
    });

    it(`${axle.id} is a ball-joint IFS front with a 7.5 in ring gear`, () => {
      expect(axle.group).toBe('Toyota');
      expect(axle.kind).toBe('ifs');
      expect(axle.position).toBe('front');
      expect(axle.ifs).toBeDefined();
      const we = axle.housing.wheelEnds;
      expect(we.kind === 'steer' && we.knuckle === 'ball-joint').toBe(true);
      expect(axle.housing.centerSection.ringGearDiameter.value).toBe(7.5);
      expect(axle.housing.centerSection.cover.boltCount).toBe(0);
    });
  }

  it('uses unique ids', () => {
    expect(new Set(toyotaIfs.map((a) => a.id)).size).toBe(toyotaIfs.length);
  });

  it('puts the 1986-1995 carrier on the passenger side', () => {
    expect(toyotaIfs75Front.housing.centerSection.offsetFromVehicleCenter.value).toBeLessThan(0);
  });
});
