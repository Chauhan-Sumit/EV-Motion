"use client";

import { TrendingUp, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TrendingCompactCard } from "./TrendingCompactCard";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";
import type { TrendingCompactItemData } from "@/types/ev-motion";

export function TrendingCompactSection({
  title,
  items,
}: {
  title: string;
  items: TrendingCompactItemData[];
}) {
  const { trackRef, scrollByCards } = useCarouselScroll<HTMLDivElement>();

  return (
    <Container className="py-3">
      <div className="relative rounded-xl border border-border bg-surface-secondary p-3.5">
        <div className="mb-2.5 flex items-center gap-1.5">
          <TrendingUp size={15} className="text-primary" />
          <h2 className="text-[13px] font-bold text-ink">{title}</h2>
        </div>

        <div className="relative">
          <div
            ref={trackRef}
            className="scroll-row flex snap-x snap-mandatory gap-2.5 overflow-x-auto pr-9"
          >
            {items.map((item) => (
              <div key={item.id} className="w-[68%] snap-start sm:w-[240px]">
                <TrendingCompactCard item={item} />
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            className="focus-ring absolute right-0 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-surface text-ink-secondary shadow-card transition-colors hover:border-primary hover:text-primary sm:flex"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Container>
  );
}
