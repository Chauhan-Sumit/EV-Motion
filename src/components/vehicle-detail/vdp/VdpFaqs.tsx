import type { Faq, SectionCopy } from "@/lib/vehicle-detail/types";
import { PrototypeSection } from "./Section";

/**
 * FAQs, as native `<details>` elements.
 *
 * No JavaScript, no state, no animation library: the browser already knows how
 * to open and close a disclosure, announce it to a screen reader and find text
 * inside a closed one. The first is open so the section never reads as a wall
 * of collapsed rows.
 */
export function VdpFaqs({ copy, faqs }: { copy: SectionCopy; faqs: Faq[] }) {
  return (
    <PrototypeSection copy={copy}>
      <div className="flex flex-col gap-2.5">
        {faqs.map((faq, index) => (
          <details
            key={faq.id}
            open={index === 0}
            className="group rounded-xl border border-border bg-surface px-4 shadow-card"
          >
            <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[14px] font-bold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden
                className="shrink-0 text-[18px] font-normal leading-none text-ink-muted transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-[70ch] pb-4 text-[13px] leading-relaxed text-ink-secondary">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </PrototypeSection>
  );
}
