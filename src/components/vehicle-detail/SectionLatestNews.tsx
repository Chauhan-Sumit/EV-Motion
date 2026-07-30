import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import type { VehicleDetail } from "@/types/vehicle-detail";

/**
 * No real news data source exists anywhere in this project, so this is an
 * honest empty state — matching the pattern used for Reviews and Videos —
 * rather than fabricated headlines.
 */
export function SectionLatestNews({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <section className="border-t border-border bg-surface-secondary py-8">
      <Container>
        <BlockHeading title={`Latest News on ${vehicle.brand} ${vehicle.name}`} />
        <div className="flex max-w-2xl flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface px-4 py-8 text-center">
          <Newspaper size={22} className="text-ink-muted" />
          <p className="text-[12px] font-semibold text-ink">No news yet</p>
          <p className="max-w-xs text-[11px] text-ink-muted">
            Coverage of the {vehicle.name} will appear here once published.
          </p>
        </div>
      </Container>
    </section>
  );
}
