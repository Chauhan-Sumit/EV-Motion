type AdSize = "leaderboard" | "rectangle" | "sticky";

const SIZE_CONFIG: Record<AdSize, { width: number; height: number; label: string }> = {
  leaderboard: { width: 970, height: 90, label: "970 × 90" },
  rectangle: { width: 300, height: 250, label: "300 × 250" },
  sticky: { width: 300, height: 600, label: "300 × 600" },
};

/** Shared ad-unit placeholder — used on the Vehicle Detail Page and the Compare page. */
export function AdSlot({ size, className }: { size: AdSize; className?: string }) {
  const { width, height, label } = SIZE_CONFIG[size];
  const landmarkLabel =
    size === "leaderboard" ? "Advertisement, leaderboard" : size === "sticky" ? "Advertisement, sidebar" : "Advertisement, inline";

  return (
    <div
      role="complementary"
      aria-label={landmarkLabel}
      className={`mx-auto flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border-strong bg-surface-secondary ${className ?? ""}`}
      style={{ width, height, maxWidth: "100%" }}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">Advertisement</span>
      <span className="text-[10px] text-ink-muted">{label}</span>
    </div>
  );
}
