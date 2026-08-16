import type { VehicleCategory } from "@/types/vehicle";

/**
 * Estimated, state-level EV on-road charges and subsidy policy — not sourced
 * from a live government API (this app has no backend). Modelled on the
 * well-documented general shape of Indian state EV policy: many large states
 * offer a full or near-full road-tax/registration waiver for EVs, a smaller
 * set layer an additional direct purchase subsidy on top of that, and the
 * rest fall back to a standard estimated rate. Every UI surface using this
 * table labels its output "estimated" — same honesty convention as the
 * rest of the site's ownership-cost tools.
 */
export interface StateCharges {
  /** Road tax / RTO registration, as a % of ex-showroom price. Many states waive this for EVs. */
  registrationPct: number;
  /** Motor insurance, as a % of ex-showroom price. */
  insurancePct: number;
  /** Whether this state currently layers a direct purchase subsidy on top of its registration waiver. */
  hasPurchaseSubsidy: boolean;
  /**
   * State road tax/cess, as a % of ex-showroom price — a separate line item from
   * `registrationPct`'s RTO fee, added for the Vehicle Detail Page's itemized
   * price breakdown (see `src/lib/vehicle-pricing/`). Additive field: existing consumers
   * reading only `registrationPct`/`insurancePct`/`hasPurchaseSubsidy` (Compare
   * page, homepage Subsidy Calculator) are unaffected by its presence.
   */
  roadTaxPct: number;
  /** Flat estimated standard charges (handling, logistics, smart card/FASTag) added to every on-road estimate, regardless of state. Same additive-only note as `roadTaxPct` above. */
  otherChargesFlat: number;
}

const DEFAULT_CHARGES: StateCharges = { registrationPct: 4, insurancePct: 3, hasPurchaseSubsidy: false, roadTaxPct: 2, otherChargesFlat: 8500 };

/** States with a full/near-full EV road-tax or registration waiver. */
const WAIVER_STATES: StateCharges = { registrationPct: 0, insurancePct: 3, hasPurchaseSubsidy: false, roadTaxPct: 0, otherChargesFlat: 8500 };

/** States that layer a direct purchase subsidy on top of the waiver — the app's existing ceiling figures apply here. */
const SUBSIDY_STATES: StateCharges = { registrationPct: 0, insurancePct: 3, hasPurchaseSubsidy: true, roadTaxPct: 0, otherChargesFlat: 8500 };

/** A few larger states offer a partial (not full) EV registration concession rather than a full waiver. */
const PARTIAL_WAIVER_STATES: StateCharges = { registrationPct: 1.5, insurancePct: 3, hasPurchaseSubsidy: false, roadTaxPct: 1, otherChargesFlat: 8500 };

export const STATE_CHARGES: Record<string, StateCharges> = {
  // Direct purchase subsidy + registration waiver
  "Delhi": SUBSIDY_STATES,
  "Gujarat": SUBSIDY_STATES,
  "Maharashtra": SUBSIDY_STATES,
  "Meghalaya": SUBSIDY_STATES,
  "Punjab": SUBSIDY_STATES,
  "Rajasthan": SUBSIDY_STATES,

  // Registration/road-tax waiver only, no separate purchase subsidy
  "Karnataka": WAIVER_STATES,
  "Kerala": WAIVER_STATES,
  "Tamil Nadu": WAIVER_STATES,
  "Telangana": WAIVER_STATES,
  "Andhra Pradesh": WAIVER_STATES,
  "West Bengal": WAIVER_STATES,
  "Bihar": WAIVER_STATES,
  "Odisha": WAIVER_STATES,
  "Assam": WAIVER_STATES,
  "Uttar Pradesh": WAIVER_STATES,
  "Haryana": WAIVER_STATES,
  "Chandigarh": WAIVER_STATES,
  "Goa": WAIVER_STATES,
  "Uttarakhand": WAIVER_STATES,
  "Jharkhand": WAIVER_STATES,
  "Himachal Pradesh": WAIVER_STATES,

  // Partial concession
  "Madhya Pradesh": PARTIAL_WAIVER_STATES,
  "Chhattisgarh": PARTIAL_WAIVER_STATES,
};

export function chargesForState(state: string): StateCharges {
  return STATE_CHARGES[state] ?? DEFAULT_CHARGES;
}

const SUBSIDY_CEILING: Record<VehicleCategory, string> = {
  car: "up to ₹1,50,000",
  "2-wheeler": "up to ₹30,000",
  commercial: "varies by vehicle class under FAME-II / PM E-DRIVE",
};

const REGISTRATION_LABEL: Record<VehicleCategory, string> = {
  car: "Road tax / registration waiver",
  "2-wheeler": "Registration waiver",
  commercial: "Permit / road tax waiver",
};

/** State-aware two-row breakdown for the Ownership Tools "Subsidy Calculator" card. */
export function subsidyRowsForState(state: string, category: VehicleCategory): { label: string; value: string }[] {
  const charges = chargesForState(state);
  const registrationValue =
    charges.registrationPct === 0
      ? "100% waived"
      : `Reduced (~${charges.registrationPct}% of ex-showroom)`;

  return [
    {
      label: `State subsidy in ${state}`,
      value: charges.hasPurchaseSubsidy ? SUBSIDY_CEILING[category] : "No active purchase subsidy on file",
    },
    { label: REGISTRATION_LABEL[category], value: registrationValue },
  ];
}

/** State-aware subsidy message — honest "not currently available" for states with no active purchase subsidy. */
export function subsidyMessageForState(state: string, category: VehicleCategory): string {
  const charges = chargesForState(state);
  const waiverNote =
    charges.registrationPct === 0
      ? "a full road-tax/registration waiver"
      : charges.registrationPct < DEFAULT_CHARGES.registrationPct
        ? "a reduced road-tax/registration rate"
        : "standard road tax/registration (no confirmed EV waiver on file)";

  if (charges.hasPurchaseSubsidy) {
    return `${state} currently offers a direct purchase subsidy ${SUBSIDY_CEILING[category]}, plus ${waiverNote}. Confirm the exact eligibility and amount with ${state}'s official EV policy.`;
  }
  return `${state} does not currently have an active direct purchase subsidy on file for this category, but offers ${waiverNote}. Central FAME-II / PM E-DRIVE incentives may still apply — confirm with ${state}'s official EV policy.`;
}
