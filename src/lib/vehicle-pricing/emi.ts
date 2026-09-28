import { getPricingConfig } from "./config";

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalCost: number;
}

/** Standard reducing-balance EMI amortization — the one place any EMI figure on the site is computed. */
export function calculateEmi({
  principal,
  annualRatePct,
  tenureMonths,
}: {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
}): EmiResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalCost: 0 };
  }
  if (annualRatePct <= 0) {
    const emi = principal / tenureMonths;
    return { emi, totalInterest: 0, totalCost: principal };
  }
  const monthlyRate = annualRatePct / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  const totalCost = emi * tenureMonths;
  return { emi, totalInterest: totalCost - principal, totalCost };
}

/**
 * The assumption behind every "EMI from ₹X/mo" figure on the site.
 *
 * Resolved from `config.ts`, not written out here — the rate and tenure are
 * deployment settings, and a second copy of them in this file is precisely how
 * the VDP and a listing card end up quoting different EMIs for the same
 * vehicle. A getter rather than a constant so it always reflects the resolved
 * configuration.
 */
export function defaultEmiAssumption(): {
  downPct: number;
  annualRatePct: number;
  tenureMonths: number;
} {
  const { finance } = getPricingConfig();
  return {
    downPct: finance.defaultDownPaymentPct,
    annualRatePct: finance.annualRatePct,
    tenureMonths: finance.defaultTenureMonths,
  };
}

/**
 * @deprecated Kept so existing call sites keep compiling. Prefer
 * `defaultEmiAssumption()`, or read `getPricingConfig().finance` directly.
 */
export const DEFAULT_EMI_ASSUMPTION = defaultEmiAssumption();

/** Convenience wrapper for the common "EMI from" display case, off a single ex-showroom figure (in rupees). */
export function estimateEmiFrom(exShowroom: number): number {
  const { downPct, annualRatePct, tenureMonths } = defaultEmiAssumption();
  return calculateEmi({
    principal: exShowroom * (1 - downPct / 100),
    annualRatePct,
    tenureMonths,
  }).emi;
}
