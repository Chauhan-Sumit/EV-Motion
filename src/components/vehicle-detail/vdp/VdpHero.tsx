"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { QuickSpec } from "@/lib/vehicle-detail/calculations";
import type {
  Colour,
  GalleryShot,
  Variant,
  VdpViewModel,
} from "@/lib/vehicle-detail/types";
import { CarIllustration } from "./CarIllustration";
import { Eyebrow } from "./Section";

/**
 * Column counts written out in full so Tailwind's scanner sees them — a
 * template-built class name like `lg:grid-cols-${n}` is never emitted.
 */
const LG_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

/**
 * Hero band: identity, the image stage with its thumbnail strip, the price
 * panel, and the quick-spec chips.
 *
 * The image stage is the page's answer to having no photography yet. Frame one
 * is the live illustration in the selected colour; the rest are labelled slots
 * that state the brief for the shot that belongs there. Reviewers see the
 * gallery interaction working without the page pretending to own pictures it
 * does not have.
 */
export function VdpHero({
  vehicle,
  variant,
  colour,
  shot,
  shotIndex,
  quickSpecs,
  exShowroomLabel,
  onRoadLabel,
  emiLabel,
  city,
  onSelectShot,
}: {
  vehicle: VdpViewModel;
  variant: Variant;
  colour: Colour;
  shot: GalleryShot;
  shotIndex: number;
  quickSpecs: QuickSpec[];
  exShowroomLabel: string;
  onRoadLabel: string;
  emiLabel: string;
  /** Pricing city, for the "Ex-showroom, <city>" label. */
  city: string;
  onSelectShot: (index: number) => void;
}) {
  return (
    <section
      id="images"
      className="scroll-mt-[128px] border-b border-border bg-gradient-to-b from-surface to-primary-tint py-8 dark:from-surface-dark dark:to-surface"
    >
      <Container>
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="grid gap-6 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] sm:items-center">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <Eyebrow>{vehicle.brand}</Eyebrow>
                <Eyebrow aria-hidden>·</Eyebrow>
                <Eyebrow>{vehicle.bodyType}</Eyebrow>
              </div>

              <h1 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.75rem]">
                {vehicle.name}
              </h1>

              <p className="max-w-[38ch] text-[14px] leading-relaxed text-ink-secondary">
                {vehicle.statement}
              </p>

              <ul className="flex flex-wrap gap-1.5 pt-1">
                {vehicle.badges.map((badge, index) => (
                  <li
                    key={badge}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                      index === 0
                        ? "border-primary/35 bg-primary-tint text-accent-foreground"
                        : "border-border bg-surface text-ink-secondary",
                    )}
                  >
                    {badge}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="m-0 flex flex-col items-center gap-2">
              <div className="relative flex min-h-[170px] w-full items-center justify-center rounded-xl px-3 sm:min-h-[210px]">
                <span className="absolute right-1 top-1 rounded-full border border-border bg-surface/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-ink-muted backdrop-blur">
                  {shot.kind === "illustration" ? "Illustration" : "Photo slot"}
                </span>

                {shot.kind === "illustration" ? (
                  <CarIllustration
                    shape={vehicle.shape}
                    bodyColor={colour.hex}
                    alt={`${vehicle.name} illustration in ${colour.name}`}
                    className="max-w-[430px]"
                  />
                ) : (
                  <PhotoSlot label={shot.label} note={shot.note} />
                )}
              </div>
              <figcaption className="text-[12px] text-ink-muted">
                {shot.kind === "illustration"
                  ? `${variant.name} · ${colour.name}`
                  : "Awaiting photography"}
              </figcaption>
            </figure>
          </div>

          <PricePanel
            city={city}
            exShowroomLabel={exShowroomLabel}
            variantSummary={`${variant.name} · ${variant.batteryKwh} kWh`}
            onRoadLabel={onRoadLabel}
            emiLabel={emiLabel}
          />
        </div>

        <div
          role="group"
          aria-label="Choose a view"
          className="scroll-row mt-6 flex gap-2.5 overflow-x-auto pb-1"
        >
          {vehicle.shots.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelectShot(index)}
              aria-pressed={index === shotIndex}
              className={cn(
                "focus-ring flex h-[74px] w-[124px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border bg-surface px-2 transition-colors",
                index === shotIndex
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-border hover:border-border-strong",
              )}
            >
              {entry.kind === "illustration" ? (
                <CarIllustration
                  shape={vehicle.shape}
                  bodyColor={colour.hex}
                  alt=""
                  detail={false}
                  className="max-h-[34px] w-[86px]"
                />
              ) : (
                <span className="text-[11px] font-bold tabular-nums text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span className="text-[11px] font-semibold text-ink-secondary">
                {entry.shortLabel}
              </span>
            </button>
          ))}
        </div>

        {/*
          The approved 5-across strip. The `lg:` column count follows the chip
          count only so a category publishing fewer figures does not leave a
          dead cell; with all five chips present — every car — this renders
          exactly as approved.
        */}
        <dl
          className={cn(
            "mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3",
            LG_COLUMNS[quickSpecs.length] ?? "lg:grid-cols-5",
          )}
        >
          {quickSpecs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1 bg-surface px-3.5 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">
                {spec.label}
              </dt>
              <dd className="text-[1.25rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-ink">
                {spec.value}
                {spec.unit ? (
                  <span className="ml-0.5 text-[12px] font-semibold text-ink-muted">
                    {spec.unit}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/** Labelled placeholder standing in for photography that does not exist yet. */
function PhotoSlot({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex min-h-[150px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong bg-surface/60 px-5 py-7 text-center sm:min-h-[190px]">
      <span className="text-[13px] font-bold text-ink">{label}</span>
      <span className="max-w-[34ch] text-[11px] leading-relaxed text-ink-muted">{note}</span>
    </div>
  );
}

function PricePanel({
  city,
  exShowroomLabel,
  variantSummary,
  onRoadLabel,
  emiLabel,
}: {
  city: string;
  exShowroomLabel: string;
  variantSummary: string;
  onRoadLabel: string;
  emiLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-[18px] shadow-card">
      <Eyebrow>Ex-showroom, {city}</Eyebrow>
      <span className="text-[1.75rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-primary">
        {exShowroomLabel}
      </span>
      <span className="text-[13px] text-ink-secondary">{variantSummary}</span>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold tabular-nums text-ink">{onRoadLabel}</span>
          <span className="text-[11px] text-ink-muted">On-road, est.</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold tabular-nums text-ink">{emiLabel}</span>
          <span className="text-[11px] text-ink-muted">EMI / month</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-0.5">
        <Button className="h-10 w-full text-[13px]">Get Best Price</Button>
        <Button variant="outline" className="h-10 w-full text-[13px]">
          Book a Test Drive
        </Button>
      </div>
    </div>
  );
}
