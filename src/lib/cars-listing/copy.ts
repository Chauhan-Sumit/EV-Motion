import { formatPriceLakh, formatPriceRangeLakh } from "@/lib/utils";
import { BODY_LABEL, compareBy, hasFiveStarBharatNcap, launchSortKey } from "./filters";
import { featuredRank, FEATURED_ORDER } from "./featured";
import type { PricedCar } from "./types";

/**
 * Words the listing generates from the catalogue — card badges, the FAQ, the
 * SEO paragraph and the brand tiles. Everything is computed from the cars it
 * is given, so it can never name a car the listing doesn't have or quote a
 * figure the cards don't show. Data-free and client-safe.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Aug 2026", or "2026" for a year-only date. Drops the data's "(Tentative)" marker — callers say "expected". */
export function launchLabel(date: string | null): string {
  const m = /(\d{4})(?:-(\d{2}))?/.exec(date ?? "");
  if (!m) return date ?? "";
  return `${m[2] ? `${MONTHS[Number(m[2]) - 1]} ` : ""}${m[1]}`;
}

/** A price range through the site's shared formatters; one figure when every variant costs the same. */
export function priceText([low, high]: [number, number], separator = " – "): string {
  return Math.abs(low - high) < 0.005 ? formatPriceLakh(low) : formatPriceRangeLakh(low, high, separator);
}

