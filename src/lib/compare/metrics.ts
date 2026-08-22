import type { VehicleDetail } from "@/types/vehicle-detail";
import type { WinnerMetric } from "./winnerEngine";
import { boolToMetricValue } from "./winnerEngine";
import { formatPriceLakh } from "@/lib/utils";
import { isTorqueComparable, torqueMeasurementPointFor, TORQUE_POINT_LABEL } from "@/lib/vehicle-torque";
import { batteryBasisFor, isBatteryComparable, BATTERY_BASIS_LABEL } from "@/lib/vehicle-battery";
import { currentNcapRating, formatNcapResult, ncapResultFor } from "@/lib/vehicle-safety";

export interface SpecRow {
  key: string;
  label: string;
  section: string;
  render: (v: VehicleDetail) => string;
  /** Optional raw numeric accessor — when present, SpecTable draws a proportional bar (value vs. the highest known value in the row) next to the text instead of just the number. Omit for rows with no meaningful magnitude (Colours, free-text). */
  barValue?: (v: VehicleDetail) => number | null;
  /**
   * Optional SET-level gate, mirroring `WinnerMetric.comparable`. When it
   * returns false, SpecTable still renders every value but draws no
   * proportional bars — a bar is a visual ranking, so leaving it on would
   * crown a winner the engine has just refused to crown.
   */
  comparable?: (vehicles: VehicleDetail[]) => boolean;
}

/**
 * Two separate registries, not one — presentational rows (SPEC_ROWS-shaped
 * arrays below, each driving one section's SpecTable) vs. one scoreable
 * WINNER_METRICS array (drives the winner engine). Not every displayed row
 * has a meaningful "better" direction (Colours, free-text Warranty), so
 * keeping them apart means the Winner Ribbon / crown badges /
 * SmartRecommendation only ever touch the scoreable subset, keyed by the
 * same `key`s as a subset of the various *_SPEC_ROWS arrays.
 *
 * WINNER_METRICS is intentionally ONE flat array spanning every section
 * (not one array per section) — the Winner Ribbon's "wins N categories"
 * tally and SmartRecommendation need a true cross-section count. Each
 * section's SpecTable filters it down to its own `section` when rendering
 * crowns. Both this file's row arrays and WINNER_METRICS grow as each
 * Compare section is built — this file is the single place a new schema
 * field needs to be registered, not a new component.
 */

/** Shared sentinel a value's `render()` returns when a manufacturer hasn't published that spec — SpecTable (and any hand-rolled table) detects this exact string to swap in the premium `UnavailableValue` treatment instead of raw text. */
export const NOT_SPECIFIED = "Not officially specified";

function fmtKm(n: number): string {
  return `${n.toLocaleString("en-IN")} km`;
}

/**
 * Power and torque are sourced-only. These used to fall back to a "(est.)"
 * figure derived from battery capacity — which meant the Power and Torque
 * rows were a restatement of the Battery row, and, because they also fed
 * `barValue`, they let battery size be counted three times over in the
 * winner engine and the overall verdict. Unsourced now reads as unsourced.
 */
function powerLabel(v: VehicleDetail): string {
  const real = v.quickSpecs.powerKw;
  return real ? `${real} kW` : NOT_SPECIFIED;
}

/**
 * Torque prints its measurement point whenever one is known — "58 Nm (at
 * motor)", "140 Nm (at wheel)". Those two numbers are four hours of confusion
 * apart without that suffix and obvious with it, and it is the visible half of
 * the same rule `torqueComparable` enforces invisibly: a hub figure and a
 * shaft figure never get ranked against each other. See
 * `src/lib/vehicle-torque.ts` and CLAUDE.md #28(b2).
 *
 * A two-wheeler whose convention was never established prints the bare figure
 * — no suffix is honest about not knowing, and its value is excluded from the
 * ranking anyway.
 */
function torqueLabel(v: VehicleDetail): string {
  const real = v.quickSpecs.torqueNm;
  if (!real) return NOT_SPECIFIED;
  const point = torqueMeasurementPointFor(v.sourceVehicle);
  return point ? `${real} Nm (${TORQUE_POINT_LABEL[point]})` : `${real} Nm`;
}

/** Shared by the Overview and Performance torque rows — both render the same figure, so both must gate on the same rule. */
const torqueComparable = (vehicles: VehicleDetail[]) => isTorqueComparable(vehicles.map((v) => v.sourceVehicle));

