import type { TwoWheelerType } from "@/types/vehicle";
import { launchSortKey } from "@/lib/cars-listing/filters";
import type { ListedStatus, PricedBike } from "./types";

/**
 * Filter, sort and URL state for the Scooters & Bikes listing, as pure
 * functions. Same shape as the Electric Cars listing's `filters.ts`, with the
 * facets a two-wheeler buyer filters on: type, top speed (including the
 * low-speed class), home-charging time and battery size. Data-free and
 * client-safe; every function takes bikes already priced for the city.
 */

/* ------------------------------------------------------------------ price scale */

/** Price-slider stops, in lakh. Index 0 is "no minimum", the last index is "no maximum". */
export const PRICE_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5] as const;
export const LAST_STEP = PRICE_STEPS.length - 1;
/** Display label for each stop. A fixed table of bucket labels, not a vehicle price. */
export const STEP_LABELS = ["₹50K", "₹75K", "₹1 L", "₹1.25 L", "₹1.5 L", "₹1.75 L", "₹2 L", "₹2.5 L", "₹3 L", "₹4 L", "₹5 L"] as const;

/** The "Under ₹1 Lakh" category tile and preset: no minimum, ₹1 L maximum. */
export const BUDGET_MAX_STEP = 2;

export const PRICE_PRESETS = [
  { label: "Under ₹1 L", min: 0, max: BUDGET_MAX_STEP },
  { label: "₹1–1.5 L", min: 2, max: 4 },
  { label: "₹1.5–2 L", min: 4, max: 6 },
  { label: "Above ₹2 L", min: 6, max: LAST_STEP },
] as const;

/* ------------------------------------------------------------------ facets */

export const TYPE_ORDER: readonly TwoWheelerType[] = ["scooter", "motorcycle"];
export const TYPE_LABEL: Record<TwoWheelerType, string> = { scooter: "Scooter", motorcycle: "Motorcycle" };
const TYPE_PLURAL: Record<TwoWheelerType, string> = { scooter: "Scooters", motorcycle: "Motorcycles" };

export const STATUS_OPTIONS: readonly { value: ListedStatus; label: string }[] = [
  { value: "available", label: "Available now" },
  { value: "just-launched", label: "Just launched" },
  { value: "upcoming", label: "Upcoming" },
];

/**
 * Top-speed buckets. `"low"` is the low-speed class — a top speed of 25 km/h
 * or less, the category India exempts from registration when its motor is
 * also within the power limit. The listing only states the speed; whether a
 * model is exempt is for its detail page and the OEM to say.
 */
export const LOW_SPEED_KMPH = 25;
export type SpeedBucket = "" | "low" | "60" | "80" | "100";
export const SPEED_OPTIONS: readonly { value: SpeedBucket; label: string }[] = [
  { value: "", label: "Any" },
  { value: "low", label: `Low-speed (up to ${LOW_SPEED_KMPH} km/h)` },
  { value: "60", label: "60 km/h or more" },
  { value: "80", label: "80 km/h or more" },
  { value: "100", label: "100 km/h or more" },
];

export const CHARGE_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 0, label: "Any" },
  { value: 3, label: "Under 3 hours" },
  { value: 4, label: "Under 4 hours" },
  { value: 5, label: "Under 5 hours" },
  { value: 6, label: "Under 6 hours" },
];

export const RANGE_MAX = 300;
export const RANGE_STEP = 25;
/** The "Long range" category tile. */
export const LONG_RANGE_KM = 150;
export const BATTERY_MAX = 6;
export const BATTERY_STEP = 0.5;

/* ------------------------------------------------------------------ state */

export interface BikeFilters {
  q: string;
  type: TwoWheelerType[];
  /** OEM keys. */
  brand: string[];
  status: ListedStatus[];
  /** Index into `PRICE_STEPS`. */
  pmin: number;
  /** Index into `PRICE_STEPS`. */
  pmax: number;
  /** Minimum claimed range in km; 0 is any. */
  range: number;
  /** Minimum battery in kWh; 0 is any. */
  battery: number;
  speed: SpeedBucket;
  /** Maximum home-charging hours; 0 is any. */
  charge: number;
  /** Only models with a published fast-charging time. */
  fast: boolean;
}

export const EMPTY_FILTERS: BikeFilters = {
  q: "",
  type: [],
  brand: [],
  status: [],
  pmin: 0,
  pmax: LAST_STEP,
  range: 0,
  battery: 0,
  speed: "",
  charge: 0,
  fast: false,
};

