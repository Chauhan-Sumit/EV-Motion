"use client";

import { Fragment, useMemo } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { routeSegmentFor, categoryConfig } from "@/lib/data/categories";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { WINNER_METRICS } from "@/lib/compare/metrics";
import { MAX_COMPARE } from "@/lib/compare/slug";
import { heroRuling } from "@/lib/compare/showroom/verdicts";
import { listJoin } from "@/lib/compare/showroom/metrics";
import { formatPricingDate, PRICING_DATA_LAST_UPDATED } from "@/lib/vehicle-pricing";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { DISPLAY, WRAP } from "./ui";
import { EmptySlot, VehicleSlot } from "./VehicleSlot";
import { ReportErrorButton } from "./ReportErrorButton";

const H1_SIZE: Record<number, string> = {
  2: "text-[clamp(28px,9.5vw,42px)] md:text-[clamp(30px,4.4vw,58px)]",
  3: "text-[clamp(24px,7.6vw,34px)] md:text-[clamp(28px,3.9vw,52px)]",
  4: "text-[clamp(24px,7.6vw,34px)] md:text-[clamp(26px,3.3vw,44px)]",
};

export function ShowroomHero() {
  const { vehicles, pricing, settings, cityLabel, category, noun, openPicker, removeVehicle, openCityPicker } = useShowroom();
  const n = vehicles.length;
  const ruling = useMemo(() => heroRuling(vehicles, settings), [vehicles, settings]);
  const tally = useMemo(() => {
    const r = computeWinners(
      vehicles.map((v) => v.detail),
      WINNER_METRICS,
    );
    return { wins: r.categoriesWon, rankable: r.metricResults.filter((m) => m.state !== "insufficient-data").length };
  }, [vehicles]);

  const names = vehicles.map((v) => v.detail.name);
  const others = n - 1;

  return (
    <section id="top" aria-labelledby="showroom-h1" className="relative overflow-hidden bg-surface-dark pb-7 pt-3.5 text-slate-200 md:pb-[34px] md:pt-[18px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 25% 62%,rgba(61,107,255,.20),transparent 70%),radial-gradient(60% 55% at 75% 62%,rgba(242,107,29,.18),transparent 70%),radial-gradient(90% 60% at 50% 110%,rgba(255,255,255,.07),transparent 70%)",
        }}
      />
      <div className={cn(WRAP, "relative")}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13px] text-slate-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/compare" className="hover:text-white">Compare</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${routeSegmentFor(category)}`} className="hover:text-white">{categoryConfig(category).label}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-200" aria-current="page">{names.join(" vs ")}</span>
        </nav>

        <div className="mt-[18px] flex flex-wrap items-center justify-center gap-x-2.5 text-center text-[11.5px] uppercase tracking-[.16em] text-slate-400">
          <b className="font-semibold text-primary-bright" aria-hidden="true">●</b> The ruling <span aria-hidden="true">·</span> Updated{" "}
          {formatPricingDate(PRICING_DATA_LAST_UPDATED)}
        </div>

        <h1 id="showroom-h1" className={cn(DISPLAY, H1_SIZE[n], "mt-2.5 text-center font-[850] uppercase leading-[.98] text-white font-stretch-[70%]")}>
          {names.map((nm, i) => (
            <Fragment key={nm}>
              {i > 0 ? (
                <em className="mx-[.25em] align-[.38em] text-[.4em] font-medium not-italic tracking-[.1em] text-slate-400 font-stretch-[100%] md:mx-[.32em] md:text-[.42em]">vs</em>
              ) : null}
              <span>{nm}</span>
            </Fragment>
          ))}
        </h1>
        <p className="mt-2.5 text-center text-[13px] text-slate-400 md:text-[14.5px]">
          {n} {noun} compared on price, range, charging, running cost and safety
          {n < MAX_COMPARE ? ` · add up to ${MAX_COMPARE - n} more` : ""}
        </p>

        <div aria-label="Vehicles being compared" className="mt-[18px] grid grid-cols-2 gap-2.5 md:mt-6 md:gap-3.5 min-[68.75rem]:grid-cols-4">
          {vehicles.map((v, i) => (
            <VehicleSlot
              key={v.detail.slug}
              v={v}
              pricing={pricing[i]}
              isLead={i === ruling.leaderIndex}
              wins={tally.wins[i]}
              rankable={tally.rankable}
              canRemove={n > 2}
              onChange={() => openPicker(i)}
              onRemove={() => removeVehicle(i)}
            />
          ))}
          {Array.from({ length: MAX_COMPARE - n }, (_, k) => (
            <EmptySlot key={`empty-${k}`} index={n + k} count={n} max={MAX_COMPARE} onAdd={() => openPicker()} />
          ))}
        </div>

        <p
          aria-live="polite"
          className={cn(
            DISPLAY,
            "mx-auto mt-5 max-w-[860px] text-left text-[clamp(17px,1.7vw,21px)] font-semibold leading-[1.3] tracking-[-.01em] text-[#D7DAE0] font-stretch-[92%] md:text-center",
            "[&_b]:font-extrabold [&_b]:text-white",
          )}
        >
          {ruling.tie ? (
            <>
              It’s <b>{ruling.first.detail.name}</b> or <b>{ruling.second.detail.name}</b> — too close to call overall. Use the{" "}
              <span className="text-primary-bright">Key differences</span> picker below to break the tie for how you drive.
            </>
          ) : (
            <>
              Get the <b>{ruling.first.detail.name}</b> — best overall
              {ruling.firstLeads.length ? (
                <>
                  , leading on <span className="text-primary-bright">{listJoin(ruling.firstLeads)}</span>
                </>
              ) : (
                " on balance"
              )}
              .{" "}
              {others > 0 ? (
                <>
                  Pick the <b>{ruling.second.detail.name}</b>
                  {ruling.secondLead ? ` if ${ruling.secondLead} matters most` : " as the runner-up"}.
                </>
              ) : null}
            </>
          )}
        </p>

        <div className="mt-4 flex flex-wrap justify-start gap-x-[18px] gap-y-2.5 text-xs text-slate-400 md:justify-center md:text-[12.5px]">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Specs as published by the manufacturers
          </span>
          <button type="button" onClick={openCityPicker} className="underline-offset-[3px] hover:text-white hover:underline focus-ring">
            Prices for {cityLabel}
          </button>
          <span>By EV Motion Data Desk</span>
          <ReportErrorButton className="text-slate-400 underline underline-offset-[3px] hover:text-white" />
        </div>
      </div>
    </section>
  );
}
