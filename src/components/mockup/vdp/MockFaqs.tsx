import { MessageCircleQuestion, Plus } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, SectionHead } from "./Shell";

/**
 * MOCKUP FAQs.
 *
 * Built on native `<details>`/`<summary>` so it needs no client JavaScript and
 * keeps keyboard and screen-reader behaviour for free. The questions and
 * answers are the real generated ones from `toVehicleDetail()` — they are also
 * emitted as schema.org FAQPage markup in production, so every answer has to
 * be defensible as published fact.
 */
export function MockFaqs({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <Band id="faqs" tone="light">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <div className="lg:sticky lg:top-[132px]">
              <SectionHead
                eyebrow="Questions"
                title={
                  <>
                    Before you
                    <br className="hidden lg:block" /> decide
                  </>
                }
                lead="The things people ask most about this model."
                className="mb-6"
              />
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-secondary p-5">
                <MessageCircleQuestion size={17} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-[12.5px] font-bold text-ink">Something not answered here?</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-ink-secondary">
                    Ask it and we will answer against the manufacturer specification, not a sales pitch.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 divide-y divide-border border-y border-border">
            {vehicle.faqs.map((faq) => (
              <details key={faq.id} className="group py-5">
                <summary className="focus-ring flex cursor-pointer list-none items-start justify-between gap-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[14.5px] font-bold leading-snug tracking-tight text-ink transition-colors group-open:text-primary sm:text-[16px]">
                    {faq.question}
                  </h3>
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-ink-secondary transition-all group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-white"
                    aria-hidden="true"
                  >
                    <Plus size={15} />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-12 text-[13px] leading-relaxed text-ink-secondary">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Band>
  );
}
