import type { CarBodyType } from "@/types/vehicle";
import type { ListedStatus, PricedCar } from "./types";

/**
 * Filter, sort and URL state for the Electric Cars listing — the approved
 * design's behaviour as pure functions. Data-free and client-safe: every
 * function takes the cars it works on, already priced for the selected city.
 */

/* ------------------------------------------------------------------ price scale */

/** Price-slider stops, in lakh. Index 0 is "no minimum", the last index is "no maximum". */
export const PRICE_STEPS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 500, 1000] as const;
export const LAST_STEP = PRICE_STEPS.length - 1;
/** Display label for each stop. A fixed table of bucket labels, not a vehicle price. */
export const STEP_LABELS = ["₹5 L", "₹10 L", "₹15 L", "₹20 L", "₹25 L", "₹30 L", "₹40 L", "₹50 L", "₹75 L", "₹1 Cr", "₹1.5 Cr", "₹2 Cr", "₹3 Cr", "₹5 Cr", "₹10 Cr"] as const;

export const PRICE_PRESETS = [
  { label: "Under ₹10 L", min: 0, max: 1 },
  { label: "₹10–20 L", min: 1, max: 3 },
  { label: "₹20–40 L", min: 3, max: 6 },
  { label: "₹40 L–1 Cr", min: 6, max: 9 },
  { label: "Above ₹1 Cr", min: 9, max: LAST_STEP },
] as const;

/** The "Luxury" category is every car from ₹40 L up. */
export const LUXURY_MIN_STEP = 6;

/* ------------------------------------------------------------------ facets */

export const BODY_ORDER: readonly CarBodyType[] = ["hatchback", "sedan", "suv", "muv"];
export const BODY_LABEL: Record<CarBodyType, string> = { hatchback: "Hatchback", sedan: "Sedan", suv: "SUV", muv: "MPV" };
const BODY_PLURAL: Record<CarBodyType, string> = { hatchback: "Hatchbacks", sedan: "Sedans", suv: "SUVs", muv: "MPVs" };

export const STATUS_OPTIONS: readonly { value: ListedStatus; label: string }[] = [
  { value: "available", label: "Available now" },
  { value: "just-launched", label: "Just launched" },
  { value: "upcoming", label: "Upcoming" },
];

export const CHARGE_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 0, label: "Any" },
  { value: 20, label: "Under 20 min" },
  { value: 30, label: "Under 30 min" },
  { value: 45, label: "Under 45 min" },
  { value: 60, label: "Under 60 min" },
];

export const RANGE_MAX = 800;
export const RANGE_STEP = 50;

/* ------------------------------------------------------------------ state */

export interface ListingFilters {
  q: string;
  body: CarBodyType[];
  /** OEM keys. */
  brand: string[];
  seats: number[];
  status: ListedStatus[];
  /** Index into `PRICE_STEPS`. */
  pmin: number;
  /** Index into `PRICE_STEPS`. */
  pmax: number;
  /** Minimum claimed range in km; 0 is any. */
  range: number;
  /** Maximum DC fast-charge minutes; 0 is any. */
  dc: number;
  safe: boolean;
  awd: boolean;
}

export const EMPTY_FILTERS: ListingFilters = {
  q: "",
  body: [],
  brand: [],
  seats: [],
  status: [],
  pmin: 0,
  pmax: LAST_STEP,
  range: 0,
  dc: 0,
  safe: false,
  awd: false,
};

export type FilterFacet = "q" | "price" | "body" | "brand" | "seats" | "status" | "range" | "dc" | "safe" | "awd";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "range", label: "Longest range" },
  { value: "dc", label: "Fastest charging" },
  { value: "value", label: "Best value (₹/km)" },
  { value: "new", label: "Newest" },
  { value: "acc", label: "Quickest 0–100" },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type ViewMode = "list" | "grid";

/* ------------------------------------------------------------------ predicates */

export const isPriceActive = (f: ListingFilters) => f.pmin > 0 || f.pmax < LAST_STEP;
export const isLuxury = (f: ListingFilters) => f.pmin === LUXURY_MIN_STEP && f.pmax === LAST_STEP;

