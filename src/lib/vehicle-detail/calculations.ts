import type { StateCharges } from "@/lib/data/state-charges";
import { calculateEmi as amortise, calculatePriceBreakdown } from "@/lib/vehicle-pricing";
import type {
  CompareColumn,
  PricingAssumptions,
  SpecDefinition,
  SpecRow,
  Variant,
  VdpViewModel,
} from "./types";

/**
 * Every number the Vehicle Detail Page shows is derived here.
 *
 * Nothing in this file imports React, touches the DOM or knows what a
 * component is — it is plain functions over plain data, so the arithmetic can
 * be read, argued with and (later) unit-tested without rendering anything. The
 * components' only job is to display what `deriveFigures()` returns.
 */

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Whole rupees, Indian digit grouping: 1499000 → "₹14,99,000". */
export function formatRupees(amount: number): string {
  return `₹${inr.format(Math.round(amount))}`;
}

/** Rupees to two decimals, for per-kilometre costs: 0.7742 → "₹0.77". */
export function formatRupeesPrecise(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

/**
 * On-road and EMI both delegate to `@/lib/vehicle-pricing` — the sites one
 * pricing system (CLAUDE.md #16). This page deliberately owns neither an
 * interest rate nor an on-road formula: a VDP quoting a different EMI from the
 * listing card beside it is exactly the drift that rule exists to prevent.
 */
export function calculateOnRoad(exShowroom: number, charges: StateCharges): number {
  return calculatePriceBreakdown(exShowroom, charges).onRoad;
}

/**
 * Energy cost per kilometre.
 *
 * Pack size ÷ claimed range gives kWh per km; times the unit tariff gives
 * rupees per km. It therefore inherits the claimed range's optimism — the page
 * says so next to the figure rather than quietly padding it.
 */
export function calculateEnergyCostPerKm(
  batteryKwh: number,
  rangeKm: number,
  costPerUnit: number,
): number {
  if (rangeKm <= 0) return 0;
  return (batteryKwh / rangeKm) * costPerUnit;
}

/** Fuel cost per kilometre for the petrol car being compared against. */
export function calculatePetrolCostPerKm(pricePerLitre: number, kmPerLitre: number): number {
  if (kmPerLitre <= 0) return 0;
  return pricePerLitre / kmPerLitre;
}

/** Cost of filling the pack from empty at the assumed tariff. */
export function calculateFullChargeCost(batteryKwh: number, costPerUnit: number): number {
  return batteryKwh * costPerUnit;
}

/** Resolves a spec definition against the selected variant. */
function resolveSpec(spec: SpecDefinition, variant: Variant): SpecRow {
  if ("from" in spec && spec.from) {
    switch (spec.from) {
      case "battery":
        return { label: spec.label, value: `${variant.batteryKwh} kWh`, unpublished: false };
      case "range":
        return { label: spec.label, value: `${variant.rangeKm} km`, unpublished: false };
      case "dcFastCharge":
        return variant.dcFastChargeMinutes === null
          ? { label: spec.label, value: "Not published", unpublished: true }
          : {
              label: spec.label,
              value: `${variant.dcFastChargeMinutes} min`,
              unpublished: false,
            };
    }
  }
  return { label: spec.label, value: spec.value, unpublished: Boolean(spec.unpublished) };
}

export function buildSpecRows(specs: SpecDefinition[], variant: Variant): SpecRow[] {
  return specs.map((spec) => resolveSpec(spec, variant));
}

export interface QuickSpec {
  label: string;
  value: string;
  unit: string;
}

/**
 * The hero's headline strip: the three figures that move with the variant,
 * followed by whatever fixed figures the vehicle adds.
 */
export function buildQuickSpecs(vehicle: VdpViewModel, variant: Variant): QuickSpec[] {
  return [
    { label: "Range", value: String(variant.rangeKm), unit: "km" },
    { label: "Battery", value: String(variant.batteryKwh), unit: "kWh" },
    {
      label: "10 → 80%",
      value: variant.dcFastChargeMinutes === null ? "—" : String(variant.dcFastChargeMinutes),
      unit: variant.dcFastChargeMinutes === null ? "" : "min",
    },
    ...vehicle.staticQuickSpecs,
  ];
}

export interface ResolvedCompareColumn extends Omit<CompareColumn, "rows"> {
  rows: { label: string; value: string; unpublished: boolean }[];
}

/**
 * Fills the `{ live: … }` placeholders in the comparison table from the current
 * configuration, so the car this page is about is compared as configured
 * rather than at some fixed trim.
 */
export function resolveCompareColumns(
  columns: CompareColumn[],
  live: { onRoad: string; range: string; battery: string },
  context: { city: string; charges: StateCharges },
): ResolvedCompareColumn[] {
  return columns.map((column) => ({
    ...column,
    rows: column.rows.map((row) => {
      let value: string;
      if (typeof row.value === "string") {
        value = row.value;
      } else if (row.value.live === "onRoad" && !column.self && column.exShowroom) {
        // A rival's on-road, quoted on the same basis as this vehicle's —
        // same city, same RTO rates. Quoting one column on-road and the
        // others "from ₹X ex-showroom" would not be a comparison.
        value = formatRupees(calculateOnRoad(column.exShowroom, context.charges));
      } else {
        value = live[row.value.live];
      }
      return {
        label: row.label.replace("{city}", context.city),
        value,
        unpublished: value === "Not published",
      };
    }),
  }));
}

/** What the user has chosen. The single source of truth for every figure below. */
export interface ConfiguratorState {
  variantId: string;
  colourId: string;
  shotIndex: number;
  kmPerDay: number;
  downPaymentPercent: number;
  tenureMonths: number;
}

/** Everything the page displays, derived once per state change. */
export interface DerivedFigures {
  exShowroom: number;
  exShowroomLabel: string;
  onRoad: number;
  onRoadLabel: string;
  /** EMI at the default tenure with nothing down — the headline figure. */
  headlineEmi: number;
  headlineEmiLabel: string;
  /** EMI as configured in the sidebar calculator. */
  configuredEmi: number;
  configuredEmiLabel: string;
  downPayment: number;
  downPaymentLabel: string;
  energyCostPerKm: number;
  energyCostPerKmLabel: string;
  petrolCostPerKm: number;
  petrolCostPerKmLabel: string;
  electricMonthly: number;
  electricMonthlyLabel: string;
  petrolMonthly: number;
  petrolMonthlyLabel: string;
  monthlySaving: number;
  monthlySavingLabel: string;
  annualSaving: number;
  annualSavingLabel: string;
  /** Electric bar width as a percentage of the petrol bar, which sits at 100%. */
  electricBarPercent: number;
  fullChargeCost: number;
  fullChargeCostLabel: string;
  dcFastChargeLabel: string;
  dcFastChargeUnpublished: boolean;
  rangeLabel: string;
  batteryLabel: string;
}

/**
 * The prototype's one calculation entry point.
 *
 * Components receive this object and read labels off it. They never format a
 * rupee value or divide anything themselves, which is what keeps the
 * arithmetic in one reviewable place.
 */
export function deriveFigures(
  variant: Variant,
  state: ConfiguratorState,
  assumptions: PricingAssumptions,
): DerivedFigures {
  const onRoad = calculateOnRoad(variant.exShowroom, assumptions.charges);

  const headlineEmi = amortise({
    principal: variant.exShowroom,
    annualRatePct: assumptions.annualRatePct,
    tenureMonths: assumptions.defaultTenureMonths,
  }).emi;

  const downPayment = (variant.exShowroom * state.downPaymentPercent) / 100;
  const configuredEmi = amortise({
    principal: variant.exShowroom - downPayment,
    annualRatePct: assumptions.annualRatePct,
    tenureMonths: state.tenureMonths,
  }).emi;

  const energyCostPerKm = calculateEnergyCostPerKm(
    variant.batteryKwh,
    variant.rangeKm,
    assumptions.electricityCostPerUnit,
  );
  const petrolCostPerKm = calculatePetrolCostPerKm(
    assumptions.petrolPricePerLitre,
    assumptions.petrolKmPerLitre,
  );

  const monthlyKm = state.kmPerDay * assumptions.daysPerMonth;
  const electricMonthly = energyCostPerKm * monthlyKm;
  const petrolMonthly = petrolCostPerKm * monthlyKm;
  const monthlySaving = petrolMonthly - electricMonthly;

  const fullChargeCost = calculateFullChargeCost(
    variant.batteryKwh,
    assumptions.electricityCostPerUnit,
  );

  const dcUnpublished = variant.dcFastChargeMinutes === null;

  return {
    exShowroom: variant.exShowroom,
    exShowroomLabel: formatRupees(variant.exShowroom),
    onRoad,
    onRoadLabel: formatRupees(onRoad),
    headlineEmi,
    headlineEmiLabel: formatRupees(headlineEmi),
    configuredEmi,
    configuredEmiLabel: formatRupees(configuredEmi),
    downPayment,
    downPaymentLabel:
      state.downPaymentPercent > 0
        ? `${formatRupees(downPayment)} · ${state.downPaymentPercent}%`
        : formatRupees(0),
    energyCostPerKm,
    energyCostPerKmLabel: formatRupeesPrecise(energyCostPerKm),
    petrolCostPerKm,
    petrolCostPerKmLabel: formatRupeesPrecise(petrolCostPerKm),
    electricMonthly,
    electricMonthlyLabel: formatRupees(electricMonthly),
    petrolMonthly,
    petrolMonthlyLabel: formatRupees(petrolMonthly),
    monthlySaving,
    monthlySavingLabel: formatRupees(monthlySaving),
    annualSaving: monthlySaving * 12,
    annualSavingLabel: formatRupees(monthlySaving * 12),
    electricBarPercent: petrolMonthly > 0 ? (electricMonthly / petrolMonthly) * 100 : 0,
    fullChargeCost,
    fullChargeCostLabel: formatRupees(fullChargeCost),
    dcFastChargeLabel: dcUnpublished ? "Not published" : `${variant.dcFastChargeMinutes} min`,
    dcFastChargeUnpublished: dcUnpublished,
    rangeLabel: `${variant.rangeKm} km`,
    batteryLabel: `${variant.batteryKwh} kWh`,
  };
}
