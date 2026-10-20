import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { MAX_COMPARE } from "@/lib/compare/slug";
import type { SortOption } from "@/lib/brand-page/copy";

/**
 * Every model the brand sells: heading, count, sort, and the compact tiles
 * passed in as children.
 */
export function BrandModels<K extends string>({
  heading,
  count,
  emptyNoun,
  sort,
  sortOptions,
  onSortChange,
  children,
}: {
  heading: string;
  count: number;
  /** "electric cars", "electric scooters" — for the empty state. */
  emptyNoun: string;
  sort: K;
  sortOptions: readonly SortOption<K>[];
  onSortChange: (next: K) => void;
  children: ReactNode;
}) {
  return (
    <section id="models" aria-labelledby="models-h2" className="scroll-mt-[84px] pt-9">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <div>
          <h2 id="models-h2" className="text-[clamp(22px,2.4vw,28px)] font-[750] leading-[1.15] tracking-[-.035em]">
            {heading}
          </h2>
          <p className="mt-1 text-[14.5px] text-ink-muted">
            {count} model{count === 1 ? "" : "s"} · ex-showroom prices{count > 1 ? ` · tick up to ${MAX_COMPARE} to compare` : ""}
          </p>
        </div>
        {count > 1 ? (
          <label className="relative flex h-10 items-center gap-1.5 rounded-xl border border-border bg-surface pl-3 pr-[34px] text-[13.5px] focus-within:border-primary max-[760px]:w-full">
            <span className="whitespace-nowrap text-ink-muted">Sort by</span>
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(e) => onSortChange(sortOptions.find((o) => o.value === e.target.value)?.value ?? sort)}
              className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-[13.5px] font-semibold outline-none max-[760px]:w-full"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-ink-muted" strokeWidth={2.6} aria-hidden="true" />
          </label>
        ) : null}
      </div>

      {count ? (
        <div id="results" aria-live="polite" className="grid grid-cols-4 gap-3.5 max-[1240px]:grid-cols-3 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-3">
          {children}
        </div>
      ) : (
        <div className="rounded-[18px] border border-dashed border-border bg-surface px-5 py-[60px] text-center">
          <h3 className="text-[22px] font-bold">No {emptyNoun} listed right now</h3>
          <p className="mt-2 text-ink-muted">New launches will appear here.</p>
        </div>
      )}
    </section>
  );
}
