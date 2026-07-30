import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { UpcomingCard } from "./UpcomingCard";
import type { UpcomingItemData } from "@/types/ev-motion";

export function UpcomingSection({
  title,
  items,
  tinted,
}: {
  title: string;
  items: UpcomingItemData[];
  tinted?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section className={tinted ? "bg-surface-secondary py-8" : "py-8"}>
      <Container>
        <BlockHeading title={title} />
        {/* Mobile: horizontal scroll so cards never wrap and orphan the last item.
            sm+: standard 3-column grid. */}
        <div className="scroll-row -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-[11px] sm:overflow-visible sm:px-0 sm:pb-0">
          {items.map((item) => (
            <div key={item.id} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <UpcomingCard item={item} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
