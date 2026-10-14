import type { TireSpec } from './types';

export const MIN_TIRE_DIAMETER = 31;
export const MAX_TIRE_DIAMETER = 44;
export const BASELINE_TIRE_DIAMETER = 33;
export const TIRE_PRESETS = [33, 35, 37, 38, 40, 42, 44];

/**
 * Typical flotation section width for each nominal diameter. Drawing only: the
 * width has no effect on clearance. Real widths vary by brand and wheel width.
 */
const TYPICAL_SECTION_WIDTH: Record<number, number> = {
  31: 10.5,
  32: 11.5,
  33: 12.5,
  34: 12.5,
  35: 12.5,
  36: 12.5,
  37: 12.5,
  38: 13.5,
  39: 13.5,
  40: 13.5,
  41: 14.5,
  42: 14.5,
  43: 14.5,
  44: 15.5
};

export function isSupportedDiameter(diameter: number): boolean {
  return (
    Number.isInteger(diameter) && diameter >= MIN_TIRE_DIAMETER && diameter <= MAX_TIRE_DIAMETER
  );
}

export function tireForDiameter(diameter: number): TireSpec {
  if (!isSupportedDiameter(diameter)) {
    throw new RangeError(
      `Tire diameter ${diameter} is outside ${MIN_TIRE_DIAMETER}-${MAX_TIRE_DIAMETER} in`
    );
  }
  const sectionWidth = TYPICAL_SECTION_WIDTH[diameter] ?? 12.5;
  return {
    nominalDiameter: diameter,
    sectionWidth,
    label: `${diameter}x${sectionWidth.toFixed(2)}`
  };
}

export function supportedDiameters(): number[] {
  const out: number[] = [];
  for (let d = MIN_TIRE_DIAMETER; d <= MAX_TIRE_DIAMETER; d++) out.push(d);
  return out;
}

/**
 * Tire at any diameter inside the supported range, for drawing a transition
 * between two sizes. Section width is interpolated between neighbouring sizes.
 */
export function tireAtDiameter(diameter: number): TireSpec {
  const d = Math.min(MAX_TIRE_DIAMETER, Math.max(MIN_TIRE_DIAMETER, diameter));
  const lo = Math.floor(d);
  const hi = Math.ceil(d);
  const a = tireForDiameter(lo);
  if (lo === hi) return a;
  const b = tireForDiameter(hi);
  const t = d - lo;
  const sectionWidth = a.sectionWidth + (b.sectionWidth - a.sectionWidth) * t;
  return {
    nominalDiameter: d,
    sectionWidth,
    // An in-between size exists only mid-animation; label what is drawn.
    label: `${d.toFixed(1)}x${sectionWidth.toFixed(2)}`
  };
}
