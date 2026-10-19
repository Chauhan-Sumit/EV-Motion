import { formatPriceLakh } from "@/lib/utils";
import { joinList, launchLabel, priceText, shortBrand } from "@/lib/cars-listing/copy";
import { launchSortKey } from "@/lib/cars-listing/filters";
import { compareBy, LOW_SPEED_KMPH, TYPE_LABEL, type BikeSortKey } from "./filters";
import { featuredRank, FEATURED_ORDER } from "./featured";
import type { PricedBike } from "./types";

export { launchLabel, priceText };

/** Company-form suffixes two-wheeler makers carry in `oemName` but riders drop: "Ather Energy" → "Ather". */
const BIKE_BRAND_SUFFIX = / (Automotive|Autotech|Energy|Electric|E-Motors|E-Mobility|Mobility|Motors|Motor|India)$/;

/**
 * The maker as riders say it, for "Ather Rizta" rather than "Ather Energy
 * Rizta". A dual name ("Hero Electric / Vida") uses the sub-brand the models
 * are sold under. Falls back to the cars' rule for anything else.
 */
export function shortBikeBrand(oemName: string): string {
  const name = oemName.includes(" / ") ? oemName.split(" / ").pop()! : oemName;
  return shortBrand(name.replace(BIKE_BRAND_SUFFIX, ""));
}

/**
 * Words the Scooters & Bikes listing generates from the catalogue — badges,
 * FAQ, SEO paragraph, brand tiles. Computed from the bikes passed in, so it
 * can never name a model the listing doesn't have or quote a figure the cards
 * don't show. Data-free and client-safe.
 */

const sorted = (bikes: readonly PricedBike[], key: BikeSortKey) => [...bikes].sort(compareBy(key, featuredRank));
const onSale = (bikes: readonly PricedBike[]) => bikes.filter((b) => b.status !== "upcoming");

/** Superlative badges, one per bike at most, among bikes on sale now. */
export function superlatives(bikes: readonly PricedBike[]): Map<string, string> {
  const pool = onSale(bikes);
  const out = new Map<string, string>();
  if (!pool.length) return out;
  const set = (bike: PricedBike | undefined, label: string) => {
    if (bike && !out.has(bike.slug)) out.set(bike.slug, label);
  };
  set(sorted(pool, "price-asc")[0], "Most affordable");
  set(sorted(pool, "range")[0], "Longest range");
  set(sorted(pool, "speed")[0], "Fastest");
  set(sorted(pool, "value")[0], "Best value");
  return out;
}

export interface Faq {
  q: string;
  a: string;
}

