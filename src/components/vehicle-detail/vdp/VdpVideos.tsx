import type { SectionCopy, VideoSlot } from "@/lib/vehicle-detail/types";
import { PrototypeSection } from "./Section";

/**
 * Video slots.
 *
 * There are no videos on file, so these are labelled briefs for the three that
 * earn their place on a vehicle page — not embeds, not stock footage, and not
 * a section quietly hidden because it has no content. Showing the shape of the
 * gap is what makes it commissionable.
 */
export function VdpVideos({ copy, videos }: { copy: SectionCopy; videos: VideoSlot[] }) {
  return (
    <PrototypeSection copy={copy}>
      {/*
        Mobile: one horizontal, snapping row showing ~1.35 cards, so the next
        card is visibly cut off and the row reads as swipeable. Full-width
        stacked cards made three video slots look like the whole page.
        `sm:` and up is the approved grid, untouched.
        `-mx-4 px-4` lets the row bleed to the screen edge while keeping the
        first card aligned with the text above it.
      */}
      <ul className="scroll-row -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {videos.map((video) => (
          <li
            key={video.id}
            className="w-[74%] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-surface shadow-card sm:w-auto sm:shrink"
          >
            <div className="relative flex aspect-video items-center justify-center border-b border-dashed border-border-strong bg-surface-secondary">
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-full border border-border bg-surface shadow-card"
              >
                <span className="ml-0.5 border-y-[7px] border-l-[11px] border-y-transparent border-l-ink-secondary" />
              </span>
              <span className="absolute bottom-2 right-2 rounded bg-surface-dark/80 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white">
                {video.duration}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 px-3.5 py-3">
              <span className="text-[13px] font-bold text-ink">{video.title}</span>
              <span className="text-[11px] text-ink-muted">{video.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </PrototypeSection>
  );
}
