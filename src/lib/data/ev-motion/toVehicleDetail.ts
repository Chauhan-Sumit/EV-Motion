import type { Vehicle, VehicleCategory } from "@/types/vehicle";
import type {
  VdpBodySpecs,
  VdpFaq,
  VdpFeature,
  VdpOwnershipTool,
  VdpVariant,
  VehicleDetail,
} from "@/types/vehicle-detail";
import { getOemBySlug, getRelatedVehicles, getVehicleBySlug } from "@/lib/data";
import { routeSegmentFor } from "@/lib/data/categories";

/**
 * Adapter from a catalog `Vehicle` into the VDP view model.
 *
 * **Honesty rule — the same one the Compare page follows.** A specification
 * is either real manufacturer data (from `Vehicle.specs`, the sourced-only
 * channel, or from a first-class `Vehicle` field) or it is `undefined` and
 * renders as "Not specified". Nothing in this file may invent a spec from a
 * formula. Power, torque, warranty, battery chemistry, boot space, drive
 * layout, connector type and fast-charge time were all previously derived
 * from multipliers or category lookups and presented as fact; they are now
 * sourced-or-absent.
 *
 * Two computed blocks deliberately remain, because they are *calculators*
 * rather than specs — each publishes the assumptions it uses, so a reader
 * can see the number is modeled:
 *   - running/charging cost (`ownershipTools`) — states ₹/unit, km/day, and
 *     the comparison fuel efficiency in its summary.
 *   - `realWorldRange` — carries its derating `factors` so the UI can show
 *     the derivation instead of implying the figures were measured.
 *
 * Colour hex codes stay keyword-derived: they are a swatch approximation of
 * a marketing colour name, not a claim about the vehicle.
 */

const COLOR_KEYWORDS: [RegExp, string][] = [
  [/white|pearl|porcelain|ivory|snow|glaze/i, "#F2F2ED"],
  [/black|jet|cosmos|vault|onyx|obsidian/i, "#1A1A1A"],
  [/red|flame|runway|crimson|maroon/i, "#B5222A"],
  [/blue|arctic|ocean|stellar|starlight|indigo|azure/i, "#3E6E8E"],
  [/grey|gray|titanium|graphite|galaxy|daytona|sonic/i, "#57595C"],
  [/silver|aurora/i, "#B9BDC1"],
  [/green|mint|teal|forest|sage|salt/i, "#3F7A5C"],
  [/yellow|amber|sunlit|gold/i, "#E8C547"],
  [/orange|copper/i, "#D95000"],
  [/purple|violet|plum/i, "#6B4C8A"],
];

function colorNameToHex(name: string): string {
  for (const [pattern, hex] of COLOR_KEYWORDS) {
    if (pattern.test(name)) return hex;
  }
  return "#8A8F98";
}

const FEATURE_CATEGORY_RULES: [RegExp, string][] = [
  [/airbag|adas|stability|camera|monitor|brake|safety/i, "Safety"],
  [/touchscreen|display|dashboard|app|connect|navigation|android|carplay|ota|update|smart/i, "Technology"],
  [/seat|sunroof|storage|charging port|usb|sound|comfort|boot|cargo|payload/i, "Comfort"],
  [/mode|accel|launch|regen|top speed|performance|awd|torque/i, "Performance"],
];

function categorizeFeature(label: string): string {
  for (const [pattern, category] of FEATURE_CATEGORY_RULES) {
    if (pattern.test(label)) return category;
  }
  return "Highlights";
}

/**
 * Derating factors applied to the manufacturer's claimed (ARAI/MIDC) range to
 * model real-world figures. Deliberately round numbers: these are a stated
 * rule of thumb — claimed cycles are optimistic, highway running costs an EV
 * more than city running does — not a researched per-vehicle measurement, and
 * a value like 0.686 would imply a precision that does not exist. Surfaced in
 * the UI via `VdpRealWorldRange.factors` so the derivation is visible.
 */
const REAL_WORLD_RANGE_FACTORS = { city: 0.8, highway: 0.7, mixed: 0.75 } as const;

const BODY_TYPE_LABEL: Record<string, string> = {
  hatchback: "Hatchback",
  suv: "SUV",
  sedan: "Sedan",
  muv: "MUV",
  scooter: "Scooter",
  motorcycle: "Motorcycle",
  "three-wheeler-cargo": "3-Wheeler Cargo",
  "three-wheeler-passenger": "3-Wheeler Passenger",
  "small-truck": "Small Truck / LCV",
  van: "Van",
  bus: "Bus",
};

/**
 * Body-type label comes from the catalog record (real), everything else is
 * sourced-or-absent. Drive layout used to be guessed from whether a variant
 * name contained "AWD"; boot space came from a per-body-type lookup table, so
 * every SUV in the database claimed exactly 400 L. Both are now `specs`-only.
 */
