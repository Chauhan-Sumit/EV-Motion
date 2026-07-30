import { BlockHeading } from "@/components/ui/BlockHeading";
import { Block } from "@/components/ui/Block";
import { categories } from "@/lib/data/ev-motion/content";

export function CategoryRow() {
  return (
    <Block>
      <BlockHeading title="Browse by Category" />
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="focus-ring flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {category.emoji}
            </span>
            <span className="text-[11px] font-semibold leading-tight text-ink">{category.name}</span>
            <span className="text-[10px] text-ink-muted">{category.count}</span>
          </button>
        ))}
      </div>
    </Block>
  );
}
