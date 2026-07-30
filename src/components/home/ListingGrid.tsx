import { Block } from "@/components/ui/Block";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { ListingCard } from "./ListingCard";
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
  return (
    <Block>
      <BlockHeading title={title} viewAllLabel={viewAllLabel} viewAllHref={viewAllHref} />
      {/* Mobile: horizontal scroll so cards never wrap and orphan the last item.
          sm+: standard 3-column grid. */}
      <div className="scroll-row -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-[11px] sm:overflow-visible sm:px-0 sm:pb-0">
        {items.map((item, index) => (
          <div key={item.id} className="w-[62%] shrink-0 snap-start sm:w-auto">
            <ListingCard item={item} priority={index === 0} />
          </div>
        ))}
      </div>
    </Block>
  );
}
