import type { VehicleDetail } from "@/types/vehicle-detail";
import type { Vehicle } from "@/types/vehicle";
import {
  VDP_ADS,
  VDP_DAILY_DISTANCE,
  VDP_SHOTS,
  VDP_TABS,
  VDP_VIDEO_SLOTS,
  vdpSections,
} from "./chrome";
import type {
  BodyShape,
  CompareColumn,
  SimilarVehicle,
  SpecDefinition,
  VdpViewModel,
} from "./types";

/**
 * Maps the catalogue-shaped `VehicleDetail` onto the page-shaped
 * `VdpViewModel`. This is the only place the two vocabularies meet, and the
 * only reason the same component tree can render a hatchback, a scooter and a
 * cargo three-wheeler.
 *
 * **The honesty rule applies throughout** (CLAUDE.md #22). Specs coverage is
 * partial — 65 of 123 vehicles carry `Vehicle.specs` — so most vehicles reach
 * this function with power, torque, boot space and chemistry all `undefined`.
 * Every one of those becomes a row flagged `unpublished`, rendered muted as
 * "Not published". Nothing here derives a figure from another figure.
 *
 * Must be called from a Server Component: it is handed `similar` by the route,
 * which resolves it through `@/lib/data` (never importable from a client
 * component — CLAUDE.md #23).
 */

/**
 * Catalogue body type → silhouette. Deliberately lossy: `sedan` and `muv` take
 * the shapes closest to them rather than getting drawings of their own, since
 * these are generic category art, not model likenesses.
 */
function shapeFor(vehicle: Vehicle): BodyShape {
  if (vehicle.twoWheelerType === "scooter") return "scooter";
  if (vehicle.twoWheelerType === "motorcycle") return "motorcycle";

  switch (vehicle.commercialType) {
    case "three-wheeler-cargo":
    case "three-wheeler-passenger":
      return "three-wheeler";
    case "small-truck":
    case "van":
    case "bus":
      return "van";
  }

  switch (vehicle.bodyType) {
    case "hatchback":
      return "hatch";
    case "sedan":
      return "coupe";
    case "muv":
    case "suv":
      return "suv";
  }

  // A record with no sub-type recorded. A car silhouette is the safest
  // default for the car-dominant catalogue, and the page never claims the
  // drawing is a likeness anyway.
  return vehicle.category === "2-wheeler" ? "scooter" : "suv";
}

/** Plural noun for the category, used in section copy. */
function categoryNoun(vehicle: VehicleDetail): string {
  switch (vehicle.category) {
    case "2-wheeler":
      return "two-wheelers";
    case "commercial":
      return "commercial EVs";
    default:
      return "cars";
  }
}

/** Hours → "8 hr 30 min", the label the charging bar prints. */
function formatHours(hours: number): string {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  if (whole === 0) return `${minutes} min`;
  return minutes === 0 ? `${whole} hr` : `${whole} hr ${minutes} min`;
}

/**
 * The hero pills. Facts from the catalogue record — never a marketing claim.
 *
 * The approved prototype's first pill read "Best seller", which nothing in the
 * catalogue backs. Writing it here would assert it of all 123 vehicles, so the
 * highlighted slot carries a real signal instead: "New Launch" where
 * `launchStatus` says so, otherwise the body type. The pill treatment is the
 * approved one; only the words are sourced.
 */
function badgesFor(vehicle: VehicleDetail): string[] {
  const badges: string[] = [];
  if (vehicle.sourceVehicle.launchStatus === "just-launched") badges.push("New Launch");
  if (vehicle.bodySpecs.bodyType) badges.push(vehicle.bodySpecs.bodyType);
  if (vehicle.bodySpecs.seatingCapacity) badges.push(vehicle.bodySpecs.seatingCapacity);
  if (vehicle.charging.connectorType) badges.push(vehicle.charging.connectorType);
  if (vehicle.variants.length > 0) {
    badges.push(
      `${vehicle.variants.length} ${vehicle.variants.length === 1 ? "variant" : "variants"}`,
    );
  }
  return badges;
}

/**
 * The eight-figure glance grid. Range and battery track the selected variant;
 * the rest are fixed, and any the maker has not published are dropped rather
 * than shown as a gap — the full spec sheet below carries those.
 */
