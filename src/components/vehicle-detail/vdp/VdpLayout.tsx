"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  buildQuickSpecs,
  buildSpecRows,
  deriveFigures,
  resolveCompareColumns,
} from "@/lib/vehicle-detail/calculations";
import type { ConfiguratorState } from "@/lib/vehicle-detail/calculations";
import type { SectionCopy, VdpViewModel } from "@/lib/vehicle-detail/types";
import { useVdpPricingAssumptions } from "@/lib/vehicle-detail/useVdpPricingAssumptions";
import { VdpAdSlot } from "./VdpAdSlot";
import { VdpBattery } from "./VdpBattery";
import { VdpCompare } from "./VdpCompare";
import { VdpFaqs } from "./VdpFaqs";
import { VdpFeatures } from "./VdpFeatures";
import { VdpHero } from "./VdpHero";
import { VdpNews } from "./VdpNews";
import { VdpOverview } from "./VdpOverview";
import { VdpOwnershipTools } from "./VdpOwnershipTools";
import { VdpRealWorldRange } from "./VdpRealWorldRange";
import { VdpReviews } from "./VdpReviews";
import { VdpSidebar } from "./VdpSidebar";
import { VdpSimilar } from "./VdpSimilar";
import { VdpSpecifications } from "./VdpSpecifications";
import { VdpStickyTabs } from "./VdpStickyTabs";
import { VdpVariants } from "./VdpVariants";
import { VdpVideos } from "./VdpVideos";

/**
 * The Vehicle Detail Page's one stateful component, and the only client
 * component in the tree.
 *
 * It owns the whole configuration — variant, colour, gallery frame, daily
 * distance, down payment, tenure — derives every figure from it in one place,
 * and hands the results down as plain props. Each section component below is
 * therefore presentational: none of them holds state, and none of them
 * calculates anything. That split is what lets one set of sections serve every
 * vehicle in the catalogue, whatever its category.
 *
 * It receives a finished `VdpViewModel` and never reaches for catalogue data
 * itself — `@/lib/data` must stay out of the client bundle (CLAUDE.md #23).
 *
 * The section grid uses `minmax(0, 1fr)` rather than a bare `1fr` on the main
 * column. Two sections (the comparison and the hero thumbnail strip) are
 * horizontal scrollers, and a bare `1fr` track sizes to its max-content, which
 * would let their unscrolled width push the whole page sideways — a bug this
 * codebase has already shipped once.
 */