function bodySpecsFor(vehicle: Vehicle): VdpBodySpecs {
  const bodyKey =
    (vehicle.category === "car"
      ? vehicle.bodyType
      : vehicle.category === "2-wheeler"
        ? vehicle.twoWheelerType
        : vehicle.commercialType) ?? "suv";

  return {
    bodyType: BODY_TYPE_LABEL[bodyKey] ?? bodyKey,
    seatingCapacity: vehicle.seatingCapacity ? `${vehicle.seatingCapacity} Seater` : undefined,
    driveType: vehicle.specs?.motor?.driveLayout,
    bootSpaceLiters: vehicle.specs?.dimensions?.bootSpaceLiters,
    connectedCar: vehicle.specs?.features?.connectedCarApp,
  };
}

function toVariants(vehicle: Vehicle): VdpVariant[] {
  return vehicle.variants.map((v, i) => ({
    id: v.id,
    name: v.name,
    batteryKwh: v.batteryKwh,
    rangeKm: v.rangeKm,
    price: Math.round(v.priceLakh * 100000),
    isRecommended: vehicle.variants.length > 1 && i === Math.floor((vehicle.variants.length - 1) / 2),
  }));
}

function toFeatures(vehicle: Vehicle): VdpFeature[] {
  return vehicle.highlights.map((label, i) => ({
    id: `f${i + 1}`,
    label,
    category: categorizeFeature(label),
  }));
}

/**
 * These FAQs are also emitted as schema.org `FAQPage` markup, so every answer
 * has to be defensible as published fact — a fabricated figure here would be
 * fed to search engines as a structured claim. The fast-charge answer is
 * therefore split: it only quotes a DC time when the catalog actually has
 * one, and otherwise answers with the home-charging figure alone.
 */
function toFaqs(vehicle: Vehicle, fastChargeMinutes: number | undefined): VdpFaq[] {
  const faqs: VdpFaq[] = [
    {
      id: "q1",
      question: `What is the claimed range of the ${vehicle.modelName}?`,
      answer: `${vehicle.rangeKm} km on a full charge, as claimed by ${vehicle.oemName}.`,
    },
    {
      id: "q2",
      question: "How long does it take to charge?",
      answer: fastChargeMinutes
        ? `About ${fastChargeMinutes} minutes on a compatible fast charger (10-80%). A standard home charger takes roughly ${vehicle.chargingTimeSlowHr} hours for a full charge.`
        : `A standard home charger takes roughly ${vehicle.chargingTimeSlowHr} hours for a full charge. ${vehicle.oemName} has not published a DC fast-charging time for the ${vehicle.modelName}.`,
    },
  ];

  if (vehicle.variants.length > 1) {
    const recommended = vehicle.variants[Math.floor((vehicle.variants.length - 1) / 2)];
    faqs.push({
      id: "q3",
      question: "Which variant offers the best value?",
      answer: `The ${recommended.name} is generally the most recommended trim — it balances range and price without jumping to the top-spec variant.`,
    });
  }

  return faqs;
}

const OWNERSHIP_ASSUMPTIONS: Record<VehicleCategory, { dailyKm: number; fuelKmPerL: number; fuelLabel: string }> = {
  car: { dailyKm: 40, fuelKmPerL: 15, fuelLabel: "car" },
  "2-wheeler": { dailyKm: 25, fuelKmPerL: 45, fuelLabel: "scooter" },
  commercial: { dailyKm: 90, fuelKmPerL: 12, fuelLabel: "commercial vehicle" },
};

/** Tariff used by the running/charging-cost calculators, disclosed in their summaries. */
const ELECTRICITY_RATE_PER_UNIT = 8;
/** Petrol/diesel rate the fuel comparison is quoted against, disclosed likewise. */
const FUEL_RATE_PER_LITRE = 105;

/**
 * Calculators, not specs — every figure below is reproducible from the
 * assumptions printed in its own `summary`. A "Price History" tool used to
 * sit here too, reporting `currentPrice × 1.012` as the price three months
 * ago; there is no price-history source in this project, so it was removed
 * rather than estimated. Restore it only against real recorded prices.
 *
 * The subsidy tool's rows are computed per-state at render time by
 * `SectionOwnershipTools` via `subsidyRowsForState()`, which is why it ships
 * an empty `rows` array here.
 */
