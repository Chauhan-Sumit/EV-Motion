"use client";

import { useId, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import { rank } from "@/lib/compare/showroom/metrics";
import {
  emiQuote,
  fiveYearCost,
  monthlyRunningCost,
  ownershipBounds,
  petrolComparator,
  petrolMonthlyCost,
  PUBLIC_CHARGING_PER_UNIT,
  runningCostPerKm,
  type OwnershipSettings,
} from "@/lib/compare/showroom/ownership";
import { cn, formatPriceLakh } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { BestCheck, DISPLAY, Dot, inr, pill, Reveal, SECTION, SectionHeader } from "./ui";

const RANGE_INPUT = cn(
  "h-7 w-full cursor-pointer appearance-none bg-transparent focus-ring",
  "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-[3px] [&::-webkit-slider-runnable-track]:bg-[linear-gradient(90deg,var(--ink)_var(--fill),var(--border)_var(--fill))]",
  "[&::-webkit-slider-thumb]:-mt-[9px] [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,.15)]",
  "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-[3px] [&::-moz-range-track]:bg-border [&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-[3px] [&::-moz-range-progress]:bg-ink",
  "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-white",
);

function SliderField({
  label,
  display,
  value,
  bounds,
  onChange,
}: {
  label: string;
  display: string;
  value: number;
  bounds: { min: number; max: number; step: number };
  onChange: (v: number) => void;
}) {
  const id = useId();
  const fill = ((value - bounds.min) / (bounds.max - bounds.min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex justify-between text-sm text-ink-secondary">
        {label} <b className="tabular-nums text-ink">{display}</b>
      </label>
      <input
        id={id}
        type="range"
        min={bounds.min}
        max={bounds.max}
        step={bounds.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={RANGE_INPUT}
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
    </div>
  );
}

const PANEL = "flex flex-col gap-5 rounded-3xl border border-border bg-surface p-5 md:p-7";
const TILE_VALUE = cn(DISPLAY, "text-2xl font-bold tracking-[-.02em] tabular-nums font-stretch-[86%]");

export function CostSection() {
  const { vehicles, pricing, settings, setSettings, category, city, cityLabel, openCityPicker } = useShowroom();
  const bounds = ownershipBounds(category);
  const set = (k: keyof OwnershipSettings) => (v: number) => setSettings({ [k]: v });
  const petrol = petrolComparator(category);
  const lakh = (x: number) => formatPriceLakh(x / 100000);

  const emiRank = rank("emi", vehicles, settings);
  const runRank = rank("run", vehicles, settings);
  const tcoRank = rank("tco", vehicles, settings);
  const onroadRank = rank("onroad", vehicles, settings);

  const emis = vehicles.map((v) => emiQuote(v.onRoad, settings));
  const lowEmi = vehicles.reduce((a, v) => (emis[v.index].emi < emis[a.index].emi ? v : a));
  const highEmi = vehicles.reduce((a, v) => (emis[v.index].emi > emis[a.index].emi ? v : a));

  const petrolMonthly = petrolMonthlyCost(category, settings);
  const avgRun = vehicles.reduce((a, v) => a + monthlyRunningCost(v.detail, settings), 0) / vehicles.length;

  const tcos = vehicles.map((v) => fiveYearCost(v.onRoad, v.detail, settings));
  const maxTco = Math.max(...tcos);
  const byTco = [...vehicles].sort((a, b) => tcos[a.index] - tcos[b.index]);

  const regTax = pricing.map((p) => p.breakdown.low.registration + p.breakdown.low.roadTax);
  const evExempt = regTax.every((x) => x === 0);

  return (
    <section id="cost" aria-labelledby="cH" className={SECTION}>
      <SectionHeader
        id="cH"
        eyebrow="Price & cost of ownership"
        title="What each one really costs you."
        lede={`Estimates for ${city.name}, starting variants. Move the sliders to match your loan and driving.`}
      />

      <Reveal className="flex flex-col gap-[22px] rounded-4xl bg-surface-dark p-[22px] text-slate-200 md:p-[34px]">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className={cn(DISPLAY, "text-[22px] font-bold font-stretch-[95%]")}>5-year cost of ownership</h3>
          <span className="text-[13px] text-slate-400">On-road price + 5 years of charging at your running-cost settings</span>
        </div>
        <div className="flex flex-col gap-4">
          {vehicles.map((v, i) => {
            const on = (v.onRoad / maxTco) * 100;
            const ch = ((tcos[i] - v.onRoad) / maxTco) * 100;
            const isBest = tcoRank.best.includes(i);
            return (
              <div key={v.detail.slug} className="grid grid-cols-[1fr_auto] items-center gap-2 md:grid-cols-[130px_minmax(0,1fr)_120px] md:gap-[18px]">
                <span className="flex items-center gap-2">
                  <Dot color={v.color} />
                  {v.detail.name}
                </span>
                <div className="col-span-2 row-start-2 flex h-[26px] gap-[3px] md:col-span-1 md:row-start-auto md:h-[34px]">
                  <i className="block h-full rounded-l-lg" style={{ width: `${on}%`, background: v.color.base }} />
                  <i className="block h-full rounded-r-lg" style={{ width: `${ch}%`, background: v.color.shade }} />
                </div>
                <b className={cn(DISPLAY, "text-right text-xl font-bold tabular-nums font-stretch-[88%] md:text-2xl", isBest && "text-primary-bright")}>{lakh(tcos[i])}</b>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-[18px] text-[13px] text-slate-400">
          <span>Bright = on-road price · Dark = 5 years of charging</span>
          {byTco.length > 1 && tcoRank.state !== "insufficient-data" ? (
            <span className="text-white">
              {byTco[0].detail.name} is cheapest to own —{" "}
              <b className="tabular-nums text-primary-bright">{inr(tcos[byTco[byTco.length - 1].index] - tcos[byTco[0].index])}</b> less than the{" "}
              {byTco[byTco.length - 1].detail.name} over five years
            </span>
          ) : null}
        </div>
      </Reveal>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Reveal className={PANEL}>
          <div>
            <h3 className={cn(DISPLAY, "text-[21px] font-bold font-stretch-[95%]")}>EMI calculator</h3>
            <p className="mt-1 text-[13.5px] text-ink-muted">Loan on the on-road price</p>
          </div>
          <SliderField label="Down payment" display={`${settings.downPaymentPct}%`} value={settings.downPaymentPct} bounds={bounds.downPaymentPct} onChange={set("downPaymentPct")} />
          <SliderField label="Interest rate" display={`${settings.annualRatePct.toFixed(2)}% p.a.`} value={settings.annualRatePct} bounds={bounds.annualRatePct} onChange={set("annualRatePct")} />
          <SliderField label="Tenure" display={`${settings.tenureMonths} months`} value={settings.tenureMonths} bounds={bounds.tenureMonths} onChange={set("tenureMonths")} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(118px,1fr))] gap-3">
            {vehicles.map((v, i) => (
              <div key={v.detail.slug} className="flex flex-col gap-1 rounded-2xl bg-surface-secondary px-[18px] py-4">
                <span className="flex items-center gap-1.5 truncate text-[13px] text-ink-muted">
                  <Dot color={v.color} />
                  <span className="truncate">{v.detail.name}</span>
                  {emiRank.best.includes(i) ? <BestCheck /> : null}
                </span>
                <b className={TILE_VALUE}>{inr(emis[i].emi)}</b>
                <span className="text-[12.5px] text-ink-muted">
                  Loan {inr(emis[i].principal)} · interest {inr(emis[i].totalInterest)}
                </span>
              </div>
            ))}
          </div>
          {lowEmi !== highEmi ? (
            <p className="text-[13px] text-ink-muted">
              The {lowEmi.detail.name} costs <b className="tabular-nums text-ink">{inr(emis[highEmi.index].emi - emis[lowEmi.index].emi)}</b> less a month than the {highEmi.detail.name}.
            </p>
          ) : null}
        </Reveal>

        <Reveal className={PANEL}>
          <div>
            <h3 className={cn(DISPLAY, "text-[21px] font-bold font-stretch-[95%]")}>Running cost calculator</h3>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              Public charging at ₹{PUBLIC_CHARGING_PER_UNIT}/unit · petrol {petrol.label} at ₹{petrol.pricePerLitre}/litre, {petrol.kmPerLitre} km/l
            </p>
          </div>
          <SliderField label="Distance per month" display={`${settings.kmPerMonth.toLocaleString("en-IN")} km`} value={settings.kmPerMonth} bounds={bounds.kmPerMonth} onChange={set("kmPerMonth")} />
          <SliderField label="Home electricity rate" display={`₹${settings.homeTariff.toFixed(1)}/unit`} value={settings.homeTariff} bounds={bounds.homeTariff} onChange={set("homeTariff")} />
          <SliderField label="Charged at home" display={`${settings.homeSharePct}%`} value={settings.homeSharePct} bounds={bounds.homeSharePct} onChange={set("homeSharePct")} />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(118px,1fr))] gap-3">
            {vehicles.map((v, i) => (
              <div key={v.detail.slug} className="flex flex-col gap-1 rounded-2xl bg-surface-secondary px-[18px] py-4">
                <span className="flex items-center gap-1.5 truncate text-[13px] text-ink-muted">
                  <Dot color={v.color} />
                  <span className="truncate">{v.detail.name}</span>
                  {runRank.best.includes(i) ? <BestCheck /> : null}
                </span>
                <b className={TILE_VALUE}>{inr(monthlyRunningCost(v.detail, settings))}</b>
                <span className="text-[12.5px] text-ink-muted">₹{runningCostPerKm(v.detail, settings).toFixed(2)}/km</span>
              </div>
            ))}
            <div className="flex flex-col gap-1 rounded-2xl border border-dashed border-border bg-surface px-[18px] py-4">
              <span className="text-[13px] capitalize text-ink-muted">Petrol {petrol.label}</span>
              <b className={cn(TILE_VALUE, "text-ink-muted")}>{inr(petrolMonthly)}</b>
              <span className="text-[12.5px] text-ink-muted">per month</span>
            </div>
          </div>
          {petrolMonthly > avgRun ? (
            <p className="text-[13px] text-ink-muted">
              Any of these saves about <b className="tabular-nums text-primary-hover">{inr((petrolMonthly - avgRun) * 12)}</b> a year over petrol.
            </p>
          ) : null}
        </Reveal>
      </div>

      <Reveal className={cn(PANEL, "mt-4")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={cn(DISPLAY, "text-[21px] font-bold font-stretch-[95%]")}>On-road price breakdown</h3>
          <button type="button" onClick={openCityPicker} className={pill}>
            {cityLabel}
            <ChevronDown className="size-3" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12.5px] tabular-nums md:text-[15px]">
            <thead>
              <tr>
                <th scope="col" className="pb-3.5 text-left text-xs font-semibold uppercase tracking-[.08em] text-ink-muted">Component</th>
                {vehicles.map((v) => (
                  <th key={v.detail.slug} scope="col" className="whitespace-nowrap pb-3.5 pl-1.5 text-right text-xs font-semibold uppercase tracking-[.08em] text-ink-muted md:pl-3">
                    {v.detail.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_td]:border-t [&_td]:border-border/60 [&_td]:py-3.5 [&_td:not(:first-child)]:whitespace-nowrap [&_td:not(:first-child)]:pl-1.5 [&_td:not(:first-child)]:text-right md:[&_td:not(:first-child)]:pl-3">
              <tr>
                <td className="text-ink-secondary">Ex-showroom price</td>
                {pricing.map((p, i) => <td key={i}>{inr(p.breakdown.low.exShowroom)}</td>)}
              </tr>
              <tr>
                <td className="text-ink-secondary">
                  Registration &amp; road tax
                  {evExempt ? <span className="ml-1.5 inline-flex h-6 items-center rounded-xl bg-primary-tint px-2.5 text-xs font-semibold text-primary-hover">EV exempt</span> : null}
                </td>
                {regTax.map((x, i) => <td key={i}>{inr(x)}</td>)}
              </tr>
              <tr>
                <td className="text-ink-secondary">Insurance (est.)</td>
                {pricing.map((p, i) => <td key={i}>{inr(p.breakdown.low.insurance)}</td>)}
              </tr>
              <tr>
                <td className="text-ink-secondary">Other charges (est.)</td>
                {pricing.map((p, i) => <td key={i}>{inr(p.breakdown.low.otherCharges)}</td>)}
              </tr>
              <tr className="text-[15px] font-bold text-ink md:text-[17px]">
                <td>Total on-road</td>
                {pricing.map((p, i) => (
                  <td key={i} className={cn(onroadRank.best.includes(i) && "text-primary-hover")}>
                    {inr(p.breakdown.low.onRoad)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-ink-muted">Estimated for {city.name} — confirm with your dealer. Insurance and other charges vary by city and insurer.</p>
      </Reveal>
    </section>
  );
}