function glanceFor(vehicle: VehicleDetail): SpecDefinition[] {
  const rows: SpecDefinition[] = [
    { label: "Range", from: "range" },
    { label: "Battery", from: "battery" },
  ];
  if (vehicle.quickSpecs.powerKw) rows.push({ label: "Power", value: `${vehicle.quickSpecs.powerKw} kW` });
  if (vehicle.quickSpecs.torqueNm) rows.push({ label: "Torque", value: `${vehicle.quickSpecs.torqueNm} Nm` });
  if (vehicle.bodySpecs.bodyType) rows.push({ label: "Body type", value: vehicle.bodySpecs.bodyType });
  if (vehicle.bodySpecs.seatingCapacity) {
    rows.push({ label: "Seating", value: vehicle.bodySpecs.seatingCapacity });
  }
  if (vehicle.bodySpecs.bootSpaceLiters) {
    rows.push({ label: "Boot", value: `${vehicle.bodySpecs.bootSpaceLiters} L` });
  }
  if (vehicle.charging.connectorType) {
    rows.push({ label: "Charging port", value: vehicle.charging.connectorType });
  }
  return rows;
}

/**
 * The full spec sheet. Unlike the glance grid this keeps unsourced rows and
 * marks them, because "we don't publish this" is itself information on a spec
 * sheet — and hiding the row would make the sheet look complete when it isn't.
 */
function specSheetFor(vehicle: VehicleDetail): SpecDefinition[] {
  const unknown = (label: string): SpecDefinition => ({
    label,
    value: "Not published",
    unpublished: true,
  });

  return [
    vehicle.bodySpecs.bodyType
      ? { label: "Body type", value: vehicle.bodySpecs.bodyType }
      : unknown("Body type"),
    ...(vehicle.bodySpecs.seatingCapacity
      ? [{ label: "Seating", value: vehicle.bodySpecs.seatingCapacity } as SpecDefinition]
      : []),
    vehicle.bodySpecs.driveType
      ? { label: "Drive type", value: vehicle.bodySpecs.driveType }
      : unknown("Drive type"),
    ...(vehicle.category === "car"
      ? [
          vehicle.bodySpecs.bootSpaceLiters
            ? ({
                label: "Boot space",
                value: `${vehicle.bodySpecs.bootSpaceLiters} litres`,
              } as SpecDefinition)
            : unknown("Boot space"),
        ]
      : []),
    { label: "Battery, gross", from: "battery" },
    { label: "Claimed range", from: "range" },
    vehicle.quickSpecs.powerKw
      ? { label: "Peak power", value: `${vehicle.quickSpecs.powerKw} kW` }
      : unknown("Peak power"),
    vehicle.quickSpecs.torqueNm
      ? { label: "Peak torque", value: `${vehicle.quickSpecs.torqueNm} Nm` }
      : unknown("Peak torque"),
    vehicle.charging.connectorType
      ? { label: "Charging port", value: vehicle.charging.connectorType }
      : unknown("Charging port"),
    {
      label: "AC home charge",
      value: `${formatHours(vehicle.charging.acHomeChargeHours)}, empty to full`,
    },
    { label: "DC fast charge", from: "dcFastCharge" },
    vehicle.quickSpecs.warrantyYears && vehicle.quickSpecs.warrantyKm
      ? {
          label: "Battery warranty",
          value: `${vehicle.quickSpecs.warrantyYears} yr / ${vehicle.quickSpecs.warrantyKm.toLocaleString("en-IN")} km`,
        }
      : unknown("Battery warranty"),
  ];
}

function similarFor(similar: VehicleDetail[]): SimilarVehicle[] {
  return similar.map((entry) => ({
    id: entry.slug,
    brand: entry.brand,
    name: entry.name,
    price: entry.startingPrice,
    priceBasis: "onwards, ex-showroom",
    summary: `${entry.quickSpecs.rangeKm} km · ${entry.quickSpecs.batteryKwh} kWh`,
    shape: shapeFor(entry.sourceVehicle),
    hex: entry.oemColor,
  }));
}

/**
 * Comparison columns. The first is this vehicle, whose rows are filled from
 * the live configuration so switching variant restates the comparison; the
 * rest are its two closest rivals at their starting trim.
 */
/** Driver assistance, sourced only — never inferred from trim names. */
function adasFor(vehicle: VehicleDetail): string {
  return vehicle.sourceVehicle.specs?.safety?.adas ? "ADAS" : "Not published";
}

/**
 * Comparison columns, exactly the five rows the approved design carries.
 *
 * Every column's on-road price is resolved at render time from its own
 * ex-showroom against the reader's city, so the three figures are quoted on
 * the same basis — the row label carries `{city}` for the same reason. The
 * first column is this vehicle, and its rows follow the live configuration so
 * switching variant restates the comparison.
 */
