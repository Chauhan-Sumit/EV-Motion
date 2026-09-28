import { AdSlot } from "@/components/common/AdSlot";
import { cn } from "@/lib/utils";
import type { AdPlacement } from "@/lib/vehicle-detail/types";

/**
 * Ad-unit placeholder for the prototype.
 *
 * Three of the design's four sizes are the shared
 * `@/components/common/AdSlot` verbatim — 970 × 90 `leaderboard`, 300 × 250
 * `rectangle`, 300 × 600 `sticky`. The fourth, the 728 × 90 in-content banner,
 * is the one size the shared component's `SIZE_CONFIG` does not carry, so it
 * is drawn here against the same class recipe.
 *
 * That branch exists only because modifying the shared component was out of
 * scope for this prototype. **When this design is implemented, add
 * `banner: { width: 728, height: 90, label: "728 × 90" }` to
 * `common/AdSlot.tsx` and delete the branch** — there is no reason for two
 * components to draw the same grey box.
 *
 * The placement note under each unit is the design's argument for why the slot
 * sits where it does. In a design review that reasoning is the whole point; a
 * grey rectangle on its own says nothing.
 */
export function VdpAdSlot({
  placement,
  className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      {placement.size === "banner" ? (
        <BannerSlot />
      ) : (
        <AdSlot size={placement.size} />
      )}
      <p className="max-w-[34ch] text-center text-[11px] leading-snug text-ink-muted">
        {placement.note}
      </p>
    </div>
  );
}

/** 728 × 90. Mirrors `common/AdSlot`'s markup exactly — see the note above. */
function BannerSlot() {
  return (
    <div
      role="complementary"
      aria-label="Advertisement, inline"
      className="mx-auto flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-strong bg-surface-secondary"
      style={{ width: 728, height: 90, maxWidth: "100%" }}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">
        Advertisement
      </span>
      <span className="text-[10px] text-ink-muted">728 × 90</span>
    </div>
  );
}
