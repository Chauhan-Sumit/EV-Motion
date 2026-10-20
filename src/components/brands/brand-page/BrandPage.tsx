"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { MAX_COMPARE } from "@/lib/compare/slug";
import { EMPTY_FILTERS } from "@/lib/cars-listing/filters";
import { superlatives } from "@/lib/cars-listing/copy";
import type { PricedCar } from "@/lib/cars-listing/types";
import { DEFAULT_BRAND_SORT, parseBrandSort, sortBrandCars, type BrandSortKey } from "@/lib/brand-page/copy";
import type { BrandPageData } from "@/lib/brand-page/types";
import { CarsListingProvider, type CarsListingState } from "@/components/vehicles/cars-listing/ListingContext";
import { CompareTray } from "@/components/vehicles/cars-listing/CompareTray";
import { ListingToast } from "@/components/vehicles/cars-listing/ListingToast";
import { listingText } from "@/components/vehicles/cars-listing/fonts";
import { TEXT, WRAP } from "@/components/vehicles/cars-listing/ui";
import { cn } from "@/lib/utils";
import { BrandHero } from "./BrandHero";
import { BrandModels } from "./BrandModels";

const noop = () => {};

/** After Back/Forward the address bar, not the server render, holds the visitor's sort (same reasoning as `CarsListingPage`). */
function sortFromAddressBar(initial: BrandSortKey): BrandSortKey {
  if (typeof window === "undefined") return initial;
  return parseBrandSort(new URLSearchParams(window.location.search).get("sort") ?? undefined);
}

export interface BrandPageProps {
  data: BrandPageData;
  initialSort: BrandSortKey;
}

/**
 * A brand page — the approved design on the site's stack and data: brand hero
 * with the line-up drawn to scale, then every car the brand sells as the
 * Electric Cars listing's grid card, with sorting and compare.
 *
 * The cards, compare tray and toast are the listing's own components, fed
 * through the listing's context, so a car looks and behaves the same here as
 * on `/cars`. Every price is the city-adjusted ex-showroom figure from the
 * site's one pricing service; changing city in the navbar moves them all.
 */
export function BrandPage({ data, initialSort }: BrandPageProps) {
  const { city } = useLocation();
  const [sort, setSort] = useState<BrandSortKey>(() => sortFromAddressBar(initialSort));
  const [picks, setPicks] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<{ text: string; id: number } | null>(null);
  const toastId = useRef(0);

  const market = useMemo<PricedCar[]>(
    () =>
      data.market.map((c) => ({
        ...c,
        price: getVehiclePricingSnapshot({ vehicleId: c.id, vehicleName: c.name, exShowroomRangeLakh: c.basePriceLakh, city }).exShowroomRangeLakh,
      })),
    [data.market, city],
  );
  const cars = useMemo(() => market.filter((c) => c.oem === data.brand.key), [market, data.brand.key]);
  const results = useMemo(() => sortBrandCars(cars, sort), [cars, sort]);
  // Judged against every listed car, so "Most affordable" means across the site, not within the brand.
  const badges = useMemo(() => superlatives(market), [market]);

  const toast = useCallback((text: string) => {
    toastId.current += 1;
    setToastMsg({ text, id: toastId.current });
  }, []);

  // Keep the address bar in step with the sort, without a navigation.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (sort === DEFAULT_BRAND_SORT) params.delete("sort");
    else params.set("sort", sort);
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(null, "", url);
  }, [sort]);

  const togglePick = useCallback(
    (slug: string) => {
      if (picks.includes(slug)) {
        setPicks(picks.filter((s) => s !== slug));
        return;
      }
      if (picks.length >= MAX_COMPARE) {
        toast(`You can compare up to ${MAX_COMPARE} cars — remove one from the tray first.`);
        return;
      }
      setPicks([...picks, slug]);
      if (picks.length === 0) toast("Added. Pick at least one more to compare.");
    },
    [picks, toast],
  );

  const toggleSaved = useCallback(
    (slug: string, name: string) => {
      const on = !saved.includes(slug);
      setSaved(on ? [...saved, slug] : saved.filter((s) => s !== slug));
      toast(on ? `${name} saved to your shortlist.` : `${name} removed from your shortlist.`);
    },
    [saved, toast],
  );

  // The listing context also carries filter and view state; a brand page has
  // neither control, so those are fixed (no filters, grid view).
  const state: CarsListingState = {
    cars,
    results,
    filters: EMPTY_FILTERS,
    setFilters: noop,
    sort,
    setSort: (next) => setSort(parseBrandSort(next)),
    view: "grid",
    setView: noop,
    badges,
    brandName: () => data.brand.name,
    picks,
    togglePick,
    clearPicks: () => setPicks([]),
    saved,
    toggleSaved,
    cityName: city.name,
    filtersOpen: false,
    setFiltersOpen: noop,
    scrollToResults: noop,
    toast,
  };

  return (
    <CarsListingProvider value={state}>
      <div className={cn(listingText.variable, TEXT, "bg-surface-secondary text-[15px] leading-normal text-ink antialiased")}>
        <BrandHero brand={data.brand} cars={cars} />
        <div className={WRAP}>
          <BrandModels brandName={data.brand.name} results={results} sort={sort} onSortChange={setSort} />
        </div>
        <div className="h-[88px]" aria-hidden="true" />
        <CompareTray />
        <ListingToast message={toastMsg} />
      </div>
    </CarsListingProvider>
  );
}