function compareFor(vehicle: VehicleDetail, rivals: VehicleDetail[]): CompareColumn[] {
  const self: CompareColumn = {
    id: vehicle.slug,
    name: vehicle.name,
    brand: vehicle.brand,
    shape: shapeFor(vehicle.sourceVehicle),
    hex: vehicle.oemColor,
    self: true,
    rows: [
      { label: "On-road, {city}", value: { live: "onRoad" } },
      { label: "Claimed range", value: { live: "range" } },
      { label: "Battery", value: { live: "battery" } },
      {
        label: "Power",
        value: vehicle.quickSpecs.powerKw ? `${vehicle.quickSpecs.powerKw} kW` : "Not published",
      },
      { label: "Driver assistance", value: adasFor(vehicle) },
    ],
  };

  const others = rivals.map((rival) => ({
    id: rival.slug,
    name: rival.name,
    brand: rival.brand,
    shape: shapeFor(rival.sourceVehicle),
    hex: rival.oemColor,
    exShowroom: rival.startingPrice,
    rows: [
      { label: "On-road, {city}", value: { live: "onRoad" as const } },
      { label: "Claimed range", value: `${rival.quickSpecs.rangeKm} km` },
      { label: "Battery", value: `${rival.quickSpecs.batteryKwh} kWh` },
      {
        label: "Power",
        value: rival.quickSpecs.powerKw ? `${rival.quickSpecs.powerKw} kW` : "Not published",
      },
      { label: "Driver assistance", value: adasFor(rival) },
    ],
  }));

  return [self, ...others];
}

export function buildVdpViewModel(
  vehicle: VehicleDetail,
  similar: VehicleDetail[],
): VdpViewModel {
  const noun = categoryNoun(vehicle);
  const staticQuickSpecs: { label: string; value: string; unit: string }[] = [];
  if (vehicle.quickSpecs.powerKw) {
    staticQuickSpecs.push({ label: "Power", value: String(vehicle.quickSpecs.powerKw), unit: "kW" });
  }
  if (vehicle.bodySpecs.bootSpaceLiters) {
    staticQuickSpecs.push({
      label: "Boot",
      value: String(vehicle.bodySpecs.bootSpaceLiters),
      unit: "L",
    });
  }

  return {
    slug: vehicle.slug,
    category: vehicle.category,
    brand: vehicle.brand,
    name: vehicle.name,
    bodyType: vehicle.bodySpecs.bodyType,
    shape: shapeFor(vehicle.sourceVehicle),
    statement: vehicle.sourceVehicle.description,
    badges: badgesFor(vehicle),
    overview: vehicle.overview,

    variants: vehicle.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      batteryKwh: variant.batteryKwh,
      rangeKm: variant.rangeKm,
      exShowroom: variant.price,
      // Charge time is published per model, not per variant, so every variant
      // carries the model's figure — or null where none is published.
      dcFastChargeMinutes: vehicle.charging.dcFastChargeMinutes ?? null,
      recommended: variant.isRecommended,
    })),

    colours: vehicle.colors,
    shots: VDP_SHOTS,
    staticQuickSpecs,
    atAGlance: glanceFor(vehicle),
    specSheet: specSheetFor(vehicle),
    ads: VDP_ADS,
    acChargeTime: formatHours(vehicle.charging.acHomeChargeHours),
    acChargeMinutes: Math.round(vehicle.charging.acHomeChargeHours * 60),
    chargingPort: vehicle.charging.connectorType ?? "Not published",
    batteryChemistry: vehicle.battery.chemistry ?? null,
    features: vehicle.features.map((f) => ({ category: f.category, label: f.label })),
    videos: VDP_VIDEO_SLOTS,

    // An empty structure, not invented praise. The shape is what a real review
    // will fill; the counts stay at zero until one exists.
    reviews: {
      averageRating: null,
      totalRatings: 0,
      histogram: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 })),
      placeholderFields: {
        heading: "Owner name · verified purchase · months owned",
        meta: "Rating · variant · city",
      },
    },

    faqs: vehicle.faqs,
    compare: compareFor(vehicle, similar.slice(0, 2)),
    similar: similarFor(similar.slice(0, 4)),
    realWorldRange: vehicle.realWorldRange,
    dailyDistance: VDP_DAILY_DISTANCE,
    tabs: VDP_TABS,
    sections: vdpSections(vehicle.name, noun, vehicle.charging.connectorType ?? null),
  };
}
