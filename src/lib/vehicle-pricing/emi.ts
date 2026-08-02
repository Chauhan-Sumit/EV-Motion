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

/** Standard assumption every "EMI from ₹X/mo" figure on the site uses: 80% financed, 9.5% p.a., 60 months. */
export const DEFAULT_EMI_ASSUMPTION = { downPct: 20, annualRatePct: 9.5, tenureMonths: 60 } as const;

/** Convenience wrapper for the common "EMI from" display case, off a single ex-showroom figure (in rupees). */
export function estimateEmiFrom(exShowroom: number): number {
  const principal = exShowroom * (1 - DEFAULT_EMI_ASSUMPTION.downPct / 100);
  return calculateEmi({
    principal,
    annualRatePct: DEFAULT_EMI_ASSUMPTION.annualRatePct,
    tenureMonths: DEFAULT_EMI_ASSUMPTION.tenureMonths,
  }).emi;
}
