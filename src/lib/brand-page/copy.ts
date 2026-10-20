import { compareBy, launchSortKey, SORT_OPTIONS, type SortKey } from "@/lib/cars-listing/filters";
import { featuredRank } from "@/lib/cars-listing/featured";
import { paintFrom, swatchFor, type Paint } from "@/lib/cars-listing/paint";
import type { PricedCar } from "@/lib/cars-listing/types";

/**
 * What the brand page derives from a brand's cars — sort options and the
 * line-up drawn in the hero. Everything is computed from the cars it
 * is given; nothing is a claim about the brand that the catalogue does not
 * hold. Data-free and client-safe.
 */

/** The approved design's sort menu — a subset of the listing's, with the listing's labels and comparators. */
export const BRAND_SORT_KEYS = ["price-asc", "price-desc", "range", "dc", "new"] as const satisfies readonly SortKey[];
export type BrandSortKey = (typeof BRAND_SORT_KEYS)[number];
export const DEFAULT_BRAND_SORT: BrandSortKey = "price-asc";

export const BRAND_SORT_OPTIONS = BRAND_SORT_KEYS.map((value) => ({
  value,
  label: SORT_OPTIONS.find((o) => o.value === value)!.label,
}));

export function parseBrandSort(value: string | string[] | undefined): BrandSortKey {
  const v = Array.isArray(value) ? value[0] : value;
  return (BRAND_SORT_KEYS as readonly string[]).includes(v ?? "") ? (v as BrandSortKey) : DEFAULT_BRAND_SORT;
}

export function sortBrandCars(cars: readonly PricedCar[], sort: BrandSortKey): PricedCar[] {
  return [...cars].sort(compareBy(sort, featuredRank));
}

export type StagePosition = "back" | "mid" | "front";

export interface StageCar {
  car: PricedCar;
  position: StagePosition;
  /** Swatch of the catalogue colour the car is drawn in. */
  swatch: string;
  paint: Paint;
}

const NEUTRAL_SWATCHES = new Set(["#1F2227", "#E6E8EB", "#8A9099"]);

/**
 * Up to three cars for the hero line-up, as the approved design picks them:
 * the newest on-sale model in front, the site's best-known one (the editorial
 * featured order) in the middle, the flagship (highest price) at the back.
 * No car appears twice; a brand with fewer cars draws fewer.
 *
 * Each car is drawn in one of its own catalogue colours — the first colourful
 * one not already taken by a car in front of it, so a line-up that all lists
 * the same red first still reads as three different cars.
 */
export function lineup(cars: readonly PricedCar[]): StageCar[] {
  const used = new Set<string>();
  const take = (list: readonly PricedCar[]) => {
    const car = list.find((c) => !used.has(c.slug));
    if (car) used.add(car.slug);
    return car;
  };
  const onSale = cars.filter((c) => c.status !== "upcoming");
  const front = take([...onSale].sort((a, b) => launchSortKey(b.launchDate) - launchSortKey(a.launchDate)));
  const mid = take([...cars].sort((a, b) => featuredRank(a.slug) - featuredRank(b.slug) || a.price[0] - b.price[0]));
  const back = take([...cars].sort((a, b) => b.price[0] - a.price[0]));
  const taken = new Set<string>();
  const swatchOf = (colors: readonly string[]) => {
    const swatches = colors.map(swatchFor);
    const pick =
      swatches.find((h) => !NEUTRAL_SWATCHES.has(h) && !taken.has(h)) ??
      swatches.find((h) => !taken.has(h)) ??
      swatches.find((h) => !NEUTRAL_SWATCHES.has(h)) ??
      swatches[0] ??
      "#8A9099";
    taken.add(pick);
    return pick;
  };
  // Colours are chosen front to back, so the car nearest the viewer keeps its own first colour.
  const picked = (
    [
      [front, "front"],
      [mid, "mid"],
      [back, "back"],
    ] as const
  )
    .filter((x): x is readonly [PricedCar, StagePosition] => x[0] !== undefined)
    .map(([car, position]) => {
      const swatch = swatchOf(car.colors);
      return { car, position, swatch, paint: paintFrom(swatch) };
    });
  // Drawn back to front so nearer cars overlap the ones behind.
  return picked.reverse();
}
