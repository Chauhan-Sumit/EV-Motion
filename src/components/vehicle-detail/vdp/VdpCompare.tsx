import { cn } from "@/lib/utils";
import type { ResolvedCompareColumn } from "@/lib/vehicle-detail/calculations";
import type { SectionCopy } from "@/lib/vehicle-detail/types";
import { CarIllustration } from "./CarIllustration";
import { PrototypeSection } from "./Section";

/**
 * Side-by-side comparison against the two cars shoppers put beside this one.
 *
 * The `self` column is filled from the live configuration rather than a fixed
 * trim, so switching variant re-states the comparison — a reader who has
 * configured the cheaper pack is shown *that* car's on-road price against the
 * rivals, not the one the page happened to load with.
 *
 * On a phone the three columns scroll horizontally rather than stacking:
 * stacked columns stop being a comparison.
 */
export function VdpCompare({
  copy,
  columns,
}: {
  copy: SectionCopy;
  columns: ResolvedCompareColumn[];
}) {
  return (
    <PrototypeSection copy={copy}>
      <div className="scroll-row -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {columns.map((column) => (
          <article
            key={column.id}
            className={cn(
              "flex w-[240px] shrink-0 flex-col rounded-xl border bg-surface shadow-card sm:w-auto sm:flex-1",
              column.self ? "border-primary ring-1 ring-primary/25" : "border-border",
            )}
          >
            <div className="flex items-center justify-center border-b border-border bg-surface-secondary px-4 py-3">
              <CarIllustration
                shape={column.shape}
                bodyColor={column.hex}
                alt={`${column.name} illustration`}
                className="max-w-[180px]"
              />
            </div>

            <div className="flex flex-col gap-0.5 px-4 py-3">
              <span className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-ink">
                {column.name}
                {column.self ? (
                  <span className="rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-accent-foreground">
                    This car
                  </span>
                ) : null}
              </span>
              <span className="text-[11px] text-ink-muted">{column.brand}</span>
            </div>

            <dl className="flex flex-col border-t border-border px-4 pb-3">
              {column.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-0.5 border-b border-border py-2 last:border-b-0"
                >
                  <dt className="text-[11px] text-ink-muted">{row.label}</dt>
                  <dd
                    className={cn(
                      "text-[13px] tabular-nums",
                      row.unpublished ? "font-normal text-ink-muted" : "font-semibold text-ink",
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </PrototypeSection>
  );
}
