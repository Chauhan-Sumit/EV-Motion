import { Newspaper } from "lucide-react";
import type { SectionCopy } from "@/lib/vehicle-detail/types";
import { Card, PrototypeSection } from "./Section";

/**
 * Latest news — the final content section before the footer.
 *
 * **There is no news data source anywhere in this project.** The homepage's
 * `LatestEVNewsSection` and the previous VDP's `SectionLatestNews` are both
 * honest empty states for the same reason, and this one follows them rather
 * than inventing headlines for a vehicle nobody has written about. That is the
 * same rule the Videos and Reviews sections above obey.
 *
 * When a source exists, the swap is small: replace the panel below with a
 * `.scroll-row` of article cards scoped to `brand`/`name`. The section, its
 * heading and its place in the running order are already here and already in
 * the sticky nav.
 */
export function VdpNews({ copy, brand, name }: { copy: SectionCopy; brand: string; name: string }) {
  return (
    <PrototypeSection copy={copy}>
      <Card className="flex flex-col items-center gap-2 border-dashed py-10 text-center">
        <Newspaper size={24} className="text-ink-muted" aria-hidden />
        <p className="text-[13px] font-semibold text-ink">No news yet</p>
        <p className="max-w-sm text-[11.5px] leading-relaxed text-ink-muted">
          Coverage of the {brand} {name} will appear here once published.
        </p>
      </Card>
    </PrototypeSection>
  );
}