/** A current 5-star Bharat NCAP result. Expired results never qualify (`ncapResultFor` already resolved expiry). */
export function hasFiveStarBharatNcap(car: Pick<PricedCar, "ncap">): boolean {
  return !!car.ncap && !car.ncap.expired && car.ncap.rating === 5 && /bharat/i.test(car.ncap.agency);
}

/**
 * Whether `car` passes every active filter. `skip` leaves one facet out, so a
 * facet's option counts show what selecting that option would return.
 * Price compares the city-adjusted *starting* price against the stops.
 */
export function matches(car: PricedCar, f: ListingFilters, skip?: FilterFacet): boolean {
  if (skip !== "q" && f.q) {
    const hay = `${car.oemName} ${car.model} ${car.tagline} ${BODY_LABEL[car.body]}`.toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t))) return false;
  }
  if (skip !== "price") {
    if (f.pmin > 0 && car.price[0] < PRICE_STEPS[f.pmin]) return false;
    if (f.pmax < LAST_STEP && car.price[0] > PRICE_STEPS[f.pmax]) return false;
  }
  if (skip !== "body" && f.body.length && !f.body.includes(car.body)) return false;
  if (skip !== "brand" && f.brand.length && !f.brand.includes(car.oem)) return false;
  if (skip !== "seats" && f.seats.length && (car.seats === null || !f.seats.includes(car.seats))) return false;
  if (skip !== "status" && f.status.length && !f.status.includes(car.status)) return false;
  if (skip !== "range" && f.range && car.rangeKm < f.range) return false;
  if (skip !== "dc" && f.dc && (car.dcMin === null || car.dcMin > f.dc)) return false;
  if (skip !== "safe" && f.safe && !hasFiveStarBharatNcap(car)) return false;
  if (skip !== "awd" && f.awd && car.drive !== "AWD") return false;
  return true;
}

export function countMatching(cars: readonly PricedCar[], f: ListingFilters, skip: FilterFacet, test: (c: PricedCar) => boolean): number {
  let n = 0;
  for (const c of cars) if (matches(c, f, skip) && test(c)) n++;
  return n;
}

