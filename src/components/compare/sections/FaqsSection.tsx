import { HelpCircle } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { Disclosure } from "@/components/vehicle-detail/Disclosure";
import { computeComparisonFaqs } from "@/lib/compare/faqs";

export function FaqsSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const comparisonFaqs = computeComparisonFaqs(vehicles);

  return (
    <CompareSectionCard id="faqs" title="Frequently Asked Questions" icon={HelpCircle}>
      {comparisonFaqs.length > 0 ? (
        <div className="max-w-2xl overflow-hidden rounded-xl border border-border bg-surface">
          {comparisonFaqs.map((faq) => (
            <Disclosure key={faq.question} title={faq.question}>
              <p className="text-[12px] leading-relaxed text-ink-secondary">{faq.answer}</p>
            </Disclosure>
          ))}
        </div>
      ) : null}

      {vehicles.map((v) =>
        v.faqs.length > 0 ? (
          <div key={v.slug} className="mt-5 max-w-2xl">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-muted">{v.name}</p>
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              {v.faqs.map((faq) => (
                <Disclosure key={faq.id} title={faq.question}>
                  <p className="text-[12px] leading-relaxed text-ink-secondary">{faq.answer}</p>
                </Disclosure>
              ))}
            </div>
          </div>
        ) : null,
      )}
    </CompareSectionCard>
  );
}
