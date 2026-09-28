import type { VehicleCategory } from "@/types/vehicle";

/**
 * The pricing service's configuration surface.
 *
 * Every rate, tenure and tariff the site quotes is resolved here and nowhere
 * else. Before this existed the same numbers were written out in four places —
 * `emi.ts`, `chargingCost.ts`, `toVehicleDetail.ts` and the Vehicle Detail
 * Page's own chrome file — plus a literal `8` passed at three Compare call
 * sites. That is the drift CLAUDE.md #16 exists to prevent, and it is why no
 * consumer may hold a rate of its own: **read these values, never restate
 * them.**
 *
 * The local pricing library is a stand-in for a real pricing service. When
 * that service arrives, `resolvePricingConfig()` is the seam it plugs into —
 * the shape below is what it has to return, and no consumer changes.
 *
 * ## Overriding
 *
 * Every value can be set by environment variable, so changing the financed
 * rate or the electricity tariff is a deployment setting rather than a code
 * change. Unset variables fall back to the documented defaults below; see
 * `.env.example`.
 *
 * The variables are `NEXT_PUBLIC_`-prefixed on purpose: the Vehicle Detail
 * Page's EMI calculator is a client component, so the figures have to survive
 * into the browser bundle. They are public rates quoted on the page anyway —
 * do not put anything secret behind this prefix.
 */

export interface RangeConfig {
  min: number;
  max: number;
  step: number;
}

export interface FinanceConfig {
  /** Annual reducing-balance interest rate, as a percentage. */
  annualRatePct: number;
  /** Tenure used for every "EMI from ₹X/mo" figure. */
  defaultTenureMonths: number;
  /** Down payment assumed by that same headline figure, as a percentage. */
  defaultDownPaymentPct: number;
  /** Bounds any tenure control offers. Not page-specific. */
  tenureMonths: RangeConfig;
  /** Bounds any down-payment control offers, in percent. Not page-specific. */
  downPaymentPct: RangeConfig;
}

/** The petrol vehicle an EV's running cost is quoted against. */
export interface PetrolComparator {
  kmPerLitre: number;
  /** Named in the disclosure line, e.g. "at 45 km/l" for a scooter. */
  label: string;
}

export interface RunningCostConfig {
  /** ₹ per kWh of domestic electricity. */
  electricityCostPerUnit: number;
  /** ₹ per litre of petrol, for the comparison against an ICE equivalent. */
  petrolPricePerLitre: number;
  /** Days per month used to turn a daily distance into a monthly cost. */
  daysPerMonth: number;
  /** Default daily distance assumed per category, where the user sets none. */
  dailyKmByCategory: Record<VehicleCategory, number>;
  /**
   * The ICE equivalent, per category. Category-aware because it has to be: a
   * scooter's running cost compared against a 15 km/l car overstates the
   * saving roughly threefold, which is exactly what the Vehicle Detail Page
   * did while it carried a single flat figure of its own.
   */
  petrolComparatorByCategory: Record<VehicleCategory, PetrolComparator>;
}

export interface PricingConfig {
  finance: FinanceConfig;
  runningCost: RunningCostConfig;
  /**
   * Names of the settings taken from the environment rather than the
   * defaults. Empty on a stock deployment. Surfaced so a surprising price can
   * be traced to a deployment setting instead of being hunted through code.
   */
  overrides: string[];
}

/**
 * Defaults, used when nothing overrides them.
 *
 * These are the figures the site has always quoted; moving them here changed
 * where they live, not what they are. Each is an assumption, not a
 * manufacturer figure, which is why every surface that displays one also
 * prints the assumption beside it.
 */
export const PRICING_DEFAULTS: Omit<PricingConfig, "overrides"> = {
  // The site-wide finance assumption: 80% financed, 9.5% p.a., 60 months.
  //
  // Deliberately NOT the approved prototype's 10.45% / 84 months. The
  // prototype defines the page's UI and layout; it does not define the
  // company's financial assumptions. Every surface that quotes an EMI —
  // listing cards, Compare, the VDP, both calculators — reads this one value,
  // so they cannot disagree, and a deployment can change it without a code
  // change.
  finance: {
    annualRatePct: 9.5,
    defaultTenureMonths: 60,
    defaultDownPaymentPct: 20,
    tenureMonths: { min: 36, max: 84, step: 12 },
    downPaymentPct: { min: 0, max: 40, step: 5 },
  },
  runningCost: {
    electricityCostPerUnit: 8,
    petrolPricePerLitre: 105,
    daysPerMonth: 30,
    dailyKmByCategory: { car: 40, "2-wheeler": 25, commercial: 90 },
    petrolComparatorByCategory: {
      car: { kmPerLitre: 15, label: "car" },
      "2-wheeler": { kmPerLitre: 45, label: "scooter" },
      commercial: { kmPerLitre: 12, label: "commercial vehicle" },
    },
  },
};

