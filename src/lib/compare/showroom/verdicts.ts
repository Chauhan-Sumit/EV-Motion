import type { VehicleDetail } from "@/types/vehicle-detail";
import { formatPriceLakh } from "@/lib/utils";
import {
  METRICS,
  currentRatingLabel,
  listJoin,
  phrases,
  rank,
  score,
  type MetricKey,
  type Score,
  type ShowroomVehicle,
  type Weights,
} from "./metrics";
import { acRangePerHour, fiveYearCost, rangePer15MinDc, type OwnershipSettings } from "./ownership";

/**
 * Everything the showroom page *says* — rulings, verdict cards, quiz reasons,
 * cons, FAQs — generated from the ranked data in `metrics.ts`. No sentence
 * here names a figure the data does not hold; a metric that cannot be ranked
 * produces "no clear winner" rather than a guess.
 */

export interface Lens {
  id: "overall" | "city" | "highway" | "family" | "budget";
  name: string;
  kicker: string;
  weights: Weights;
  rows: MetricKey[];
}

export const LENSES: Lens[] = [
  {
    id: "overall",
    name: "Overall",
    kicker: "Best for most buyers",
    weights: { onroad: 2, range: 1.5, eff: 1, dc15: 1, boot: 1, safety: 1.5, acc: 1 },
    rows: ["onroad", "range", "eff", "boot", "dc", "safety"],
  },
  { id: "city", name: "City commute", kicker: "Best in the city", weights: { len: 1.5, eff: 1.5, run: 1, acc: 0.7, gc: 0.5 }, rows: ["len", "eff", "run", "acc", "gc"] },
  { id: "highway", name: "Highway trips", kicker: "Best for highways", weights: { range: 2, dc15: 1.5, dc: 0.5, top: 0.7, kw: 0.7 }, rows: ["range", "dc15", "dc", "top", "kw"] },
  { id: "family", name: "Family", kicker: "Best for families", weights: { boot: 2, wb: 1.5, hgt: 0.5, safety: 2 }, rows: ["boot", "wb", "hgt", "safety", "airbags"] },
  { id: "budget", name: "Tight budget", kicker: "Best value", weights: { onroad: 2, emi: 1, run: 1, tco: 2, ppk: 1 }, rows: ["onroad", "emi", "run", "tco", "ppk"] },
];

export interface LensResult {
  score: Score;
  first: ShowroomVehicle;
  second: ShowroomVehicle;
  text: string;
}

const name = (v: ShowroomVehicle) => v.detail.name;

export function lensResult(lens: Lens, vs: ShowroomVehicle[], s: OwnershipSettings): LensResult {
  const r = score(lens.weights, vs, s);
  const first = vs[r.order[0]];
  const second = vs[r.order[1]];
  const leadA = r.leads[first.index];
  const leadB = r.leads[second.index];
  let text: string;
  if (r.tie) {
    const parts = [
      leadA.length ? `${name(first)} leads on ${listJoin(phrases(leadA))}` : "",
      leadB.length ? `${name(second)} on ${listJoin(phrases(leadB))}` : "",
    ].filter(Boolean);
    text = `${name(first)} and ${name(second)} are neck and neck${parts.length ? ` — ${parts.join("; ")}` : ""}.`;
  } else {
    text = `${name(first)}${leadA.length ? ` leads on ${listJoin(phrases(leadA))}` : " scores best across the board without topping one single number"}.`;
    text += ` ${name(second)} is the closest alternative${leadB.length ? `, ahead on ${listJoin(phrases(leadB))}` : ""}.`;
  }
  return { score: r, first, second, text };
}

/** The hero's one-line ruling, from the Overall lens. */
export function heroRuling(vs: ShowroomVehicle[], s: OwnershipSettings) {
  const r = lensResult(LENSES[0], vs, s);
  return {
    tie: r.score.tie,
    leaderIndex: r.score.tie ? -1 : r.first.index,
    first: r.first,
    second: r.second,
    firstLeads: phrases(r.score.leads[r.first.index]),
    secondLead: r.score.leads[r.second.index][0] ? METRICS[r.score.leads[r.second.index][0]].phrase : null,
  };
}

