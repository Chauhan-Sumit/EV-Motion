import { describe, expect, it } from "vitest";
import { getVehicleBySlug } from "@/lib/data";
import { cars } from "@/lib/data/cars";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { DEFAULT_CITY } from "@/lib/data/cities";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { getVehiclePricingSnapshot, PRICING_DEFAULTS } from "@/lib/vehicle-pricing";
import { slotColor } from "./palette";
import { currentRatingLabel, METRICS, rank, score, type MetricKey, type ShowroomVehicle } from "./metrics";
import { defaultOwnershipSettings, rangePer15MinDc } from "./ownership";
import { consFor, heroRuling, LENSES, lensResult, quizResult, DEFAULT_QUIZ_ANSWERS, showroomFaqs, verdictCards } from "./verdicts";
import { carGeometry, carStyleFor } from "./outline";

/**
 * The showroom page ranks and writes sentences about real vehicles, so the
 * properties worth pinning are the honesty rules it inherits (CLAUDE.md #15,
 * #22, #29): nothing is ranked on fewer than two known values or across
 * incomparable quantities, an expired crash-test result is not a rating, and
 * no generated sentence can contain a hole.
 */

function showroom(...slugs: string[]): ShowroomVehicle[] {
  return slugs.map((slug, index) => {
    const v = getVehicleBySlug(slug);
    if (!v) throw new Error(`no vehicle ${slug}`);
    const detail = toVehicleDetail(v);
    const onRoad = getVehiclePricingSnapshot({
      vehicleId: detail.id,
      vehicleName: detail.name,
      exShowroomRangeLakh: detail.priceRangeLakh,
      city: DEFAULT_CITY,
    }).breakdown.low.onRoad;
    return { detail, index, color: slotColor(index), onRoad };
  });
}

const carSettings = defaultOwnershipSettings("car");

describe("ownership defaults", () => {
  it("open at the site-wide pricing configuration, not values of their own", () => {
    expect(carSettings.annualRatePct).toBe(PRICING_DEFAULTS.finance.annualRatePct);
    expect(carSettings.tenureMonths).toBe(PRICING_DEFAULTS.finance.defaultTenureMonths);
    expect(carSettings.downPaymentPct).toBe(PRICING_DEFAULTS.finance.defaultDownPaymentPct);
    expect(carSettings.homeTariff).toBe(PRICING_DEFAULTS.runningCost.electricityCostPerUnit);
    expect(carSettings.publicTariff).toBe(PRICING_DEFAULTS.runningCost.publicChargingCostPerUnit);
  });
});

describe("rank — inherits the site's comparability gates", () => {
  it("refuses to rank a gross battery figure against a usable one (bmw-ix vs bmw-i4)", () => {
    const vs = showroom("bmw-ix", "bmw-i4");
    const r = rank("bat", vs, carSettings);
    expect(r.state).toBe("insufficient-data");
    expect(r.best).toEqual([]);
    // The values themselves are still shown.
    expect(r.values.every((x) => x !== null)).toBe(true);
    // Energy use and running cost are battery ÷ range, so they inherit the gate.
    expect(rank("eff", vs, carSettings).state).toBe("insufficient-data");
    expect(rank("run", vs, carSettings).state).toBe("insufficient-data");
  });

  it("does not treat an expired crash-test result as a rating (MG ZS EV, Euro NCAP 2019)", () => {
    const vs = showroom("mg-zs-ev", "tata-nexon-ev");
    expect(currentRatingLabel(vs[0].detail)).toBeNull();
    expect(currentRatingLabel(vs[1].detail)).toBe("5 ★ BNCAP");
    // One current rating among two is nothing to beat — no winner.
    expect(rank("safety", vs, carSettings).state).toBe("insufficient-data");
  });

  it("needs two known values before naming a winner", () => {
    const vs = showroom("mg-windsor-ev", "tata-nexon-ev");
    for (const key of Object.keys(METRICS) as MetricKey[]) {
      const r = rank(key, vs, carSettings);
      const known = r.values.filter((x) => x !== null).length;
      if (known < 2) expect(r.best, key).toEqual([]);
    }
  });

  it("marks every vehicle that ties for best", () => {
    const vs = showroom("tata-nexon-ev", "tata-curvv-ev");
    const r = rank("bat", vs, carSettings);
    if (r.values[0] === r.values[1]) expect(r.state).toBe("level");
  });
});

describe("derived figures", () => {
  it("adds no DC estimate without a published DC time", () => {
    const withoutDc = [...cars, ...twoWheelers].find((v) => !v.chargingTimeFastMin);
    expect(withoutDc).toBeDefined();
    expect(rangePer15MinDc(toVehicleDetail(withoutDc!))).toBeNull();
  });

  it("scores an unranked metric as nothing, not as zero for the unknown vehicle", () => {
    const vs = showroom("bmw-ix", "bmw-i4");
    const s = score({ bat: 5 }, vs, carSettings);
    expect(s.scores).toEqual([0, 0]);
    expect(s.leads).toEqual([[], []]);
  });
});

describe("generated copy has no holes", () => {
  const BAD = /undefined|NaN|null|Infinity|\[object/;

  // Every comparison of a car with its catalogue neighbour, plus 3- and 4-way
  // sets, plus two-wheelers — the whole range of data gaps the catalogue has.
  const sets: string[][] = [];
  for (let i = 0; i + 1 < cars.length; i++) sets.push([cars[i].slug, cars[i + 1].slug]);
  for (let i = 0; i + 3 < cars.length; i += 4) sets.push(cars.slice(i, i + 4).map((v) => v.slug));
  for (let i = 0; i + 2 < twoWheelers.length; i += 3) sets.push(twoWheelers.slice(i, i + 3).map((v) => v.slug));

  it.each(sets.map((s) => [s.join(" vs "), s]))("%s", (_, slugs) => {
    const vs = showroom(...(slugs as string[]));
    const settings = defaultOwnershipSettings(vs[0].detail.category);
    const texts: string[] = [];
    for (const lens of LENSES) texts.push(lensResult(lens, vs, settings).text);
    const ruling = heroRuling(vs, settings);
    texts.push(...ruling.firstLeads, ruling.secondLead ?? "");
    for (const c of verdictCards(vs, settings)) texts.push(c.category, c.text);
    texts.push(...quizResult(DEFAULT_QUIZ_ANSWERS, vs, settings).reasons);
    for (const v of vs) texts.push(...consFor(v, vs, settings));
    for (const f of showroomFaqs(vs, settings, DEFAULT_CITY.name)) texts.push(f.question, f.answer);
    for (const t of texts) expect(t, t).not.toMatch(BAD);
  });
});

describe("scale outline", () => {
  it("is proportioned to the published length and wheelbase", () => {
    const g = carGeometry({ lengthMm: 4000, heightMm: 1600, wheelbaseMm: 2500, groundClearanceMm: 180, style: carStyleFor("suv"), scale: 0.1 });
    expect(g.l).toBeCloseTo(400);
    expect(g.rx - g.fx).toBeCloseTo(250);
    expect(g.body).not.toMatch(/NaN/);
  });
});
