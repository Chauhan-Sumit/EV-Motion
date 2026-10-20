import { compareBy as compareCars, launchSortKey, SORT_OPTIONS as CAR_SORT_OPTIONS, type SortKey as CarSortKey } from "@/lib/cars-listing/filters";
import { featuredRank as carFeaturedRank } from "@/lib/cars-listing/featured";
import { paintFrom, swatchFor, type Paint } from "@/lib/cars-listing/paint";
import type { PricedCar } from "@/lib/cars-listing/types";
import { compareBy as compareBikes, SORT_OPTIONS as BIKE_SORT_OPTIONS, type BikeSortKey } from "@/lib/two-wheelers-listing/filters";
import { featuredRank as bikeFeaturedRank } from "@/lib/two-wheelers-listing/featured";
import type { PricedBike } from "@/lib/two-wheelers-listing/types";
import type { TwoWheelerType } from "@/types/vehicle";

/**
 * What a brand page derives from a brand's line-up — headings, sort options
 * and the models drawn in the hero. Everything is computed from the vehicles
 * it is given; nothing is a claim about the brand that the catalogue does not
 * hold. Data-free and client-safe.
 */

/* ------------------------------------------------------------------ headings */

const TITLE: Record<string, string> = { cars: "Cars", scooters: "Scooters", motorcycles: "Motorcycles", "scooters & motorcycles": "Scooters & Motorcycles" };

/** What the brand sells, as a plural noun: cars, scooters, motorcycles, or both two-wheeler types. */
export function lineupNoun(kind: "car" | "2-wheeler", types: readonly TwoWheelerType[] = []): string {
  if (kind === "car") return "cars";
  const set = new Set(types);
  if (set.size === 1) return set.has("motorcycle") ? "motorcycles" : "scooters";
  return "scooters & motorcycles";
}

/**
 * The hero's second line ("electric cars") and the models heading ("MG Motor
 * Electric Cars"). A brand whose name already says it — "Ola Electric",
 * "PURE EV" — is not called electric twice.
 */
export function brandHeadings(name: string, noun: string): { heroLine: string; modelsHeading: string } {
  const saysElectric = /\b(electric|ev)\b/i.test(name);
  return {
    heroLine: saysElectric ? noun : `electric ${noun}`,
    modelsHeading: `${name} ${saysElectric ? "" : "Electric "}${TITLE[noun] ?? noun}`,
  };
}

/* ------------------------------------------------------------------ sorting */

export interface SortOption<K extends string> {
  value: K;
  label: string;
}

function sortConfig<K extends string>(keys: readonly K[], all: readonly { value: string; label: string }[]) {
  const options: SortOption<K>[] = keys.map((value) => ({ value, label: all.find((o) => o.value === value)!.label }));
  const parse = (value: string | string[] | null | undefined): K => {
    const v = Array.isArray(value) ? value[0] : value;
    return (keys as readonly string[]).includes(v ?? "") ? (v as K) : keys[0];
  };
  return { keys, options, defaultSort: keys[0], parse };
}

/** The approved design's sort menu for car brands — a subset of the Electric Cars listing's, with its labels and comparators. */
export const CAR_BRAND_SORT = sortConfig(["price-asc", "price-desc", "range", "dc", "new"] as const satisfies readonly CarSortKey[], CAR_SORT_OPTIONS);
export type CarBrandSortKey = (typeof CAR_BRAND_SORT.keys)[number];

/** The same menu for two-wheeler brands, on the Scooters & Bikes listing's figures (top speed and home charging instead of DC). */
export const BIKE_BRAND_SORT = sortConfig(["price-asc", "price-desc", "range", "speed", "charge", "new"] as const satisfies readonly BikeSortKey[], BIKE_SORT_OPTIONS);
export type BikeBrandSortKey = (typeof BIKE_BRAND_SORT.keys)[number];

export function sortBrandCars(cars: readonly PricedCar[], sort: CarBrandSortKey): PricedCar[] {
  return [...cars].sort(compareCars(sort, carFeaturedRank));
}

export function sortBrandBikes(bikes: readonly PricedBike[], sort: BikeBrandSortKey): PricedBike[] {
  return [...bikes].sort(compareBikes(sort, bikeFeaturedRank));
}

/* ------------------------------------------------------------------ hero line-up */

export type StagePosition = "back" | "mid" | "front";

/** The fields the line-up chooses by — shared by `PricedCar` and `PricedBike`. */
interface LineupSource {
  slug: string;
  status: string;
  launchDate: string | null;
  colors: string[];
  price: [number, number];
}

export interface StageItem<T> {
  item: T;
  position: StagePosition;
  /** Swatch of the catalogue colour the model is drawn in. */
  swatch: string;
  paint: Paint;
}

const NEUTRAL_SWATCHES = new Set(["#1F2227", "#E6E8EB", "#8A9099"]);

/**
 * Up to three models for the hero line-up, as the approved design picks them:
 * the newest on-sale model in front, the site's best-known one (the listing's
 * editorial featured order) in the middle, the flagship (highest price) at
 * the back. No model appears twice; a brand with fewer models draws fewer.
 *
 * Each is drawn in one of its own catalogue colours — the first colourful one
 * not already taken by a model in front of it, so a line-up that all lists
 * the same red first still reads as different models.
 */
export function lineup<T extends LineupSource>(items: readonly T[], featuredRank: (slug: string) => number): StageItem<T>[] {
  const used = new Set<string>();
  const take = (list: readonly T[]) => {
    const item = list.find((c) => !used.has(c.slug));
    if (item) used.add(item.slug);
    return item;
  };
  const onSale = items.filter((c) => c.status !== "upcoming");
  const front = take([...onSale].sort((a, b) => launchSortKey(b.launchDate) - launchSortKey(a.launchDate)));
  const mid = take([...items].sort((a, b) => featuredRank(a.slug) - featuredRank(b.slug) || a.price[0] - b.price[0]));
  const back = take([...items].sort((a, b) => b.price[0] - a.price[0]));
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
  // Colours are chosen front to back, so the model nearest the viewer keeps its own first colour.
  const picked = (
    [
      [front, "front"],
      [mid, "mid"],
      [back, "back"],
    ] as const
  )
    .filter((x): x is readonly [T, StagePosition] => x[0] !== undefined)
    .map(([item, position]) => {
      const swatch = swatchOf(item.colors);
      return { item, position, swatch, paint: paintFrom(swatch) };
    });
  // Drawn back to front so nearer models overlap the ones behind.
  return picked.reverse();
}