export type BikeFacet = "q" | "price" | "type" | "brand" | "status" | "range" | "battery" | "speed" | "charge" | "fast";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "range", label: "Longest range" },
  { value: "speed", label: "Highest top speed" },
  { value: "charge", label: "Quickest home charge" },
  { value: "value", label: "Best value (₹/km)" },
  { value: "new", label: "Newest" },
] as const;
export type BikeSortKey = (typeof SORT_OPTIONS)[number]["value"];

export type ViewMode = "list" | "grid";

/* ------------------------------------------------------------------ predicates */

export const isPriceActive = (f: BikeFilters) => f.pmin > 0 || f.pmax < LAST_STEP;
export const isBudget = (f: BikeFilters) => f.pmin === 0 && f.pmax === BUDGET_MAX_STEP;

export function matchesSpeed(topSpeedKmph: number, bucket: SpeedBucket): boolean {
  if (!bucket) return true;
  if (bucket === "low") return topSpeedKmph <= LOW_SPEED_KMPH;
  return topSpeedKmph >= Number(bucket);
}

/**
 * Whether `bike` passes every active filter. `skip` leaves one facet out, so
 * that facet's option counts show what selecting an option would return.
 * Price compares the city-adjusted *starting* price against the stops.
 */
export function matches(bike: PricedBike, f: BikeFilters, skip?: BikeFacet): boolean {
  if (skip !== "q" && f.q) {
    const hay = `${bike.oemName} ${bike.model} ${bike.tagline} ${TYPE_LABEL[bike.type]}`.toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t))) return false;
  }
  if (skip !== "price") {
    if (f.pmin > 0 && bike.price[0] < PRICE_STEPS[f.pmin]) return false;
    if (f.pmax < LAST_STEP && bike.price[0] > PRICE_STEPS[f.pmax]) return false;
  }
  if (skip !== "type" && f.type.length && !f.type.includes(bike.type)) return false;
  if (skip !== "brand" && f.brand.length && !f.brand.includes(bike.oem)) return false;
  if (skip !== "status" && f.status.length && !f.status.includes(bike.status)) return false;
  if (skip !== "range" && f.range && bike.rangeKm < f.range) return false;
  if (skip !== "battery" && f.battery && bike.batteryKwh < f.battery) return false;
  if (skip !== "speed" && !matchesSpeed(bike.topSpeedKmph, f.speed)) return false;
  if (skip !== "charge" && f.charge && bike.homeChargeHr >= f.charge) return false;
  if (skip !== "fast" && f.fast && bike.fastChargeMin === null) return false;
  return true;
}

export function countMatching(bikes: readonly PricedBike[], f: BikeFilters, skip: BikeFacet, test: (b: PricedBike) => boolean): number {
  let n = 0;
  for (const b of bikes) if (matches(b, f, skip) && test(b)) n++;
  return n;
}

