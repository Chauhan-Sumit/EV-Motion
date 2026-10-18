"use client";

import type { ReactNode } from "react";
import { Home, IndianRupee, Route, ShieldCheck, Tag, Zap } from "lucide-react";
import { rank, rankValues, listJoin, type Rank, type ShowroomVehicle } from "@/lib/compare/showroom/metrics";
import { acRangePerHour, blendedUnitRate, rangePer15MinDc, runningCostPerKm } from "@/lib/compare/showroom/ownership";
import { realWorldBand } from "@/lib/compare/showroom/verdicts";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { BestCheck, DISPLAY, Dot, inr, NotPublished, Reveal, SECTION, SectionHeader } from "./ui";

const small = (u: string) => <small className="ml-[3px] text-xs font-medium text-ink-muted [font-family:var(--font-showroom-text)]">{u}</small>;

interface Card {
  icon: ReactNode;
  title: string;
  r: Rank;
  value: (v: ShowroomVehicle) => ReactNode;
  take: (best: ShowroomVehicle | null) => ReactNode;
  fine: string;
}

function warrantyText(v: ShowroomVehicle): string | null {
  const w = v.detail.sourceVehicle.specs?.warranty;
  if (!w?.batteryYears) return null;
  return `${w.batteryYears} yrs${w.batteryKm ? ` / ${w.batteryKm.toLocaleString("en-IN")} km` : ""}`;
}

/** Numbers a spec sheet won't give you — worked out from published figures, maths shown. */
export function OwnershipInsights() {
  const { vehicles, settings } = useShowroom();
  const unit = blendedUnitRate(settings);
  const factors = vehicles[0].detail.realWorldRange.factors;
  const lo = Math.round(Math.min(factors.city, factors.highway) * 100);
  const hi = Math.round(Math.max(factors.city, factors.highway) * 100);
  const withWarranty = vehicles.filter((v) => warrantyText(v));
  const strong = (v: ShowroomVehicle | null) => <strong className="text-ink">{v?.detail.name}</strong>;

  const cards: Card[] = [
    {
      icon: <Route className="size-[21px]" strokeWidth={1.8} aria-hidden="true" />,
      title: "Real-world range",
      r: rank("range", vehicles, settings),
      value: (v) => {
        const [a, b] = realWorldBand(v.detail);
        return (
          <>
            {a}–{b}
            {small("km")}
          </>
        );
      },
      take: (w) => <>{strong(w)} should go furthest between charges in everyday driving.</>,
      fine: `Estimate: ${lo}–${hi}% of each claimed range (highway to city).`,
    },
    {
      icon: <Zap className="size-[21px]" strokeWidth={1.8} aria-hidden="true" />,
      title: "Fast-charge top-up",
      r: rank("dc15", vehicles, settings),
      value: (v) => {
        const x = rangePer15MinDc(v.detail);
        return x === null ? <NotPublished /> : (
          <>
            {x}
            {small("km / 15 min")}
          </>
        );
      },
      take: (w) => <>{strong(w)} adds the most range during a coffee stop — handy on highway runs.</>,
      fine: "Average over 10–80%: 70% of claimed range ÷ published DC minutes × 15.",
    },
    {
      icon: <Home className="size-[21px]" strokeWidth={1.8} aria-hidden="true" />,
      title: "Home charging",
      r: rankValues(vehicles.map((v) => acRangePerHour(v.detail)), "higher"),
      value: (v) => {
        const x = acRangePerHour(v.detail);
        return x === null ? <NotPublished /> : (
          <>
            {Math.round(x)}
            {small("km / hour")}
          </>
        );
      },
      take: (w) => <>All of these refill overnight on an AC wallbox — {strong(w)} soonest.</>,
      fine: "Claimed range ÷ published full AC charge time.",
    },
    {
      icon: <IndianRupee className="size-[21px]" strokeWidth={1.8} aria-hidden="true" />,
      title: "Running cost per km",
      r: rank("eff", vehicles, settings),
      value: (v) => (
        <>
          ₹{runningCostPerKm(v.detail, settings).toFixed(2)}
          {small("/km")}
        </>
      ),
      take: (w) => <>{strong(w)} is the cheapest to run every kilometre.</>,
      fine: `At ₹${unit.toFixed(2)}/unit blended home + public charging — change it in the calculator below.`,
    },
    {
      icon: <Tag className="size-[21px]" strokeWidth={1.8} aria-hidden="true" />,
      title: "Price per km of range",
      r: rank("ppk", vehicles, settings),
      value: (v) => inr(v.onRoad / v.detail.quickSpecs.rangeKm),
      take: (w) => <>You pay the least for each km of range with the {strong(w)}.</>,
      fine: "On-road price ÷ claimed range.",
    },
    {
      icon: <ShieldCheck className="size-[21px]" strokeWidth={1.8} aria-hidden="true" />,
      title: "Battery warranty",
      r: rankValues([], "higher"),
      value: (v) => {
        const t = warrantyText(v);
        if (!t) return <NotPublished />;
        const [yrs, km] = t.split(" / ");
        return (
          <>
            {yrs}
            {km ? small(`/ ${km}`) : null}
          </>
        );
      },
      take: () =>
        withWarranty.length
          ? `${listJoin(withWarranty.map((v) => v.detail.name))} ${withWarranty.length > 1 ? "publish" : "publishes"} battery cover${withWarranty.length < vehicles.length ? "; check the others with the dealer before you buy" : ""}.`
          : "No battery warranty published yet — ask the dealer.",
      fine: "As published by the manufacturers.",
    },
  ];

  return (
    <section id="ev" aria-labelledby="evH" className={SECTION}>
      <SectionHeader
        id="evH"
        eyebrow="EV ownership"
        title="What living with each one is like."
        lede="Numbers a spec sheet won’t give you — worked out from the published figures, with the maths shown."
      />
      <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[68.75rem]:grid-cols-3">
        {cards.map((c) => {
          const best = c.r.state === "winner" || c.r.state === "tie" ? vehicles[c.r.best[0]] : null;
          return (
            <div key={c.title} className="flex flex-col gap-4 rounded-3xl bg-surface-secondary p-[26px]">
              <div className="flex items-center gap-3">
                <span className="grid size-[42px] flex-none place-items-center rounded-xl bg-surface">{c.icon}</span>
                <h3 className="text-[17px] font-bold tracking-[-.01em]">{c.title}</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                {vehicles.map((v, i) => {
                  const isBest = c.r.best.includes(i);
                  return (
                    <div key={v.detail.slug} className="flex items-baseline justify-between gap-2.5">
                      <span className="flex min-w-0 items-center gap-[7px] overflow-hidden whitespace-nowrap text-[13px] text-ink-muted">
                        <Dot color={v.color} />
                        <span className="truncate">{v.detail.name}</span>
                        {isBest ? <BestCheck /> : null}
                      </span>
                      <b className={cn(DISPLAY, "whitespace-nowrap text-[22px] font-bold tabular-nums font-stretch-[86%]", c.r.best.length > 0 && !isBest && "text-ink-muted/70")}>
                        {c.value(v)}
                      </b>
                    </div>
                  );
                })}
              </div>
              {best || c.title === "Battery warranty" ? <p className="rounded-[14px] bg-surface px-4 py-3.5 text-sm leading-normal text-ink-secondary">{c.take(best)}</p> : null}
              <p className="mt-auto text-xs text-ink-muted">{c.fine}</p>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
