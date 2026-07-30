import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { CompareCard } from "./CompareCard";
import type { CompareCardPairData } from "@/types/ev-motion";

export function CompareSection({
  title,
  pairs,
  viewAllHref,
  tinted,
}: {
  title: string;
  pairs: CompareCardPairData[];
  viewAllHref: string;
  tinted?: boolean;
}) {
  if (pairs.length === 0) return null;

  return (
    <section className={tinted ? "bg-surface-secondary py-8" : "py-8"}>
      <Container>
        <BlockHeading title={title} viewAllLabel="Compare more" viewAllHref={viewAllHref} />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-[11px]">
          {pairs.map((pair) => (
            <CompareCard key={pair.id} pair={pair} />
          ))}
        </div>
      </Container>
    </section>
  );
}
