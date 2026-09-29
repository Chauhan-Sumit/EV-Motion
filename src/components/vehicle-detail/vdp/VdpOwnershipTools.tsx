"use client";

import { Slider } from "@/components/ui/slider";
import type { DerivedFigures } from "@/lib/vehicle-detail/calculations";
import type {
  DailyDistanceRange,
  PricingAssumptions,
  SectionCopy,
} from "@/lib/vehicle-detail/types";
import { Card, Eyebrow, PrototypeSection, Stat } from "./Section";
import { singleSliderValue } from "@/lib/slider-value";

/**
 * Cost of ownership — the section that answers the question underneath range,
 * charging and price: what does this actually cost to run?
 *
 * The two cost bars share one scale, petrol at full width, so the gap is read
 * as a length rather than as two numbers to subtract in your head. Every
 * assumption behind the figures is printed under the chart instead of being
 * buried, because a running-cost claim with hidden inputs is marketing.
 */
export function VdpOwnershipTools({
  copy,
  figures,
  assumptions,
  dailyDistance,
  kmPerDay,
  batteryLabel,
  onChangeKmPerDay,
}: {
  copy: SectionCopy;
  figures: DerivedFigures;
  assumptions: PricingAssumptions;
  dailyDistance: DailyDistanceRange;
  kmPerDay: number;
  batteryLabel: string;
  onChangeKmPerDay: (km: number) => void;
}) {
  return (
    <PrototypeSection copy={copy}>
      <Card>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <Eyebrow>You drive</Eyebrow>
              <span className="text-[1.5rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-ink">
                {kmPerDay}
                <span className="ml-1 text-[12px] font-semibold text-ink-muted">km / day</span>
              </span>
            </div>

            <Slider
              min={dailyDistance.min}
              max={dailyDistance.max}
              step={dailyDistance.step}
              value={[kmPerDay]}
              onValueChange={(v) => onChangeKmPerDay(singleSliderValue(v, kmPerDay))}
              aria-label="Kilometres driven per day"
            />

            <div className="flex justify-between text-[11px] text-ink-muted">
              {dailyDistance.ticks.map((tick) => (
                <span key={tick}>{tick} km</span>
              ))}
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <span className="text-[2rem] font-extrabold tabular-nums leading-none tracking-[-0.03em] text-primary">
                {figures.annualSavingLabel}
              </span>
              <span className="text-[12px] text-ink-secondary">
                saved a year against an equivalent petrol {assumptions.petrolComparatorLabel}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold tabular-nums text-ink">
                {figures.monthlySavingLabel} a month
              </span>
              <span className="text-[11px] text-ink-muted">
                Full charge of the {batteryLabel} pack: {figures.fullChargeCostLabel} for{" "}
                {figures.rangeLabel}
              </span>
            </div>
          </div>

          <figure className="m-0 flex flex-col gap-3">
            <CostBar
              name="Electric"
              amount={figures.electricMonthlyLabel}
              perKm={figures.energyCostPerKmLabel}
              percent={figures.electricBarPercent}
              kmPerDay={kmPerDay}
              colorClass="bg-chart-1"
              swatchClass="bg-chart-1"
            />
            <CostBar
              name={`Equivalent petrol ${assumptions.petrolComparatorLabel}`}
              amount={figures.petrolMonthlyLabel}
              perKm={figures.petrolCostPerKmLabel}
              percent={100}
              kmPerDay={kmPerDay}
              colorClass="bg-chart-2"
              swatchClass="bg-chart-2"
            />

            <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2.5 text-[12px] text-ink-secondary">
              <span>Per kilometre</span>
              <span>
                <b className="tabular-nums text-ink">{figures.energyCostPerKmLabel}</b> electric ·{" "}
                <b className="tabular-nums text-ink">{figures.petrolCostPerKmLabel}</b> petrol
              </span>
            </div>

            <figcaption className="text-[11px] leading-relaxed text-ink-muted">
              Monthly energy or fuel cost only. Electricity at ₹
              {assumptions.electricityCostPerUnit} a unit against petrol at ₹
              {assumptions.petrolPricePerLitre} a litre and {assumptions.petrolKmPerLitre} km/l,
              over {assumptions.daysPerMonth} days. Excludes servicing, insurance and tyres.
            </figcaption>
          </figure>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          <Stat
            label="Charging cost"
            value={figures.fullChargeCostLabel}
            sub={`a full ${batteryLabel} charge at ₹${assumptions.electricityCostPerUnit} a unit`}
            className="bg-surface px-3.5 py-3"
          />
          <Stat
            label="Cost per km"
            value={figures.energyCostPerKmLabel}
            sub={`against ${figures.petrolCostPerKmLabel} on petrol`}
            className="bg-surface px-3.5 py-3"
          />
          <Stat
            label="State subsidy"
            value={<span className="text-[15px]">{assumptions.state}</span>}
            sub="Check eligibility against the current state EV policy"
            className="bg-surface px-3.5 py-3"
          />
        </div>
      </Card>
    </PrototypeSection>
  );
}

/**
 * One bar in the running-cost comparison. The breakdown appears on hover *and*
 * on keyboard focus — a hover-only detail is invisible to anyone not using a
 * mouse, so the row is focusable and the panel responds to both.
 */
function CostBar({
  name,
  amount,
  perKm,
  percent,
  kmPerDay,
  colorClass,
  swatchClass,
}: {
  name: string;
  amount: string;
  perKm: string;
  percent: number;
  kmPerDay: number;
  colorClass: string;
  swatchClass: string;
}) {
  return (
    <div
      tabIndex={0}
      className="focus-ring group relative flex flex-col gap-1.5 rounded-lg outline-none"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[12px] text-ink-secondary">
          <span className={`size-2.5 rounded-[3px] ${swatchClass}`} aria-hidden />
          {name}
        </span>
        <span className="text-[13px] font-bold tabular-nums text-ink">{amount}</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div
          className={`h-full rounded-full transition-[width] duration-200 ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="pointer-events-none absolute -top-1 left-0 z-10 -translate-y-full rounded-lg border border-border bg-surface px-3 py-2 text-[11px] leading-snug text-ink-secondary opacity-0 shadow-card-hover transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <b className="text-ink">{name}</b>
        <br />
        {amount} a month
        <br />
        {perKm} per km · {kmPerDay} km/day
      </div>
    </div>
  );
}
