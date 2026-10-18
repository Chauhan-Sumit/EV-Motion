import type { CarBodyType } from "@/types/vehicle";

/**
 * Side-view car geometry, ported from the approved Compare design's
 * `carSVG()`. One generic drawing per body style — not a likeness of any
 * model — proportioned to a length, height, wheelbase and ground clearance.
 *
 * Two consumers, with different honesty requirements:
 *  - the hero/dock/cards art (`ShowroomCar`), which is illustration and may
 *    fall back to typical proportions for the body type when a car's
 *    dimensions are unpublished;
 *  - the "Drawn to the same scale" overlay, which claims proportion and so
 *    only ever draws from published dimensions (see `SizeSection`).
 */

export type CarStyle = "suv" | "mpv" | "coupe" | "boxy";

const STYLE: Record<CarBodyType, CarStyle> = { suv: "suv", muv: "mpv", sedan: "coupe", hatchback: "boxy" };

export function carStyleFor(bodyType?: CarBodyType): CarStyle {
  return STYLE[bodyType ?? "suv"];
}

export interface CarDims {
  lengthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  groundClearanceMm: number;
}

/** Typical proportions per body type — used for illustration only, never for the scale overlay. */
export const TYPICAL_DIMS: Record<CarBodyType, CarDims> = {
  suv: { lengthMm: 4300, heightMm: 1650, wheelbaseMm: 2600, groundClearanceMm: 190 },
  muv: { lengthMm: 4400, heightMm: 1690, wheelbaseMm: 2750, groundClearanceMm: 180 },
  sedan: { lengthMm: 4700, heightMm: 1480, wheelbaseMm: 2850, groundClearanceMm: 150 },
  hatchback: { lengthMm: 3800, heightMm: 1550, wheelbaseMm: 2450, groundClearanceMm: 165 },
};

export interface CarGeometryInput extends CarDims {
  style: CarStyle;
  /** mm → px. */
  scale: number;
  /** Common frame (mm) so several cars share one scale inside equal boxes. */
  frameLengthMm?: number;
  frameHeightMm?: number;
}

export interface CarGeometry {
  body: string;
  glass: string;
  /** Offset every x-coordinate below must be shifted by. */
  ox: number;
  k: number;
  l: number;
  h: number;
  G: number;
  r: number;
  fx: number;
  rx: number;
  dx: number;
  cy: number;
  yRoof: number;
  yBelt: number;
  yNose: number;
  ySill: number;
  bX: number;
  viewWidth: number;
  viewHeight: number;
}

export function carGeometry(o: CarGeometryInput): CarGeometry {
  const s = o.scale;
  const k = s * 10;
  const l = o.lengthMm * s;
  const h = o.heightMm * s;
  const wb = o.wheelbaseMm * s;
  const gc = o.groundClearanceMm * s;
  const r = 340 * s;
  const frame = (o.frameLengthMm ?? o.lengthMm) * s;
  const ox = (frame - l) / 2 + 12;
  const G = (o.frameHeightMm ?? o.heightMm) * s + 10;
  const mpv = o.style === "mpv";
  const coupe = o.style === "coupe";
  const boxy = o.style === "boxy";
  const fx = (o.lengthMm - o.wheelbaseMm) * 0.53 * s;
  const rx = fx + wb;
  const yRoof = G - h;
  const ySill = G - gc;
  const yBelt = G - h * (mpv ? 0.62 : 0.64);
  const yNose = G - h * (mpv ? 0.5 : 0.53);
  const wBase = mpv ? fx + r * 0.3 : fx + r;
  const rStart = mpv ? wBase + h * 0.66 : wBase + h * (coupe ? 0.56 : 0.5);
  const rEnd = mpv ? rx + r * 0.95 : coupe ? rx - r * 0.35 : boxy ? rx + r * 0.85 : rx + r * 0.45;
  const yRear = yRoof + (mpv ? 4 : coupe ? 14 : boxy ? 2 : 10) * k;
  const aR = r + 5 * k;
  const cy = G - r;
  const dx = Math.sqrt(Math.max(aR * aR - Math.pow(ySill - cy, 2), 1));
  const P = (x: number, y: number) => `${(x + ox).toFixed(1)} ${y.toFixed(1)}`;

  const tail = coupe
    ? ` C${P(rEnd + (l - rEnd) * 0.55, yRear + 8 * k)} ${P(l - 4 * k, G - h * 0.68)} ${P(l - 1 * k, G - h * 0.6)}`
    : ` C${P(rEnd + (l - rEnd) * 0.72, yRear + 1 * k)} ${P(l - 2 * k, G - h * 0.74)} ${P(l - 0.8 * k, G - h * 0.62)}`;

  const body =
    `M${P(30 * k, ySill)}` +
    ` C${P(8 * k, ySill)} ${P(0, G - h * 0.26)} ${P(1.5 * k, G - h * 0.36)}` +
    ` C${P(3 * k, yNose + 5 * k)} ${P(8 * k, yNose)} ${P(22 * k, yNose - 2 * k)}` +
    ` L${P(wBase, yBelt - 2 * k)}` +
    ` C${P(wBase + (rStart - wBase) * 0.55, yRoof + h * 0.1)} ${P(rStart - 20 * k, yRoof)} ${P(rStart, yRoof)}` +
    ` L${P(rEnd, yRear)}${tail}` +
    ` L${P(l, G - h * 0.32)}` +
    ` C${P(l, ySill - 3 * k)} ${P(l - 6 * k, ySill)} ${P(l - 24 * k, ySill)}` +
    ` L${P(rx + dx, ySill)} A${aR.toFixed(1)} ${aR.toFixed(1)} 0 1 0 ${P(rx - dx, ySill)}` +
    ` L${P(fx + dx, ySill)} A${aR.toFixed(1)} ${aR.toFixed(1)} 0 1 0 ${P(fx - dx, ySill)} Z`;

  const gEnd = mpv ? l - 16 * k : coupe ? rEnd + 34 * k : boxy ? l - 18 * k : rEnd + 16 * k;
  const glass =
    `M${P(wBase + 9 * k, yBelt - 4 * k)}` +
    ` C${P(wBase + (rStart - wBase) * 0.5, yRoof + h * 0.16)} ${P(rStart - 12 * k, yRoof + 6 * k)} ${P(rStart + 2 * k, yRoof + 6 * k)}` +
    ` L${P(rEnd - 6 * k, yRear + 6 * k)} L${P(gEnd, yBelt - 4 * k)} Z`;

  return {
    body,
    glass,
    ox,
    k,
    l,
    h,
    G,
    r,
    fx,
    rx,
    dx,
    cy,
    yRoof,
    yBelt,
    yNose,
    ySill,
    bX: wBase + (rEnd - wBase) * 0.47,
    viewWidth: frame + 24,
    viewHeight: G + 8,
  };
}