/**
 * Battery prints its basis whenever one is known — "105.2 kWh (usable)",
 * "83.9 kWh (gross)". Those are not the same quantity, and the suffix is the
 * visible half of the rule `batteryComparable` enforces invisibly. See
 * `src/lib/vehicle-battery.ts` and BATTERY_CONVENTION_SURVEY.md.
 *
 * A vehicle whose basis was never established prints the bare figure — no
 * suffix is honest about not knowing, and its value is excluded from the
 * ranking anyway. That is currently every two-wheeler.
 */
function batteryLabel(v: VehicleDetail): string {
  const kwh = v.quickSpecs.batteryKwh;
  const basis = batteryBasisFor(v.sourceVehicle);
  return basis ? `${kwh} kWh (${BATTERY_BASIS_LABEL[basis]})` : `${kwh} kWh`;
}

/** Shared by the Overview battery row, the Battery-section row and the Efficiency row — all three are the same figure, so all three gate on the same rule. */
const batteryComparable = (vehicles: VehicleDetail[]) => isBatteryComparable(vehicles.map((v) => v.sourceVehicle));

function fastChargeLabel(v: VehicleDetail, suffix = ""): string {
  const real = v.quickSpecs.fastChargeMinutes;
  return real ? `${real} min${suffix}` : NOT_SPECIFIED;
}

export const OVERVIEW_SPEC_ROWS: SpecRow[] = [
  { key: "battery", label: "Battery", section: "overview", render: batteryLabel, barValue: (v) => v.quickSpecs.batteryKwh, comparable: batteryComparable },
  { key: "range", label: "Range", section: "overview", render: (v) => fmtKm(v.quickSpecs.rangeKm), barValue: (v) => v.quickSpecs.rangeKm },
  { key: "power", label: "Power", section: "overview", render: powerLabel, barValue: (v) => v.quickSpecs.powerKw ?? null },
  { key: "torque", label: "Torque", section: "overview", render: torqueLabel, barValue: (v) => v.quickSpecs.torqueNm ?? null, comparable: torqueComparable },
  { key: "topSpeed", label: "Top Speed", section: "overview", render: (v) => `${v.sourceVehicle.topSpeedKmph} km/h` },
  {
    key: "acceleration",
    label: "Acceleration",
    section: "overview",
    render: (v) => (v.sourceVehicle.accelerationSec0To100 ? `${v.sourceVehicle.accelerationSec0To100}s (0-100)` : NOT_SPECIFIED),
  },
  {
    key: "fastCharge",
    label: "Charging Time",
    section: "overview",
    render: (v) => fastChargeLabel(v, " (10-80%)"),
    barValue: (v) => v.quickSpecs.fastChargeMinutes ?? null,
  },
  {
    key: "efficiency",
    label: "Efficiency",
    section: "overview",
    render: (v) => `${(v.quickSpecs.batteryKwh / (v.quickSpecs.rangeKm / 100)).toFixed(1)} kWh/100km`,
    // Battery-derived, so it inherits the battery basis: a usable-figure car
    // shows a lower kWh/100km than an identical gross-figure one purely by
    // convention. No `barValue` today, but the gate travels with the row so a
    // future bar cannot reintroduce the distortion.
    comparable: batteryComparable,
  },
];

export const PRICE_SPEC_ROWS: SpecRow[] = [
  { key: "price", label: "Ex-showroom (starting)", section: "price", render: (v) => formatPriceLakh(v.startingPrice / 100000) },
];

export const BATTERY_SPEC_ROWS: SpecRow[] = [
  { key: "battery", label: "Battery Capacity", section: "battery", render: batteryLabel, barValue: (v) => v.quickSpecs.batteryKwh, comparable: batteryComparable },
  {
    key: "batteryChemistry",
    label: "Battery Chemistry",
    section: "battery",
    render: (v) => v.sourceVehicle.specs?.batteryChemistry ?? NOT_SPECIFIED,
  },
  { key: "range", label: "Range", section: "battery", render: (v) => fmtKm(v.quickSpecs.rangeKm), barValue: (v) => v.quickSpecs.rangeKm },
];

