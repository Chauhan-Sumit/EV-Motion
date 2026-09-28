import { PenLine, Star, ThumbsUp } from "lucide-react";
import { Band, Container, Kicker, Pill, SectionHead } from "./Shell";
import { demoRatingSummary, demoReviews } from "./demo-content";
import { cn } from "@/lib/utils";

/**
 * MOCKUP owner reviews.
 *
 * Every rating, count and review body here is placeholder demo content — the
 * production site has no review store, and reviews are local React state. This
 * section is a layout study for what a real review section would look like:
 * a rating summary with a distribution, then long-form owner entries with
 * ownership duration attached, which is the detail that makes an EV review
 * useful.
 */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={cn(i <= Math.round(rating) ? "fill-primary text-primary" : "fill-border text-border")}
        />
      ))}
    </span>
  );
}

export function MockReviews() {
  const { average, count, distribution } = demoRatingSummary;

  return (
    <Band id="reviews" tone="tinted">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Owner reviews"
          title="From people who live with it"
          lead="Placeholder content in this prototype. A real review section would carry verified-owner badges and the length of ownership beside every entry."
          action={
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-primary-hover"
            >
              <PenLine size={14} />
              Write a review
            </button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-5">
          {/* ---- Summary ---- */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 lg:sticky lg:top-[132px] lg:self-start">
            <div className="flex items-end gap-4">
              <p className="text-[52px] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ink">
                {average}
              </p>
              <div className="mb-1.5">
                <Stars rating={average} size={15} />
                <p className="mt-1.5 text-[11px] text-ink-muted">{count} reviews</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              {distribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="flex w-8 shrink-0 items-center gap-0.5 text-[11px] font-bold tabular-nums text-ink-secondary">
                    {row.stars}
                    <Star size={10} className="fill-ink-muted text-ink-muted" />
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-secondary">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-primary to-primary-bright"
                      style={{ width: `${row.share}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right text-[11px] font-semibold tabular-nums text-ink-muted">
                    {row.share}%
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 border-t border-border pt-5 text-[11px] leading-relaxed text-ink-muted">
              Ratings shown are demo values for this design prototype.
            </p>
          </div>

          {/* ---- Review entries ---- */}
          <div className="flex min-w-0 flex-col gap-4">
            {demoReviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-[12px] font-extrabold text-primary-hover">
                    {review.author.slice(-1)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-ink">{review.author}</p>
                    <p className="text-[10.5px] text-ink-muted">
                      {review.city} · owned {review.ownedFor}
                    </p>
                  </div>
                  <span className="ml-auto flex items-center gap-2">
                    <Pill accent>Verified owner</Pill>
                    <Stars rating={review.rating} />
                  </span>
                </div>

                <p className="text-[14px] font-bold leading-snug tracking-tight text-ink">{review.title}</p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-secondary">{review.body}</p>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                  <button
                    type="button"
                    className="focus-ring flex items-center gap-1.5 text-[11px] font-bold text-ink-secondary transition-colors hover:text-primary"
                  >
                    <ThumbsUp size={13} />
                    Helpful
                    <span className="tabular-nums text-ink-muted">({review.helpful})</span>
                  </button>
                  <Kicker className="ml-auto">Demo content</Kicker>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Band>
  );
}
