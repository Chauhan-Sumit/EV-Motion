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
 * Fields our Vehicle data doesn't model (power/torque, colour hex, warranty,
 * ownership-tool costs, FAQs) are derived here from what we do have — battery
 * size, range, price — the same way the template's own vehicle-detail.ts
 * derives ownership-tool costs from price/battery/range. Clearly a computed
 * approximation, consistent with this already being a labeled demo project.
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

function chemistryFor(vehicle: Vehicle): string {
  return vehicle.oem === "byd" ? "LFP Blade Battery" : "NMC (Nickel Manganese Cobalt)";
}

const POWER_MULTIPLIER: Record<VehicleCategory, number> = { car: 2.3, "2-wheeler": 2.0, commercial: 1.5 };
const TORQUE_MULTIPLIER: Record<VehicleCategory, number> = { car: 2.0, "2-wheeler": 4.0, commercial: 3.0 };

function powerKwFor(vehicle: Vehicle): number {
  return Math.round(vehicle.batteryCapacityKwh * POWER_MULTIPLIER[vehicle.category] * 10) / 10;
}

function torqueNmFor(vehicle: Vehicle, powerKw: number): number {
  return Math.round(powerKw * TORQUE_MULTIPLIER[vehicle.category]);
}

function fastChargeMinutesFor(vehicle: Vehicle): number {
  return vehicle.chargingTimeFastMin ?? Math.round(vehicle.chargingTimeSlowHr * 60 * 0.4);
}

const BOOT_SPACE_BY_BODY_TYPE: Record<string, number> = {
  hatchback: 300,
  suv: 400,
  sedan: 450,
  muv: 500,
  scooter: 30,
  motorcycle: 15,
  "three-wheeler-cargo": 550,
  "three-wheeler-passenger": 0,
  "small-truck": 1200,
  van: 4000,
  bus: 0,
};

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

