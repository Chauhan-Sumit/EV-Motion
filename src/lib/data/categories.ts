import type { VehicleCategory } from "@/types/vehicle";

export interface CategoryConfig {
  key: VehicleCategory;
  /** URL segment — matches the top-level route folder for this category. */
  routeSegment: "cars" | "two-wheelers" | "commercial";
  label: string;
  pluralLabel: string;
  shortLabel: string;
}

/**
 * Single source of truth for "which vehicle categories exist." Every place
 * that used to hand-write a car/2-wheeler pair (brand pages, sitemap, compare
 * tabs, derive.ts's card builders) loops this instead, so adding a category
 * doesn't require touching N call sites.
 */
export const CATEGORIES: CategoryConfig[] = [
  { key: "car", routeSegment: "cars", label: "Electric Cars", pluralLabel: "EV Cars", shortLabel: "Cars" },
  {
    key: "2-wheeler",
    routeSegment: "two-wheelers",
    label: "Electric 2-Wheelers",
    pluralLabel: "Electric 2-Wheelers",
    shortLabel: "2-Wheelers",
  },
  {
    key: "commercial",
    routeSegment: "commercial",
    label: "Commercial EVs",
    pluralLabel: "Commercial EVs",
    shortLabel: "Commercial",
  },
];

export function categoryConfig(key: VehicleCategory): CategoryConfig {
  const found = CATEGORIES.find((c) => c.key === key);
  if (!found) throw new Error(`Unknown vehicle category: ${key}`);
  return found;
}

export function routeSegmentFor(key: VehicleCategory): string {
  return categoryConfig(key).routeSegment;
}
