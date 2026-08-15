"use client";

import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { UpcomingCard } from "./UpcomingCard";
import { UpcomingNotifyBanner } from "./UpcomingNotifyBanner";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";
import type { UpcomingItemData } from "@/types/ev-motion";

export function UpcomingSection({
  title,
  items,
  tinted,
  showNotifyBanner,
}: {
  title: string;
  items: UpcomingItemData[];
  tinted?: boolean;
  showNotifyBanner?: boolean;
}) {
  const { trackRef, scrollByCards } = useCarouselScroll<HTMLDivElement>();

  if (items.length === 0) return null;

  return (
    <section className={tinted ? "bg-surface-secondary py-8" : "py-8"}>
      <Container>
        <BlockHeading title={title} />
        {/* Horizontal 3-card layout, reachable by scroll or the arrow button —
            never wraps into extra rows on desktop. */}
        <div className="relative">
          <div
            ref={trackRef}
            className="scroll-row -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
          >
            {items.map((item) => (
              <div key={item.id} className="w-[62%] shrink-0 snap-start sm:w-[280px]">
                <UpcomingCard item={item} />
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            className="focus-ring absolute right-0 top-[calc(50%-14px)] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-surface text-ink-secondary shadow-card transition-colors hover:border-primary hover:text-primary sm:flex"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        {showNotifyBanner ? <UpcomingNotifyBanner /> : null}
      </Container>
    </section>
  );
}