export const CHARGING_SPEC_ROWS: SpecRow[] = [
  {
    key: "fastCharge",
    label: "DC Fast Charging (10-80%)",
    section: "charging",
    render: (v) => fastChargeLabel(v),
    barValue: (v) => v.quickSpecs.fastChargeMinutes ?? null,
  },
  {
    key: "acCharge",
    label: "AC Home Charging (full)",
    section: "charging",
    render: (v) => `${v.charging.acHomeChargeHours} hr`,
    barValue: (v) => v.charging.acHomeChargeHours,
  },
  {
    key: "connectorType",
    label: "Charging Port",
    section: "charging",
    render: (v) => v.sourceVehicle.specs?.chargingExtra?.connectorType ?? NOT_SPECIFIED,
  },
  {
    key: "v2l",
    label: "Vehicle to Load",
    section: "charging",
    render: (v) => (v.sourceVehicle.specs?.chargingExtra?.v2l === undefined ? NOT_SPECIFIED : v.sourceVehicle.specs?.chargingExtra?.v2l ? "Yes" : "No"),
  },
  {
    key: "v2v",
    label: "Vehicle to Vehicle",
    section: "charging",
    render: (v) => (v.sourceVehicle.specs?.chargingExtra?.v2v === undefined ? NOT_SPECIFIED : v.sourceVehicle.specs?.chargingExtra?.v2v ? "Yes" : "No"),
  },
  {
    key: "chargingNetwork",
    label: "Charging Network Partner",
    section: "charging",
    render: (v) => v.sourceVehicle.specs?.chargingExtra?.chargingNetworkPartner ?? NOT_SPECIFIED,
  },
];

export const PERFORMANCE_SPEC_ROWS: SpecRow[] = [
  { key: "power", label: "Power", section: "performance", render: powerLabel, barValue: (v) => v.quickSpecs.powerKw ?? null },
  { key: "torque", label: "Torque", section: "performance", render: torqueLabel, barValue: (v) => v.quickSpecs.torqueNm ?? null, comparable: torqueComparable },
  {
    key: "acceleration",
    label: "0-100 km/h",
    section: "performance",
    render: (v) => (v.sourceVehicle.accelerationSec0To100 ? `${v.sourceVehicle.accelerationSec0To100}s` : NOT_SPECIFIED),
  },
  {
    key: "topSpeed",
    label: "Top Speed",
    section: "performance",
    render: (v) => `${v.sourceVehicle.topSpeedKmph} km/h`,
    barValue: (v) => v.sourceVehicle.topSpeedKmph,
  },
  {
    key: "driveModes",
    label: "Drive Modes",
    section: "performance",
    render: (v) => v.sourceVehicle.specs?.motor?.driveModes?.join(", ") || NOT_SPECIFIED,
  },
  {
    key: "regenBraking",
    label: "Regenerative Braking",
    section: "performance",
    render: (v) => (v.sourceVehicle.specs?.motor?.regenBraking === undefined ? NOT_SPECIFIED : v.sourceVehicle.specs?.motor?.regenBraking ? "Yes" : "No"),
  },
  {
    key: "motorType",
    label: "Motor Type",
    section: "performance",
    render: (v) => v.sourceVehicle.specs?.motor?.motorType ?? NOT_SPECIFIED,
  },
  {
    key: "driveLayout",
    label: "Drive Layout",
    section: "performance",
    render: (v) => v.sourceVehicle.specs?.motor?.driveLayout ?? NOT_SPECIFIED,
  },
];

function yesNo(value: boolean | undefined): string {
  return value === undefined ? NOT_SPECIFIED : value ? "Yes" : "No";
}

