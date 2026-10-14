/**
 * Minimal path geometry in physical inches.
 *
 * Paths are built from points and cubic curves only (no SVG arcs) so that a
 * single point transform converts them to drawing units without any special
 * handling for flipped axes.
 */

export interface Point {
  x: number;
  y: number;
}

export type Segment =
  | { op: 'M'; p: Point }
  | { op: 'L'; p: Point }
  | { op: 'C'; c1: Point; c2: Point; p: Point }
  | { op: 'Z' };

export type Transform = (p: Point) => Point;

/** Cubic Bezier handle length for a quarter circle. */
const KAPPA = 0.5522847498;

export function pt(x: number, y: number): Point {
  return { x, y };
}

export function translate(dx: number, dy: number): Transform {
  return (p) => ({ x: p.x + dx, y: p.y + dy });
}

export function mapPath(path: Segment[], t: Transform): Segment[] {
  return path.map((s) => {
    switch (s.op) {
      case 'M':
      case 'L':
        return { op: s.op, p: t(s.p) };
      case 'C':
        return { op: 'C', c1: t(s.c1), c2: t(s.c2), p: t(s.p) };
      case 'Z':
        return s;
    }
  });
}

function n(v: number): string {
  // Two decimals of a drawing unit is far below a pixel; keeps the DOM small.
  return String(Math.round(v * 100) / 100);
}

export function toD(path: Segment[]): string {
  return path
    .map((s) => {
      switch (s.op) {
        case 'M':
        case 'L':
          return `${s.op}${n(s.p.x)} ${n(s.p.y)}`;
        case 'C':
          return `C${n(s.c1.x)} ${n(s.c1.y)} ${n(s.c2.x)} ${n(s.c2.y)} ${n(s.p.x)} ${n(s.p.y)}`;
        case 'Z':
          return 'Z';
      }
    })
    .join('');
}

export function polyline(points: Point[], closed = false): Segment[] {
  const out: Segment[] = [];
  points.forEach((p, i) => out.push({ op: i === 0 ? 'M' : 'L', p }));
  if (closed) out.push({ op: 'Z' });
  return out;
}

export function line(a: Point, b: Point): Segment[] {
  return polyline([a, b]);
}

/** Quarter-circle corner from `from` to `to`, bulging toward `corner`. */
function corner(from: Point, cornerPt: Point, to: Point): Segment {
  return {
    op: 'C',
    c1: pt(from.x + (cornerPt.x - from.x) * KAPPA, from.y + (cornerPt.y - from.y) * KAPPA),
    c2: pt(to.x + (cornerPt.x - to.x) * KAPPA, to.y + (cornerPt.y - to.y) * KAPPA),
    p: to
  };
}

/**
 * Axis-aligned rectangle with independent corner radii, in y-up space.
 * Radii are clamped so they never exceed half a side.
 */
export function roundedRect(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: { top: number; bottom: number }
): Segment[] {
  const left = Math.min(x0, x1);
  const right = Math.max(x0, x1);
  const bottom = Math.min(y0, y1);
  const top = Math.max(y0, y1);
  const halfW = (right - left) / 2;
  const halfH = (top - bottom) / 2;
  const rt = Math.max(0, Math.min(r.top, halfW, halfH));
  const rb = Math.max(0, Math.min(r.bottom, halfW, halfH));
  return [
    { op: 'M', p: pt(left + rb, bottom) },
    { op: 'L', p: pt(right - rb, bottom) },
    corner(pt(right - rb, bottom), pt(right, bottom), pt(right, bottom + rb)),
    { op: 'L', p: pt(right, top - rt) },
    corner(pt(right, top - rt), pt(right, top), pt(right - rt, top)),
    { op: 'L', p: pt(left + rt, top) },
    corner(pt(left + rt, top), pt(left, top), pt(left, top - rt)),
    { op: 'L', p: pt(left, bottom + rb) },
    corner(pt(left, bottom + rb), pt(left, bottom), pt(left + rb, bottom)),
    { op: 'Z' }
  ];
}

export function rect(x0: number, y0: number, x1: number, y1: number): Segment[] {
  return roundedRect(x0, y0, x1, y1, { top: 0, bottom: 0 });
}

/** Ellipse as four cubic quarter arcs. */
export function ellipse(cx: number, cy: number, rx: number, ry: number): Segment[] {
  return [
    { op: 'M', p: pt(cx + rx, cy) },
    corner(pt(cx + rx, cy), pt(cx + rx, cy + ry), pt(cx, cy + ry)),
    corner(pt(cx, cy + ry), pt(cx - rx, cy + ry), pt(cx - rx, cy)),
    corner(pt(cx - rx, cy), pt(cx - rx, cy - ry), pt(cx, cy - ry)),
    corner(pt(cx, cy - ry), pt(cx + rx, cy - ry), pt(cx + rx, cy)),
    { op: 'Z' }
  ];
}

export function circle(cx: number, cy: number, r: number): Segment[] {
  return ellipse(cx, cy, r, r);
}

/** Lowest y reached by any on-curve or control point. Control points bound a cubic. */
export function minY(path: Segment[]): number {
  let lo = Infinity;
  for (const s of path) {
    if (s.op === 'Z') continue;
    lo = Math.min(lo, s.p.y);
    if (s.op === 'C') lo = Math.min(lo, s.c1.y, s.c2.y);
  }
  return lo;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function bounds(paths: Segment[][]): Bounds {
  const b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const path of paths) {
    for (const s of path) {
      if (s.op === 'Z') continue;
      const pts = s.op === 'C' ? [s.c1, s.c2, s.p] : [s.p];
      for (const p of pts) {
        b.minX = Math.min(b.minX, p.x);
        b.minY = Math.min(b.minY, p.y);
        b.maxX = Math.max(b.maxX, p.x);
        b.maxY = Math.max(b.maxY, p.y);
      }
    }
  }
  return b;
}
