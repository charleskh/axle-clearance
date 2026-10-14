/** Display-only rounding. Calculations keep full precision. */
export function formatInches(value: number, digits = 2): string {
  return `${value.toFixed(digits)}"`;
}

export function formatSignedInches(value: number, digits = 2): string {
  const rounded = Number(value.toFixed(digits));
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : '±';
  return `${sign}${Math.abs(rounded).toFixed(digits)}"`;
}

export function formatMillimetres(inches: number): string {
  return `${Math.round(inches * 25.4)} mm`;
}
