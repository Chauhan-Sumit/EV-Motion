// EV Motion — Vehicle Detail Page domain types. Generic across cars and
// 2-wheelers — one shape, one template. `vehicle` + `oemColor` are carried
// alongside so sections can render via our existing VehicleImage component
// instead of assuming a flat image URL always exists.

import type { EvMotionKind } from "./ev-motion";
import type { Vehicle } from "./vehicle";

export type VdpCategory = "cars" | "scooters";

export interface VdpQuickSpecs {
  rangeKm: number;
  batteryKwh: number;
  powerKw: number;
  torqueNm: number;
  fastChargeMinutes: number;
  fastChargeFromPct: number;
  fastChargeToPct: number;
  warrantyYears: number;
  warrantyKm: number;
}

export interface VdpVariant {
  id: string;
  name: string;
  batteryKwh: number;
  rangeKm: number;
  price: number;
  isRecommended?: boolean;
}

export interface VdpColor {
  id: string;
  name: string;
  hex: string;
}

export interface VdpFeature {
  id: string;
  label: string;
  category: string;
}

export interface VdpFaq {
  id: string;
  question: string;
  answer: string;
}

export interface VdpOwnershipTool {
  id: "running-cost" | "charging-cost" | "price-history" | "subsidy";
  title: string;
  summary: string;
  rows: { label: string; value: string }[];
}

export interface VdpRealWorldRange {
  araiKm: number;
  cityKm: number;
  highwayKm: number;
  mixedKm: number;
}

export interface VdpBattery {
  capacityKwh: number;
  araiRangeKm: number;
  chemistry: string;
}

export interface VdpCharging {
  dcFastChargeMinutes: number;
  dcFastChargeFromPct: number;
  dcFastChargeToPct: number;
  acHomeChargeHours: number;
  connectorType: string;
}

export interface VdpBodySpecs {
  bodyType: string;
  seatingCapacity: string;
  driveType: string;
  bootSpaceLiters: number;
  connectedCar: boolean;
}

export interface VehicleDetail {
  id: string;
  category: VdpCategory;
  kind: EvMotionKind;
  brand: string;
  brandSlug: string;
  name: string;
  slug: string;
  /** The underlying catalog record — used to render photos via VehicleImage. */
  sourceVehicle: Vehicle;
  oemColor: string;
  priceLabel: string;
  startingPrice: number;
  emiLabel: string;
  overview: string;
  quickSpecs: VdpQuickSpecs;
  variants: VdpVariant[];
  colors: VdpColor[];
  battery: VdpBattery;
  charging: VdpCharging;
  bodySpecs: VdpBodySpecs;
  realWorldRange: VdpRealWorldRange;
  ownershipTools: VdpOwnershipTool[];
  features: VdpFeature[];
  faqs: VdpFaq[];
  similarSlugs: string[];
}
