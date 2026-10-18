import type { VehicleDetail } from "@/types/vehicle-detail";
import { WINNER_METRICS } from "@/lib/compare/metrics";
import { formatPriceLakh } from "@/lib/utils";
import { currentNcapRating, ncapResultFor } from "@/lib/vehicle-safety";
import type { SlotColor } from "./palette";
import {
  emiQuote,
  energyPer100Km,
  fiveYearCost,
  monthlyRunningCost,
  rangePer15MinDc,
  type OwnershipSettings,
} from "./ownership";

/**
 * The showroom page's metric registry.
 *
 * Every metric the page ranks on is either *the* existing `WINNER_METRICS`
 * entry — same `value()`, same set-level `comparable()` gate — or a figure
 * this page adds (on-road price, energy use, running cost, EMI, 5-year cost,
 * price per km, the two charging estimates, three body dimensions). So the
 * gross-vs-usable battery rule, the shaft-vs-wheel torque rule and the NCAP
 * expiry rule hold here exactly as they do everywhere else, without being
 * re-implemented.
 */

export interface ShowroomVehicle {
  detail: VehicleDetail;
  /** Position in the comparison — also picks its slot colour. */
  index: number;
  color: SlotColor;
  /** City on-road price of the starting variant, from the pricing service. */
  onRoad: number;
}

export type MetricKey =
  | "onroad"
  | "range"
  | "eff"
  | "bat"
  | "dc"
  | "dc15"
  | "ac"
  | "acc"
  | "kw"
  | "nm"
  | "top"
  | "boot"
  | "wb"
  | "len"
  | "hgt"
  | "gc"
  | "safety"
  | "airbags"
  | "run"
  | "emi"
  | "tco"
  | "ppk";

export interface Metric {
  key: MetricKey;
  label: string;
  /** Noun phrase used in generated sentences: "leads on {phrase}". */
  phrase: string;
  better: "higher" | "lower";
  value: (v: ShowroomVehicle, s: OwnershipSettings) => number | null;
  format: (x: number, v: ShowroomVehicle) => string;
  /** Set-level gate — false withholds the ranking but keeps the values. */
  comparable?: (vs: ShowroomVehicle[]) => boolean;
  /** Printed beside the row: what the figure is, when it is not a spec. */
  note?: string;
  /** Shown instead of "Not published" when a missing value means something else. */
  missing?: string;
  /** Bars are drawn against a fixed scale (stars out of 5) rather than the set's max. */
  scaleMax?: number;
}

const inr = (x: number) => `₹${Math.round(x).toLocaleString("en-IN")}`;
const grp = (x: number) => Math.round(x).toLocaleString("en-IN");
const lakh = (rupees: number) => formatPriceLakh(rupees / 100000);

/** Borrow `value` and `comparable` from the site-wide winner registry. */
function winner(key: string) {
  const m = WINNER_METRICS.find((w) => w.key === key);
  if (!m) throw new Error(`WINNER_METRICS has no "${key}"`);
  return {
    value: (v: ShowroomVehicle) => m.value(v.detail),
    comparable: m.comparable ? (vs: ShowroomVehicle[]) => m.comparable!(vs.map((v) => v.detail)) : undefined,
  };
}

const dims = (v: ShowroomVehicle) => v.detail.sourceVehicle.specs?.dimensions;

/** Short agency names for the compact "5 ★ BNCAP" treatment. */
const AGENCY_SHORT: Record<string, string> = {
  "Bharat NCAP": "BNCAP",
  "Global NCAP": "GNCAP",
  "Euro NCAP": "Euro NCAP",
  ANCAP: "ANCAP",
};

/** "5 ★ BNCAP" for a current rating; null when there is none or it lapsed. */
export function currentRatingLabel(v: VehicleDetail): string | null {
  const safety = v.sourceVehicle.specs?.safety;
  const stars = currentNcapRating(safety);
  if (stars === null) return null;
  const agency = ncapResultFor(safety)?.agency;
  return `${stars} ★${agency ? ` ${AGENCY_SHORT[agency] ?? agency}` : ""}`;
}

