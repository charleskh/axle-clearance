import { describe, expect, it } from 'vitest';
import { axles, listDimensions, validateAxle } from './index';
import { danaSuper60Ford } from './danaSuper60Ford';

describe('axle data', () => {
  for (const axle of axles) {
    it(`${axle.id} is structurally valid`, () => {
      expect(validateAxle(axle)).toEqual([]);
    });
  }

  it('every dimension carries a status and at least one source', () => {
    for (const { key, dimension } of listDimensions(danaSuper60Ford)) {
      expect(dimension.status, key).toMatch(/verified|derived|community|estimated|schematic/);
      expect(dimension.sourceIds.length, key).toBeGreaterThan(0);
    }
  });

  it('does not present the housing drop as verified', () => {
    // No manufacturer or supplier figure was found. Change this test only with a cited measurement.
    expect(danaSuper60Ford.housing.centerSection.dropBelowCenterline.status).not.toBe('verified');
  });

  it('keeps the ring gear distinct from the housing drop', () => {
    const cs = danaSuper60Ford.housing.centerSection;
    expect(cs.ringGearDiameter.value).toBeCloseTo(10.08, 2);
    expect(cs.dropBelowCenterline.value).toBeGreaterThan(cs.ringGearDiameter.value / 2);
    expect(cs.dropBelowCenterline.value).not.toBe(cs.ringGearDiameter.value);
  });

  it('puts wheel centers on the Ford-published track', () => {
    const { wheel, housing } = danaSuper60Ford;
    const centers = housing.wheelEnds.wmsWidth.value - 2 * wheel.offset.value;
    expect(centers).toBeCloseTo(wheel.trackWidth.value, 10);
    expect(wheel.trackWidth.value).toBeCloseTo(68.35, 2);
  });

  it('offsets the differential to the driver side', () => {
    expect(danaSuper60Ford.housing.centerSection.offsetFromVehicleCenter.value).toBeGreaterThan(0);
  });
});
