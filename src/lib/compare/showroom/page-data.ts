import { getCurrentVehiclesByCategory, getRelatedVehicles } from "@/lib/data";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { DEFAULT_CITY } from "@/lib/data/cities";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { buildCompareSlug, SHOWROOM_MAX_COMPARE } from "@/lib/compare/slug";
import type { Vehicle } from "@/types/vehicle";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { slotColor } from "./palette";
import { defaultOwnershipSettings } from "./ownership";
import { showroomFaqs, type Faq } from "./verdicts";
import type { ShowroomVehicle } from "./metrics";
import type { ShapeSubject } from "./shape";

/**
 * Server-side assembly for the showroom Compare page. **Server-only** — it
 * reads the catalogue. The client receives the compared vehicles' details
 * plus two lightweight lists (picker candidates, popular comparisons) rather
 * than the catalogue itself, so this page does not need the CLAUDE.md #23
 * exception the current Compare page relies on.
 */

/** What the add/change picker needs per vehicle — nothing more. */
export interface PickerCandidate extends ShapeSubject {
  slug: string;
  name: string;
  oemName: string;
  priceRangeLakh: [number, number];
  rangeKm: number;
  batteryKwh: number;
  dimensions?: { lengthMm?: number; heightMm?: number; wheelbaseMm?: number; groundClearanceMm?: number };
}

export interface PopularComparison {
  slug: string;
  vehicles: PickerCandidate[];
}

export interface ShowroomPageData {
  vehicles: VehicleDetail[];
  candidates: PickerCandidate[];
  popular: PopularComparison[];
  /** Generated at the default city and default settings — the first paint. */
  faqs: Faq[];
}

function toCandidate(v: Vehicle): PickerCandidate {
  return {
    slug: v.slug,
    name: v.modelName,
    oemName: v.oemName,
    category: v.category,
    bodyType: v.bodyType,
    twoWheelerType: v.twoWheelerType,
    commercialType: v.commercialType,
    priceRangeLakh: v.priceRangeLakh,
    rangeKm: v.rangeKm,
    batteryKwh: v.batteryCapacityKwh,
    dimensions: v.specs?.dimensions
      ? {
          lengthMm: v.specs.dimensions.lengthMm,
          heightMm: v.specs.dimensions.heightMm,
          wheelbaseMm: v.specs.dimensions.wheelbaseMm,
          groundClearanceMm: v.specs.dimensions.groundClearanceMm,
        }
      : undefined,
  };
}

/**
 * Up to four nearby comparisons, each pairing a compared vehicle with its
 * nearest current neighbour (same OEM first, then closest on price — the
 * existing `getRelatedVehicles` rule that also picks the pre-rendered set).
 * No "sponsored" or "most compared" labels: nothing here records either.
 */
function popularFor(vehicles: Vehicle[]): PopularComparison[] {
  const current = new Set(vehicles.map((v) => v.slug));
  const seen = new Set<string>();
  const out: PopularComparison[] = [];
  const related = vehicles.map((v) => getRelatedVehicles(v, 4).filter((r) => !current.has(r.slug)));
  for (let depth = 0; depth < 4 && out.length < 4; depth++) {
    vehicles.forEach((v, i) => {
      const other = related[i][depth];
      if (!other || out.length >= 4) return;
      const key = [v.slug, other.slug].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ slug: buildCompareSlug([v, other], SHOWROOM_MAX_COMPARE), vehicles: [toCandidate(v), toCandidate(other)] });
    });
  }
  return out;
}

export function buildShowroomPageData(vehicles: Vehicle[]): ShowroomPageData {
  const details = vehicles.map(toVehicleDetail);
  const category = vehicles[0].category;
  const settings = defaultOwnershipSettings(category);
  const showroom: ShowroomVehicle[] = details.map((detail, index) => ({
    detail,
    index,
    color: slotColor(index),
    onRoad: getVehiclePricingSnapshot({
      vehicleId: detail.id,
      vehicleName: detail.name,
      exShowroomRangeLakh: detail.priceRangeLakh,
      city: DEFAULT_CITY,
    }).breakdown.low.onRoad,
  }));

  return {
    vehicles: details,
    candidates: getCurrentVehiclesByCategory(category).map(toCandidate),
    popular: popularFor(vehicles),
    faqs: showroomFaqs(showroom, settings, DEFAULT_CITY.name),
  };
}