export const DIMENSIONS_SPEC_ROWS: SpecRow[] = [
  { key: "length", label: "Length", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.lengthMm ? `${v.sourceVehicle.specs.dimensions.lengthMm} mm` : NOT_SPECIFIED) },
  { key: "width", label: "Width", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.widthMm ? `${v.sourceVehicle.specs.dimensions.widthMm} mm` : NOT_SPECIFIED) },
  { key: "height", label: "Height", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.heightMm ? `${v.sourceVehicle.specs.dimensions.heightMm} mm` : NOT_SPECIFIED) },
  { key: "wheelbase", label: "Wheelbase", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.wheelbaseMm ? `${v.sourceVehicle.specs.dimensions.wheelbaseMm} mm` : NOT_SPECIFIED) },
  { key: "groundClearance", label: "Ground Clearance", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.groundClearanceMm ? `${v.sourceVehicle.specs.dimensions.groundClearanceMm} mm` : NOT_SPECIFIED) },
  { key: "bootSpace", label: "Boot Space", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.bootSpaceLiters ? `${v.sourceVehicle.specs.dimensions.bootSpaceLiters} L` : NOT_SPECIFIED) },
  { key: "kerbWeight", label: "Kerb Weight", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.kerbWeightKg ? `${v.sourceVehicle.specs.dimensions.kerbWeightKg} kg` : NOT_SPECIFIED) },
  { key: "turningRadius", label: "Turning Radius", section: "dimensions", render: (v) => (v.sourceVehicle.specs?.dimensions?.turningRadiusM ? `${v.sourceVehicle.specs.dimensions.turningRadiusM} m` : NOT_SPECIFIED) },
  { key: "tyreSize", label: "Tyre Size", section: "dimensions", render: (v) => v.sourceVehicle.specs?.tyres?.size ?? NOT_SPECIFIED },
  {
    key: "suspension",
    label: "Suspension (Front / Rear)",
    section: "dimensions",
    render: (v) => {
      const s = v.sourceVehicle.specs?.suspension;
      return s?.front || s?.rear ? `${s.front ?? "—"} / ${s.rear ?? "—"}` : NOT_SPECIFIED;
    },
  },
  {
    key: "brakes",
    label: "Brakes (Front / Rear)",
    section: "dimensions",
    render: (v) => {
      const b = v.sourceVehicle.specs?.brakes;
      return b?.front || b?.rear ? `${b.front ?? "—"} / ${b.rear ?? "—"}` : NOT_SPECIFIED;
    },
  },
];

export const SAFETY_SPEC_ROWS: SpecRow[] = [
  {
    key: "ncap",
    label: "NCAP Rating",
    section: "safety",
    /**
     * Renders the published result WITH its year, and says so out loud once
     * that year has lapsed — "5 Stars (Euro NCAP, 2019 — rating expired)".
     * Euro NCAP and ANCAP results run six years; `src/lib/vehicle-safety.ts`
     * owns that policy. An expired result is real history and stays visible,
     * but it must never read as a current rating, which is exactly what a
     * bare "5 Stars (Euro NCAP)" did before `ncapYear` existed.
     */
    render: (v) => {
      const result = ncapResultFor(v.sourceVehicle.specs?.safety);
      return result ? formatNcapResult(result) : NOT_SPECIFIED;
    },
  },
  { key: "airbags", label: "Airbags", section: "safety", render: (v) => (v.sourceVehicle.specs?.safety?.airbagsCount ? `${v.sourceVehicle.specs.safety.airbagsCount}` : NOT_SPECIFIED) },
  { key: "adas", label: "ADAS", section: "safety", render: (v) => yesNo(v.sourceVehicle.specs?.safety?.adas) },
  { key: "abs", label: "ABS", section: "safety", render: (v) => yesNo(v.sourceVehicle.specs?.safety?.abs) },
  { key: "esc", label: "ESC", section: "safety", render: (v) => yesNo(v.sourceVehicle.specs?.safety?.esc) },
  { key: "hillHold", label: "Hill Hold Control", section: "safety", render: (v) => yesNo(v.sourceVehicle.specs?.safety?.hillHoldControl) },
  { key: "camera360", label: "360° Camera", section: "safety", render: (v) => yesNo(v.sourceVehicle.specs?.safety?.camera360) },
  { key: "tpms", label: "TPMS", section: "safety", render: (v) => yesNo(v.sourceVehicle.specs?.safety?.tpms) },
  { key: "isofix", label: "ISOFIX", section: "safety", render: (v) => yesNo(v.sourceVehicle.specs?.safety?.isofix) },
  { key: "parkingSensors", label: "Parking Sensors", section: "safety", render: (v) => v.sourceVehicle.specs?.safety?.parkingSensors ?? NOT_SPECIFIED },
];