export const METRICS: Record<MetricKey, Metric> = {
  onroad: { key: "onroad", label: "On-road price", phrase: "price", better: "lower", value: (v) => v.onRoad, format: lakh },
  range: { key: "range", label: "Claimed range", phrase: "range", better: "higher", ...winner("range"), format: (x) => `${grp(x)} km` },
  eff: {
    key: "eff",
    label: "Energy use",
    phrase: "efficiency",
    better: "lower",
    value: (v) => energyPer100Km(v.detail),
    // Battery ÷ range inherits the battery's gross/usable basis.
    comparable: winner("battery").comparable,
    format: (x) => `${x.toFixed(1)} kWh/100 km`,
  },
  bat: { key: "bat", label: "Battery", phrase: "battery size", better: "higher", ...winner("battery"), format: (x) => `${x} kWh` },
  dc: { key: "dc", label: "DC fast charge, 10–80%", phrase: "fast-charging time", better: "lower", ...winner("fastCharge"), format: (x) => `${x} min` },
  dc15: {
    key: "dc15",
    label: "Range added in 15 min (DC)",
    phrase: "range added per charging stop",
    better: "higher",
    value: (v) => rangePer15MinDc(v.detail),
    format: (x) => `${x} km`,
    note: "EV Motion estimate",
  },
  ac: { key: "ac", label: "AC home charge (full)", phrase: "home-charging time", better: "lower", ...winner("acCharge"), format: (x) => `${x} h` },
  acc: { key: "acc", label: "0–100 km/h", phrase: "acceleration", better: "lower", ...winner("acceleration"), format: (x) => `${x.toFixed(1)} s` },
  kw: { key: "kw", label: "Power", phrase: "power", better: "higher", ...winner("power"), format: (x) => `${x} kW` },
  nm: { key: "nm", label: "Torque", phrase: "torque", better: "higher", ...winner("torque"), format: (x) => `${x} Nm` },
  top: { key: "top", label: "Top speed", phrase: "top speed", better: "higher", ...winner("topSpeed"), format: (x) => `${x} km/h` },
  boot: { key: "boot", label: "Boot space", phrase: "boot space", better: "higher", ...winner("bootSpace"), format: (x) => `${x} L` },
  wb: {
    key: "wb",
    label: "Wheelbase",
    phrase: "wheelbase",
    better: "higher",
    value: (v) => dims(v)?.wheelbaseMm ?? null,
    format: (x) => `${grp(x)} mm`,
    note: "Longer usually means more rear legroom",
  },
  len: {
    key: "len",
    label: "Length",
    phrase: "compact size",
    better: "lower",
    value: (v) => dims(v)?.lengthMm ?? null,
    format: (x) => `${grp(x)} mm`,
    note: "Shorter is easier to park",
  },
  hgt: { key: "hgt", label: "Height", phrase: "cabin height", better: "higher", value: (v) => dims(v)?.heightMm ?? null, format: (x) => `${grp(x)} mm` },
  gc: { key: "gc", label: "Ground clearance", phrase: "ground clearance", better: "higher", ...winner("groundClearance"), format: (x) => `${x} mm` },
  safety: {
    key: "safety",
    label: "Crash-test rating",
    phrase: "crash-test rating",
    better: "higher",
    ...winner("safetyRating"),
    format: (_x, v) => currentRatingLabel(v.detail) ?? "Not rated",
    note: "Current ratings only",
    missing: "Not rated",
    scaleMax: 5,
  },
  airbags: { key: "airbags", label: "Airbags", phrase: "airbags", better: "higher", ...winner("airbags"), format: (x) => String(x) },
  run: {
    key: "run",
    label: "Running cost / month",
    phrase: "running cost",
    better: "lower",
    value: (v, s) => monthlyRunningCost(v.detail, s),
    comparable: winner("battery").comparable,
    format: inr,
    note: "At your calculator settings",
  },
  emi: { key: "emi", label: "EMI / month", phrase: "EMI", better: "lower", value: (v, s) => emiQuote(v.onRoad, s).emi, format: inr },
  tco: {
    key: "tco",
    label: "5-year cost",
    phrase: "5-year cost",
    better: "lower",
    value: (v, s) => fiveYearCost(v.onRoad, v.detail, s),
    comparable: winner("battery").comparable,
    format: lakh,
  },
  ppk: {
    key: "ppk",
    label: "Price per km of range",
    phrase: "price per km of range",
    better: "lower",
    value: (v) => v.onRoad / v.detail.quickSpecs.rangeKm,
    format: inr,
    note: "On-road price ÷ claimed range",
  },
};

