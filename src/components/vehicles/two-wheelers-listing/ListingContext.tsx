"use client";

import { createContext, useContext } from "react";
import type { BikeFilters, BikeSortKey, ViewMode } from "@/lib/two-wheelers-listing/filters";
import type { PricedBike } from "@/lib/two-wheelers-listing/types";

export interface BikesListingState {
  /** Every listed two-wheeler, priced for the selected city. */
  bikes: PricedBike[];
  /** `bikes` after the active filters and sort. */
  results: PricedBike[];
  filters: BikeFilters;
  setFilters: (next: BikeFilters | ((prev: BikeFilters) => BikeFilters)) => void;
  sort: BikeSortKey;
  setSort: (next: BikeSortKey) => void;
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

const Ctx = createContext<BikesListingState | null>(null);
export const BikesListingProvider = Ctx.Provider;

export function useBikesListing(): BikesListingState {
  const state = useContext(Ctx);
  if (!state) throw new Error("useBikesListing must be used inside <BikesListingProvider>");
  return state;
}