export const FEATURES_SPEC_ROWS: SpecRow[] = [
  { key: "touchscreen", label: "Touchscreen", section: "features", render: (v) => (v.sourceVehicle.specs?.features?.touchscreenInches ? `${v.sourceVehicle.specs.features.touchscreenInches}"` : NOT_SPECIFIED) },
  { key: "wirelessAndroidAuto", label: "Wireless Android Auto", section: "features", render: (v) => yesNo(v.sourceVehicle.specs?.features?.wirelessAndroidAuto) },
  { key: "wirelessCarPlay", label: "Wireless Apple CarPlay", section: "features", render: (v) => yesNo(v.sourceVehicle.specs?.features?.wirelessCarPlay) },
  { key: "otaUpdates", label: "OTA Updates", section: "features", render: (v) => yesNo(v.sourceVehicle.specs?.features?.otaUpdates) },
  { key: "connectedCarApp", label: "Connected Car App", section: "features", render: (v) => yesNo(v.sourceVehicle.specs?.features?.connectedCarApp) },
  { key: "ventilatedSeats", label: "Ventilated Seats", section: "features", render: (v) => yesNo(v.sourceVehicle.specs?.features?.ventilatedSeats) },
  { key: "sunroof", label: "Sunroof", section: "features", render: (v) => v.sourceVehicle.specs?.features?.sunroofType ?? NOT_SPECIFIED },
  { key: "digitalCluster", label: "Digital Cluster", section: "features", render: (v) => yesNo(v.sourceVehicle.specs?.features?.digitalCluster) },
  { key: "ambientLighting", label: "Ambient Lighting", section: "features", render: (v) => yesNo(v.sourceVehicle.specs?.features?.ambientLighting) },
  { key: "premiumAudio", label: "Premium Audio", section: "features", render: (v) => v.sourceVehicle.specs?.features?.premiumAudioBrand ?? NOT_SPECIFIED },
];

export const WARRANTY_SPEC_ROWS: SpecRow[] = [
  {
    key: "vehicleWarranty",
    label: "Vehicle Warranty",
    section: "warranty",
    render: (v) => {
      const w = v.sourceVehicle.specs?.warranty;
      return w?.vehicleYears ? `${w.vehicleYears} yrs${w.vehicleKm ? ` / ${w.vehicleKm.toLocaleString("en-IN")} km` : ""}` : NOT_SPECIFIED;
    },
  },
  {
    key: "batteryWarrantyRow",
    label: "Battery Warranty",
    section: "warranty",
    render: (v) => {
      const w = v.sourceVehicle.specs?.warranty;
      return w?.batteryYears ? `${w.batteryYears} yrs${w.batteryKm ? ` / ${w.batteryKm.toLocaleString("en-IN")} km` : ""}` : NOT_SPECIFIED;
    },
  },
  {
    key: "motorWarranty",
    label: "Motor Warranty",
    section: "warranty",
    render: (v) => {
      const w = v.sourceVehicle.specs?.warranty;
      return w?.motorYears ? `${w.motorYears} yrs${w.motorKm ? ` / ${w.motorKm.toLocaleString("en-IN")} km` : ""}` : NOT_SPECIFIED;
    },
  },
  {
    key: "roadsideAssistance",
    label: "Roadside Assistance",
    section: "warranty",
    render: (v) => {
      const years = v.sourceVehicle.specs?.warranty?.roadsideAssistanceYears;
      return years ? `${years} yrs` : NOT_SPECIFIED;
    },
  },
];

