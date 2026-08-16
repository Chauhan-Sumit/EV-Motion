"use client";

import { useMemo, useState } from "react";
import { Clock, TrendingUp } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { oemColorOf } from "@/lib/data/ev-motion/derive";
import { getVehiclesByCategory } from "@/lib/data";
import { POPULAR_SEARCHES_BY_SCOPE } from "@/lib/popular-searches";
import { loadRecentSearches, saveRecentSearch } from "@/lib/search-history";
import type { Vehicle, VehicleCategory } from "@/types/vehicle";

const RECENT_KEY = "ev-motion:compare-recent-vehicles";

interface ChangeVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: VehicleCategory;
  excludeSlugs: string[];
  onSelect: (vehicle: Vehicle) => void;
}

/**
 * Premium searchable "Change Vehicle" modal — built on the same Command/cmdk
 * primitive VehiclePicker already uses (keyboard nav + fuzzy filtering come
 * free), swapped into a full Dialog instead of a Popover, with an
 * already-selected exclusion list and a hard category lock. Deliberately
 * NOT built on VehicleSearchBox — that component's navigate-on-select
 * behavior is threaded through 4 internal call sites and isn't safely
 * overridable without risking the working Navbar/homepage search.
 */
export function ChangeVehicleModal({ open, onOpenChange, category, excludeSlugs, onSelect }: ChangeVehicleModalProps) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => loadRecentSearches(RECENT_KEY));

  const eligible = useMemo(
    () => getVehiclesByCategory(category).filter((v) => !excludeSlugs.includes(v.slug)),
    [category, excludeSlugs],
  );

  const recentVehicles = recentSlugs
    .map((slug) => eligible.find((v) => v.slug === slug))
    .filter((v): v is Vehicle => Boolean(v));

  const popularTerms = POPULAR_SEARCHES_BY_SCOPE[category];
  const popularVehicles = popularTerms
    .map((term) => eligible.find((v) => v.modelName.toLowerCase().includes(term.toLowerCase())))
    .filter((v): v is Vehicle => Boolean(v))
    .filter((v, i, arr) => arr.findIndex((o) => o.slug === v.slug) === i)
    .slice(0, 6);

  function handleSelect(vehicle: Vehicle) {
    setRecentSlugs(saveRecentSearch(RECENT_KEY, vehicle.slug, recentSlugs));
    onSelect(vehicle);
    onOpenChange(false);
  }

  function renderItem(vehicle: Vehicle) {
    return (
      <CommandItem
        key={vehicle.slug}
        value={`${vehicle.oemName} ${vehicle.modelName}`}
        onSelect={() => handleSelect(vehicle)}
        className="gap-2.5"
      >
        <span className="relative h-9 w-11 shrink-0 overflow-hidden rounded-md bg-white">
          <VehicleImage vehicle={vehicle} color={oemColorOf(vehicle)} sizes="44px" className="h-full w-full" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] font-semibold text-ink">
            {vehicle.oemName} {vehicle.modelName}
          </span>
        </span>
      </CommandItem>
    );
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Change vehicle"
      description="Search for a vehicle to add to the comparison"
    >
      <Command>
        <CommandInput placeholder="Search by brand or model..." aria-label="Search vehicles to compare" />
        <CommandList>
          <CommandEmpty>No vehicle found.</CommandEmpty>
          {recentVehicles.length > 0 ? (
            <CommandGroup
              heading={
                <span className="flex items-center gap-1">
                  <Clock size={11} /> Recent
                </span>
              }
            >
              {recentVehicles.map(renderItem)}
            </CommandGroup>
          ) : null}
          {popularVehicles.length > 0 ? (
            <CommandGroup
              heading={
                <span className="flex items-center gap-1">
                  <TrendingUp size={11} /> Popular
                </span>
              }
            >
              {popularVehicles.map(renderItem)}
            </CommandGroup>
          ) : null}
          <CommandGroup heading="All vehicles">{eligible.map(renderItem)}</CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