/** Environment keys, in one place so `.env.example` and the parser cannot drift. */
export const PRICING_ENV_KEYS = {
  annualRatePct: "NEXT_PUBLIC_PRICING_ANNUAL_RATE_PCT",
  defaultTenureMonths: "NEXT_PUBLIC_PRICING_TENURE_MONTHS",
  defaultDownPaymentPct: "NEXT_PUBLIC_PRICING_DOWN_PAYMENT_PCT",
  tenureMin: "NEXT_PUBLIC_PRICING_TENURE_MIN_MONTHS",
  tenureMax: "NEXT_PUBLIC_PRICING_TENURE_MAX_MONTHS",
  tenureStep: "NEXT_PUBLIC_PRICING_TENURE_STEP_MONTHS",
  downMin: "NEXT_PUBLIC_PRICING_DOWN_MIN_PCT",
  downMax: "NEXT_PUBLIC_PRICING_DOWN_MAX_PCT",
  downStep: "NEXT_PUBLIC_PRICING_DOWN_STEP_PCT",
  electricityCostPerUnit: "NEXT_PUBLIC_PRICING_ELECTRICITY_PER_UNIT",
  petrolPricePerLitre: "NEXT_PUBLIC_PRICING_PETROL_PER_LITRE",
  daysPerMonth: "NEXT_PUBLIC_PRICING_DAYS_PER_MONTH",
} as const;

export type PricingEnv = Partial<Record<string, string | undefined>>;

/**
 * Parses one numeric setting.
 *
 * A malformed or out-of-range value falls back to the default rather than
 * propagating. A typo'd tariff must not be able to turn every price on the
 * site into `NaN` — a wrong-but-sane number is recoverable, `₹NaN` in front of
 * a buyer is not. Out-of-range is treated the same way: a negative interest
 * rate or a zero-month tenure is a misconfiguration, not an intent.
 */
