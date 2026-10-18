"use client";

import { useMemo } from "react";
import { showroomFaqs } from "@/lib/compare/showroom/verdicts";
import { useShowroom } from "./ShowroomContext";
import { Reveal, SECTION, SectionHeader } from "./ui";

/** FAQs written from the compared data — the same generator feeds the page's FAQPage markup. */
export function FaqSection() {
  const { vehicles, settings, city } = useShowroom();
  const faqs = useMemo(() => showroomFaqs(vehicles, settings, city.name), [vehicles, settings, city.name]);
  if (!faqs.length) return null;
  return (
    <section id="faq" aria-labelledby="fH" className={SECTION}>
      <SectionHeader id="fH" eyebrow="FAQs" title="Questions buyers ask." />
      <Reveal>
        {faqs.map((f, i) => (
          <details key={f.question} open={i === 0} className="group border-b border-border first-of-type:border-t">
            <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold focus-ring [&::-webkit-details-marker]:hidden">
              {f.question}
              <span
                aria-hidden="true"
                className="size-3.5 flex-none transition-transform duration-[250ms] group-open:rotate-45"
                style={{ background: "linear-gradient(var(--ink),var(--ink)) center/14px 2px no-repeat, linear-gradient(var(--ink),var(--ink)) center/2px 14px no-repeat" }}
              />
            </summary>
            <p className="mb-6 max-w-[820px] text-ink-secondary">{f.answer}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
