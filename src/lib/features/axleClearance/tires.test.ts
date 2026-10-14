import { describe, expect, it } from 'vitest';
import {
  MAX_TIRE_DIAMETER,
  MIN_TIRE_DIAMETER,
  TIRE_PRESETS,
  supportedDiameters,
  tireAtDiameter,
  tireForDiameter
} from './tires';

describe('tires', () => {
  it('supports every whole inch from 31 to 44', () => {
    expect(supportedDiameters()).toEqual([31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]);
    expect(MIN_TIRE_DIAMETER).toBe(31);
    expect(MAX_TIRE_DIAMETER).toBe(44);
  });

  it('offers the requested presets', () => {
    expect(TIRE_PRESETS).toEqual([33, 35, 37, 38, 40, 42, 44]);
  });

  it('rejects unsupported sizes', () => {
    expect(() => tireForDiameter(30)).toThrow(RangeError);
    expect(() => tireForDiameter(45)).toThrow(RangeError);
    expect(() => tireForDiameter(35.5)).toThrow(RangeError);
  });

  it('interpolates between sizes for transitions', () => {
    const t = tireAtDiameter(37.5);
    expect(t.nominalDiameter).toBe(37.5);
    expect(t.sectionWidth).toBe(13);
    expect(tireAtDiameter(40)).toEqual(tireForDiameter(40));
  });
});