function readNumber(
  env: PricingEnv,
  key: string,
  fallback: number,
  { min, max }: { min: number; max: number },
  overrides: string[],
): number {
  const raw = env[key];
  if (raw === undefined || raw.trim() === "") return fallback;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[pricing] ${key}="${raw}" is not a number in [${min}, ${max}] — using the default ${fallback}.`,
      );
    }
    return fallback;
  }

  overrides.push(key);
  return parsed;
}

/**
 * Pure resolver, so the parsing and fallback rules can be tested without
 * touching `process.env`. `getPricingConfig()` is the production entry point.
 */
export function resolvePricingConfig(env: PricingEnv): PricingConfig {
  const overrides: string[] = [];
  const d = PRICING_DEFAULTS;
  const k = PRICING_ENV_KEYS;

  const pct = { min: 0, max: 100 };
  const months = { min: 1, max: 600 };
  const money = { min: 0, max: 100_000 };

  const finance: FinanceConfig = {
    annualRatePct: readNumber(env, k.annualRatePct, d.finance.annualRatePct, pct, overrides),
    defaultTenureMonths: readNumber(
      env,
      k.defaultTenureMonths,
      d.finance.defaultTenureMonths,
      months,
      overrides,
    ),
    defaultDownPaymentPct: readNumber(
      env,
      k.defaultDownPaymentPct,
      d.finance.defaultDownPaymentPct,
      pct,
      overrides,
    ),
    tenureMonths: {
      min: readNumber(env, k.tenureMin, d.finance.tenureMonths.min, months, overrides),
      max: readNumber(env, k.tenureMax, d.finance.tenureMonths.max, months, overrides),
      step: readNumber(env, k.tenureStep, d.finance.tenureMonths.step, months, overrides),
    },
    downPaymentPct: {
      min: readNumber(env, k.downMin, d.finance.downPaymentPct.min, pct, overrides),
      max: readNumber(env, k.downMax, d.finance.downPaymentPct.max, pct, overrides),
      step: readNumber(env, k.downStep, d.finance.downPaymentPct.step, { min: 1, max: 100 }, overrides),
    },
  };

  const runningCost: RunningCostConfig = {
    electricityCostPerUnit: readNumber(
      env,
      k.electricityCostPerUnit,
      d.runningCost.electricityCostPerUnit,
      money,
      overrides,
    ),
    petrolPricePerLitre: readNumber(
      env,
      k.petrolPricePerLitre,
      d.runningCost.petrolPricePerLitre,
      money,
      overrides,
    ),
    daysPerMonth: readNumber(
      env,
      k.daysPerMonth,
      d.runningCost.daysPerMonth,
      { min: 1, max: 31 },
      overrides,
    ),
    dailyKmByCategory: d.runningCost.dailyKmByCategory,
    petrolComparatorByCategory: d.runningCost.petrolComparatorByCategory,
  };

  // A slider whose bounds cross over would render an unusable control, so an
  // inverted pair is discarded in favour of the defaults rather than shipped.
  if (finance.tenureMonths.min >= finance.tenureMonths.max) {
    finance.tenureMonths = d.finance.tenureMonths;
  }
  if (finance.downPaymentPct.min >= finance.downPaymentPct.max) {
    finance.downPaymentPct = d.finance.downPaymentPct;
  }

  return { finance, runningCost, overrides };
}

/**
 * Next inlines `process.env.NEXT_PUBLIC_*` only for literal member accesses,
 * so every key is read explicitly here rather than through a loop over
 * `PRICING_ENV_KEYS`. A dynamic lookup would silently resolve to `undefined`
 * in the browser and quietly fall back to defaults in production only.
 */
const ENV: PricingEnv = {
  [PRICING_ENV_KEYS.annualRatePct]: process.env.NEXT_PUBLIC_PRICING_ANNUAL_RATE_PCT,
  [PRICING_ENV_KEYS.defaultTenureMonths]: process.env.NEXT_PUBLIC_PRICING_TENURE_MONTHS,
  [PRICING_ENV_KEYS.defaultDownPaymentPct]: process.env.NEXT_PUBLIC_PRICING_DOWN_PAYMENT_PCT,
  [PRICING_ENV_KEYS.tenureMin]: process.env.NEXT_PUBLIC_PRICING_TENURE_MIN_MONTHS,
  [PRICING_ENV_KEYS.tenureMax]: process.env.NEXT_PUBLIC_PRICING_TENURE_MAX_MONTHS,
  [PRICING_ENV_KEYS.tenureStep]: process.env.NEXT_PUBLIC_PRICING_TENURE_STEP_MONTHS,
  [PRICING_ENV_KEYS.downMin]: process.env.NEXT_PUBLIC_PRICING_DOWN_MIN_PCT,
  [PRICING_ENV_KEYS.downMax]: process.env.NEXT_PUBLIC_PRICING_DOWN_MAX_PCT,
  [PRICING_ENV_KEYS.downStep]: process.env.NEXT_PUBLIC_PRICING_DOWN_STEP_PCT,
  [PRICING_ENV_KEYS.electricityCostPerUnit]: process.env.NEXT_PUBLIC_PRICING_ELECTRICITY_PER_UNIT,
  [PRICING_ENV_KEYS.petrolPricePerLitre]: process.env.NEXT_PUBLIC_PRICING_PETROL_PER_LITRE,
  [PRICING_ENV_KEYS.daysPerMonth]: process.env.NEXT_PUBLIC_PRICING_DAYS_PER_MONTH,
};

const ENV_CONFIG = resolvePricingConfig(ENV);

/**
 * What a rate is being asked for. Optional today and ignored by the built-in
 * resolver, but every consumer already passes what it knows, so a later
 * state-wise or category-wise rate table slots in **here** rather than in
 * fifteen call sites.
 *
 * This is not hypothetical for an Indian market: domestic electricity tariffs
 * and road tax already vary by state, and `state-charges.ts` treats road tax
 * that way. The tariff simply has not been given the same treatment yet.
 */
export interface PricingScope {
  /** Indian state name, as `LocationContext` supplies it. */
  state?: string;
  category?: VehicleCategory;
}

export type PricingConfigResolver = (scope?: PricingScope) => PricingConfig;

/**
 * The built-in resolver: environment over defaults, scope ignored.
 * Deliberately returns the same frozen object for every scope, so nothing can
 * come to depend on per-scope identity before per-scope data exists.
 */
const environmentResolver: PricingConfigResolver = () => ENV_CONFIG;

let activeResolver: PricingConfigResolver = environmentResolver;

/**
 * Replaces the source of pricing configuration.
 *
 * This is the seam an API- or database-backed pricing service plugs into. Fetch
 * the configuration once during startup (server bootstrap, or a provider at the
 * root of the tree), then install a resolver that returns the fetched snapshot.
 *
 * **Why the getter stays synchronous.** Its callers are render-path: component
 * bodies, `useMemo`, and adapters that run during static generation. Making
 * `getPricingConfig()` async would turn every one of them into a suspense
 * boundary or a loading state — a large change to fifteen consumers in exchange
 * for nothing, since a rate table is small, changes rarely, and is perfectly
 * suited to being hydrated once and read many times. Fetch asynchronously,
 * serve synchronously.
 */
export function setPricingConfigResolver(next: PricingConfigResolver): void {
  activeResolver = next;
}

/** Restores the built-in environment-backed resolver. Used by tests. */
export function resetPricingConfigResolver(): void {
  activeResolver = environmentResolver;
}

/**
 * The active pricing configuration. Read it; never restate its values.
 *
 * Pass whatever scope you know — the state the user has selected, the category
 * of the vehicle being priced. It costs nothing today and is what makes
 * state-wise pricing a change to this file alone.
 */
export function getPricingConfig(scope?: PricingScope): PricingConfig {
  return activeResolver(scope);
}
