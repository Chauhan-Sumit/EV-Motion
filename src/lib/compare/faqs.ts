import type { VehicleDetail } from "@/types/vehicle-detail";
import { formatPriceLakh } from "@/lib/utils";

export interface ComparisonFaq {
  question: string;
  answer: string;
}

/** Auto-generated, entirely from real compared data — no invented Q&A copy. */
export function computeComparisonFaqs(vehicles: VehicleDetail[]): ComparisonFaq[] {
  if (vehicles.length < 2) return [];
  const names = vehicles.map((v) => v.name);
  const faqs: ComparisonFaq[] = [];

  const byRange = [...vehicles].sort((a, b) => b.quickSpecs.rangeKm - a.quickSpecs.rangeKm);
  faqs.push({
    question: `Which has a longer range — ${names.join(" or ")}?`,
    answer: `The ${byRange[0].name} has the longer claimed range at ${byRange[0].quickSpecs.rangeKm} km, compared to ${byRange
      .slice(1)
      .map((v) => `the ${v.name}'s ${v.quickSpecs.rangeKm} km`)
      .join(" and ")}.`,
  });

  const byPrice = [...vehicles].sort((a, b) => a.startingPrice - b.startingPrice);
  faqs.push({
    question: `Which is cheaper — ${names.join(" or ")}?`,
    answer: `The ${byPrice[0].name} has the lower starting price at ${formatPriceLakh(byPrice[0].startingPrice / 100000)}, ex-showroom.`,
  });

  // Emitted as schema.org FAQPage markup, so this answer only gets published
  // when at least two of the compared vehicles have a real, manufacturer-
  // published DC time to rank. Previously every vehicle had one, because an
  // absent time was silently backfilled from its AC charging hours.
  const withCharge = vehicles.filter((v) => v.quickSpecs.fastChargeMinutes !== undefined);
  if (withCharge.length >= 2) {
    const byCharge = [...withCharge].sort(
      (a, b) => a.quickSpecs.fastChargeMinutes! - b.quickSpecs.fastChargeMinutes!,
    );
    faqs.push({
      question: `Which charges faster?`,
      answer: `The ${byCharge[0].name} DC fast-charges from 10-80% in about ${byCharge[0].quickSpecs.fastChargeMinutes} minutes, the quickest among the vehicles compared here with a published fast-charging time.`,
    });
  }

  const byBattery = [...vehicles].sort((a, b) => b.quickSpecs.batteryKwh - a.quickSpecs.batteryKwh);
  faqs.push({
    question: `Which has the bigger battery?`,
    answer: `The ${byBattery[0].name} has the largest battery at ${byBattery[0].quickSpecs.batteryKwh} kWh.`,
  });

  return faqs;
}