export type RankState = "winner" | "tie" | "level" | "insufficient-data";

export interface Rank {
  values: (number | null)[];
  /** Every vehicle holding the best value — empty unless state is winner/tie. */
  best: number[];
  state: RankState;
  max: number | null;
  min: number | null;
}

/**
 * Ranks one metric across the set, on the same rules as the site's winner
 * engine: at least two known values, the set-level gate passes, and the
 * values actually differ. Unlike `computeWinners`, a tie keeps *who* tied, so
 * the page can mark both.
 */
export function rank(key: MetricKey, vs: ShowroomVehicle[], s: OwnershipSettings): Rank {
  const m = METRICS[key];
  const values = vs.map((v) => m.value(v, s));
  return rankValues(values, m.better, m.comparable ? m.comparable(vs) : true);
}

/** The ranking rule on its own, for derived figures that are not registry metrics. */
export function rankValues(raw: (number | null)[], better: Metric["better"], comparable = true): Rank {
  const values = raw.map((x) => (x === null || Number.isNaN(x) ? null : x));
  const known = values.filter((x): x is number => x !== null);
  const max = known.length ? Math.max(...known) : null;
  const min = known.length ? Math.min(...known) : null;
  if (known.length < 2 || !comparable) {
    return { values, best: [], state: "insufficient-data", max, min };
  }
  if (max === min) return { values, best: [], state: "level", max, min };
  const target = better === "higher" ? max : min;
  const best = values.flatMap((x, i) => (x === target ? [i] : []));
  return { values, best, state: best.length === 1 ? "winner" : "tie", max, min };
}

export type Weights = Partial<Record<MetricKey, number>>;

export interface Score {
  /** Weighted, normalised score per vehicle. */
  scores: number[];
  /** Metrics each vehicle wins outright, in weight order. */
  leads: MetricKey[][];
  /** Vehicle indices, best first. */
  order: number[];
  /** Top two within 6% of each other. */
  tie: boolean;
}

/**
 * Weighted score: each ranked metric contributes 0–1 per vehicle (best = 1,
 * worst = 0) times its weight. A metric that cannot be ranked contributes
 * nothing to anyone — an unknown value is not scored as a zero.
 */
export function score(weights: Weights, vs: ShowroomVehicle[], s: OwnershipSettings): Score {
  const scores = vs.map(() => 0);
  const leads: MetricKey[][] = vs.map(() => []);
  const keys = (Object.keys(weights) as MetricKey[]).sort((a, b) => (weights[b] ?? 0) - (weights[a] ?? 0));
  for (const key of keys) {
    const r = rank(key, vs, s);
    if (r.state !== "winner" && r.state !== "tie") continue;
    const span = (r.max as number) - (r.min as number);
    r.values.forEach((x, i) => {
      if (x === null) return;
      const n = METRICS[key].better === "higher" ? (x - (r.min as number)) / span : ((r.max as number) - x) / span;
      scores[i] += n * (weights[key] ?? 0);
    });
    if (r.state === "winner") leads[r.best[0]].push(key);
  }
  const order = scores.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);
  const top = scores[order[0]];
  const tie = order.length > 1 && top - scores[order[1]] < 0.06 * Math.max(top, 0.0001);
  return { scores, leads, order, tie };
}

/** Joins with commas and a final "and". */
export function listJoin(items: string[]): string {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function phrases(keys: MetricKey[], n = 3): string[] {
  return keys.slice(0, n).map((k) => METRICS[k].phrase);
}
