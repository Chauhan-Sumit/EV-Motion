"use client";

import { useId } from "react";
import { carGeometry, carStyleFor, type CarDims } from "@/lib/compare/showroom/outline";
import type { Paint } from "@/lib/cars-listing/paint";
import type { CarBodyType } from "@/types/vehicle";
import { cn } from "@/lib/utils";

/**
 * The listing's side-view car drawing: the same generic, body-style geometry
 * the Compare page draws (`carGeometry`), proportioned to the car's published
 * dimensions where they exist, plus the approved listing design's floor
 * reflection. Illustration, not a likeness or a photograph (CLAUDE.md #26).
 */
export function ListingCarArt({
  dims,
  body,
  paint,
  frame,
  reflect = false,
  detail = true,
  alt,
  className,
}: {
  dims: CarDims;
  body: CarBodyType;
  paint: Paint;
  /** Common frame (mm) so cars sit at one scale inside equal boxes. */
  frame: { lengthMm: number; heightMm: number };
  reflect?: boolean;
  /** False drops spokes and lights — for small thumbnails. */
  detail?: boolean;
  /** Empty marks the drawing decorative. */
  alt: string;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const s = 0.1;
  const g = carGeometry({ ...dims, style: carStyleFor(body), scale: s, frameLengthMm: Math.max(frame.lengthMm, dims.lengthMm), frameHeightMm: frame.heightMm });
  const { k, ox, r, cy } = g;
  const reflH = reflect ? frame.heightMm * s * 0.26 : 8;
  const viewH = g.G + reflH;
  const boxy = body === "muv" || body === "hatchback";
  const X = (x: number) => (x + ox).toFixed(1);

  const wheel = (cx: number) => (
    <g key={cx}>
      <circle cx={X(cx)} cy={cy.toFixed(1)} r={r.toFixed(1)} fill="#0A0B0D" />
      <circle cx={X(cx)} cy={cy.toFixed(1)} r={(r * 0.66).toFixed(1)} fill={`url(#rim${id})`} />
      {detail
        ? Array.from({ length: 5 }, (_, i) => {
            const a = (i * 72 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={X(cx)}
                y1={cy.toFixed(1)}
                x2={(cx + ox + Math.cos(a) * r * 0.6).toFixed(1)}
                y2={(cy + Math.sin(a) * r * 0.6).toFixed(1)}
                stroke="#3B4048"
                strokeWidth={(2.2 * k).toFixed(1)}
                strokeLinecap="round"
              />
            );
          })
        : null}
      <circle cx={X(cx)} cy={cy.toFixed(1)} r={(r * 0.14).toFixed(1)} fill="#D5D9DF" />
    </g>
  );

  const car = (
    <>
      <path d={g.body} fill={`url(#pg${id})`} />
      <path d={g.body} fill={`url(#sh${id})`} />
      <path d={g.glass} fill={`url(#gl${id})`} />
      <rect x={X(g.bX)} y={(g.yRoof + 4 * k).toFixed(1)} width={(4.5 * k).toFixed(1)} height={Math.max(g.yBelt - g.yRoof - 6 * k, 1).toFixed(1)} fill={paint[2]} />
      {boxy ? (
        <rect x={X(g.rx - r * 0.1)} y={(g.yRoof + 6 * k).toFixed(1)} width={(5 * k).toFixed(1)} height={Math.max(g.yBelt - g.yRoof - 8 * k, 1).toFixed(1)} fill={paint[2]} />
      ) : null}
      <path d={`M${X(24 * k)} ${(g.yBelt + 5 * k).toFixed(1)} L${X(g.l - 6 * k)} ${(g.yBelt + 3 * k).toFixed(1)}`} stroke="#fff" strokeOpacity=".35" strokeWidth={(0.9 * k).toFixed(1)} fill="none" />
      <rect x={X(g.fx + g.dx)} y={(g.ySill - 7 * k).toFixed(1)} width={Math.max(g.rx - g.fx - 2 * g.dx, 1).toFixed(1)} height={(7 * k).toFixed(1)} fill="#000" opacity=".35" />
      {detail ? (
        <>
          <rect x={X(4 * k)} y={(g.yNose + 3 * k).toFixed(1)} width={(24 * k).toFixed(1)} height={(3.2 * k).toFixed(1)} rx={(1.6 * k).toFixed(1)} fill="#EAF3FF" />
          <rect x={X(g.l - 14 * k)} y={(g.G - g.h * 0.66).toFixed(1)} width={(13 * k).toFixed(1)} height={(3.6 * k).toFixed(1)} rx={(1.6 * k).toFixed(1)} fill="#FF3B30" />
        </>
      ) : null}
      {wheel(g.fx)}
      {wheel(g.rx)}
    </>
  );

  return (
    <svg
      viewBox={`0 0 ${g.viewWidth.toFixed(0)} ${viewH.toFixed(0)}`}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("relative block h-auto w-full", className)}
    >
      <defs>
        <linearGradient id={`pg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={paint[0]} />
          <stop offset=".45" stopColor={paint[1]} />
          <stop offset="1" stopColor={paint[2]} />
        </linearGradient>
        <linearGradient id={`sh${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset=".8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
        <linearGradient id={`gl${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A3446" />
          <stop offset=".5" stopColor="#0B0F16" />
          <stop offset=".62" stopColor="#3A475C" />
          <stop offset="1" stopColor="#0B0F16" />
        </linearGradient>
        <radialGradient id={`rim${id}`}>
          <stop offset="0" stopColor="#9AA1AB" />
          <stop offset=".7" stopColor="#5D636C" />
          <stop offset="1" stopColor="#2B2F36" />
        </radialGradient>
        <filter id={`bl${id}`} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation={(3 * k).toFixed(1)} />
        </filter>
        {reflect ? (
          <>
            <linearGradient id={`fd${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".18" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id={`mk${id}`} maskUnits="userSpaceOnUse" x="0" y={g.G.toFixed(1)} width={g.viewWidth.toFixed(1)} height={reflH.toFixed(1)}>
              <rect x="0" y={g.G.toFixed(1)} width={g.viewWidth.toFixed(1)} height={reflH.toFixed(1)} fill={`url(#fd${id})`} />
            </mask>
          </>
        ) : null}
      </defs>
      {reflect ? (
        <g mask={`url(#mk${id})`}>
          <g transform={`translate(0 ${(2 * g.G).toFixed(1)}) scale(1 -1)`}>{car}</g>
        </g>
      ) : null}
      <ellipse cx={X(g.l / 2)} cy={(g.G - 1).toFixed(1)} rx={(g.l * 0.5).toFixed(1)} ry={(3.5 * k).toFixed(1)} fill="#000" opacity=".7" filter={`url(#bl${id})`} />
      {car}
    </svg>
  );
}
