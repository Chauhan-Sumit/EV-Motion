import type { Vehicle } from "@/types/vehicle";
import type {
  VdpBodySpecs,
  VdpFaq,
  VdpFeature,
  VdpOwnershipTool,
  VdpVariant,
  VehicleDetail,
} from "@/types/vehicle-detail";
import { getOemBySlug, getRelatedVehicles, getVehicleBySlug } from "@/lib/data";
import { estimateEmi, priceLabel } from "./derive";

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
  [/seat|sunroof|storage|charging port|usb|sound|comfort|boot/i, "Comfort"],
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

function powerKwFor(vehicle: Vehicle): number {
  const multiplier = vehicle.category === "car" ? 2.3 : 2.0;
  return Math.round(vehicle.batteryCapacityKwh * multiplier * 10) / 10;
}

function torqueNmFor(vehicle: Vehicle, powerKw: number): number {
  const multiplier = vehicle.category === "car" ? 2.0 : 4.0;
  return Math.round(powerKw * multiplier);
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
};

const BODY_TYPE_LABEL: Record<string, string> = {
  hatchback: "Hatchback",
  suv: "SUV",
  sedan: "Sedan",
  muv: "MUV",
  scooter: "Scooter",
  motorcycle: "Motorcycle",
};

function bodySpecsFor(vehicle: Vehicle): VdpBodySpecs {
  const isCar = vehicle.category === "car";
  const bodyKey = (isCar ? vehicle.bodyType : vehicle.twoWheelerType) ?? "suv";
  const hasAwdVariant = vehicle.variants.some((v) => /awd/i.test(v.name));

  return {
    bodyType: BODY_TYPE_LABEL[bodyKey] ?? bodyKey,
    seatingCapacity: isCar ? `${vehicle.seatingCapacity ?? 5} Seater` : "2 Rider",
    driveType: isCar ? (hasAwdVariant ? "AWD" : "FWD") : "Hub Motor (FWD)",
    bootSpaceLiters: BOOT_SPACE_BY_BODY_TYPE[bodyKey] ?? (isCar ? 350 : 25),
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

function ownershipTools(vehicle: Vehicle): VdpOwnershipTool[] {
  const price = Math.round(vehicle.priceRangeLakh[0] * 100000);
  const isCar = vehicle.category === "car";
  const dailyKm = isCar ? 40 : 25;
  const monthlyKm = dailyKm * 30;
  const unitsPerMonth = (monthlyKm / vehicle.rangeKm) * vehicle.batteryCapacityKwh;
  const electricityCost = Math.round(unitsPerMonth * 8);
  const petrolEquivalent = Math.round((monthlyKm / (isCar ? 15 : 45)) * 105);
  const chargeCost = Math.round(vehicle.batteryCapacityKwh * 8);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return [
    {
      id: "running-cost",
      title: "Running Cost",
      summary: `Estimated at ${dailyKm} km/day, ₹8/unit, vs. a comparable petrol ${isCar ? "car" : "scooter"} at ${isCar ? 15 : 45} km/l.`,
      rows: [
        { label: "Monthly electricity cost", value: inr(electricityCost) },
        { label: "Equivalent petrol cost", value: inr(petrolEquivalent) },
        { label: "Estimated monthly saving", value: inr(petrolEquivalent - electricityCost) },
      ],
    },
    {
      id: "charging-cost",
      title: "Charging Cost",
      summary: `A full home charge costs approximately ${inr(chargeCost)}.`,
      rows: [
        { label: "Cost per full charge (home, ₹8/unit)", value: inr(chargeCost) },
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
        { label: "6 months ago (est.)", value: inr(Math.round(price * (isCar ? 1.03 : 1.05))) },
      ],
    },
    {
      id: "subsidy",
      title: "Subsidy Calculator",
      summary: "Estimated only — confirm eligibility and amount with your state EV policy.",
      rows: isCar
        ? [
            { label: "State subsidy (varies by state)", value: "Up to ₹1,50,000 in some states" },
            { label: "Road tax / registration waiver", value: "Often 100% in EV-friendly states" },
          ]
        : [
            { label: "State subsidy (varies by state)", value: "Up to ₹30,000 in some states" },
            { label: "Registration waiver", value: "Often 100% in EV-friendly states" },
          ],
    },
  ];
}

export function toVehicleDetail(vehicle: Vehicle): VehicleDetail {
  const powerKw = powerKwFor(vehicle);
  const fastChargeMinutes = fastChargeMinutesFor(vehicle);
  const related = getRelatedVehicles(vehicle);

  return {
    id: vehicle.id,
    category: vehicle.category === "car" ? "cars" : "scooters",
    kind: vehicle.category === "car" ? "car" : "bike",
    brand: vehicle.oemName,
    brandSlug: vehicle.oem,
    name: vehicle.modelName,
    slug: vehicle.slug,
    sourceVehicle: vehicle,
    oemColor: getOemBySlug(vehicle.oem)?.color ?? "#1FA83C",
    priceLabel: priceLabel(vehicle),
    startingPrice: Math.round(vehicle.priceRangeLakh[0] * 100000),
    emiLabel: `EMI ₹${Math.round(estimateEmi(vehicle)).toLocaleString("en-IN")}/mo`,
    overview: vehicle.description,
    quickSpecs: {
      rangeKm: vehicle.rangeKm,
      batteryKwh: vehicle.batteryCapacityKwh,
      powerKw,
      torqueNm: torqueNmFor(vehicle, powerKw),
      fastChargeMinutes,
      fastChargeFromPct: 10,
      fastChargeToPct: 80,
      warrantyYears: vehicle.category === "car" ? 8 : 3,
      warrantyKm: vehicle.category === "car" ? 160000 : 40000,
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
      connectorType: vehicle.category === "car" ? "CCS2" : "Type 2 (proprietary)",
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

/** Route to a vehicle's detail page, matching our flat `/cars/[slug]` / `/two-wheelers/[slug]` shape. */
export function vehicleDetailHref(vehicle: VehicleDetail): string {
  return `${vehicle.category === "cars" ? "/cars" : "/two-wheelers"}/${vehicle.slug}`;
}
