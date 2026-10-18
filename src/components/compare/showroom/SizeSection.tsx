"use client";

import { carGeometry, carStyleFor } from "@/lib/compare/showroom/outline";
import { listJoin, type ShowroomVehicle } from "@/lib/compare/showroom/metrics";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { Legend, Reveal, SECTION, SectionHeader } from "./ui";

const SCALE = 0.14;
const grp = (x: number) => x.toLocaleString("en-IN");

type Drawable = ShowroomVehicle & { L: number; H: number; WB: number };

function ScaleOverlay({ drawable, missing }: { drawable: Drawable[]; missing: ShowroomVehicle[] }) {
  const maxL = Math.max(...drawable.map((v) => v.L));
  const maxH = Math.max(...drawable.map((v) => v.H));
  const G = maxH * SCALE + 26;
  const W = maxL * SCALE + 40 + drawable.length * 54;
  const VH = G + 30 + drawable.length * 24;
  const longest = [...drawable].sort((a, b) => b.L - a.L);

  return (
    <div className="flex flex-col gap-3.5 rounded-4xl bg-surface-secondary px-3.5 pb-3 pt-[18px] md:px-7 md:pb-5 md:pt-7">
      <svg viewBox={`0 0 ${(W + 40).toFixed(0)} ${VH.toFixed(0)}`} role="img" aria-label="Side outlines of the compared vehicles at the same scale" className="h-auto w-full">
        <line x1="0" y1={G} x2={W} y2={G} stroke="var(--border-strong)" strokeWidth="1" />
        {drawable.map((v, j) => {
          // Published length, height and wheelbase only; ground clearance just
          // places the sill line, so a missing one takes a typical share of height.
          const o = carGeometry({
            lengthMm: v.L,
            heightMm: v.H,
            wheelbaseMm: v.WB,
            groundClearanceMm: v.detail.sourceVehicle.specs?.dimensions?.groundClearanceMm ?? v.H * 0.11,
            style: carStyleFor(v.detail.sourceVehicle.bodyType),
            scale: SCALE,
          });
          const c = v.color;
          const y = G + 24 + j * 24;
          const x2 = 12 + v.L * SCALE;
          const hx = maxL * SCALE + 40 + j * 54;
          const top = G - v.H * SCALE;
          return (
            <g key={v.detail.slug}>
              <g transform={`translate(0 ${(G - o.G).toFixed(1)})`}>
                <path d={o.body} fill={c.base} fillOpacity=".07" stroke={c.base} strokeWidth="2" strokeLinejoin="round" />
                <path d={o.glass} fill="none" stroke={c.base} strokeOpacity=".5" strokeWidth="1.2" />
                {[o.fx, o.rx].map((x) => (
                  <circle key={x} cx={x + o.ox} cy={o.cy} r={o.r} fill="none" stroke={c.base} strokeWidth="2" />
                ))}
              </g>
              <g stroke={c.deep} strokeWidth="1.5">
                <line x1="12" y1={y} x2={x2} y2={y} />
                <line x1="12" y1={y - 5} x2="12" y2={y + 5} />
                <line x1={x2} y1={y - 5} x2={x2} y2={y + 5} />
                <line x1={hx} y1={top} x2={hx} y2={G} />
                <line x1={hx - 5} y1={top} x2={hx + 5} y2={top} />
              </g>
              <text x={x2 + 8} y={y + 4} fontSize="12.5" fontWeight="600" fill={c.deep} style={{ fontFamily: "var(--font-showroom-text)" }}>
                {grp(v.L)} mm
              </text>
              <text x={hx + 6} y={top + 13} fontSize="12" fontWeight="600" fill={c.deep} style={{ fontFamily: "var(--font-showroom-text)" }}>
                {grp(v.H)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-[13px] text-ink-muted">
        {drawable.length > 1 ? (
          <>
            The {longest[0].detail.name} is the longest —{" "}
            <b className="text-ink">{grp(longest[0].L - longest[longest.length - 1].L)} mm longer</b> than the {longest[longest.length - 1].detail.name}.
          </>
        ) : null}
        {missing.length ? ` ${listJoin(missing.map((v) => v.detail.name))} not drawn — length, height or wheelbase not published.` : ""}
      </p>
    </div>
  );
}

const DIMS: [string, "lengthMm" | "widthMm" | "heightMm" | "wheelbaseMm" | "groundClearanceMm" | "bootSpaceLiters", string, boolean][] = [
  ["Length", "lengthMm", "mm", false],
  ["Width", "widthMm", "mm", false],
  ["Height", "heightMm", "mm", false],
  ["Wheelbase", "wheelbaseMm", "mm", true],
  ["Ground clearance", "groundClearanceMm", "mm", true],
  ["Boot space", "bootSpaceLiters", "L", true],
];

/** Drawn to the same scale, then every dimension as a bar. */
export function SizeSection() {
  const { vehicles, category } = useShowroom();
  const drawable: Drawable[] = [];
  const missing: ShowroomVehicle[] = [];
  for (const v of vehicles) {
    const d = v.detail.sourceVehicle.specs?.dimensions;
    if (d?.lengthMm && d.heightMm && d.wheelbaseMm) drawable.push({ ...v, L: d.lengthMm, H: d.heightMm, WB: d.wheelbaseMm });
    else missing.push(v);
  }
  // The outline is a car silhouette; it is not drawn for other categories.
  const showOverlay = category === "car" && drawable.length > 0;

  return (
    <section id="size" aria-labelledby="sH" className={SECTION}>
      <SectionHeader
        id="sH"
        eyebrow="Size & space"
        title={showOverlay ? "Drawn to the same scale." : "Every published dimension."}
        lede={
          showOverlay
            ? "Outlines are illustrative but proportioned to each car’s published length, height and wheelbase."
            : "As published by the manufacturers. Longer bars are bigger figures."
        }
        aside={<Legend vehicles={vehicles.map((v) => ({ name: v.detail.name, color: v.color }))} />}
      />
      <Reveal className={cn("grid grid-cols-1 items-stretch gap-7", showOverlay && "min-[68.75rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]")}>
        {showOverlay ? <ScaleOverlay drawable={drawable} missing={missing} /> : null}
        <div className="flex flex-col">
          {DIMS.map(([label, key, u, higherWins]) => {
            const vals = vehicles.map((v) => v.detail.sourceVehicle.specs?.dimensions?.[key] ?? null);
            const known = vals.filter((x): x is number => x !== null);
            const mx = known.length ? Math.max(...known) : 0;
            const mn = known.length ? Math.min(...known) : 0;
            return (
              <div key={key} className="grid grid-cols-1 items-center gap-3.5 border-b border-border/60 py-3.5 first:border-t md:grid-cols-[120px_minmax(0,1fr)]">
                <span className="text-sm text-ink-secondary">{label}</span>
                <div className="flex flex-col gap-1.5">
                  {vehicles.map((v, i) => {
                    const x = vals[i];
                    const wins = higherWins && known.length >= 2 && x === mx && mx !== mn;
                    return (
                      <div key={v.detail.slug} className="grid grid-cols-[minmax(0,1fr)_84px] items-center gap-2.5 text-[13.5px] tabular-nums">
                        <span className="relative h-2 overflow-hidden rounded bg-border">
                          <i className="absolute inset-y-0 left-0 rounded" style={{ width: `${x && mx ? (x / mx) * 100 : 0}%`, background: v.color.base, opacity: higherWins && !wins ? 0.4 : 1 }} />
                        </span>
                        <em className={cn("text-right not-italic", wins && "font-bold", x === null && "text-ink-muted")}>{x === null ? "—" : `${grp(x)} ${u}`}</em>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
