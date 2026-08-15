import Link from "next/link";
import { Zap, TrendingUp, Sparkles, Gauge, Crown, ListChecks, ChevronRight } from "lucide-react";
import type { HighlightItemData } from "@/types/ev-motion";

const ICONS: Record<HighlightItemData["id"], typeof TrendingUp> = {
  trending: TrendingUp,
  newLaunches: Sparkles,
  highestRange: Gauge,
  bestSeller: Crown,
  totalListed: ListChecks,
};

export function KeyHighlightsCard({ items }: { items: HighlightItemData[] }) {
  return (
    <div className="flex flex-col rounded-xl border border-primary/20 bg-surface-dark p-4">
      <div className="mb-3 flex items-center gap-1.5">
        <Zap size={14} className="fill-primary-bright text-primary-bright" />
        <h2 className="text-[13px] font-bold text-white">Today&apos;s Highlights</h2>
      </div>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const Icon = ICONS[item.id];
          const row = (
            <span className="flex items-center justify-between gap-2 text-[11.5px]">
              <span className="flex items-center gap-1.5 text-white/60">
                <Icon size={12} className="text-primary-bright" />
                {item.label}
              </span>
              <span className="max-w-[120px] truncate text-right font-semibold text-white">{item.value}</span>
            </span>
          );
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="focus-ring block rounded-md transition-opacity hover:opacity-80">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
      <Link
        href="/cars"
        className="focus-ring mt-4 flex items-center justify-center gap-1 rounded-lg border border-white/15 bg-white/5 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/10"
      >
        View All Highlights
        <ChevronRight size={12} />
      </Link>
    </div>
  );
}