export function VdpLayout({ vehicle }: { vehicle: VdpViewModel }) {
  // City-dependent, so it cannot be baked into the statically generated view
  // model — see the hook's own note.
  const assumptions = useVdpPricingAssumptions(vehicle.category);

  const [state, setState] = useState<ConfiguratorState>(() => ({
    variantId: (vehicle.variants.find((v) => v.recommended) ?? vehicle.variants[0]).id,
    colourId: vehicle.colours[1]?.id ?? vehicle.colours[0].id,
    shotIndex: 0,
    kmPerDay: vehicle.dailyDistance.default,
    downPaymentPercent: assumptions.downPaymentOptions.min,
    tenureMonths: assumptions.defaultTenureMonths,
  }));

  const variant =
    vehicle.variants.find((v) => v.id === state.variantId) ?? vehicle.variants[0];
  const colour = vehicle.colours.find((c) => c.id === state.colourId) ?? vehicle.colours[0];
  const shot = vehicle.shots[state.shotIndex] ?? vehicle.shots[0];

  const figures = useMemo(
    () => deriveFigures(variant, state, assumptions),
    [variant, state, assumptions],
  );

  const quickSpecs = useMemo(() => buildQuickSpecs(vehicle, variant), [vehicle, variant]);
  const glanceRows = useMemo(
    () => buildSpecRows(vehicle.atAGlance, variant),
    [vehicle.atAGlance, variant],
  );
  const specRows = useMemo(
    () => buildSpecRows(vehicle.specSheet, variant),
    [vehicle.specSheet, variant],
  );
  const compareColumns = useMemo(
    () =>
      resolveCompareColumns(vehicle.compare, {
        onRoad: figures.onRoadLabel,
        range: figures.rangeLabel,
        battery: figures.batteryLabel,
      }, { city: assumptions.city, charges: assumptions.charges }),
    [vehicle.compare, figures.onRoadLabel, figures.rangeLabel, figures.batteryLabel, assumptions],
  );

  const section = (id: string): SectionCopy =>
    vehicle.sections.find((s) => s.id === id) ?? { id, eyebrow: "", title: "" };

  const update = (patch: Partial<ConfiguratorState>) =>
    setState((previous) => ({ ...previous, ...patch }));

  return (
    <>
      {/* 970 × 90 band between the header and the hero. Desktop only — the HTML
          hid it below 66rem, since a 970px unit has nowhere to go on a phone. */}
      <div className="hidden border-b border-border bg-background py-3.5 lg:block">
        <Container>
          <VdpAdSlot placement={vehicle.ads.heroLeaderboard} />
        </Container>
      </div>

      <VdpHero
        vehicle={vehicle}
        variant={variant}
        colour={colour}
        shot={shot}
        shotIndex={state.shotIndex}
        quickSpecs={quickSpecs}
        exShowroomLabel={figures.exShowroomLabel}
        onRoadLabel={figures.onRoadLabel}
        emiLabel={figures.headlineEmiLabel}
        city={assumptions.city}
        onSelectShot={(shotIndex) => update({ shotIndex })}
      />

      <VdpStickyTabs tabs={vehicle.tabs} priceLabel={figures.exShowroomLabel} />

      <Container>
        {/* No `items-start`: the sidebar cell must STRETCH to the row height,
            or its sticky ad has only the rail's own short box to travel inside
            and scrolls away the moment the rail's cards end. */}
        <div className="grid gap-x-8 pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0">
            <VdpOverview
              copy={section("overview")}
              summary={vehicle.overview}
              glance={glanceRows}
            />

            <VdpVariants
              copy={section("variants")}
              variants={vehicle.variants}
              colours={vehicle.colours}
              selectedVariant={variant}
              selectedColour={colour}
              figures={figures}
              shape={vehicle.shape}
              city={assumptions.city}
              tenureMonths={assumptions.defaultTenureMonths}
              onSelectVariant={(variantId) => update({ variantId, shotIndex: 0 })}
              onSelectColour={(colourId) => update({ colourId, shotIndex: 0 })}
            />

            <VdpBattery
              copy={section("battery")}
              figures={figures}
              chemistry={vehicle.batteryChemistry}
              acChargeTime={vehicle.acChargeTime}
              acChargeMinutes={vehicle.acChargeMinutes}
            />

            <VdpRealWorldRange
              copy={section("real-world-range")}
              range={vehicle.realWorldRange}
            />

            <VdpOwnershipTools
              copy={section("ownership-tools")}
              figures={figures}
              assumptions={assumptions}
              dailyDistance={vehicle.dailyDistance}
              kmPerDay={state.kmPerDay}
              batteryLabel={figures.batteryLabel}
              onChangeKmPerDay={(kmPerDay) => update({ kmPerDay })}
            />

            <VdpSpecifications copy={section("specifications")} rows={specRows} />

            {/* 728 × 90 between the spec sheet and the comparison. Hidden on
                the narrowest screens, as in the HTML, where it would be clamped
                down to something that no longer reads as a leaderboard. */}
            <div className="hidden py-4 sm:block">
              <VdpAdSlot placement={vehicle.ads.inContent} />
            </div>

            <VdpCompare copy={section("compare")} columns={compareColumns} />
            <VdpFeatures copy={section("features")} features={vehicle.features} />
            <VdpVideos copy={section("videos")} videos={vehicle.videos} />
            <VdpReviews copy={section("reviews")} reviews={vehicle.reviews} />
            <VdpFaqs copy={section("faqs")} faqs={vehicle.faqs} />
            <VdpSimilar copy={section("similar")} vehicles={vehicle.similar} />
            <VdpNews copy={section("news")} brand={vehicle.brand} name={vehicle.name} />
          </main>

          <div className="pt-7">
            <VdpSidebar
              variant={variant}
              colour={colour}
              figures={figures}
              assumptions={assumptions}
              similar={vehicle.similar}
              ads={vehicle.ads}
              downPaymentPercent={state.downPaymentPercent}
              tenureMonths={state.tenureMonths}
              city={assumptions.city}
              onChangeDownPayment={(downPaymentPercent) => update({ downPaymentPercent })}
              onChangeTenure={(tenureMonths) => update({ tenureMonths })}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
