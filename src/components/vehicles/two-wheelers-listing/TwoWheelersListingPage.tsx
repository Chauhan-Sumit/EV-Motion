"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { MAX_COMPARE } from "@/lib/compare/slug";
import { filterAndSort, parseBikeQuery, serializeBikeQuery, type BikeQueryState } from "@/lib/two-wheelers-listing/filters";
import { featuredRank } from "@/lib/two-wheelers-listing/featured";
import { superlatives } from "@/lib/two-wheelers-listing/copy";
import type { PricedBike, TwoWheelersListingData } from "@/lib/two-wheelers-listing/types";
import { cn } from "@/lib/utils";
import { listingText } from "@/components/vehicles/cars-listing/fonts";
import { TEXT, WRAP } from "@/components/vehicles/cars-listing/ui";
import { ListingToast } from "@/components/vehicles/cars-listing/ListingToast";
import { BikesListingProvider, type BikesListingState } from "./ListingContext";
import { BikeHero } from "./BikeHero";
import { BikeCategoryRail } from "./BikeCategoryRail";
import { BikeBrandShowcase } from "./BikeBrandShowcase";
import { BikeFilterPanel } from "./BikeFilterPanel";
import { BikeResults } from "./BikeResults";
import { UpcomingBikes } from "./UpcomingBikes";
import { BikeFaqSection } from "./BikeFaqSection";
import { BikeCompareTray } from "./BikeCompareTray";

/** The site navbar's height (`h-16`) plus breathing room — where sticky panels and scroll targets sit. */
const NAV_CLEARANCE = 84;

/** The address bar wins after Back/Forward, when Next restores the route's original server props (see the cars listing). */
function fromAddressBar(initial: BikeQueryState, data: TwoWheelersListingData): BikeQueryState {
  if (typeof window === "undefined") return initial;
  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  return parseBikeQuery(params, [...new Set(data.bikes.map((b) => b.oem))]);
}

export interface TwoWheelersListingPageProps {
  data: TwoWheelersListingData;
  initial: BikeQueryState;
}

/**
 * The Scooters & Bikes listing — electric scooters and motorcycles, in the
 * premium style of the approved Electric Cars listing. Server-rendered from
 * the query string; every filter, sort and view change is written back to the
 * URL. Every price on the page is the city-adjusted ex-showroom figure from
 * the site's one pricing service.
 */
export function TwoWheelersListingPage({ data, initial }: TwoWheelersListingPageProps) {
  const { city } = useLocation();
  const [start] = useState(() => fromAddressBar(initial, data));
  const [filters, setFiltersState] = useState(start.filters);
  const [sort, setSort] = useState(start.sort);
  const [view, setView] = useState(start.view);
  const [picks, setPicks] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; id: number } | null>(null);
  const toastId = useRef(0);

  const bikes = useMemo<PricedBike[]>(
    () =>
      data.bikes.map((b) => ({
        ...b,
        price: getVehiclePricingSnapshot({ vehicleId: b.id, vehicleName: b.name, exShowroomRangeLakh: b.basePriceLakh, city }).exShowroomRangeLakh,
      })),
    [data.bikes, city],
  );
  const results = useMemo(() => filterAndSort(bikes, filters, sort, featuredRank), [bikes, filters, sort]);
  const badges = useMemo(() => superlatives(bikes), [bikes]);
  const brandNames = useMemo(() => new Map(bikes.map((b) => [b.oem, b.oemName])), [bikes]);
  const brandName = useCallback((oem: string) => brandNames.get(oem) ?? oem, [brandNames]);

  const toast = useCallback((text: string) => {
    toastId.current += 1;
    setToastMsg({ text, id: toastId.current });
  }, []);

  // Keep the address bar in step with the list, without a navigation.
  useEffect(() => {
    const qs = serializeBikeQuery({ filters, sort, view }).toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(null, "", url);
  }, [filters, sort, view]);

  // The filter sheet is modal below the desktop breakpoint: lock page scroll and close on Escape.
  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  const scrollToResults = useCallback(() => {
    const el = document.getElementById("results");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE;
    if (Math.abs(window.scrollY - y) > 40) window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const togglePick = useCallback(
    (slug: string) => {
      if (picks.includes(slug)) {
        setPicks(picks.filter((s) => s !== slug));
        return;
      }
      if (picks.length >= MAX_COMPARE) {
        toast(`You can compare up to ${MAX_COMPARE} — remove one from the tray first.`);
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

  const state: BikesListingState = {
    bikes,
    results,
    filters,
    setFilters: setFiltersState,
    sort,
    setSort,
    view,
    setView,
    badges,
    brandName,
    picks,
    togglePick,
    clearPicks: () => setPicks([]),
    saved,
    toggleSaved,
    cityName: city.name,
    filtersOpen,
    setFiltersOpen,
    scrollToResults,
    toast,
  };

  const spotlight = bikes.find((b) => b.slug === data.spotlightSlug) ?? bikes[0];

  return (
    <BikesListingProvider value={state}>
      <div className={cn(listingText.variable, TEXT, "bg-surface-secondary text-[15px] leading-normal text-ink antialiased")}>
        <BikeHero spotlight={spotlight} />
        <div className={WRAP}>
          <BikeCategoryRail />
          <BikeBrandShowcase />
          <div className="grid grid-cols-1 items-start gap-7 pt-[22px] min-[981px]:grid-cols-[286px_minmax(0,1fr)] min-[981px]:pt-7">
            <BikeFilterPanel />
            <BikeResults />
          </div>
          <UpcomingBikes />
          <BikeFaqSection />
        </div>
        <div className="h-[130px]" aria-hidden="true" />
        <div
          aria-hidden="true"
          onClick={() => setFiltersOpen(false)}
          className={cn(
            "fixed inset-0 z-[80] bg-[rgba(14,17,22,.45)] backdrop-blur-[3px] transition-opacity duration-300 min-[981px]:hidden",
            filtersOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
        <BikeCompareTray />
        <ListingToast message={toastMsg} />
      </div>
    </BikesListingProvider>
  );
}
