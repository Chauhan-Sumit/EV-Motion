"use client";

import { useState, type FormEvent } from "react";
import { MessageSquare, Star } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";

interface LocalReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
}

/** Real, per-vehicle review state — no fabricated rating/count, same honest-empty-state pattern as the VDP's SectionReviews, adapted to a multi-vehicle tabbed layout. */
export function ReviewsSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviewsByVehicle, setReviewsByVehicle] = useState<Record<string, LocalReview[]>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [draftRating, setDraftRating] = useState(5);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const active = vehicles[activeIndex];
  const reviews = reviewsByVehicle[active.slug] ?? [];
  const averageRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draftTitle.trim() || !draftBody.trim()) return;
    setReviewsByVehicle((prev) => ({
      ...prev,
      [active.slug]: [
        { id: `local-${Date.now()}`, author: "You", rating: draftRating, title: draftTitle.trim(), body: draftBody.trim() },
        ...(prev[active.slug] ?? []),
      ],
    }));
    setDraftTitle("");
    setDraftBody("");
    setDraftRating(5);
    setFormOpen(false);
  }

  return (
    <VehicleSection id="reviews" title="Owner Reviews">
      {vehicles.length > 1 ? (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {vehicles.map((v, i) => (
            <button
              key={v.slug}
              type="button"
              onClick={() => {
                setActiveIndex(i);
                setFormOpen(false);
              }}
              aria-pressed={i === activeIndex}
              className={`focus-ring rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                i === activeIndex ? "bg-primary text-white" : "border border-border-strong text-ink-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
        <div>
          <div className="rounded-xl border border-border bg-surface p-3.5">
            {reviews.length > 0 ? (
              <>
                <p className="text-3xl font-extrabold text-ink">{averageRating.toFixed(1)}</p>
                <div className="mt-1 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} className={n <= Math.round(averageRating) ? "fill-primary text-primary" : "text-border-strong"} />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-ink-muted">
                  Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </p>
              </>
            ) : (
              <p className="text-[12px] text-ink-secondary">No ratings yet — be the first to review the {active.name}.</p>
            )}

            <button
              type="button"
              onClick={() => setFormOpen((o) => !o)}
              aria-expanded={formOpen}
              className="focus-ring mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              <MessageSquare size={13} />
              Write a Review
            </button>
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
                <label htmlFor="compare-review-title" className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                  Title
                </label>
                <input
                  id="compare-review-title"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  required
                  className="focus-ring w-full rounded-[5px] border border-border-strong bg-white px-2.5 py-[7px] text-xs text-ink outline-none"
                />
              </div>
              <div>
                <label htmlFor="compare-review-body" className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                  Your review
                </label>
                <textarea
                  id="compare-review-body"
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
              <p className="max-w-xs text-[11px] text-ink-muted">Be the first to share your experience with the {active.name}.</p>
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
