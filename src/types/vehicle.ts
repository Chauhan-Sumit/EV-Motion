export type VehicleCategory = "car" | "2-wheeler" | "commercial";
/**
 * `"discontinued"` says the OEM no longer sells this vehicle. It exists so a
 * record describing a real scooter/car that people still own and look up does
 * not have to claim it is on sale — the alternative was deleting the record,
 * which loses a working public URL and the data behind it.
 *
 * It is deliberately NOT a fourth availability filter chip: discontinued
 * vehicles are excluded from listings, homepage rails, related/similar
 * recommendations, the compare picker and the search index (see
 * `src/lib/vehicle-availability.ts` for the one predicate all of those share),
 * while their detail page, comparison pages and structured data keep working.
 */
export type LaunchStatus = "available" | "just-launched" | "upcoming" | "discontinued";
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
  /**
   * Calendar year the `ncapRating` was published. Records an age, and age is
   * what decides whether a crash-test result is still a rating or only a
   * historical fact: Euro NCAP and ANCAP results lapse six years after
   * publication, so a 2019 five-star result stopped being current on
   * 1 January 2026.
   *
   * Never present a rating whose year has lapsed as a current rating — read
   * it through `ncapResultFor()` in `src/lib/vehicle-safety.ts`, which is the
   * one place the expiry policy lives, rather than off `ncapRating` directly.
   * Absent means the year was never sourced, not that the rating is current;
   * such a rating is shown without a year and cannot be checked for expiry.
   */
  ncapYear?: number;
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

/**
 * Where a published torque figure was measured. Two OEMs can both publish an
 * honest "peak torque" and mean different quantities:
 *
 * - `"shaft"` — at the motor's output shaft, before any belt/gear reduction.
 *   The convention for every car, and for mid-drive two-wheelers (Ather, Ola,
 *   Bajaj's belt-driven Chetak).
 * - `"wheel"` — at the wheel, with no reduction in between. The convention for
 *   hub-motor two-wheelers (TVS iQube).
 *
 * TVS's 140 Nm and Ather's 26 Nm are not a 5× difference, they are a
 * definition — see CLAUDE.md #28(b2). Nothing here converts between the two:
 * the reduction ratio is not published, so a conversion would be invention.
 */
export type TorqueMeasurementPoint = "shaft" | "wheel";

/**
 * Which quantity a published battery figure is: the total/installed/nominal
 * pack (`"gross"`), or what remains after the manufacturer's protective
 * buffer (`"usable"`). See `Vehicle.batteryMeasuredAt`.
 */
export type BatteryMeasurementBasis = "gross" | "usable";

export interface VehicleMotor {
  motorType?: string;
  driveLayout?: "FWD" | "RWD" | "AWD";
  peakPowerKw?: number;
  peakTorqueNm?: number;
  /**
   * Where `peakTorqueNm` was measured, when it has been established from the
   * source. Only meaningful alongside a `peakTorqueNm`.
   *
   * Absent does NOT mean "shaft" — for a car it resolves to the category
   * default (see `torqueMeasurementPointFor()` in
   * `src/lib/vehicle-torque.ts`), but for a two-wheeler, where both
   * conventions are in live use, absent means *unknown* and the figure is
   * excluded from torque comparison rather than assumed comparable.
   */
  torqueMeasuredAt?: TorqueMeasurementPoint;
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
  /**
   * Which quantity `batteryCapacityKwh` — and every variant's `batteryKwh` —
   * actually is. One qualifier covers the variants too: variants of one model
   * share a pack convention.
   *
   * Absent means no source established it, and absent **never** resolves to a
   * default. That is the deliberate difference from `torqueMeasuredAt`, which
   * a car may leave blank because no hub-motor car exists: here there is no
   * category whose convention is unambiguous. BMW and BYD each use both
   * conventions *within their own line-ups* — `bmw-ix` records the usable
   * figure while `bmw-i4` beside it records the gross one.
   *
   * See `BATTERY_CONVENTION_SURVEY.md` for the per-record classification and
   * `src/lib/vehicle-battery.ts` for the comparison rule.
   */
  batteryMeasuredAt?: BatteryMeasurementBasis;
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
