"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { MAX_COMPARE } from "@/lib/compare/slug";
import { filterAndSort, parseListingQuery, serializeListingQuery, type ListingQueryState } from "@/lib/cars-listing/filters";
import { featuredRank } from "@/lib/cars-listing/featured";
import { superlatives } from "@/lib/cars-listing/copy";
import type { CarsListingData, PricedCar } from "@/lib/cars-listing/types";
import { ListingToast } from "./ListingToast";
import { cn } from "@/lib/utils";
import { listingText } from "./fonts";
import { TEXT, WRAP } from "./ui";
import { CarsListingProvider, type CarsListingState } from "./ListingContext";
import { ListingHero } from "./ListingHero";
import { CategoryRail } from "./CategoryRail";
import { FilterPanel } from "./FilterPanel";
import { ResultsSection } from "./ResultsSection";
import { BrandShowcase } from "./BrandShowcase";
import { UpcomingCars } from "./UpcomingCars";
import { FaqSection } from "./FaqSection";
import { CompareTray } from "./CompareTray";

/** The site navbar's height (`h-16`) plus breathing room — where sticky panels and scroll targets sit. */
const NAV_CLEARANCE = 84;

/**
 * The state to start from. On the server, and on a fresh page load where the
 * address bar and the server agree, that is `initial`. After Back/Forward,
 * though, Next restores this route's original server render while the address
 * bar holds the filters the visitor had set (written with `replaceState`), so
 * the address bar is the source of truth. Same parser on both sides, so the
 * first client render matches the server's.
 */
function fromAddressBar(initial: ListingQueryState, data: CarsListingData): ListingQueryState {
  if (typeof window === "undefined") return initial;
  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  return parseListingQuery(params, [...new Set(data.cars.map((c) => c.oem))]);
}

export interface CarsListingPageProps {
  data: CarsListingData;
  initial: ListingQueryState;
}

/**
 * The Electric Cars listing — the approved design, on the site's stack and
 * data. Server-rendered from the query string; every filter, sort and view
 * change is written back to the URL, so any state of the list is a shareable
 * address.
 *
 * Prices everywhere on the page (cards, filters, sorting, badges, brand tiles,
 * FAQ) are the city-adjusted ex-showroom figures from the site's one pricing
 * service, so changing city in the navbar moves them all together.
 */
export function CarsListingPage({ data, initial }: CarsListingPageProps) {
  const { city } = useLocation();
  const [start] = useState(() => fromAddressBar(initial, data));
  const [filters, setFiltersState] = useState(start.filters);
  const [sort, setSortState] = useState(start.sort);
  const [view, setView] = useState(start.view);
  const [picks, setPicks] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; id: number } | null>(null);
  const toastId = useRef(0);

  const cars = useMemo<PricedCar[]>(
    () =>
      data.cars.map((c) => ({
        ...c,
        price: getVehiclePricingSnapshot({ vehicleId: c.id, vehicleName: c.name, exShowroomRangeLakh: c.basePriceLakh, city }).exShowroomRangeLakh,
      })),
    [data.cars, city],
  );
  const results = useMemo(() => filterAndSort(cars, filters, sort, featuredRank), [cars, filters, sort]);
  const badges = useMemo(() => superlatives(cars), [cars]);
  const brandNames = useMemo(() => new Map(cars.map((c) => [c.oem, c.oemName])), [cars]);
  const brandName = useCallback((oem: string) => brandNames.get(oem) ?? oem, [brandNames]);

  const toast = useCallback((text: string) => {
    toastId.current += 1;
    setToastMsg({ text, id: toastId.current });
  }, []);

  // Keep the address bar in step with the list, without a navigation.
  useEffect(() => {
    const qs = serializeListingQuery({ filters, sort, view }).toString();
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

  const state: CarsListingState = {
    cars,
    results,
    filters,
    setFilters: setFiltersState,
    sort,
    setSort: setSortState,
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

  const spotlight = cars.find((c) => c.slug === data.spotlightSlug) ?? cars[0];

  return (
    <CarsListingProvider value={state}>
      <div className={cn(listingText.variable, TEXT, "bg-surface-secondary text-[15px] leading-normal text-ink antialiased")}>
        <ListingHero spotlight={spotlight} />
        <div className={WRAP}>
          <CategoryRail />
          <BrandShowcase />
          <div className="grid grid-cols-1 items-start gap-7 pt-[22px] min-[981px]:grid-cols-[286px_minmax(0,1fr)] min-[981px]:pt-7">
            <FilterPanel />
            <ResultsSection />
          </div>
          <UpcomingCars />
          <FaqSection />
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
        <CompareTray />
        <ListingToast message={toastMsg} />
      </div>
    </CarsListingProvider>
  );
}
