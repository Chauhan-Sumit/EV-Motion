import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";
import { Disclosure } from "./Disclosure";

export function SectionFaqs({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <VehicleSection id="faqs" title="Frequently Asked Questions">
      <div className="max-w-2xl overflow-hidden rounded-xl border border-border bg-surface">
        {vehicle.faqs.map((faq) => (
          <Disclosure key={faq.id} title={faq.question}>
            <p className="text-[12px] leading-relaxed text-ink-secondary">{faq.answer}</p>
          </Disclosure>
        ))}
      </div>
    </VehicleSection>
  );
}
