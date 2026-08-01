import type { VehicleDetail } from "@/types/vehicle-detail";
import { Container } from "@/components/ui/Container";
import { AdSlot } from "@/components/common/AdSlot";
import { CompareHero } from "./hero/CompareHero";
import { CompareStickyNav } from "./CompareStickyNav";
import { OverviewSection } from "./sections/OverviewSection";
import { PriceSection } from "./sections/PriceSection";
import { BatterySection, ChargingSection } from "./sections/BatteryChargingSection";
import { PerformanceSection } from "./sections/PerformanceSection";
import { OwnershipSection } from "./sections/OwnershipSection";
import { RunningCostSection } from "./sections/RunningCostSection";
import { DimensionsSection } from "./sections/DimensionsSection";
import { SafetySection } from "./sections/SafetySection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { WarrantySection } from "./sections/WarrantySection";
import { ColoursSection } from "./sections/ColoursSection";
import { ProsConsSection } from "./sections/ProsConsSection";
import { ExpertVerdictSection } from "./sections/ExpertVerdictSection";
import { RatingsSection } from "./sections/RatingsSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import { NewsSection } from "./sections/NewsSection";
import { FaqsSection } from "./sections/FaqsSection";
import { SimilarComparisonsCarousel } from "./SimilarComparisonsCarousel";
import { ComparisonEndingSection } from "./ComparisonEndingSection";
import { SmartRecommendation } from "./summary/SmartRecommendation";
import { CompareSidebar } from "./summary/CompareSidebar";

/**
 * Top-level Compare page template — every piece of content comes from the
 * `vehicles` prop, same "one template, no per-page special-casing" pattern
 * as VehicleDetailTemplate. Section order matches CompareStickyNav's 17
 * items; Ratings/Similar Comparisons/Smart Recommendation render after FAQs
 * but aren't in the nav, matching the original spec's own structure.
 *
 * The sidebar (Quick Verdict + one sticky ad + actions) renders three times
 * at three different breakpoints rather than once with responsive classes,
 * because it needs to sit in three different *positions*, not just three
 * different widths: sticky beside the content on desktop, below all the
 * detail sections on tablet, and directly below the hero on mobile. Only
 * one instance is ever visible at a time via Tailwind's responsive display
 * classes — same pattern the Navbar already uses for its three device tiers.
 */
export function ComparePageContent({ vehicles }: { vehicles: VehicleDetail[] }) {
  const rawVehicles = vehicles.map((v) => v.sourceVehicle);

  return (
    <>
      <Container className="hidden justify-center py-3.5 lg:flex">
        <AdSlot size="leaderboard" />
      </Container>

      <CompareHero initialVehicles={rawVehicles} initialCategory={vehicles[0]?.category ?? null} />

      {/* Mobile: sidebar stacks directly below the hero, non-sticky. */}
      <div className="sm:hidden">
        <Container className="py-5">
          <CompareSidebar vehicles={vehicles} />
        </Container>
      </div>

      <CompareStickyNav />

      <Container>
        <div className="grid gap-x-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 divide-y divide-border">
            <OverviewSection vehicles={vehicles} />
            <PriceSection vehicles={vehicles} />
            <BatterySection vehicles={vehicles} />
            <ChargingSection vehicles={vehicles} />
            <PerformanceSection vehicles={vehicles} />
            <OwnershipSection vehicles={vehicles} />
            <RunningCostSection vehicles={vehicles} />
            <DimensionsSection vehicles={vehicles} />
            <SafetySection vehicles={vehicles} />
            <FeaturesSection vehicles={vehicles} />
            <WarrantySection vehicles={vehicles} />
            <ColoursSection vehicles={vehicles} />
            <ProsConsSection vehicles={vehicles} />
            <ExpertVerdictSection vehicles={vehicles} />
            <RatingsSection vehicles={vehicles} />
            <ReviewsSection vehicles={vehicles} />
            <FaqsSection vehicles={vehicles} />
          </div>

          {/* Desktop: sticky sidebar beside the content — releases naturally once this grid row ends (right after FAQs), never reaching News/Similar/Recommendation below. */}
          <div className="hidden pt-8 lg:block">
            <CompareSidebar vehicles={vehicles} sticky />
          </div>
        </div>

        {/* Tablet: sidebar moves below all the detail sections, non-sticky. */}
        <div className="hidden py-6 sm:block lg:hidden">
          <CompareSidebar vehicles={vehicles} />
        </div>
      </Container>

      <NewsSection vehicles={vehicles} />
      <ComparisonEndingSection vehicles={rawVehicles} />

      <Container className="hidden justify-center py-4 lg:flex">
        <AdSlot size="leaderboard" />
      </Container>

      <SimilarComparisonsCarousel vehicles={rawVehicles} />
      <SmartRecommendation vehicles={vehicles} />

      <Container className="hidden justify-center py-4 lg:flex">
        <AdSlot size="leaderboard" />
      </Container>
    </>
  );
}
