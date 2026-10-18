import type { VehicleCategory } from "@/types/vehicle";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { calculateEmi, getPricingConfig } from "@/lib/vehicle-pricing";
import type { RangeConfig } from "@/lib/vehicle-pricing/config";

/**
 * Ownership maths for the showroom Compare page — EMI, running cost, 5-year
 * cost, and the two charging estimates.
 *
 * Every rate it opens at comes from the pricing service (`getPricingConfig`),
 * and every EMI goes through the one amortisation function the site has
 * (`calculateEmi`), so the figures here agree with the listing cards and the
 * Vehicle Detail Page on first paint. What this file adds is only what the
 * page lets the reader *change* — and each of those is an assumption the page
 * prints beside the number it drives.
 */

/**
 * ₹/unit at a public DC charger. Not in the pricing configuration yet — it is
 * the figure the previous Compare page's charging calculator stated. Promote it
 * into `RunningCostConfig` so a deployment can change it like the other rates.
 */
export const PUBLIC_CHARGING_PER_UNIT = 15;

/** Share of charging done at home that the running-cost calculator opens at. */
export const DEFAULT_HOME_SHARE_PCT = 80;

/** Share of the claimed range a 10–80% DC session adds. */
const DC_SESSION_SHARE = 0.7;

export interface OwnershipSettings {
  downPaymentPct: number;
  annualRatePct: number;
  tenureMonths: number;
  kmPerMonth: number;
  homeTariff: number;
  homeSharePct: number;
}

export interface OwnershipBounds {
  downPaymentPct: RangeConfig;
  annualRatePct: RangeConfig;
  tenureMonths: RangeConfig;
  kmPerMonth: RangeConfig;
  homeTariff: RangeConfig;
  homeSharePct: RangeConfig;
}

export function defaultOwnershipSettings(category: VehicleCategory): OwnershipSettings {
  const { finance, runningCost } = getPricingConfig({ category });
  return {
    downPaymentPct: finance.defaultDownPaymentPct,
    annualRatePct: finance.annualRatePct,
    tenureMonths: finance.defaultTenureMonths,
    kmPerMonth: runningCost.dailyKmByCategory[category] * runningCost.daysPerMonth,
    homeTariff: runningCost.electricityCostPerUnit,
    homeSharePct: DEFAULT_HOME_SHARE_PCT,
  };
}

/**
 * Slider bounds. Down payment and tenure are the site-wide finance bounds;
 * the rest are control ranges from the approved design, widened where needed
 * so the configured default always sits inside them.
 */
export function ownershipBounds(category: VehicleCategory): OwnershipBounds {
  const { finance } = getPricingConfig({ category });
  const d = defaultOwnershipSettings(category);
  return {
    downPaymentPct: finance.downPaymentPct,
    tenureMonths: finance.tenureMonths,
    annualRatePct: { min: Math.min(7.5, d.annualRatePct), max: Math.max(13, d.annualRatePct), step: 0.25 },
    kmPerMonth: { min: 300, max: Math.max(3000, d.kmPerMonth), step: 100 },
    homeTariff: { min: 5, max: Math.max(12, d.homeTariff), step: 0.5 },
    homeSharePct: { min: 0, max: 100, step: 10 },
  };
}

/** ₹ per kWh, blended across home and public charging. */
export function blendedUnitRate(s: OwnershipSettings): number {
  const home = s.homeSharePct / 100;
  return home * s.homeTariff + (1 - home) * PUBLIC_CHARGING_PER_UNIT;
}

/**
 * kWh per 100 km, from the published battery and claimed range. A ratio of
 * two published figures, labelled as such wherever it is shown; it inherits
 * the battery's gross/usable basis, so it is ranked only when that basis
 * matches across the set (see `metrics.ts`).
 */
export function energyPer100Km(v: VehicleDetail): number {
  return (v.quickSpecs.batteryKwh / v.quickSpecs.rangeKm) * 100;
}

export function monthlyRunningCost(v: VehicleDetail, s: OwnershipSettings): number {
  return ((s.kmPerMonth * energyPer100Km(v)) / 100) * blendedUnitRate(s);
}

export function runningCostPerKm(v: VehicleDetail, s: OwnershipSettings): number {
  return (energyPer100Km(v) / 100) * blendedUnitRate(s);
}

export interface EmiQuote {
  emi: number;
  principal: number;
  totalInterest: number;
}

export function emiQuote(onRoad: number, s: OwnershipSettings): EmiQuote {
  const principal = onRoad * (1 - s.downPaymentPct / 100);
  const r = calculateEmi({ principal, annualRatePct: s.annualRatePct, tenureMonths: s.tenureMonths });
  return { emi: r.emi, principal, totalInterest: r.totalInterest };
}

/** On-road price plus five years of charging at the reader's settings. */
export function fiveYearCost(onRoad: number, v: VehicleDetail, s: OwnershipSettings): number {
  return onRoad + monthlyRunningCost(v, s) * 60;
}

/**
 * Average km of claimed range added in 15 minutes on a DC charger: the 70% a
 * 10–80% session adds, spread over its published duration. Null without a
 * published DC time — never backfilled.
 */
export function rangePer15MinDc(v: VehicleDetail): number | null {
  const minutes = v.quickSpecs.fastChargeMinutes;
  if (!minutes) return null;
  return Math.round(((v.quickSpecs.rangeKm * DC_SESSION_SHARE) / minutes) * 15);
}

/** km of claimed range per hour on a home AC charger. */
export function acRangePerHour(v: VehicleDetail): number | null {
  const hours = v.charging.acHomeChargeHours;
  return hours > 0 ? v.quickSpecs.rangeKm / hours : null;
}

/** The petrol vehicle each category is costed against, from the pricing service. */
export function petrolComparator(category: VehicleCategory) {
  const { runningCost } = getPricingConfig({ category });
  const c = runningCost.petrolComparatorByCategory[category];
  return { ...c, pricePerLitre: runningCost.petrolPricePerLitre };
}

export function petrolMonthlyCost(category: VehicleCategory, s: OwnershipSettings): number {
  const p = petrolComparator(category);
  return (s.kmPerMonth / p.kmPerLitre) * p.pricePerLitre;
}
