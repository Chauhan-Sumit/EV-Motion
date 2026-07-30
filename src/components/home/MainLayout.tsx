import { Container } from "@/components/ui/Container";
import { CategoryRow } from "./CategoryRow";
import { SponsoredBanner } from "./SponsoredBanner";
import { ListingGrid } from "./ListingGrid";
import { BrandCarousel } from "./BrandCarousel";
import { RankedListCard } from "./RankedListCard";
import { SubsidyCalculatorCard } from "./SubsidyCalculatorCard";
import {
  popularCars,
  popularBikes,
  rankedCars,
  rankedScooters,
  carBrands,
  bikeBrands,
} from "@/lib/data/ev-motion/derive";

export function MainLayout() {
  return (
    <Container className="grid grid-cols-1 gap-3.5 py-[22px] sm:gap-5 lg:grid-cols-[1fr_260px]">
      <div className="flex flex-col gap-3.5 sm:gap-5">
        <CategoryRow />
        <SponsoredBanner />
        <ListingGrid
          title="Popular Electric Cars"
          viewAllLabel="View all"
          viewAllHref="/cars"
          items={popularCars}
        />
        <ListingGrid
          title="Popular Electric Scooters & Bikes"
          viewAllLabel="View all"
          viewAllHref="/two-wheelers"
          items={popularBikes}
        />
        <BrandCarousel title="All Car Brands" viewAllHref="/brands" brands={carBrands} />
        <BrandCarousel title="All Bikes & Scooter Brands" viewAllHref="/brands" brands={bikeBrands} />
      </div>

      <aside className="flex flex-col gap-3.5">
        <RankedListCard title="Top Electric Cars" viewAllHref="/cars" items={rankedCars} />
        <RankedListCard title="Top Scooters & Bikes" viewAllHref="/two-wheelers" items={rankedScooters} />
        <SubsidyCalculatorCard />
      </aside>
    </Container>
  );
}
