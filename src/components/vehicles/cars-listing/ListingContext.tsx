"use client";

import { createContext, useContext } from "react";
import type { ListingFilters, SortKey, ViewMode } from "@/lib/cars-listing/filters";
import type { PricedCar } from "@/lib/cars-listing/types";

export interface CarsListingState {
  /** Every listed car, priced for the selected city. */
  cars: PricedCar[];
  /** `cars` after the active filters and sort. */
  results: PricedCar[];
  filters: ListingFilters;
  setFilters: (next: ListingFilters | ((prev: ListingFilters) => ListingFilters)) => void;
  sort: SortKey;
  setSort: (next: SortKey) => void;
  view: ViewMode;
  setView: (next: ViewMode) => void;
  /** Superlative badge per slug. */
  badges: Map<string, string>;
  brandName: (oem: string) => string;
  /** Slugs ticked for comparison, in the order they were ticked. */
  picks: string[];
  togglePick: (slug: string) => void;
  clearPicks: () => void;
  /** Slugs on the visitor's shortlist (this visit only). */
  saved: string[];
  toggleSaved: (slug: string, name: string) => void;
  cityName: string;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  scrollToResults: () => void;
  toast: (text: string) => void;
}

const Ctx = createContext<CarsListingState | null>(null);
export const CarsListingProvider = Ctx.Provider;

export function useCarsListing(): CarsListingState {
  const state = useContext(Ctx);
  if (!state) throw new Error("useCarsListing must be used inside <CarsListingProvider>");
  return state;
}