export const WINNER_METRICS: WinnerMetric<VehicleDetail>[] = [
  { key: "price", label: "Lower Price", section: "price", direction: "lower-better", value: (v) => v.startingPrice },
  { key: "range", label: "Higher Range", section: "overview", direction: "higher-better", value: (v) => v.quickSpecs.rangeKm },
  {
    key: "battery",
    label: "Larger Battery",
    section: "overview",
    direction: "higher-better",
    value: (v) => v.quickSpecs.batteryKwh,
    // A gross figure and a usable figure are not the same quantity, so
    // crowning the larger one is meaningless unless both were stated the same
    // way. `bmw-ix` (105.2 usable) against `bmw-i4` (83.9 gross) is the case
    // that proves it — same brand, opposite conventions.
    comparable: batteryComparable,
  },
  {
    key: "power",
    label: "Higher Power",
    section: "performance",
    direction: "higher-better",
    value: (v) => v.sourceVehicle.specs?.motor?.peakPowerKw ?? null,
  },
  {
    key: "torque",
    label: "Higher Torque",
    section: "performance",
    direction: "higher-better",
    value: (v) => v.sourceVehicle.specs?.motor?.peakTorqueNm ?? null,
    // Hub-motor torque (at the wheel) and mid-drive torque (at the motor
    // shaft) are different quantities — see `src/lib/vehicle-torque.ts`.
    comparable: torqueComparable,
  },
  { key: "topSpeed", label: "Higher Top Speed", section: "performance", direction: "higher-better", value: (v) => v.sourceVehicle.topSpeedKmph },
  {
    key: "acceleration",
    label: "Faster Acceleration",
    section: "performance",
    direction: "lower-better",
    value: (v) => v.sourceVehicle.accelerationSec0To100 ?? null,
  },
  { key: "fastCharge", label: "Faster DC Charging", section: "charging", direction: "lower-better", value: (v) => v.quickSpecs.fastChargeMinutes ?? null },
  { key: "acCharge", label: "Faster AC Charging", section: "charging", direction: "lower-better", value: (v) => v.charging.acHomeChargeHours },
  {
    key: "v2l",
    label: "Vehicle-to-Load",
    section: "charging",
    direction: "boolean-better",
    value: (v) => boolToMetricValue(v.sourceVehicle.specs?.chargingExtra?.v2l),
  },
  {
    key: "groundClearance",
    label: "Higher Ground Clearance",
    section: "dimensions",
    direction: "higher-better",
    value: (v) => v.sourceVehicle.specs?.dimensions?.groundClearanceMm ?? null,
  },
  {
    key: "bootSpace",
    label: "More Boot Space",
    section: "dimensions",
    direction: "higher-better",
    value: (v) => v.sourceVehicle.specs?.dimensions?.bootSpaceLiters ?? null,
  },
  {
    key: "safetyRating",
    label: "Better Safety Rating",
    section: "safety",
    direction: "higher-better",
    // `currentNcapRating`, not `ncapRating`: a lapsed result is history, not
    // evidence about the car on sale today, so it neither wins this metric
    // nor counts toward the Winner Ribbon's tally. The EX40 (Euro NCAP 2018,
    // expired) vs EC40 (2022, current) pair is the case to check.
    value: (v) => currentNcapRating(v.sourceVehicle.specs?.safety),
  },
  {
    key: "airbags",
    label: "More Airbags",
    section: "safety",
    direction: "higher-better",
    value: (v) => v.sourceVehicle.specs?.safety?.airbagsCount ?? null,
  },
  {
    key: "adas",
    label: "ADAS Available",
    section: "safety",
    direction: "boolean-better",
    value: (v) => boolToMetricValue(v.sourceVehicle.specs?.safety?.adas),
  },
  {
    key: "batteryWarranty",
    label: "Longer Battery Warranty",
    section: "warranty",
    direction: "higher-better",
    value: (v) => v.sourceVehicle.specs?.warranty?.batteryYears ?? null,
  },
  {
    key: "vehicleWarranty",
    label: "Longer Vehicle Warranty",
    section: "warranty",
    direction: "higher-better",
    value: (v) => v.sourceVehicle.specs?.warranty?.vehicleYears ?? null,
  },
  {
    key: "turningRadius",
    label: "Tighter Turning Radius",
    section: "dimensions",
    direction: "lower-better",
    value: (v) => v.sourceVehicle.specs?.dimensions?.turningRadiusM ?? null,
  },
  {
    key: "esc",
    label: "ESC Available",
    section: "safety",
    direction: "boolean-better",
    value: (v) => boolToMetricValue(v.sourceVehicle.specs?.safety?.esc),
  },
];

/** Every section's rows, flattened — used to look up a plain-noun label for a metric key (Pros & Cons, Expert Verdict). */
const ALL_SPEC_ROWS: SpecRow[] = [
  ...OVERVIEW_SPEC_ROWS,
  ...PRICE_SPEC_ROWS,
  ...BATTERY_SPEC_ROWS,
  ...CHARGING_SPEC_ROWS,
  ...PERFORMANCE_SPEC_ROWS,
  ...DIMENSIONS_SPEC_ROWS,
  ...SAFETY_SPEC_ROWS,
  ...WARRANTY_SPEC_ROWS,
];

export function rowLabelForKey(key: string): string {
  return ALL_SPEC_ROWS.find((r) => r.key === key)?.label ?? key;
}
