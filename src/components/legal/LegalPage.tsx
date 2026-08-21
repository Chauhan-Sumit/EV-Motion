import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LEGAL_DETAILS_PENDING, LEGAL_LAST_UPDATED } from "@/lib/legal";

/**
 * Shared shell for the Privacy Policy and Terms of Use, so the two cannot
 * drift in typography or in how they present their "last updated" date.
 *
 * Uses the locked design system's tokens rather than a prose plugin — these
 * are the only long-form text pages on the site, and one shared shell is
 * cheaper than adding a typography dependency for two routes.
 */
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <Container className="py-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{title}</h1>
        <p className="mt-1.5 text-[11.5px] text-ink-muted">Last updated: {LEGAL_LAST_UPDATED}</p>
        <p className="mt-3.5 text-[13.5px] leading-relaxed text-ink-secondary">{intro}</p>

        {/* Disappears by itself once src/lib/legal.ts has real values — the
            same honest-empty-state rule the rest of the site follows for
            unsourced data: unfinished must never read as finished. */}
        {LEGAL_DETAILS_PENDING ? (
          <div className="mt-5 flex gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3.5">
            <AlertTriangle size={16} className="mt-px shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-[12.5px] leading-relaxed text-amber-900">
              <strong className="font-bold">This document is being finalised.</strong> Company details shown in square
              brackets are placeholders pending confirmation. The description of what data we collect and how we use it
              is accurate and complete; only the identifying details are outstanding.
            </p>
          </div>
        ) : null}

        <div className="mt-7 space-y-7">{children}</div>
      </div>
    </Container>
  );
}

/** One numbered section. `id` gives each heading a linkable anchor. */
export function LegalSection({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-[15px] font-bold tracking-tight text-ink">{heading}</h2>
      <div className="mt-2.5 space-y-2.5 text-[13.5px] leading-relaxed text-ink-secondary">{children}</div>
    </section>
  );
}

/** Bulleted list with the spacing the sections above expect. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-4 list-disc space-y-1.5 marker:text-ink-muted">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
