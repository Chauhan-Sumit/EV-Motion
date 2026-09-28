"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatRupees } from "@/lib/vehicle-detail/calculations";
import type { DerivedFigures } from "@/lib/vehicle-detail/calculations";
import type {
  AdInventory,
  Colour,
  PricingAssumptions,
  SimilarVehicle,
  Variant,
} from "@/lib/vehicle-detail/types";
import { CarIllustration } from "./CarIllustration";
import { Card, DataRow, Eyebrow } from "./Section";
import { VdpAdSlot } from "./VdpAdSlot";
import { singleSliderValue } from "@/lib/slider-value";

/**
 * The right rail, in the HTML prototype's order:
 *
 *   300 × 250 MPU → your build → 300 × 250 MPU → EMI calculator
 *   → also compared with → 300 × 600 half page
 *
 * The two MPUs bracket the price panel on purpose: the first is the page's
 * above-the-fold unit, and the second is read straight after the CTA.
 *
 * Only the last unit is sticky, and deliberately so. The rail as a whole is
 * taller than any viewport, so sticking the column would just pin its top out
 * of reach; sticking the final block keeps a unit on screen for the length of
 * the article, which is what that slot is worth.
 */
export function VdpSidebar({
  variant,
  colour,
  figures,
  assumptions,
  ads,
  similar,
  downPaymentPercent,
  tenureMonths,
  city,
  onChangeDownPayment,
  onChangeTenure,
}: {
  variant: Variant;
  colour: Colour;
  figures: DerivedFigures;
  assumptions: PricingAssumptions;
  ads: AdInventory;
  similar: SimilarVehicle[];
  downPaymentPercent: number;
  tenureMonths: number;
  city: string;
  onChangeDownPayment: (percent: number) => void;
  onChangeTenure: (months: number) => void;
}) {
  const interestLabel = `${assumptions.annualRatePct}% p.a.`;

  return (
    <aside className="flex h-full flex-col gap-4">
      {/* 300 × 250, first thing in the rail — the page's above-the-fold unit. */}
      <VdpAdSlot placement={ads.railTop} />

      <Card className="flex flex-col gap-2.5">
        <Eyebrow>Your build</Eyebrow>
        <span className="text-[1.625rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-primary">
          {figures.exShowroomLabel}
        </span>
        <span className="text-[13px] text-ink-secondary">
          {variant.name} · {colour.name}
        </span>

        <div className="mt-1 flex flex-col">
          <DataRow label={`On-road, ${city}`} value={figures.onRoadLabel} />
          <DataRow label="Range" value={figures.rangeLabel} />
          <DataRow label="Running cost" value={`${figures.energyCostPerKmLabel} / km`} />
        </div>

        <div className="mt-1 flex flex-col gap-2">
          <Button className="h-10 w-full text-[13px]">Get Best Price</Button>
          <Button variant="outline" className="h-10 w-full text-[13px]">
            Book a Test Drive
          </Button>
        </div>
      </Card>

      {/* 300 × 250, directly beneath the price panel — read straight after the CTA. */}
      <VdpAdSlot placement={ads.railUnderPrice} />

      <Card className="flex flex-col gap-3">
        <h3 className="text-[15px] font-bold text-ink">Your EMI</h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] text-ink-secondary">Down payment</span>
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {figures.downPaymentLabel}
            </span>
          </div>
          <Slider
            min={assumptions.downPaymentOptions.min}
            max={assumptions.downPaymentOptions.max}
            step={assumptions.downPaymentOptions.step}
            value={[downPaymentPercent]}
            onValueChange={(v) => onChangeDownPayment(singleSliderValue(v, downPaymentPercent))}
            aria-label="Down payment, per cent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] text-ink-secondary">Tenure</span>
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {tenureMonths} months
            </span>
          </div>
          <Slider
            min={assumptions.tenureOptions.min}
            max={assumptions.tenureOptions.max}
            step={assumptions.tenureOptions.step}
            value={[tenureMonths]}
            onValueChange={(v) => onChangeTenure(singleSliderValue(v, tenureMonths))}
            aria-label="Loan tenure in months"
          />
        </div>

        <div className="flex flex-col gap-0.5 border-t border-border pt-3">
          <span className="text-[1.375rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-primary">
            {figures.configuredEmiLabel}
          </span>
          <span className="text-[11px] text-ink-muted">per month at {interestLabel}</span>
        </div>
      </Card>

      <Card className="flex flex-col gap-2.5">
        <h3 className="text-[15px] font-bold text-ink">Also compared with</h3>
        <ul className="flex flex-col">
          {similar.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 border-b border-border py-2.5 last:border-b-0"
            >
              <span className="flex w-14 shrink-0 items-center justify-center">
                <CarIllustration
                  shape={entry.shape}
                  bodyColor={entry.hex}
                  alt=""
                  detail={false}
                />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] font-bold text-ink">{entry.name}</span>
                <span className="truncate text-[11px] text-ink-muted">{entry.summary}</span>
              </span>
              <span className="shrink-0 text-[12px] font-bold tabular-nums text-ink">
                {formatRupees(entry.price)}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 300 × 600, foot of the rail, sticky below the Navbar (h-16) and this
          page's section tabs. Below `lg` the rail stacks under the article and
          a 600px-tall unit would be a wall, so it degrades to a 300 × 250 and
          stops sticking — the same treatment the HTML gave it under 66rem. */}
      <VdpAdSlot placement={{ ...ads.railSticky, size: "rectangle" }} className="lg:hidden" />
      <div className="hidden lg:sticky lg:top-[124px] lg:block">
        <VdpAdSlot placement={ads.railSticky} />
      </div>
    </aside>
  );
}