export type VerdictCard =
  | { kind: "winner"; category: string; vehicle: ShowroomVehicle; text: string }
  | { kind: "tie"; category: string; vehicles: ShowroomVehicle[]; text: string }
  | { kind: "none"; category: string; text: string };

const VERDICT_CATEGORIES: [string, MetricKey, string][] = [
  ["Value", "onroad", " less on-road than the "],
  ["Range", "range", " more claimed range than the "],
  ["Efficiency", "eff", " less energy per 100 km than the "],
  ["Performance", "acc", " quicker to 100 km/h than the "],
  ["DC fast charging", "dc15", " more range per 15-minute stop than the "],
  ["Home charging", "ac", " faster to a full AC charge than the "],
  ["Space", "boot", " more boot space than the "],
  ["Safety", "safety", ""],
];

/** Runner-up within this share of the leader counts as too close to call. */
const NEAR_TIE = 0.02;

export function verdictCards(vs: ShowroomVehicle[], s: OwnershipSettings): VerdictCard[] {
  return VERDICT_CATEGORIES.map(([category, key, gap]) => {
    const m = METRICS[key];
    const r = rank(key, vs, s);
    let best = r.best;
    let near = false;
    if (r.state === "winner" && key !== "safety") {
      const lead = r.values[best[0]] as number;
      const close = r.values.flatMap((x, i) => (x !== null && i !== best[0] && Math.abs(x - lead) / Math.abs(lead) < NEAR_TIE ? [i] : []));
      if (close.length) {
        best = [best[0], ...close];
        near = true;
      }
    }

    if (!best.length) {
      const text =
        key === "safety"
          ? "None of these has a current crash-test rating published."
          : r.state === "level"
            ? `All level on ${m.phrase}.`
            : `Not enough comparable published data to rank ${m.phrase}.`;
      return { kind: "none", category, text };
    }

    if (best.length > 1) {
      const tied = best.map((i) => vs[i]);
      const text = near
        ? `Within 2% of each other: ${tied.map((v) => `${name(v)} ${m.format(r.values[v.index] as number, v)}`).join(" vs ")}.`
        : `Tied at ${m.format(r.values[best[0]] as number, tied[0])}.`;
      return { kind: "tie", category: `${category} · too close to call`, vehicles: tied, text };
    }

    const w = vs[best[0]];
    const rest = r.values
      .flatMap((x, i) => (x !== null && i !== w.index ? [{ x, i }] : []))
      .sort((a, b) => (m.better === "higher" ? b.x - a.x : a.x - b.x));
    const next = rest[0];
    if (key === "safety") {
      const unrated = vs.filter((v) => v.index !== w.index && !currentRatingLabel(v.detail));
      return {
        kind: "winner",
        category,
        vehicle: w,
        text: `${currentRatingLabel(w.detail)}.${unrated.length ? ` ${listJoin(unrated.map(name))} ${unrated.length > 1 ? "have" : "has"} no current rating.` : ""}`,
      };
    }
    const lead = r.values[w.index] as number;
    const diff = Math.abs(lead - next.x);
    const diffText = key === "onroad" ? formatPriceLakh(diff / 100000) : m.format(Math.round(diff * 100) / 100, w);
    return { kind: "winner", category, vehicle: w, text: `${m.format(lead, w)} — ${diffText}${gap}${name(vs[next.i])}.` };
  });
}

export interface QuizQuestion {
  q: string;
  options: { label: string; weights: Weights }[];
}

export const QUIZ: QuizQuestion[] = [
  {
    q: "Who travels with you most?",
    options: [
      { label: "Mostly just me", weights: { onroad: 2, eff: 1 } },
      { label: "Family, often with luggage", weights: { boot: 2, wb: 1, safety: 1 } },
      { label: "I’m driven by a chauffeur", weights: { wb: 2, boot: 1, hgt: 1 } },
    ],
  },
  {
    q: "What does a typical week look like?",
    options: [
      { label: "City runs under 50 km a day", weights: { len: 1.5, eff: 1, acc: 0.5 } },
      { label: "A mix of city and highway", weights: { range: 1, eff: 1 } },
      { label: "Frequent long highway trips", weights: { range: 1.5, dc15: 1.5, top: 0.5 } },
    ],
  },
  {
    q: "What matters most to you?",
    options: [
      { label: "Lowest total cost", weights: { onroad: 2, tco: 1.5, eff: 1 } },
      { label: "Space and rear-seat comfort", weights: { boot: 2, wb: 1.5 } },
      { label: "A proven safety rating", weights: { safety: 3, airbags: 0.5 } },
    ],
  },
];

