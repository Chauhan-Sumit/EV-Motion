export type VehicleCategory = "car" | "2-wheeler" | "commercial";
export type LaunchStatus = "available" | "just-launched" | "upcoming";
export type CarBodyType = "hatchback" | "suv" | "sedan" | "muv";
export type TwoWheelerType = "scooter" | "motorcycle";
export type CommercialType =
  | "three-wheeler-cargo"
  | "three-wheeler-passenger"
  | "small-truck"
  | "van"
  | "bus";

export interface VehicleVariant {
  id: string;
  name: string;
  priceLakh: number;
  rangeKm: number;
  batteryKwh: number;
  topSpeedKmph: number;
  fastChargeTimeMin?: number;
}

/**
 * `photoUrl`/`gallery` are the only fields that trigger a real photo —
 * `VehicleImage`/`VehicleGallery` fall back to the branded placeholder
 * whenever they're absent, so it's always safe to leave them unset.
 * Values are ImageKit paths: either relative (resolved against
 * NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT / `IMAGEKIT_URL_ENDPOINT` in
 * src/lib/imagekit.ts, e.g. "/vehicles/tata-nexon-ev/hero.jpg") or a full
 * `https://ik.imagekit.io/...` URL. Never hand-write a non-ImageKit external
 * URL here — see CLAUDE.md's photo-sourcing note. `hero`/`gallery`'s string
 * contents themselves are otherwise unused labels/legacy fields kept for
 * shape compatibility; only `gallery`'s *length and ImageKit paths* matter
 * once populated.
 */
export interface VehicleImages {
  hero: string;
  /** Additional real ImageKit paths shown after the primary photo — see VehicleGallery. Empty until sourced. */
  gallery: string[];
  /** The vehicle's primary/hero photo — an ImageKit path. Absent renders the branded placeholder. */
  photoUrl?: string;
  photoAttribution?: string;
}

export interface VehicleDimensions {
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  wheelbaseMm?: number;
  groundClearanceMm?: number;
  bootSpaceLiters?: number;
  kerbWeightKg?: number;
  turningRadiusM?: number;
}

export interface VehicleSafety {
  ncapRating?: number;
  ncapAgency?: string;
  airbagsCount?: number;
  adas?: boolean;
  abs?: boolean;
  esc?: boolean;
  hillHoldControl?: boolean;
  camera360?: boolean;
  tpms?: boolean;
  isofix?: boolean;
  parkingSensors?: "front" | "rear" | "both";
}

export interface VehicleWarranty {
  vehicleYears?: number;
  vehicleKm?: number;
  batteryYears?: number;
  batteryKm?: number;
  motorYears?: number;
  motorKm?: number;
  roadsideAssistanceYears?: number;
}

export interface VehicleFeatures {
  touchscreenInches?: number;
  wirelessAndroidAuto?: boolean;
  wirelessCarPlay?: boolean;
  otaUpdates?: boolean;
  connectedCarApp?: boolean;
  ventilatedSeats?: boolean;
  sunroofType?: "none" | "electric" | "panoramic";
  digitalCluster?: boolean;
  ambientLighting?: boolean;
  premiumAudioBrand?: string;
}

export interface VehicleChargingExtra {
  connectorType?: string;
  v2l?: boolean;
  v2v?: boolean;
  chargingNetworkPartner?: string;
}

export interface VehicleMotor {
  motorType?: string;
  driveLayout?: "FWD" | "RWD" | "AWD";
  peakPowerKw?: number;
  peakTorqueNm?: number;
  driveModes?: string[];
  regenBraking?: boolean;
}

export interface VehicleTyres {
  size?: string;
  spareType?: "full-size" | "space-saver" | "none" | "puncture-kit";
}

export interface VehicleSuspension {
  front?: string;
  rear?: string;
}

export interface VehicleBrakes {
  front?: "disc" | "drum";
  rear?: "disc" | "drum";
}

/**
 * Real, manufacturer/OEM-sourced specifications only — every field optional
 * at every level, never defaulted or estimated. Absent means "not officially
 * specified," rendered honestly as such rather than guessed. This is a
 * stricter, parallel channel to the computed approximations already used by
 * `toVehicleDetail()` (power/torque formulas, hardcoded warranty years) —
 * those stay as-is for the VDP; `specs` is used by the Compare page, which
 * must never fabricate a real vehicle's specifications. Populated for a
 * researched pilot batch of vehicles only — see HANDOFF.md's "Batch 6"
 * entry for coverage status and how to extend it.
 */
export interface VehicleSpecs {
  dimensions?: VehicleDimensions;
  safety?: VehicleSafety;
  warranty?: VehicleWarranty;
  features?: VehicleFeatures;
  chargingExtra?: VehicleChargingExtra;
  motor?: VehicleMotor;
  tyres?: VehicleTyres;
  suspension?: VehicleSuspension;
  brakes?: VehicleBrakes;
  batteryChemistry?: string;
  certifications?: string[];
}

export interface Vehicle {
  id: string;
  slug: string;
  category: VehicleCategory;
  oem: string;
  oemName: string;
  modelName: string;
  tagline: string;
  bodyType?: CarBodyType;
  twoWheelerType?: TwoWheelerType;
  commercialType?: CommercialType;
  priceRangeLakh: [number, number];
  rangeKm: number;
  batteryCapacityKwh: number;
  chargingTimeFastMin?: number;
  chargingTimeSlowHr: number;
  topSpeedKmph: number;
  accelerationSec0To100?: number;
  seatingCapacity?: number;
  launchStatus: LaunchStatus;
  launchDate?: string;
  colors: string[];
  images: VehicleImages;
  variants: VehicleVariant[];
  highlights: string[];
  description: string;
  /** Real, sourced-only extended specs — see `VehicleSpecs`. Absent unless researched. */
  specs?: VehicleSpecs;
}

export interface Oem {
  key: string;
  slug: string;
  name: string;
  color: string;
  country: string;
  categories: VehicleCategory[];
  description: string;
  /** Public path to the brand's real logo asset. Absent where no asset exists (e.g. Ampere) — render an initial-letter fallback in that case. */
  logoUrl?: string;
}