function bodySpecsFor(vehicle: Vehicle): VdpBodySpecs {
  const bodyKey =
    (vehicle.category === "car"
      ? vehicle.bodyType
      : vehicle.category === "2-wheeler"
        ? vehicle.twoWheelerType
        : vehicle.commercialType) ?? "suv";
  const hasAwdVariant = vehicle.variants.some((v) => /awd/i.test(v.name));

  let seatingCapacity: string;
  let driveType: string;
  if (vehicle.category === "car") {
    seatingCapacity = `${vehicle.seatingCapacity ?? 5} Seater`;
    driveType = hasAwdVariant ? "AWD" : "FWD";
  } else if (vehicle.category === "2-wheeler") {
    seatingCapacity = "2 Rider";
    driveType = "Hub Motor (FWD)";
  } else {
    seatingCapacity = vehicle.seatingCapacity ? `${vehicle.seatingCapacity} Seater` : "Driver + Cargo";
    driveType = "Rear Hub Motor (RWD)";
  }

  return {
    bodyType: BODY_TYPE_LABEL[bodyKey] ?? bodyKey,
    seatingCapacity,
    driveType,
    bootSpaceLiters: BOOT_SPACE_BY_BODY_TYPE[bodyKey] ?? (vehicle.category === "car" ? 350 : 25),
    connectedCar: true,
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

function toFaqs(vehicle: Vehicle, fastChargeMinutes: number): VdpFaq[] {
  const faqs: VdpFaq[] = [
    {
      id: "q1",
      question: `What is the claimed range of the ${vehicle.modelName}?`,
      answer: `${vehicle.rangeKm} km on a full charge, as claimed by ${vehicle.oemName}.`,
    },
    {
      id: "q2",
      question: "How long does it take to fast charge?",
      answer: `About ${fastChargeMinutes} minutes on a compatible fast charger (10-80%). A standard home charger takes roughly ${vehicle.chargingTimeSlowHr} hours for a full charge.`,
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

function ownershipTools(vehicle: Vehicle): VdpOwnershipTool[] {
  const price = Math.round(vehicle.priceRangeLakh[0] * 100000);
  const { dailyKm, fuelKmPerL, fuelLabel } = OWNERSHIP_ASSUMPTIONS[vehicle.category];
  const monthlyKm = dailyKm * 30;
  const unitsPerMonth = (monthlyKm / vehicle.rangeKm) * vehicle.batteryCapacityKwh;
  const electricityCost = Math.round(unitsPerMonth * 8);
  const petrolEquivalent = Math.round((monthlyKm / fuelKmPerL) * 105);
  const chargeCost = Math.round(vehicle.batteryCapacityKwh * 8);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const priceDriftMultiplier = vehicle.category === "car" ? 1.03 : vehicle.category === "2-wheeler" ? 1.05 : 1.02;

  const subsidyRows: Record<VehicleCategory, { label: string; value: string }[]> = {
    car: [
      { label: "State subsidy (varies by state)", value: "Up to ₹1,50,000 in some states" },
      { label: "Road tax / registration waiver", value: "Often 100% in EV-friendly states" },
    ],
    "2-wheeler": [
      { label: "State subsidy (varies by state)", value: "Up to ₹30,000 in some states" },
      { label: "Registration waiver", value: "Often 100% in EV-friendly states" },
    ],
    commercial: [
      { label: "FAME-II / PM E-DRIVE incentive (varies)", value: "Applicable on many commercial EV categories" },
      { label: "Permit / road tax waiver", value: "Often reduced or waived in EV-friendly states" },
    ],
  };

  return [
    {
      id: "running-cost",
      title: "Running Cost",
      summary: `Estimated at ${dailyKm} km/day, ₹8/unit, vs. a comparable diesel/petrol ${fuelLabel} at ${fuelKmPerL} km/l.`,
      rows: [
        { label: "Monthly electricity cost", value: inr(electricityCost) },
        { label: "Equivalent fuel cost", value: inr(petrolEquivalent) },
        { label: "Estimated monthly saving", value: inr(petrolEquivalent - electricityCost) },
      ],
    },
    {
      id: "charging-cost",
      title: "Charging Cost",
      summary: `A full home/depot charge costs approximately ${inr(chargeCost)}.`,
      rows: [
        { label: "Cost per full charge (₹8/unit)", value: inr(chargeCost) },
        { label: "Cost per km", value: `₹${(chargeCost / vehicle.rangeKm).toFixed(2)}` },
      ],
    },
    {
      id: "price-history",
      title: "Price History",
      summary: "Ex-showroom price movement, estimated over the last 6 months.",
      rows: [
        { label: "Current price", value: inr(price) },
        { label: "3 months ago (est.)", value: inr(Math.round(price * 1.012)) },
        { label: "6 months ago (est.)", value: inr(Math.round(price * priceDriftMultiplier)) },
      ],
    },
    {
      id: "subsidy",
      title: "Subsidy Calculator",
      summary: "Estimated only — confirm eligibility and amount with your state EV policy.",
      rows: subsidyRows[vehicle.category],
    },
  ];
}

export function toVehicleDetail(vehicle: Vehicle): VehicleDetail {
  const powerKw = powerKwFor(vehicle);
  const fastChargeMinutes = fastChargeMinutesFor(vehicle);
  const related = getRelatedVehicles(vehicle);
  const isThreeWheeler =
    vehicle.commercialType === "three-wheeler-cargo" || vehicle.commercialType === "three-wheeler-passenger";

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
      powerKw,
      torqueNm: torqueNmFor(vehicle, powerKw),
      fastChargeMinutes,
      fastChargeFromPct: 10,
      fastChargeToPct: 80,
      warrantyYears: vehicle.category === "car" ? 8 : vehicle.category === "2-wheeler" ? 3 : 5,
      warrantyKm: vehicle.category === "car" ? 160000 : vehicle.category === "2-wheeler" ? 40000 : 100000,
    },
    variants: toVariants(vehicle),
    colors: vehicle.colors.map((name, i) => ({ id: `c${i + 1}`, name, hex: colorNameToHex(name) })),
    battery: {
      capacityKwh: vehicle.batteryCapacityKwh,
      araiRangeKm: vehicle.rangeKm,
      chemistry: chemistryFor(vehicle),
    },
    charging: {
      dcFastChargeMinutes: fastChargeMinutes,
      dcFastChargeFromPct: 10,
      dcFastChargeToPct: 80,
      acHomeChargeHours: vehicle.chargingTimeSlowHr,
      connectorType: vehicle.category === "2-wheeler" || isThreeWheeler ? "Type 2 (proprietary)" : "CCS2",
    },
    bodySpecs: bodySpecsFor(vehicle),
    realWorldRange: {
      araiKm: vehicle.rangeKm,
      cityKm: Math.round(vehicle.rangeKm * 0.78),
      highwayKm: Math.round(vehicle.rangeKm * 0.686),
      mixedKm: Math.round(vehicle.rangeKm * 0.732),
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