export const DEFAULT_QUIZ_ANSWERS = [0, 1, 0];

export function quizResult(answers: number[], vs: ShowroomVehicle[], s: OwnershipSettings) {
  const weights: Weights = {};
  answers.forEach((oi, qi) => {
    for (const [k, w] of Object.entries(QUIZ[qi].options[oi].weights) as [MetricKey, number][]) {
      weights[k] = (weights[k] ?? 0) + w;
    }
  });
  const r = score(weights, vs, s);
  const total = r.scores.reduce((a, b) => a + b, 0) || 1;
  const keys = (Object.keys(weights) as MetricKey[]).sort((a, b) => (weights[b] ?? 0) - (weights[a] ?? 0));
  const why = (v: ShowroomVehicle) =>
    keys
      .filter((k) => {
        const rk = rank(k, vs, s);
        return rk.state === "winner" && rk.best[0] === v.index;
      })
      .slice(0, 3)
      .map((k) => `Best ${METRICS[k].phrase} here: ${METRICS[k].format(METRICS[k].value(v, s) as number, v)}`);
  const first = vs[r.order[0]];
  const second = vs[r.order[1]];
  let reasons = r.tie ? [...why(first).slice(0, 2), ...why(second).slice(0, 2)] : why(first);
  if (!reasons.length) reasons = [`Strongest all-round match for your answers across ${listJoin(keys.slice(0, 3).map((k) => METRICS[k].phrase))}`];
  return { tie: r.tie, first, second, shares: r.scores.map((x) => x / total), reasons };
}

const CON_RULES: [MetricKey, string][] = [
  ["onroad", "Highest on-road price here"],
  ["range", "Shortest claimed range here"],
  ["eff", "Uses the most energy per km"],
  ["dc", "Slowest DC fast charge here"],
  ["boot", "Smallest boot here"],
  ["acc", "Slowest to 100 km/h here"],
  ["kw", "Least powerful here"],
  ["ac", "Slowest home (AC) charge here"],
];

/**
 * Cons worked out against this group: the vehicle must be the single worst
 * on a metric the set can actually rank. A gap in the data is never a con.
 */
export function consFor(v: ShowroomVehicle, vs: ShowroomVehicle[], s: OwnershipSettings): string[] {
  const cons: string[] = [];
  for (const [key, label] of CON_RULES) {
    const r = rank(key, vs, s);
    if (r.state !== "winner" && r.state !== "tie") continue;
    const worst = METRICS[key].better === "higher" ? r.min : r.max;
    const holders = r.values.filter((x) => x === worst).length;
    if (r.values[v.index] === worst && holders === 1) cons.push(`${label} (${METRICS[key].format(worst as number, v)})`);
  }
  if (!currentRatingLabel(v.detail) && vs.some((o) => currentRatingLabel(o.detail))) cons.push("No current crash-test rating");
  const out = cons.slice(0, 3);
  return out.length ? out : ["No clear weak spot against this group"];
}

export interface Faq {
  question: string;
  answer: string;
}

/**
 * FAQs generated from the compared data. Also feeds the page's `FAQPage`
 * structured data, so a question is only asked when the data can answer it.
 */
