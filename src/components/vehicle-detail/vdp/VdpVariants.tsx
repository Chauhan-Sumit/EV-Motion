"use client";

import { cn } from "@/lib/utils";
import type { DerivedFigures } from "@/lib/vehicle-detail/calculations";
import { formatRupees } from "@/lib/vehicle-detail/calculations";
import type { Colour, SectionCopy, Variant } from "@/lib/vehicle-detail/types";
import { CarIllustration } from "./CarIllustration";
import { Card, Eyebrow, PrototypeSection, Stat } from "./Section";

/**
 * The configurator — the section the whole page pivots on.
 *
 * Picking a variant or a colour here is what drives the hero, the sidebar, the
 * comparison table and the running-cost chart. Everything it shows is passed
 * in already calculated; this component chooses no numbers of its own.
 *
 * The colour picker carries `id="colours"` so the section nav's Colours tab has
 * somewhere to land without the design needing a separate colours band.
 */
export function VdpVariants({
  copy,
  variants,
  colours,
  selectedVariant,
  selectedColour,
  figures,
  shape,
  city,
  tenureMonths,
  onSelectVariant,
  onSelectColour,
}: {
  copy: SectionCopy;
  variants: Variant[];
  colours: Colour[];
  selectedVariant: Variant;
  selectedColour: Colour;
  figures: DerivedFigures;
  shape: Parameters<typeof CarIllustration>[0]["shape"];
  city: string;
  tenureMonths: number;
  onSelectVariant: (id: string) => void;
  onSelectColour: (id: string) => void;
}) {
  return (
    <PrototypeSection copy={copy}>
      <Card padded={false}>
        <div className="flex flex-col gap-5 p-[18px]">
          <div className="flex flex-col gap-2">
            <Eyebrow>Variant</Eyebrow>
            <div role="group" aria-label="Choose a variant" className="flex flex-col gap-2">
              {variants.map((variant) => {
                const selected = variant.id === selectedVariant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelectVariant(variant.id)}
                    className={cn(
                      "focus-ring grid w-full grid-cols-2 items-center gap-x-3 gap-y-1 rounded-lg border px-3.5 py-3 text-left transition-colors sm:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]",
                      selected
                        ? "border-primary bg-primary-tint"
                        : "border-border bg-surface hover:border-border-strong hover:bg-surface-secondary",
                    )}
                  >
                    <span className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1">
                      <span className="text-[14px] font-bold text-ink">{variant.name}</span>
                      {variant.recommended ? (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-primary-foreground">
                          Best value
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[12px] tabular-nums text-ink-secondary">
                      {variant.batteryKwh} kWh
                    </span>
                    <span className="text-[12px] tabular-nums text-ink-secondary">
                      {variant.rangeKm} km
                    </span>
                    <span className="text-right text-[14px] font-bold tabular-nums text-ink">
                      {formatRupees(variant.exShowroom)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="colours"
            className="grid scroll-mt-[128px] gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-center"
          >
            <div className="flex flex-col gap-2.5">
              <Eyebrow>
                Colour — <span className="normal-case text-ink">{selectedColour.name}</span>
              </Eyebrow>
              <div role="group" aria-label="Choose a colour" className="flex flex-wrap gap-2.5">
                {colours.map((colour) => {
                  const selected = colour.id === selectedColour.id;
                  return (
                    <button
                      key={colour.id}
                      type="button"
                      title={colour.name}
                      aria-label={colour.name}
                      aria-pressed={selected}
                      onClick={() => onSelectColour(colour.id)}
                      style={{ backgroundColor: colour.hex }}
                      className={cn(
                        "focus-ring size-9 rounded-full border transition-[box-shadow,transform]",
                        selected
                          ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-surface"
                          : "border-border-strong hover:scale-105",
                      )}
                    />
                  );
                })}
              </div>
              <span className="text-[11px] text-ink-muted">
                Four factory colours — representative.
              </span>
            </div>

            <figure className="m-0 flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface-secondary px-4 py-5">
              <CarIllustration
                shape={shape}
                bodyColor={selectedColour.hex}
                alt={`Illustration in ${selectedColour.name}`}
                className="max-w-[320px]"
              />
              <figcaption className="text-[11px] text-ink-muted">
                {selectedVariant.name} · {selectedColour.name}
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          <Stat
            label="Ex-showroom"
            value={figures.exShowroomLabel}
            sub={city}
            className="bg-surface px-3.5 py-3"
          />
          <Stat
            label="On-road"
            value={figures.onRoadLabel}
            sub="Est. incl. registration"
            className="bg-surface px-3.5 py-3"
          />
          <Stat
            label="EMI"
            value={figures.headlineEmiLabel}
            sub={`per month, ${tenureMonths} mo`}
            className="bg-surface px-3.5 py-3"
          />
          <Stat
            label="Range"
            value={figures.rangeLabel}
            sub="ARAI claimed"
            className="bg-surface px-3.5 py-3"
          />
          <Stat
            label="10 → 80%"
            value={figures.dcFastChargeLabel}
            muted={figures.dcFastChargeUnpublished}
            sub={
              figures.dcFastChargeUnpublished
                ? "No figure published for this pack"
                : "DC fast charge"
            }
            className="col-span-2 bg-surface px-3.5 py-3 sm:col-span-1"
          />
        </div>
      </Card>
    </PrototypeSection>
  );
}