function ownershipTools(vehicle: Vehicle): VdpOwnershipTool[] {
  const { dailyKm, fuelKmPerL, fuelLabel } = OWNERSHIP_ASSUMPTIONS[vehicle.category];
  const monthlyKm = dailyKm * 30;
  const unitsPerMonth = (monthlyKm / vehicle.rangeKm) * vehicle.batteryCapacityKwh;
  const electricityCost = Math.round(unitsPerMonth * ELECTRICITY_RATE_PER_UNIT);
  const petrolEquivalent = Math.round((monthlyKm / fuelKmPerL) * FUEL_RATE_PER_LITRE);
  const chargeCost = Math.round(vehicle.batteryCapacityKwh * ELECTRICITY_RATE_PER_UNIT);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return [
    {
      id: "running-cost",
      title: "Running Cost",
      summary: `Calculated at ${dailyKm} km/day and ₹${ELECTRICITY_RATE_PER_UNIT}/unit, against a comparable petrol/diesel ${fuelLabel} at ${fuelKmPerL} km/l and ₹${FUEL_RATE_PER_LITRE}/litre.`,
      rows: [
        { label: "Monthly electricity cost", value: inr(electricityCost) },
        { label: "Equivalent fuel cost", value: inr(petrolEquivalent) },
        { label: "Monthly saving", value: inr(petrolEquivalent - electricityCost) },
      ],
    },
    {
      id: "charging-cost",
      title: "Charging Cost",
      summary: `A full ${vehicle.batteryCapacityKwh} kWh home/depot charge at ₹${ELECTRICITY_RATE_PER_UNIT}/unit, spread over the ${vehicle.rangeKm} km claimed range.`,
      rows: [
        { label: `Cost per full charge (₹${ELECTRICITY_RATE_PER_UNIT}/unit)`, value: inr(chargeCost) },
        { label: "Cost per km", value: `₹${(chargeCost / vehicle.rangeKm).toFixed(2)}` },
      ],
    },
    {
      id: "subsidy",
      title: "Subsidy Calculator",
      summary: "Confirm eligibility and amount with your state EV policy.",
      rows: [],
    },
  ];
}

export function toVehicleDetail(vehicle: Vehicle): VehicleDetail {
  const specs = vehicle.specs;
  // Sourced only — absent for every vehicle whose OEM figure hasn't been
  // researched yet. Previously `chargingTimeSlowHr * 60 * 0.4`.
  const fastChargeMinutes = vehicle.chargingTimeFastMin;
  const related = getRelatedVehicles(vehicle);

  return {
    id: vehicle.id,
    category: vehicle.category,
    brand: vehicle.oemName,
    brandSlug: vehicle.oem,
    name: vehicle.modelName,
    slug: vehicle.slug,
    sourceVehicle: vehicle,
    oemColor: getOemBySlug(vehicle.oem)?.color ?? "#1FA83C",
    startingPrice: Math.round(vehicle.priceRangeLakh[0] * 100000),
    priceRangeLakh: vehicle.priceRangeLakh,
    overview: vehicle.description,
    quickSpecs: {
      rangeKm: vehicle.rangeKm,
      batteryKwh: vehicle.batteryCapacityKwh,
      // Previously batteryKwh × a per-category multiplier, presented as the
      // vehicle's real output. Sourced only now.
      powerKw: specs?.motor?.peakPowerKw,
      torqueNm: specs?.motor?.peakTorqueNm,
      fastChargeMinutes,
      fastChargeFromPct: 10,
      fastChargeToPct: 80,
      // Previously a flat 8yr/160k for every car, 3yr/40k for every
      // 2-wheeler, regardless of what the manufacturer actually offers.
      warrantyYears: specs?.warranty?.vehicleYears,
      warrantyKm: specs?.warranty?.vehicleKm,
    },
    variants: toVariants(vehicle),
    colors: vehicle.colors.map((name, i) => ({ id: `c${i + 1}`, name, hex: colorNameToHex(name) })),
    battery: {
      capacityKwh: vehicle.batteryCapacityKwh,
      araiRangeKm: vehicle.rangeKm,
      // Previously "LFP Blade Battery" for BYD and "NMC" for literally every
      // other vehicle on the site.
      chemistry: specs?.batteryChemistry,
    },
    charging: {
      dcFastChargeMinutes: fastChargeMinutes,
      dcFastChargeFromPct: 10,
      dcFastChargeToPct: 80,
      acHomeChargeHours: vehicle.chargingTimeSlowHr,
      // Previously assumed CCS2 for all cars and "Type 2 (proprietary)" for
      // all 2-/3-wheelers.
      connectorType: specs?.chargingExtra?.connectorType,
    },
    bodySpecs: bodySpecsFor(vehicle),
    realWorldRange: {
      araiKm: vehicle.rangeKm,
      cityKm: Math.round(vehicle.rangeKm * REAL_WORLD_RANGE_FACTORS.city),
      highwayKm: Math.round(vehicle.rangeKm * REAL_WORLD_RANGE_FACTORS.highway),
      mixedKm: Math.round(vehicle.rangeKm * REAL_WORLD_RANGE_FACTORS.mixed),
      factors: REAL_WORLD_RANGE_FACTORS,
    },
    ownershipTools: ownershipTools(vehicle),
    features: toFeatures(vehicle),
    faqs: toFaqs(vehicle, fastChargeMinutes),
    similarSlugs: related.map((v) => v.slug),
  };
}

/** Resolve a vehicle's similarSlugs back into full VehicleDetail records. */
export function getSimilarVehicleDetails(vehicle: VehicleDetail): VehicleDetail[] {
  return vehicle.similarSlugs
    .map((slug) => getVehicleBySlug(slug))
    .filter((v): v is Vehicle => Boolean(v))
    .map(toVehicleDetail);
}

/** Route to a vehicle's detail page — driven by the category registry, not a hardcoded ternary. */
export function vehicleDetailHref(vehicle: VehicleDetail): string {
  return `/${routeSegmentFor(vehicle.category)}/${vehicle.slug}`;
}
