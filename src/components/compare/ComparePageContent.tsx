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
import { SmartRecommendation } from "./summary/SmartRecommendation";
import { FloatingSummaryPanel } from "./summary/FloatingSummaryPanel";

/**
 * Top-level Compare page template — every piece of content comes from the
 * `vehicles` prop, same "one template, no per-page special-casing" pattern
 * as VehicleDetailTemplate. Section order matches CompareStickyNav's 17
 * items; Ratings/Similar Comparisons/Smart Recommendation render after FAQs
 * but aren't in the nav, matching the original spec's own structure.
 */
export function ComparePageContent({ vehicles }: { vehicles: VehicleDetail[] }) {
  const rawVehicles = vehicles.map((v) => v.sourceVehicle);

  return (
    <>
      <Container className="hidden justify-center py-3.5 lg:flex">
        <AdSlot size="leaderboard" />
      </Container>

      <CompareHero initialVehicles={rawVehicles} initialCategory={vehicles[0]?.category ?? null} />
      <CompareStickyNav />

      <Container>
        <div className="grid gap-x-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 divide-y divide-border">
            <OverviewSection vehicles={vehicles} />
            <PriceSection vehicles={vehicles} />
            <BatterySection vehicles={vehicles} />

            <div className="flex justify-center py-4">
              <AdSlot size="rectangle" />
            </div>

            <ChargingSection vehicles={vehicles} />
            <PerformanceSection vehicles={vehicles} />
            <OwnershipSection vehicles={vehicles} />

            <div className="flex justify-center py-4">
              <AdSlot size="rectangle" />
            </div>

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

          <div className="mt-8 lg:mt-8">
            <FloatingSummaryPanel vehicles={vehicles} />
          </div>
        </div>
      </Container>

      <NewsSection vehicles={vehicles} />

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
