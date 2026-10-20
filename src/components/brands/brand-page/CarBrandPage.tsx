"use client";

import { useMemo } from "react";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { EMPTY_FILTERS } from "@/lib/cars-listing/filters";
import { featuredRank } from "@/lib/cars-listing/featured";
import { superlatives } from "@/lib/cars-listing/copy";
import type { ListingCar, PricedCar } from "@/lib/cars-listing/types";
import { brandHeadings, CAR_BRAND_SORT, lineup, lineupNoun, sortBrandCars } from "@/lib/brand-page/copy";
import type { BrandIdentity } from "@/lib/brand-page/types";
import { CarsListingProvider, type CarsListingState } from "@/components/vehicles/cars-listing/ListingContext";
import { CompareTray } from "@/components/vehicles/cars-listing/CompareTray";
import { ListingToast } from "@/components/vehicles/cars-listing/ListingToast";
import { ListingCarArt } from "@/components/vehicles/cars-listing/ListingCarArt";
import { listingText } from "@/components/vehicles/cars-listing/fonts";
import { TEXT, WRAP } from "@/components/vehicles/cars-listing/ui";
import { cn } from "@/lib/utils";
import { BrandHero } from "./BrandHero";
import { BrandLineupStage } from "./BrandLineupStage";
import { BrandModels } from "./BrandModels";
import { BrandCarCard } from "./BrandCarCard";
import { useBrandPageState } from "./useBrandPageState";

const noop = () => {};

/**
 * A car brand's page. Cards, compare tray and toast are fed through the
 * Electric Cars listing's context, so compare and shortlist behave as on
 * `/cars`; every price is the city-adjusted ex-showroom figure from the
 * site's one pricing service.
 */
export function CarBrandPage({ brand, market: listed }: { brand: BrandIdentity; market: ListingCar[] }) {
  const { city } = useLocation();
  const s = useBrandPageState(CAR_BRAND_SORT);

  const market = useMemo<PricedCar[]>(
    () =>
      listed.map((c) => ({
        ...c,
        price: getVehiclePricingSnapshot({ vehicleId: c.id, vehicleName: c.name, exShowroomRangeLakh: c.basePriceLakh, city }).exShowroomRangeLakh,
      })),
    [listed, city],
  );
  const cars = useMemo(() => market.filter((c) => c.oem === brand.key), [market, brand.key]);
  const results = useMemo(() => sortBrandCars(cars, s.sort), [cars, s.sort]);
  // Judged against every listed car, so "Most affordable" means across the site, not within the brand.
  const badges = useMemo(() => superlatives(market), [market]);
  const { heroLine, modelsHeading } = brandHeadings(brand.name, lineupNoun("car"));

  // The listing context also carries filter and view state; a brand page has
  // neither control, so those are fixed (no filters, grid view).
  const state: CarsListingState = {
    cars,
    results,
    filters: EMPTY_FILTERS,
    setFilters: noop,
    sort: s.sort,
    setSort: (next) => s.setSort(CAR_BRAND_SORT.parse(next)),
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

  const stage = lineup(cars, featuredRank).map(({ item, position, swatch, paint }) => ({
    slug: item.slug,
    model: item.model,
    href: `/cars/${item.slug}`,
    position,
    swatch,
    art: <ListingCarArt dims={item.art} body={item.body} paint={paint} frame={{ lengthMm: 4700, heightMm: 1800 }} reflect alt="" />,
  }));

  return (
    <CarsListingProvider value={state}>
      <div className={cn(listingText.variable, TEXT, "bg-surface-secondary text-[15px] leading-normal text-ink antialiased")}>
        <BrandHero brand={brand} heroLine={heroLine} stage={<BrandLineupStage models={stage} />} />
        <div className={WRAP}>
          <BrandModels heading={modelsHeading} count={results.length} emptyNoun={heroLine} sort={s.sort} sortOptions={CAR_BRAND_SORT.options} onSortChange={s.setSort}>
            {results.map((car) => (
              <BrandCarCard key={car.slug} car={car} />
            ))}
          </BrandModels>
        </div>
        <div className="h-[88px]" aria-hidden="true" />
        <CompareTray />
        <ListingToast message={s.toastMsg} />
      </div>
    </CarsListingProvider>
  );
}