export function activeFilterCount(f: BikeFilters): number {
  return (
    f.type.length +
    f.brand.length +
    f.status.length +
    (isPriceActive(f) ? 1 : 0) +
    (f.range ? 1 : 0) +
    (f.battery ? 1 : 0) +
    (f.speed ? 1 : 0) +
    (f.charge ? 1 : 0) +
    (f.fast ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}

/** Bikes per price band, counted with every filter except price — the histogram above the slider. */
export function priceHistogram(bikes: readonly PricedBike[], f: BikeFilters): number[] {
  const pool = bikes.filter((b) => matches(b, f, "price"));
  return Array.from({ length: LAST_STEP }, (_, i) =>
    pool.filter((b) => b.price[0] >= PRICE_STEPS[i] && (i === LAST_STEP - 1 || b.price[0] < PRICE_STEPS[i + 1])).length,
  );
}

/* ------------------------------------------------------------------ sorting */

export function compareBy(sort: BikeSortKey, featuredRank: (slug: string) => number): (a: PricedBike, b: PricedBike) => number {
  switch (sort) {
    case "price-asc":
      return (a, b) => a.price[0] - b.price[0];
    case "price-desc":
      return (a, b) => b.price[0] - a.price[0];
    case "range":
      return (a, b) => b.rangeKm - a.rangeKm;
    case "speed":
      return (a, b) => b.topSpeedKmph - a.topSpeedKmph;
    case "charge":
      return (a, b) => a.homeChargeHr - b.homeChargeHr;
    case "value":
      return (a, b) => a.price[0] / a.rangeKm - b.price[0] / b.rangeKm;
    case "new":
      return (a, b) => launchSortKey(b.launchDate) - launchSortKey(a.launchDate);
    case "featured":
    default:
      return (a, b) => featuredRank(a.slug) - featuredRank(b.slug) || a.price[0] - b.price[0];
  }
}

export function filterAndSort(bikes: readonly PricedBike[], f: BikeFilters, sort: BikeSortKey, featuredRank: (slug: string) => number): PricedBike[] {
  return bikes.filter((b) => matches(b, f)).sort(compareBy(sort, featuredRank));
}

/* ------------------------------------------------------------------ result copy */

export function resultsTitle(count: number, f: BikeFilters, brandName: (key: string) => string): string {
  let noun = f.type.length === 1 ? `Electric ${TYPE_PLURAL[f.type[0]]}` : "Electric Scooters & Bikes";
  if (count === 1) noun = f.type.length === 1 ? `Electric ${TYPE_LABEL[f.type[0]]}` : "Electric Two-Wheeler";
  return `${count} ${noun}${f.brand.length === 1 ? ` from ${brandName(f.brand[0])}` : ""}${f.q ? ` matching “${f.q}”` : ""}`;
}

export function priceSpanLabel(f: BikeFilters): string {
  return `${f.pmin ? STEP_LABELS[f.pmin] : "Up"} to ${f.pmax === LAST_STEP ? "any price" : STEP_LABELS[f.pmax]}`;
}

export interface ActiveChip {
  key: string;
  label: string;
  clear: (f: BikeFilters) => BikeFilters;
}

const without = <T,>(list: T[], v: T) => list.filter((x) => x !== v);

/** One removable chip per active filter. */
export function activeChips(f: BikeFilters, brandName: (key: string) => string): ActiveChip[] {
  const chips: ActiveChip[] = [];
  if (f.q) chips.push({ key: "q", label: `“${f.q}”`, clear: (s) => ({ ...s, q: "" }) });
  if (isPriceActive(f))
    chips.push({
      key: "price",
      label: `${f.pmin ? STEP_LABELS[f.pmin] : "Up"} – ${f.pmax === LAST_STEP ? "any" : STEP_LABELS[f.pmax]}`,
      clear: (s) => ({ ...s, pmin: 0, pmax: LAST_STEP }),
    });
  for (const t of f.type) chips.push({ key: `type-${t}`, label: TYPE_PLURAL[t], clear: (s) => ({ ...s, type: without(s.type, t) }) });
  for (const b of f.brand) chips.push({ key: `brand-${b}`, label: brandName(b), clear: (s) => ({ ...s, brand: without(s.brand, b) }) });
  for (const st of f.status)
    chips.push({ key: `status-${st}`, label: STATUS_OPTIONS.find((o) => o.value === st)?.label ?? st, clear: (s) => ({ ...s, status: without(s.status, st) }) });
  if (f.range) chips.push({ key: "range", label: `${f.range}+ km range`, clear: (s) => ({ ...s, range: 0 }) });
  if (f.battery) chips.push({ key: "battery", label: `${f.battery}+ kWh battery`, clear: (s) => ({ ...s, battery: 0 }) });
  if (f.speed) chips.push({ key: "speed", label: f.speed === "low" ? "Low-speed" : `${f.speed}+ km/h`, clear: (s) => ({ ...s, speed: "" }) });
  if (f.charge) chips.push({ key: "charge", label: `Home charge under ${f.charge} h`, clear: (s) => ({ ...s, charge: 0 }) });
  if (f.fast) chips.push({ key: "fast", label: "Fast charging", clear: (s) => ({ ...s, fast: false }) });
  return chips;
}

/* ------------------------------------------------------------------ URL */

export type QueryParams = Record<string, string | string[] | undefined>;

export interface BikeQueryState {
  filters: BikeFilters;
  sort: BikeSortKey;
  view: ViewMode;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const list = (v: string | string[] | undefined) => one(v).split(",").map((s) => s.trim()).filter(Boolean);
const unique = <T,>(xs: T[]) => [...new Set(xs)];
/** Highest stop at or below `lakh` — a minimum is widened, never narrowed. */
const stepAtOrBelow = (lakh: number) => PRICE_STEPS.reduce((best, step, i) => (step <= lakh ? i : best), 0);
/** Lowest stop at or above `lakh` — a maximum is widened, never narrowed. */
const stepAtOrAbove = (lakh: number) => {
  const i = PRICE_STEPS.findIndex((step) => step >= lakh);
  return i < 0 ? LAST_STEP : i;
};

/**
 * Reads the listing's state from a query string. Understands this page's own
 * parameters and the previous `/two-wheelers` listing's (`oems`, `type`,
 * `availability`, `budget`, `battery`, `charging`, `sort=range-desc`), so the
 * homepage search card and search category links keep working. The previous
 * `charging=under30|under60` buckets were fast-charge times; they map to
 * "has fast charging", the closest facet this page offers. Unknown or
 * malformed values are dropped; free-form numbers are widened to the
 * nearest stop, never narrowed.
 */
export function parseBikeQuery(params: QueryParams, knownBrands: readonly string[]): BikeQueryState {
  const brands = new Set(knownBrands);
  const f: BikeFilters = { ...EMPTY_FILTERS };

  f.q = one(params.q).trim().slice(0, 80);
  f.type = unique(list(params.type).filter((t): t is TwoWheelerType => (TYPE_ORDER as readonly string[]).includes(t)));
  f.brand = unique([...list(params.brand), ...list(params.oems)].filter((b) => brands.has(b)));
  f.status = unique([...list(params.status), ...list(params.availability)].filter((s): s is ListedStatus => STATUS_OPTIONS.some((o) => o.value === s)));

  const pmin = PRICE_STEPS.indexOf(Number(one(params.pmin)) as (typeof PRICE_STEPS)[number]);
  const pmax = PRICE_STEPS.indexOf(Number(one(params.pmax)) as (typeof PRICE_STEPS)[number]);
  const [bMin, bMax] = one(params.budget).split("-").map(Number);
  if (pmin > 0) f.pmin = Math.min(pmin, LAST_STEP - 1);
  else if (Number.isFinite(bMin) && bMin > 0) f.pmin = Math.min(stepAtOrBelow(bMin), LAST_STEP - 1);
  if (pmax > f.pmin) f.pmax = pmax;
  else if (Number.isFinite(bMax) && bMax > 0 && stepAtOrAbove(bMax) > f.pmin) f.pmax = stepAtOrAbove(bMax);

  const range = Number(one(params.range));
  if (Number.isFinite(range) && range > 0) f.range = Math.min(RANGE_MAX, Math.floor(range / RANGE_STEP) * RANGE_STEP);
  const battery = Number(one(params.battery));
  if (Number.isFinite(battery) && battery > 0) f.battery = Math.min(BATTERY_MAX, Math.floor(battery / BATTERY_STEP) * BATTERY_STEP);

  const speed = one(params.speed);
  if (SPEED_OPTIONS.some((o) => o.value === speed)) f.speed = speed as SpeedBucket;
  const charge = Number(one(params.charge));
  if (CHARGE_OPTIONS.some((o) => o.value === charge)) f.charge = charge;

  const charging = one(params.charging);
  f.fast = !!one(params.fast) || charging === "under30" || charging === "under60";

  const rawSort = one(params.sort) === "range-desc" ? "range" : one(params.sort);
  const sort = (SORT_OPTIONS.find((o) => o.value === rawSort)?.value ?? "featured") as BikeSortKey;
  const view: ViewMode = one(params.view) === "grid" ? "grid" : "list";
  return { filters: f, sort, view };
}

/** The inverse of `parseBikeQuery`, in this page's own parameter names. Defaults are omitted. */
export function serializeBikeQuery({ filters: f, sort, view }: BikeQueryState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.type.length) p.set("type", f.type.join(","));
  if (f.brand.length) p.set("brand", f.brand.join(","));
  if (f.status.length) p.set("status", f.status.join(","));
  if (f.pmin) p.set("pmin", String(PRICE_STEPS[f.pmin]));
  if (f.pmax < LAST_STEP) p.set("pmax", String(PRICE_STEPS[f.pmax]));
  if (f.range) p.set("range", String(f.range));
  if (f.battery) p.set("battery", String(f.battery));
  if (f.speed) p.set("speed", f.speed);
  if (f.charge) p.set("charge", String(f.charge));
  if (f.fast) p.set("fast", "1");
  if (sort !== "featured") p.set("sort", sort);
  if (view !== "list") p.set("view", view);
  return p;
}
