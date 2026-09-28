import { cn } from "@/lib/utils";
import type { SectionCopy, SpecRow } from "@/lib/vehicle-detail/types";
import { Card, PrototypeSection } from "./Section";

/**
 * The full spec sheet.
 *
 * A figure the maker has not published renders as a muted "Not published"
 * rather than being estimated — the same rule the production VDP follows. An
 * invented number is worse than a gap, because a gap is honest about itself.
 */
export function VdpSpecifications({ copy, rows }: { copy: SectionCopy; rows: SpecRow[] }) {
  return (
    <PrototypeSection copy={copy}>
      <Card padded={false}>
        <dl className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 bg-surface px-4 py-3"
            >
              <dt className="text-[12px] text-ink-secondary">{row.label}</dt>
              <dd
                className={cn(
                  "text-right text-[13px] tabular-nums",
                  row.unpublished ? "font-normal text-ink-muted" : "font-semibold text-ink",
                )}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </PrototypeSection>
  );
}
