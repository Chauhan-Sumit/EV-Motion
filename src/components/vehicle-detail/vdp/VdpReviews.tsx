import { Button } from "@/components/ui/button";
import type { ReviewSummary, SectionCopy } from "@/lib/vehicle-detail/types";
import { Card, PrototypeSection } from "./Section";

/**
 * Owner reviews — an honest empty state, not invented testimonials.
 *
 * No ratings exist yet, so the histogram reads zero and the two cards below
 * show the *fields* a real review will fill (who wrote it, how long they have
 * owned it, which variant, which city) as grey rules. That communicates what
 * the section will become without the page asserting praise nobody gave it.
 */
export function VdpReviews({ copy, reviews }: { copy: SectionCopy; reviews: ReviewSummary }) {
  const maxCount = Math.max(1, ...reviews.histogram.map((bar) => bar.count));

  return (
    <PrototypeSection copy={copy}>
      <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className="text-[2.5rem] font-extrabold leading-none tracking-[-0.03em] text-ink">
            {reviews.averageRating ?? "—"}
          </span>
          <span className="text-[11px] text-ink-muted">
            {reviews.totalRatings} {reviews.totalRatings === 1 ? "rating" : "ratings"}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {reviews.histogram.map((bar) => (
            <div key={bar.stars} className="flex items-center gap-2.5">
              <span className="w-11 shrink-0 text-[11px] text-ink-secondary">
                {bar.stars} star
              </span>
              <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-secondary">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${(bar.count / maxCount) * 100}%` }}
                />
              </span>
              <span className="w-5 shrink-0 text-right text-[11px] tabular-nums text-ink-muted">
                {bar.count}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {[0, 1].map((index) => (
          <li
            key={index}
            className="flex flex-col gap-2.5 rounded-xl border border-dashed border-border-strong bg-surface p-4"
          >
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="size-8 shrink-0 rounded-full bg-surface-secondary" />
              <span className="text-[11px] text-ink-muted">
                {reviews.placeholderFields.heading}
              </span>
            </div>
            <span className="text-[11px] text-ink-muted">{reviews.placeholderFields.meta}</span>
            <span aria-hidden className="h-2 w-full rounded-full bg-surface-secondary" />
            <span aria-hidden className="h-2 w-full rounded-full bg-surface-secondary" />
            <span aria-hidden className="h-2 w-2/3 rounded-full bg-surface-secondary" />
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Button variant="outline" className="h-9 text-[13px]">
          Write the first review
        </Button>
      </div>
    </PrototypeSection>
  );
}
