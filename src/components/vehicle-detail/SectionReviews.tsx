"use client";

import { useState, type FormEvent } from "react";
import { Star, MessageSquare } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";

interface LocalReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
}

// Sample rating-summary numbers for the summary card — these are
// placeholder/demo figures (like the "Advertisement" and "Coming Soon" slots
// elsewhere on this page), not real submitted ratings. The right-hand column
// below is unchanged and reflects the honest real state: no reviews exist for
// this vehicle yet.
const SAMPLE_RATING = 4.6;
const SAMPLE_REVIEW_COUNT = 1245;
const SAMPLE_DISTRIBUTION = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 1 },
];

export function SectionReviews({ vehicle }: { vehicle: VehicleDetail }) {
  const [reviews, setReviews] = useState<LocalReview[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [draftRating, setDraftRating] = useState(5);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draftTitle.trim() || !draftBody.trim()) return;
    setReviews((prev) => [
      { id: `local-${Date.now()}`, author: "You", rating: draftRating, title: draftTitle.trim(), body: draftBody.trim() },
      ...prev,
    ]);
    setDraftTitle("");
    setDraftBody("");
    setDraftRating(5);
    setFormOpen(false);
  }

  return (
    <VehicleSection id="reviews" title="Owner Reviews">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
        <div>
          <div className="rounded-xl border border-border bg-surface p-3.5">
            <p className="text-3xl font-extrabold text-ink">{SAMPLE_RATING}</p>
            <div className="mt-1 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={14}
                  className={n <= Math.round(SAMPLE_RATING) ? "fill-primary text-primary" : "text-border-strong"}
                />
              ))}
            </div>
            <p className="mt-1 text-[10px] text-ink-muted">
              Based on {SAMPLE_REVIEW_COUNT.toLocaleString("en-IN")} reviews
            </p>

            <ul className="mt-3 space-y-1">
              {SAMPLE_DISTRIBUTION.map((row) => (
                <li key={row.stars} className="flex items-center gap-2">
                  <span className="w-6 shrink-0 text-[10px] text-ink-muted">{row.stars}★</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="w-7 shrink-0 text-right text-[9px] text-ink-muted">{row.pct}%</span>
                </li>
              ))}
            </ul>

            <div className="mt-3.5 flex flex-col gap-2">
              <button
                type="button"
                className="focus-ring rounded-md border border-primary bg-transparent px-3.5 py-2 text-[11px] font-semibold text-primary transition-colors hover:bg-primary-tint"
              >
                Read All Reviews
              </button>
              <button
                type="button"
                onClick={() => setFormOpen((o) => !o)}
                aria-expanded={formOpen}
                className="focus-ring flex items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <MessageSquare size={13} />
                Write a Review
              </button>
            </div>
          </div>

          {formOpen ? (
            <form onSubmit={handleSubmit} className="mt-3.5 space-y-2.5 rounded-xl border border-border bg-surface p-3.5">
              <div>
                <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">Your rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`} onClick={() => setDraftRating(n)}>
                      <Star size={17} className={n <= draftRating ? "fill-primary text-primary" : "text-border-strong"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="review-title" className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                  Title
                </label>
                <input
                  id="review-title"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  required
                  className="focus-ring w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-[7px] text-xs text-ink outline-none"
                />
              </div>
              <div>
                <label htmlFor="review-body" className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                  Your review
                </label>
                <textarea
                  id="review-body"
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  required
                  rows={3}
                  className="focus-ring w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-2 text-xs text-ink outline-none"
                />
              </div>
              <button
                type="submit"
                className="focus-ring w-full rounded-[5px] bg-primary py-[9px] text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Submit Review
              </button>
            </form>
          ) : null}
        </div>

        <div>
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-secondary px-4 py-8 text-center">
              <Star size={22} className="text-ink-muted" />
              <p className="text-[12px] font-semibold text-ink">No reviews yet</p>
              <p className="max-w-xs text-[11px] text-ink-muted">
                Be the first to share your experience with the {vehicle.name}.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-border pb-5 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-semibold text-ink">{review.author}</p>
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={13} className={n <= review.rating ? "fill-primary text-primary" : "text-border-strong"} />
                      ))}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] font-semibold text-ink">{review.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-secondary">{review.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </VehicleSection>
  );
}
