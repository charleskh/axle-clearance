import type { Dimension } from '../types';

/** Inches per millimetre. Store metric sources as `value * MM` so the original figure stays visible. */
export const MM = 1 / 25.4;

export function dim(
  value: number,
  status: Dimension['status'],
  sourceIds: string[],
  note?: string
): Dimension {
  return note === undefined ? { value, status, sourceIds } : { value, status, sourceIds, note };
}
