"use client";

import { ChevronRight } from "lucide-react";
import { Block } from "@/components/ui/Block";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { ListingCard } from "./ListingCard";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";
import type { ListingCardData } from "@/types/ev-motion";

export function ListingGrid({
  title,
  viewAllLabel,
  viewAllHref,
  items,
}: {
  title: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  items: ListingCardData[];
}) {
  const { trackRef, scrollByCards } = useCarouselScroll<HTMLDivElement>();

  return (
    <Block>
      <BlockHeading title={title} viewAllLabel={viewAllLabel} viewAllHref={viewAllHref} />
      {/* Single-row horizontal scroll at every width — cards never wrap into
          multiple rows on desktop; reachable by scroll or the arrow button. */}
      <div className="relative">
        <div
          ref={trackRef}
          className="scroll-row -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-[62%] shrink-0 snap-start sm:w-[240px]">
              <ListingCard item={item} priority={index === 0} />
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
    </Block>
  );
}
