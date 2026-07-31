import Link from "next/link";
import type { RankedVehicleData } from "@/types/ev-motion";

export function RankedListCard({
  title,
  viewAllHref,
  items,
}: {
  title: string;
  viewAllHref: string;
  items: RankedVehicleData[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">{title}</h3>
        <Link href={viewAllHref} className="focus-ring text-[10px] font-semibold text-primary">
          View all
        </Link>
      </div>
      {items.map((item) => (
        <Link
          key={item.rank}
          href={item.href}
          className="focus-ring flex items-center gap-2.5 border-b border-border px-[13px] py-2 transition-colors last:border-b-0 hover:bg-primary-tint"
        >
          <span className="w-4 shrink-0 text-center text-[10px] font-bold text-ink-muted">{item.rank}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-ink">{item.name}</p>
            <p className="mt-px text-[9px] text-ink-muted">{item.metaLabel}</p>
          </div>
          <p className="shrink-0 text-[11px] font-bold text-primary">{item.priceLabel}</p>
        </Link>
      ))}
    </div>
  );
}
