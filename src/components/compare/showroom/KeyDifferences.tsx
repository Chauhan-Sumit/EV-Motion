"use client";

import { useMemo, useState } from "react";
import { LENSES, lensResult, type Lens } from "@/lib/compare/showroom/verdicts";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { MetricRows } from "./MetricRows";
import { artOf, ShowroomCar } from "./ShowroomCar";
import { btn, DISPLAY, Reveal, SECTION, SectionHeader } from "./ui";

/** "Main differences for…" — pick a use, and the differences that decide it re-rank. */
export function KeyDifferences() {
  const { vehicles, settings, noun } = useShowroom();
  const [lensId, setLensId] = useState<Lens["id"]>("overall");
  const lens = LENSES.find((l) => l.id === lensId) ?? LENSES[0];
  const r = useMemo(() => lensResult(lens, vehicles, settings), [lens, vehicles, settings]);
  const tie = r.score.tie;
  const halo = tie ? "rgba(255,255,255,.16)" : r.first.color.halo;

  return (
    <section id="lens" aria-labelledby="lensH" className={SECTION}>
      <SectionHeader
        id="lensH"
        eyebrow="Key differences"
        title="What matters depends on how you drive."
        lede={`Pick your use and we re-rank the differences that decide it between these ${noun}.`}
      />
      <Reveal>
        <div
          role="group"
          aria-label="Choose how you will use it"
          className="inline-flex w-full gap-1 overflow-x-auto rounded-[26px] bg-surface-secondary p-[5px] [scrollbar-width:none] md:w-auto md:flex-wrap [&::-webkit-scrollbar]:hidden"
        >
          {LENSES.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={l.id === lensId}
              onClick={() => setLensId(l.id)}
              className={cn(
                "inline-flex h-[38px] items-center whitespace-nowrap rounded-[21px] px-3.5 text-[13.5px] font-medium text-ink-secondary transition-colors hover:text-ink focus-ring md:h-[42px] md:px-[18px] md:text-[14.5px]",
                l.id === lensId && "bg-surface font-semibold text-ink shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_14px_rgba(0,0,0,.06)]",
              )}
            >
              {l.name}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal className="mt-[22px] grid grid-cols-1 gap-7 min-[68.75rem]:grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)]">
        <div aria-live="polite" className="relative flex flex-col gap-[18px] overflow-hidden rounded-4xl bg-surface-dark p-6 text-slate-200 md:p-[34px] min-[68.75rem]:min-h-[420px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 size-[280px] rounded-full"
            style={{ background: `radial-gradient(closest-side, ${halo}, transparent)` }}
          />
          <span className="relative text-[12.5px] uppercase tracking-[.14em] text-slate-400">{tie ? `${lens.name} · too close to call` : lens.kicker}</span>
          <h3 className={cn(DISPLAY, "relative text-[clamp(34px,4vw,52px)] font-[850] uppercase leading-[.95] font-stretch-[74%]")}>
            {tie ? (
              <>
                <span style={{ color: r.first.color.glow }}>{r.first.detail.name}</span>{" "}
                <span className="align-[.3em] text-[.5em] text-slate-400 font-stretch-[100%]">or</span>{" "}
                <span style={{ color: r.second.color.glow }}>{r.second.detail.name}</span>
              </>
            ) : (
              <span style={{ color: r.first.color.glow }}>{r.first.detail.name}</span>
            )}
          </h3>
          <p className="relative max-w-[460px] text-[16.5px] leading-[1.55] text-slate-300">{r.text}</p>
          {tie ? (
            <div className="relative mt-1 grid max-w-[420px] grid-cols-2 gap-2.5">
              {[r.first, r.second].map((v) => (
                <ShowroomCar key={v.detail.slug} vehicle={artOf(v.detail.sourceVehicle)} paint={v.color.paint} alt="" />
              ))}
            </div>
          ) : (
            <div className="relative mt-1 max-w-[300px]">
              <ShowroomCar vehicle={artOf(r.first.detail.sourceVehicle)} paint={r.first.color.paint} alt="" />
            </div>
          )}
          <div className="relative mt-auto flex flex-wrap gap-2.5">
            <a href="#offers" className={cn(btn.lg, btn.brand)}>
              {tie ? "Get offers on both" : `Get ${r.first.detail.name} offers`}
            </a>
            <a href="#specs" className={cn(btn.lg, btn.line)}>
              Full specs
            </a>
          </div>
        </div>
        <MetricRows keys={lens.rows} />
      </Reveal>
    </section>
  );
}
