import type { SectionCopy, SpecRow } from "@/lib/vehicle-detail/types";
import { Card, PrototypeSection } from "./Section";

/**
 * Overview: the one paragraph that says what the car is, over a glance grid of
 * the eight figures a shopper checks before reading anything else.
 *
 * Range and battery come from the selected variant, so the glance grid stays
 * true to the configuration rather than describing a trim the reader is not
 * looking at.
 */
export function VdpOverview({
  copy,
  summary,
  glance,
}: {
  copy: SectionCopy;
  summary: string;
  glance: SpecRow[];
}) {
  return (
    <PrototypeSection copy={copy}>
      <Card>
        <p className="max-w-[66ch] text-[13px] leading-relaxed text-ink-secondary">{summary}</p>

        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {glance.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 bg-surface px-3.5 py-3">
              <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">
                {row.label}
              </dt>
              <dd className="text-[14px] font-bold tabular-nums text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </PrototypeSection>
  );
}