export function activeFilterCount(f: ListingFilters): number {
  return (
    f.body.length +
    f.brand.length +
    f.seats.length +
    f.status.length +
    (isPriceActive(f) ? 1 : 0) +
    (f.range ? 1 : 0) +
    (f.dc ? 1 : 0) +
    (f.safe ? 1 : 0) +
    (f.awd ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}

/** Cars per price band, counted with every filter except price — the histogram above the slider. */
export function priceHistogram(cars: readonly PricedCar[], f: ListingFilters): number[] {
  const pool = cars.filter((c) => matches(c, f, "price"));
  return Array.from({ length: LAST_STEP }, (_, i) =>
    pool.filter((c) => c.price[0] >= PRICE_STEPS[i] && (i === LAST_STEP - 1 || c.price[0] < PRICE_STEPS[i + 1])).length,
  );
}

/* ------------------------------------------------------------------ sorting */

const nullsLast = (a: number | null, b: number | null) => (a === null ? (b === null ? 0 : 1) : b === null ? -1 : a - b);

/** Year·month as one sortable number; a year-only date sorts mid-year. */
export function launchSortKey(date: string | null): number {
  const m = /(\d{4})(?:-(\d{2}))?/.exec(date ?? "");
  return m ? Number(m[1]) * 12 + Number(m[2] ?? 6) : 0;
}

export function compareBy(sort: SortKey, featuredRank: (slug: string) => number): (a: PricedCar, b: PricedCar) => number {
  switch (sort) {
    case "price-asc":
      return (a, b) => a.price[0] - b.price[0];
    case "price-desc":
      return (a, b) => b.price[0] - a.price[0];
    case "range":
      return (a, b) => b.rangeKm - a.rangeKm;
    case "dc":
      return (a, b) => nullsLast(a.dcMin, b.dcMin);
    case "value":
      return (a, b) => a.price[0] / a.rangeKm - b.price[0] / b.rangeKm;
    case "new":
      return (a, b) => launchSortKey(b.launchDate) - launchSortKey(a.launchDate);
    case "acc":
      return (a, b) => nullsLast(a.accSec, b.accSec);
    case "featured":
    default:
      return (a, b) => featuredRank(a.slug) - featuredRank(b.slug) || a.price[0] - b.price[0];
  }
}

export function filterAndSort(cars: readonly PricedCar[], f: ListingFilters, sort: SortKey, featuredRank: (slug: string) => number): PricedCar[] {
  return cars.filter((c) => matches(c, f)).sort(compareBy(sort, featuredRank));
}

/* ------------------------------------------------------------------ result copy */

export function resultsTitle(count: number, f: ListingFilters, brandName: (key: string) => string): string {
  let noun = f.body.length === 1 ? BODY_PLURAL[f.body[0]] : "Cars";
  if (count === 1) noun = noun.replace(/es$|s$/, "");
  return `${count} Electric ${noun}${f.brand.length === 1 ? ` from ${brandName(f.brand[0])}` : ""}${f.q ? ` matching “${f.q}”` : ""}`;
}

export function priceSpanLabel(f: ListingFilters, any = "any price"): string {
  return `${f.pmin ? STEP_LABELS[f.pmin] : "Up"} to ${f.pmax === LAST_STEP ? any : STEP_LABELS[f.pmax]}`;
}

export interface ActiveChip {
  key: string;
  label: string;
  clear: (f: ListingFilters) => ListingFilters;
}

const without = <T,>(list: T[], v: T) => list.filter((x) => x !== v);

/** One removable chip per active filter, in the design's order. */
export function activeChips(f: ListingFilters, brandName: (key: string) => string): ActiveChip[] {
  const chips: ActiveChip[] = [];
  if (f.q) chips.push({ key: "q", label: `“${f.q}”`, clear: (s) => ({ ...s, q: "" }) });
  if (isPriceActive(f))
    chips.push({
      key: "price",
      label: `${f.pmin ? STEP_LABELS[f.pmin] : "Up"} – ${f.pmax === LAST_STEP ? "any" : STEP_LABELS[f.pmax]}`,
      clear: (s) => ({ ...s, pmin: 0, pmax: LAST_STEP }),
    });
  for (const b of f.body) chips.push({ key: `body-${b}`, label: BODY_LABEL[b], clear: (s) => ({ ...s, body: without(s.body, b) }) });
  for (const b of f.brand) chips.push({ key: `brand-${b}`, label: brandName(b), clear: (s) => ({ ...s, brand: without(s.brand, b) }) });
  for (const n of f.seats) chips.push({ key: `seats-${n}`, label: `${n} seats`, clear: (s) => ({ ...s, seats: without(s.seats, n) }) });
  for (const st of f.status)
    chips.push({ key: `status-${st}`, label: STATUS_OPTIONS.find((o) => o.value === st)?.label ?? st, clear: (s) => ({ ...s, status: without(s.status, st) }) });
  if (f.range) chips.push({ key: "range", label: `${f.range}+ km range`, clear: (s) => ({ ...s, range: 0 }) });
  if (f.dc) chips.push({ key: "dc", label: `DC under ${f.dc} min`, clear: (s) => ({ ...s, dc: 0 }) });
  if (f.safe) chips.push({ key: "safe", label: "5★ Bharat NCAP", clear: (s) => ({ ...s, safe: false }) });
  if (f.awd) chips.push({ key: "awd", label: "AWD", clear: (s) => ({ ...s, awd: false }) });
  return chips;
}

/* ------------------------------------------------------------------ URL */

export type QueryParams = Record<string, string | string[] | undefined>;

export interface ListingQueryState {
  filters: ListingFilters;
  sort: SortKey;
  view: ViewMode;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const list = (v: string | string[] | undefined) => one(v).split(",").map((s) => s.trim()).filter(Boolean);
const unique = <T,>(xs: T[]) => [...new Set(xs)];
const nearestStep =(lakh: number) =>
  PRICE_STEPS.reduce((best, step, i) => (Math.abs(step - lakh) < Math.abs(PRICE_STEPS[best] - lakh) ? i : best), 0);

/**
 * Reads the listing's state from a query string. Understands this page's own
 * parameters and, so links already pointing at `/cars` keep working when this
 * page replaces it, the current listing's (`oems`, `type`, `availability`,
 * `budget`, `charging`, `sort=range-desc`). Unknown or malformed values are
 * dropped rather than trusted.
 */
export function parseListingQuery(params: QueryParams, knownBrands: readonly string[]): ListingQueryState {
  const brands = new Set(knownBrands);
  const f: ListingFilters = { ...EMPTY_FILTERS };

  f.q = one(params.q).trim().slice(0, 80);
  f.body = unique([...list(params.body), ...list(params.type)].filter((b): b is CarBodyType => (BODY_ORDER as readonly string[]).includes(b)));
  f.brand = unique([...list(params.brand), ...list(params.oems)].filter((b) => brands.has(b)));
  f.seats = unique(list(params.seats).map(Number).filter((n) => Number.isInteger(n) && n > 0 && n < 20));
  f.status = unique([...list(params.status), ...list(params.availability)].filter((s): s is ListedStatus => STATUS_OPTIONS.some((o) => o.value === s)));

  const pmin = PRICE_STEPS.indexOf(Number(one(params.pmin)) as (typeof PRICE_STEPS)[number]);
  const pmax = PRICE_STEPS.indexOf(Number(one(params.pmax)) as (typeof PRICE_STEPS)[number]);
  const [bMin, bMax] = one(params.budget).split("-").map(Number);
  if (pmin > 0) f.pmin = Math.min(pmin, LAST_STEP - 1);
  else if (Number.isFinite(bMin) && bMin > 0) f.pmin = Math.min(nearestStep(bMin), LAST_STEP - 1);
  if (pmax > f.pmin) f.pmax = pmax;
  else if (Number.isFinite(bMax) && bMax > 0 && nearestStep(bMax) > f.pmin) f.pmax = nearestStep(bMax);

  const range = Number(one(params.range));
  if (Number.isFinite(range) && range > 0) f.range = Math.min(RANGE_MAX, Math.round(range / RANGE_STEP) * RANGE_STEP);

  const charging = one(params.charging);
  const dc = Number(one(params.dc)) || (charging === "under30" ? 30 : charging === "under60" ? 60 : 0);
  if (CHARGE_OPTIONS.some((o) => o.value === dc)) f.dc = dc;

  f.safe = !!one(params.safe);
  f.awd = !!one(params.awd);

  const rawSort = one(params.sort) === "range-desc" ? "range" : one(params.sort);
  const sort = (SORT_OPTIONS.find((o) => o.value === rawSort)?.value ?? "featured") as SortKey;
  const view: ViewMode = one(params.view) === "grid" ? "grid" : "list";
  return { filters: f, sort, view };
}

/** The inverse of `parseListingQuery`, in this page's own parameter names. Defaults are omitted. */
export function serializeListingQuery({ filters: f, sort, view }: ListingQueryState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.body.length) p.set("body", f.body.join(","));
  if (f.brand.length) p.set("brand", f.brand.join(","));
  if (f.seats.length) p.set("seats", f.seats.join(","));
  if (f.status.length) p.set("status", f.status.join(","));
  if (f.pmin) p.set("pmin", String(PRICE_STEPS[f.pmin]));
  if (f.pmax < LAST_STEP) p.set("pmax", String(PRICE_STEPS[f.pmax]));
  if (f.range) p.set("range", String(f.range));
  if (f.dc) p.set("dc", String(f.dc));
  if (f.safe) p.set("safe", "1");
  if (f.awd) p.set("awd", "1");
  if (sort !== "featured") p.set("sort", sort);
  if (view !== "list") p.set("view", view);
  return p;
}
