import type { VehicleDetail } from "@/types/vehicle-detail";
import { Container } from "@/components/ui/Container";
import { AdSlot } from "@/components/common/AdSlot";
import { VehicleHero } from "./VehicleHero";
import { QuickSpecsBar } from "./QuickSpecsBar";
import { StickyTabs } from "./StickyTabs";
import { VehicleSidebar } from "./VehicleSidebar";
import { SectionOverview } from "./SectionOverview";
import { SectionVariants } from "./SectionVariants";
import { SectionColors } from "./SectionColors";
import { SectionBattery } from "./SectionBattery";
import { SectionOwnershipTools } from "./SectionOwnershipTools";
import { SectionCompareSimilar } from "./SectionCompareSimilar";
import { SectionFeatures } from "./SectionFeatures";
import { SectionImages } from "./SectionImages";
import { SectionVideos } from "./SectionVideos";
import { SectionReviews } from "./SectionReviews";
import { SectionFaqs } from "./SectionFaqs";
import { SectionLatestNews } from "./SectionLatestNews";
import { SectionSimilarElectricCars } from "./SectionSimilarElectricCars";

/**
 * The single reusable Vehicle Detail Page template. Every piece of content
 * comes from the `vehicle` prop — nothing here is specific to any one model,
 * so the same tree serves cars and 2-wheelers identically. Navbar/Footer
 * come from the root layout, not this template.
 *
 * Section order: Overview → Variants → Battery & Charging → Ownership Tools
 * → Compare with Similar Cars → Colours → Features → Images → Videos →
 * Reviews → FAQs, then (outside the sidebar-grid container, full width)
 * Latest News and Similar Electric Cars.
 */
export function VehicleDetailTemplate({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <>
      <Container className="hidden justify-center py-3.5 lg:flex">
        <AdSlot size="leaderboard" />
      </Container>

      <VehicleHero vehicle={vehicle} />
      <QuickSpecsBar vehicle={vehicle} />
      <StickyTabs />

      <Container>
        <div className="grid gap-x-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 divide-y divide-border">
            <SectionOverview vehicle={vehicle} />
            <SectionVariants vehicle={vehicle} />
            <SectionBattery vehicle={vehicle} />
            <SectionOwnershipTools vehicle={vehicle} />
            <SectionCompareSimilar vehicle={vehicle} />
            <SectionColors vehicle={vehicle} />
            <SectionFeatures vehicle={vehicle} />
            <SectionImages vehicle={vehicle} />
            <SectionVideos vehicle={vehicle} />
            <SectionReviews vehicle={vehicle} />
            <SectionFaqs vehicle={vehicle} />
          </div>

          <div className="mt-8 lg:mt-8">
            <VehicleSidebar vehicle={vehicle} />
          </div>
        </div>
      </Container>

      <SectionLatestNews vehicle={vehicle} />
      <SectionSimilarElectricCars vehicle={vehicle} />
    </>
  );
}
