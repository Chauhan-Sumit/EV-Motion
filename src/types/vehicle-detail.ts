// EV Motion — Vehicle Detail Page domain types. Generic across cars and
// 2-wheelers — one shape, one template. `vehicle` + `oemColor` are carried
// alongside so sections can render via our existing VehicleImage component
// instead of assuming a flat image URL always exists.

import type { Vehicle, VehicleCategory } from "./vehicle";

/**
 * Optional fields here are the sourced-only ones: they are populated from
 * `Vehicle.specs` (real manufacturer data) or left `undefined` and rendered
 * as "Not specified". They are never derived from a formula — see the
 * honesty rule documented on `toVehicleDetail()`.
 */
export interface VdpQuickSpecs {
  rangeKm: number;
  batteryKwh: number;
  /** Sourced only — `specs.motor.peakPowerKw`. */
  powerKw?: number;
  /** Sourced only — `specs.motor.peakTorqueNm`. */
  torqueNm?: number;
  /** Sourced only — `Vehicle.chargingTimeFastMin`. */
  fastChargeMinutes?: number;
  fastChargeFromPct: number;
  fastChargeToPct: number;
  /** Sourced only — `specs.warranty.vehicleYears`. */
  warrantyYears?: number;
  /** Sourced only — `specs.warranty.vehicleKm`. */
  warrantyKm?: number;
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

/**
 * `price-history` deliberately does not exist. It was previously rendered
 * from `currentPrice × 1.012` / `× 1.03`, i.e. invented history presented as
 * tracked data. Do not reintroduce it without a real price-history source.
 */
export interface VdpOwnershipTool {
  id: "running-cost" | "charging-cost" | "subsidy";
  title: string;
  summary: string;
  rows: { label: string; value: string }[];
}

/**
 * A disclosed *model*, not manufacturer data: only `araiKm` is a real claimed
 * figure. The other three are it multiplied by `factors`, which the UI shows
 * so the derivation is visible rather than implied to be measured.
 */
export interface VdpRealWorldRange {
  araiKm: number;
  cityKm: number;
  highwayKm: number;
  mixedKm: number;
  /** The derating factors applied to `araiKm`, surfaced for disclosure. */
  factors: { city: number; highway: number; mixed: number };
}

export interface VdpBattery {
  capacityKwh: number;
  araiRangeKm: number;
  /** Sourced only — `specs.batteryChemistry`. */
  chemistry?: string;
}

export interface VdpCharging {
  /** Sourced only — `Vehicle.chargingTimeFastMin`. */
  dcFastChargeMinutes?: number;
  dcFastChargeFromPct: number;
  dcFastChargeToPct: number;
  acHomeChargeHours: number;
  /** Sourced only — `specs.chargingExtra.connectorType`. */
  connectorType?: string;
}

export interface VdpBodySpecs {
  bodyType: string;
  /** Sourced only — `Vehicle.seatingCapacity`. Absent for 2-wheelers by design. */
  seatingCapacity?: string;
  /** Sourced only — `specs.motor.driveLayout`. */
  driveType?: string;
  /** Sourced only — `specs.dimensions.bootSpaceLiters`. */
  bootSpaceLiters?: number;
  /** Sourced only — `specs.features.connectedCarApp`. */
  connectedCar?: boolean;
}

export interface VehicleDetail {
  id: string;
  category: VehicleCategory;
  brand: string;
  brandSlug: string;
  name: string;
  slug: string;
  /** The underlying catalog record — used to render photos via VehicleImage. */
  sourceVehicle: Vehicle;
  oemColor: string;
  /** Base (nationwide catalog) ex-showroom price low end — city-agnostic; live/current pricing always goes through `useVehiclePricing`, never this field directly. */
  startingPrice: number;
  /** Ex-showroom price range in lakh, [low, high] across variants — feeds the site-wide centralized pricing system (`src/lib/vehicle-pricing/`). */
  priceRangeLakh: [number, number];
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