/** The FAQ under the listing — every answer computed from the bikes passed in. Questions with no answer are left out. */
export function bikeFaqs(bikes: readonly PricedBike[]): Faq[] {
  const sale = onSale(bikes);
  const scooters = sale.filter((b) => b.type === "scooter");
  const motorcycles = sale.filter((b) => b.type === "motorcycle");
  if (!sale.length) return [];
  const from = (b: PricedBike) => formatPriceLakh(b.price[0]);
  const faqs: Faq[] = [];

  const cheapScooter = sorted(scooters, "price-asc");
  if (cheapScooter.length)
    faqs.push({
      q: "Which is the cheapest electric scooter in India?",
      a: `The ${cheapScooter[0].name} starts at ${from(cheapScooter[0])} ex-showroom${cheapScooter.length > 2 ? `, followed by the ${cheapScooter[1].name} (${from(cheapScooter[1])}) and the ${cheapScooter[2].name} (${from(cheapScooter[2])})` : ""}.`,
    });

  const far = sorted(bikes, "range");
  const farScooter = sorted(scooters, "range")[0];
  faqs.push({
    q: "Which electric two-wheeler has the longest range?",
    a: `The ${far[0].name} claims ${far[0].rangeKm} km on a charge.${farScooter && farScooter.slug !== far[0].slug ? ` Among scooters, the ${farScooter.name} leads with ${farScooter.rangeKm} km.` : ""} Expect less in everyday riding — claimed figures come from standard test cycles.`,
  });

  const fastest = sorted(motorcycles.length ? motorcycles : sale, "speed").slice(0, 3);
  if (fastest.length)
    faqs.push({
      q: "Which is the fastest electric motorcycle?",
      a: `${joinList(fastest.map((b) => `the ${b.name} (${b.topSpeedKmph} km/h)`)).replace(/^the/, "The")} have the highest claimed top speeds.`,
    });

  const under1 = sorted(sale.filter((b) => b.price[0] < 1), "price-asc");
  if (under1.length)
    faqs.push({
      q: "How many electric scooters and bikes are there under ₹1 lakh?",
      a: `${under1.length}: ${joinList(under1.slice(0, 8).map((b) => `${b.name} (${from(b)})`))}${under1.length > 8 ? `, and ${under1.length - 8} more` : ""}.`,
    });

  const lowSpeed = sorted(sale.filter((b) => b.topSpeedKmph <= LOW_SPEED_KMPH), "price-asc");
  if (lowSpeed.length)
    faqs.push({
      q: "Which models are low-speed?",
      a: `${joinList(lowSpeed.map((b) => b.name))} ${lowSpeed.length > 1 ? "have" : "has"} a top speed of ${LOW_SPEED_KMPH} km/h. Low-speed models can be exempt from registration and a licence when their motor is also within the power limit — check the model's details before you buy.`,
    });

  const quickest = sorted(sale, "charge").slice(0, 3);
  if (quickest.length)
    faqs.push({
      q: "Which electric scooters charge the fastest at home?",
      a: `${joinList(quickest.map((b) => `the ${b.name} (${b.homeChargeHr} h)`)).replace(/^the/, "The")} have the shortest published home-charging times. Charging times depend on the charger and the battery's state of charge.`,
    });

  return faqs;
}

/** The SEO block's two paragraphs. */
export function bikeSeoText(bikes: readonly PricedBike[]): [string, string] {
  if (!bikes.length) return ["", ""];
  const cheapest = sorted(bikes, "price-asc")[0];
  const priciest = sorted(bikes, "price-desc")[0];
  const count = (type: PricedBike["type"]) => bikes.filter((b) => b.type === type).length;
  const brands = new Set(bikes.map((b) => b.oem)).size;
  const picks = FEATURED_ORDER.map((slug) => bikes.find((b) => b.slug === slug)).filter((b): b is PricedBike => !!b).slice(0, 5);
  return [
    `There are ${bikes.length} electric two-wheelers listed in India from ${brands} brands — ${count("scooter")} scooters and ${count("motorcycle")} motorcycles — from the ${formatPriceLakh(cheapest.price[0])} ${cheapest.name} to the ${priciest.name}.${picks.length ? ` Models to start with include the ${joinList(picks.map((b) => b.name))}.` : ""}`,
    "Prices shown are ex-showroom ranges across variants and vary by city. Range, top speed and charging times are manufacturer-claimed; open any model to see its variants, on-road price for your city and how it compares with rivals.",
  ];
}

export interface BrandSummary {
  oem: string;
  name: string;
  short: string;
  count: number;
}

/** One tile per maker with its model count, most models first. */
export function brandSummaries(bikes: readonly PricedBike[]): BrandSummary[] {
  const by = new Map<string, BrandSummary>();
  for (const b of bikes) {
    const s = by.get(b.oem) ?? { oem: b.oem, name: b.oemName, short: shortBikeBrand(b.oemName), count: 0 };
    s.count++;
    by.set(b.oem, s);
  }
  return [...by.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Upcoming bikes, soonest first. */
export function upcomingBikes(bikes: readonly PricedBike[]): PricedBike[] {
  return bikes.filter((b) => b.status === "upcoming").sort((a, b) => launchSortKey(a.launchDate) - launchSortKey(b.launchDate));
}

/** "Ex-showroom · Scooter · 3 variants · Fast charging". */
export function cardSubline(b: PricedBike): string {
  return [
    `Ex-showroom${b.status === "upcoming" ? " (expected)" : ""}`,
    TYPE_LABEL[b.type],
    b.powerKw ? `${b.powerKw} kW` : null,
    b.variants > 1 ? `${b.variants} variants` : null,
    b.fastChargeMin !== null ? "Fast charging" : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
