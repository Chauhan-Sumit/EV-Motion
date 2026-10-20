"use client";

import { useMemo } from "react";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { EMPTY_FILTERS } from "@/lib/two-wheelers-listing/filters";
import { featuredRank } from "@/lib/two-wheelers-listing/featured";
import { superlatives } from "@/lib/two-wheelers-listing/copy";
import type { ListingBike, PricedBike } from "@/lib/two-wheelers-listing/types";
import { BIKE_BRAND_SORT, brandHeadings, lineup, lineupNoun, sortBrandBikes } from "@/lib/brand-page/copy";
import type { BrandIdentity } from "@/lib/brand-page/types";
import { BikesListingProvider, type BikesListingState } from "@/components/vehicles/two-wheelers-listing/ListingContext";
import { BikeCompareTray } from "@/components/vehicles/two-wheelers-listing/BikeCompareTray";
import { BikeArt } from "@/components/vehicles/two-wheelers-listing/BikeArt";
import { ListingToast } from "@/components/vehicles/cars-listing/ListingToast";
import { listingText } from "@/components/vehicles/cars-listing/fonts";
import { TEXT, WRAP } from "@/components/vehicles/cars-listing/ui";
import { cn } from "@/lib/utils";
import { BrandHero } from "./BrandHero";
import { BrandLineupStage } from "./BrandLineupStage";
import { BrandModels } from "./BrandModels";
import { BrandBikeCard } from "./BrandBikeCard";
import { useBrandPageState } from "./useBrandPageState";

const noop = () => {};

/**
 * A two-wheeler brand's page — the same template as a car brand's, on the
 * Scooters & Bikes listing's data, figures, drawings and compare tray, so
 * compare and shortlist behave as on `/two-wheelers`. Every price is the
 * city-adjusted ex-showroom figure from the site's one pricing service.
 */
export function BikeBrandPage({ brand, market: listed }: { brand: BrandIdentity; market: ListingBike[] }) {
  const { city } = useLocation();
  const s = useBrandPageState(BIKE_BRAND_SORT);

  const market = useMemo<PricedBike[]>(
    () =>
      listed.map((b) => ({
        ...b,
        price: getVehiclePricingSnapshot({ vehicleId: b.id, vehicleName: b.name, exShowroomRangeLakh: b.basePriceLakh, city }).exShowroomRangeLakh,
      })),
    [listed, city],
  );
  const bikes = useMemo(() => market.filter((b) => b.oem === brand.key), [market, brand.key]);
  const results = useMemo(() => sortBrandBikes(bikes, s.sort), [bikes, s.sort]);
  // Judged against every listed two-wheeler, so "Most affordable" means across the site, not within the brand.
  const badges = useMemo(() => superlatives(market), [market]);
  const { heroLine, modelsHeading } = brandHeadings(brand.name, lineupNoun("2-wheeler", bikes.map((b) => b.type)));

  // The listing context also carries filter and view state; a brand page has
  // neither control, so those are fixed (no filters, grid view).
  const state: BikesListingState = {
    bikes,
    results,
    filters: EMPTY_FILTERS,
    setFilters: noop,
    sort: s.sort,
    setSort: (next) => s.setSort(BIKE_BRAND_SORT.parse(next)),
    view: "grid",
    setView: noop,
    badges,
    brandName: () => brand.name,
    picks: s.picks,
    togglePick: s.togglePick,
    clearPicks: s.clearPicks,
    saved: s.saved,
    toggleSaved: s.toggleSaved,
    cityName: city.name,
    filtersOpen: false,
    setFiltersOpen: noop,
    scrollToResults: noop,
    toast: s.toast,
  };

  const stage = lineup(bikes, featuredRank).map(({ item, position, swatch }) => ({
    slug: item.slug,
    model: item.model,
    href: `/two-wheelers/${item.slug}`,
    position,
    swatch,
    art: <BikeArt type={item.type} color={swatch} reflect alt="" />,
  }));

  return (
    <BikesListingProvider value={state}>
      <div className={cn(listingText.variable, TEXT, "bg-surface-secondary text-[15px] leading-normal text-ink antialiased")}>
        <BrandHero brand={brand} heroLine={heroLine} stage={<BrandLineupStage models={stage} />} />
        <div className={WRAP}>
          <BrandModels heading={modelsHeading} count={results.length} emptyNoun={heroLine} sort={s.sort} sortOptions={BIKE_BRAND_SORT.options} onSortChange={s.setSort}>
            {results.map((bike) => (
              <BrandBikeCard key={bike.slug} bike={bike} />
            ))}
          </BrandModels>
        </div>
        <div className="h-[88px]" aria-hidden="true" />
        <BikeCompareTray />
        <ListingToast message={s.toastMsg} />
      </div>
    </BikesListingProvider>
  );
}
