"use client";

import { createContext, useContext } from "react";
import type { City } from "@/lib/data/cities";
import type { VehicleCategory } from "@/types/vehicle";
import type { VehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import type { ShowroomVehicle } from "@/lib/compare/showroom/metrics";
import type { OwnershipSettings } from "@/lib/compare/showroom/ownership";

export interface ShowroomState {
  vehicles: ShowroomVehicle[];
  /** Same order as `vehicles`. */
  pricing: VehiclePricingSnapshot[];
  category: VehicleCategory;
  city: City;
  settings: OwnershipSettings;
  setSettings: (next: Partial<OwnershipSettings>) => void;
  /** Opens the picker to replace `slot`, or to add a vehicle when omitted. */
  openPicker: (slot?: number) => void;
  removeVehicle: (slot: number) => void;
  openCityPicker: () => void;
  toast: (message: string) => void;
  /** "Gurugram, Haryana" — or just "Delhi" where city and state share a name. */
  cityLabel: string;
  /** e.g. "electric cars" — for copy. */
  noun: string;
}

const Ctx = createContext<ShowroomState | null>(null);
export const ShowroomProvider = Ctx.Provider;

export function useShowroom(): ShowroomState {
  const value = useContext(Ctx);
  if (!value) throw new Error("useShowroom must be used inside <CompareShowroom>");
  return value;
}
