import { Container } from "@/components/ui/Container";
import { CategoryRow } from "./CategoryRow";
import { SponsoredBanner } from "./SponsoredBanner";
import { ListingGrid } from "./ListingGrid";
import { BrandCarousel } from "./BrandCarousel";
import { RankedListCard } from "./RankedListCard";
import { SubsidyCalculatorCard } from "./SubsidyCalculatorCard";
import { getPopularByCategory, getRankedByCategory, getBrandsByCategory } from "@/lib/data/ev-motion/derive";

export function MainLayout() {
  return (
    <Container className="grid grid-cols-1 gap-3.5 py-[22px] sm:gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="flex min-w-0 flex-col gap-3.5 sm:gap-5">
        <CategoryRow />
        <SponsoredBanner />
        <ListingGrid
          title="Popular Electric Cars"
          viewAllLabel="View all"
          viewAllHref="/cars"
          items={getPopularByCategory("car")}
        />
        <ListingGrid
          title="Popular Electric Scooters & Bikes"
          viewAllLabel="View all"
          viewAllHref="/two-wheelers"
          items={getPopularByCategory("2-wheeler")}
        />
        <BrandCarousel title="All Car Brands" viewAllHref="/brands" brands={getBrandsByCategory("car")} />
        <BrandCarousel
          title="All Bikes & Scooter Brands"
          viewAllHref="/brands"
          brands={getBrandsByCategory("2-wheeler")}
        />
      </div>

      <aside className="flex flex-col gap-3.5">
        <RankedListCard title="Top Electric Cars" viewAllHref="/cars" items={getRankedByCategory("car")} />
        <RankedListCard
          title="Top Scooters & Bikes"
          viewAllHref="/two-wheelers"
          items={getRankedByCategory("2-wheeler")}
        />
        <SubsidyCalculatorCard />
      </aside>
    </Container>
  );
}