/** Joins a list as "A, B and C". */
export function joinList(items: readonly string[]): string {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const sorted = (cars: readonly PricedCar[], key: Parameters<typeof compareBy>[0]) => [...cars].sort(compareBy(key, featuredRank));
const onSale = (cars: readonly PricedCar[]) => cars.filter((c) => c.status !== "upcoming");

/**
 * Superlative badges, one per car at most, among cars on sale now. They are
 * facts about the listed set ("lowest starting price of the cars listed"), so
 * they move if the catalogue or the selected city changes them.
 */
export function superlatives(cars: readonly PricedCar[]): Map<string, string> {
  const pool = onSale(cars);
  const out = new Map<string, string>();
  if (!pool.length) return out;
  const first = (key: Parameters<typeof compareBy>[0], filter: (c: PricedCar) => boolean = () => true) => sorted(pool.filter(filter), key)[0];
  const set = (car: PricedCar | undefined, label: string) => {
    if (car && !out.has(car.slug)) out.set(car.slug, label);
  };
  set(first("price-asc"), "Most affordable");
  set(first("range"), "Longest range");
  set(first("dc", (c) => c.dcMin !== null), "Fastest charging");
  set(first("value"), "Best value");
  return out;
}

export interface Faq {
  q: string;
  a: string;
}

/** The FAQ under the listing — every answer computed from the cars passed in. Questions with no answer are left out. */
export function listingFaqs(cars: readonly PricedCar[]): Faq[] {
  const sale = onSale(cars);
  if (!sale.length) return [];
  const from = (c: PricedCar) => formatPriceLakh(c.price[0]);
  const cheap = sorted(sale, "price-asc");
  const far = sorted(cars, "range");
  const fast = sorted(cars.filter((c) => c.dcMin !== null), "dc");
  const under30 = cars.filter((c) => c.price[0] < 30);
  const u30Range = sorted(under30, "range")[0];
  const u30Fast = sorted(under30.filter((c) => c.dcMin !== null), "dc").slice(0, 3);
  const under15 = sorted(sale.filter((c) => c.price[0] < 15), "price-asc");
  const seven = sorted(sale.filter((c) => (c.seats ?? 0) >= 7), "price-asc");
  const safe = sorted(cars.filter(hasFiveStarBharatNcap), "price-asc");

  const faqs: Faq[] = [];
  faqs.push({
    q: "Which is the cheapest electric car in India?",
    a: `The ${cheap[0].name} starts at ${from(cheap[0])} ex-showroom${cheap.length > 2 ? `, followed by the ${cheap[1].name} (${from(cheap[1])}) and the ${cheap[2].name} (${from(cheap[2])})` : ""}.`,
  });
  faqs.push({
    q: "Which electric car has the longest range?",
    a: `The ${far[0].name} claims ${far[0].rangeKm} km.${u30Range ? ` Among cars under ₹30 L, the ${u30Range.name} leads with ${u30Range.rangeKm} km.` : ""} Expect roughly 75–85% of claimed range in everyday driving.`,
  });
  if (fast.length)
    faqs.push({
      q: "Which EV charges the fastest?",
      a: `The ${fast[0].name} goes from 10–80% in ${fast[0].dcMin} minutes on a compatible DC fast charger.${u30Fast.length ? ` Under ₹30 L, the ${joinList(u30Fast.map((c) => `${c.name} (${c.dcMin} min)`))} ${u30Fast.length > 1 ? "are" : "is"} quickest.` : ""}`,
    });
  if (under15.length)
    faqs.push({
      q: "How many electric cars are there under ₹15 lakh?",
      a: `${under15.length}: ${joinList(under15.map((c) => `${c.name} (${from(c)})`))}.`,
    });
  if (seven.length)
    faqs.push({ q: "Which electric cars have 7 seats?", a: `${joinList(seven.map((c) => `${c.name} (from ${from(c)})`))}.` });
  if (safe.length)
    faqs.push({
      q: "Which EVs have a 5-star Bharat NCAP rating?",
      a: `${joinList(safe.map((c) => c.name))}. Euro NCAP and ANCAP ratings are shown on cards separately — they aren’t tested to Indian conditions.`,
    });
  return faqs;
}

/** The SEO paragraph's two paragraphs. */
export function listingSeoText(cars: readonly PricedCar[]): [string, string] {
  if (!cars.length) return ["", ""];
  const cheapest = sorted(cars, "price-asc")[0];
  const priciest = sorted(cars, "price-desc")[0];
  const count = (body: PricedCar["body"]) => cars.filter((c) => c.body === body).length;
  const popular = FEATURED_ORDER.map((slug) => cars.find((c) => c.slug === slug)).filter((c): c is PricedCar => !!c).slice(0, 5);
  return [
    `There are ${cars.length} electric cars listed in India, from the ${formatPriceLakh(cheapest.price[0])} ${cheapest.name} to the ${priciest.name}. SUVs dominate with ${count("suv")} models; there are ${count("hatchback")} hatchbacks, ${count("sedan")} sedans and ${count("muv")} MPVs.${popular.length ? ` Popular picks include the ${joinList(popular.map((c) => c.name))}.` : ""}`,
    "Prices shown are ex-showroom ranges across variants. Many states waive or reduce road tax and registration on EVs, so on-road prices are often close to ex-showroom — open any model to see the on-road price for your city, its variants, and how it compares with rivals on range, charging and running cost.",
  ];
}

export interface BrandSummary {
  oem: string;
  name: string;
  short: string;
  count: number;
}

/** "Tata Motors" → "Tata", "MG Motor" → "MG". */
export const shortBrand = (oemName: string) => oemName.replace(" Motors", "").replace(" Motor", "");

/** One tile per maker with its model count, most models first. */
export function brandSummaries(cars: readonly PricedCar[]): BrandSummary[] {
  const by = new Map<string, BrandSummary>();
  for (const c of cars) {
    const b = by.get(c.oem) ?? { oem: c.oem, name: c.oemName, short: shortBrand(c.oemName), count: 0 };
    b.count++;
    by.set(c.oem, b);
  }
  return [...by.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Upcoming cars, soonest first. */
export function upcomingCars(cars: readonly PricedCar[]): PricedCar[] {
  return cars.filter((c) => c.status === "upcoming").sort((a, b) => launchSortKey(a.launchDate) - launchSortKey(b.launchDate));
}

/** "Ex-showroom · SUV · 5 seats · AWD · 3 variants". */
export function cardSubline(c: PricedCar): string {
  return [
    `Ex-showroom${c.status === "upcoming" ? " (expected)" : ""}`,
    BODY_LABEL[c.body],
    c.seats ? `${c.seats} seats` : null,
    c.drive === "AWD" ? "AWD" : null,
    c.variants > 1 ? `${c.variants} variants` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
