import Link from "next/link";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { Block } from "@/components/ui/Block";
import { categories } from "@/lib/data/ev-motion/content";

const TILE_CLASSES =
  "flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-3.5 text-center transition-all duration-200";

export function CategoryRow() {
  return (
    <Block>
      <BlockHeading title="Browse by Category" />
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {categories.map((category) =>
          category.href ? (
            <Link
              key={category.id}
              href={category.href}
              className={`focus-ring hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover ${TILE_CLASSES}`}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {category.emoji}
              </span>
              <span className="text-[11px] font-semibold leading-tight text-ink">{category.name}</span>
              <span className="text-[10px] text-ink-muted">{category.count}</span>
            </Link>
          ) : (
            <span
              key={category.id}
              title={`${category.name} — coming soon`}
              aria-disabled="true"
              className={`cursor-not-allowed opacity-50 ${TILE_CLASSES}`}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {category.emoji}
              </span>
              <span className="text-[11px] font-semibold leading-tight text-ink-muted">{category.name}</span>
              <span className="text-[10px] text-ink-muted">Soon</span>
            </span>
          ),
        )}
      </div>
    </Block>
  );
}