export function showroomFaqs(vs: ShowroomVehicle[], s: OwnershipSettings, cityName: string): Faq[] {
  if (vs.length < 2) return [];
  const names = vs.map(name);
  const or = names.length < 2 ? names[0] : `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
  const sortBy = (f: (v: ShowroomVehicle) => number | null, dir: 1 | -1) =>
    vs
      .filter((v) => f(v) !== null)
      .slice()
      .sort((a, b) => dir * ((f(a) as number) - (f(b) as number)));
  const lakh = (x: number) => formatPriceLakh(x / 100000);
  const faqs: Faq[] = [];

  const byRange = sortBy((v) => v.detail.quickSpecs.rangeKm, -1);
  faqs.push({
    question: `Which has the most range — ${or}?`,
    answer: `The ${name(byRange[0])} claims the most at ${byRange[0].detail.quickSpecs.rangeKm} km, followed by the ${name(byRange[1])} (${byRange[1].detail.quickSpecs.rangeKm} km)${
      byRange.length > 2 ? `. The ${name(byRange[byRange.length - 1])} claims the least at ${byRange[byRange.length - 1].detail.quickSpecs.rangeKm} km` : ""
    }. Expect roughly 70–80% of the claimed figure in everyday driving.`,
  });

  const byPrice = sortBy((v) => v.onRoad, 1);
  const tco = rank("tco", vs, s);
  const cheapestToOwn = tco.state === "winner" ? vs[tco.best[0]] : null;
  faqs.push({
    question: "Which is cheapest to buy and to own?",
    answer: `The ${name(byPrice[0])} has the lowest on-road price in ${cityName} at ${lakh(byPrice[0].onRoad)} — ${lakh(
      byPrice[byPrice.length - 1].onRoad - byPrice[0].onRoad,
    )} less than the ${name(byPrice[byPrice.length - 1])}.${
      cheapestToOwn
        ? ` Over five years, including charging at ${s.kmPerMonth.toLocaleString("en-IN")} km a month, the ${name(cheapestToOwn)} works out cheapest at ${lakh(
            fiveYearCost(cheapestToOwn.onRoad, cheapestToOwn.detail, s),
          )}.`
        : ""
    }`,
  });

  const byDc = sortBy((v) => rangePer15MinDc(v.detail), -1);
  const byAc = sortBy((v) => (acRangePerHour(v.detail) === null ? null : v.detail.charging.acHomeChargeHours), 1);
  if (byDc.length >= 2) {
    const c = byDc[0];
    faqs.push({
      question: "Which charges fastest?",
      answer: `On a DC fast charger the ${name(c)} adds the most range — about ${rangePer15MinDc(c.detail)} km in 15 minutes (10–80% in ${c.detail.quickSpecs.fastChargeMinutes} min).${
        byAc.length >= 2 ? ` On a home AC charger the ${name(byAc[0])} is quickest to full, at ${byAc[0].detail.charging.acHomeChargeHours} hours.` : ""
      }`,
    });
  }

  const boot = (v: ShowroomVehicle) => v.detail.sourceVehicle.specs?.dimensions?.bootSpaceLiters ?? null;
  const wb = (v: ShowroomVehicle) => v.detail.sourceVehicle.specs?.dimensions?.wheelbaseMm ?? null;
  const byBoot = sortBy(boot, -1);
  const byWb = sortBy(wb, -1);
  const rated = vs.filter((v) => currentRatingLabel(v.detail));
  const hasBoot = byBoot.length >= 2;
  const hasWb = byWb.length >= 2;
  if (hasBoot || hasWb) {
    const wbText = hasWb ? `the longest wheelbase (${wb(byWb[0])?.toLocaleString("en-IN")} mm)` : "";
    let space: string;
    if (hasBoot) {
      space = `The ${name(byBoot[0])} has the biggest boot (${boot(byBoot[0])} L)`;
      if (hasWb) space += byWb[0] === byBoot[0] ? ` and ${wbText}` : `, while the ${name(byWb[0])} has ${wbText}`;
    } else {
      space = `The ${name(byWb[0])} has ${wbText}`;
    }
    const safety = rated.length
      ? ` ${listJoin(rated.map((v) => `the ${name(v)} (${currentRatingLabel(v.detail)})`)).replace(/^t/, "T")} ${rated.length > 1 ? "have" : "has"} a current crash-test rating.`
      : " None has a current crash-test rating yet.";
    faqs.push({ question: "Which is best for a family?", answer: `${space}.${safety}` });
  }

  return faqs;
}

/** Real-world range band from the shared derating factors (highway–city). */
export function realWorldBand(v: VehicleDetail): [number, number] {
  const { highwayKm, cityKm } = v.realWorldRange;
  return [Math.min(highwayKm, cityKm), Math.max(highwayKm, cityKm)];
}
