import { Container } from "@/components/ui/Container";
import { SearchCard } from "./SearchCard";
import { KeyHighlightsCard } from "./KeyHighlightsCard";
import { EVToolsCard } from "./EVToolsCard";
import { TrendingCompactSection } from "./TrendingCompactSection";
import { getHomeHighlights, getTrendingByCategory } from "@/lib/data/ev-motion/derive";

/**
 * Search card (left, full column width) + sticky Key Highlights/EV Tools
 * stack (right), overlapping the hero boundary the same way the search card
 * alone used to.
 *
 * The sidebar is absolutely positioned (lg+) rather than a normal CSS Grid
 * column on purpose: a shared grid row always sizes to the TALLER of its two
 * columns regardless of align-items, so once the sidebar (Highlights + EV
 * Tools stacked) got taller than the main column (Search + one merged
 * Trending row), a plain 2-col grid left a fixed block of dead space below
 * Trending Now — align-items can only decide whether that space sits inside
 * an item's box or the grid gutter, never remove it. Taking the sidebar out
 * of flow lets the section's rendered height follow the main column only,
 * so MainLayout starts immediately after Trending Now with no gap. The
 * sidebar's own sticky-release boundary is unchanged (still its own natural
 * height), so it still lets go right around where FeaturedBanner begins.
 */
export function HeroSearchSection() {
  const highlights = getHomeHighlights();
  const trending = [...getTrendingByCategory("car"), ...getTrendingByCategory("2-wheeler")];

  return (
    <Container className="relative z-10 -mt-[52px]">
      <div className="relative lg:pr-[280px]">
        <div className="flex min-w-0 flex-col gap-3.5 sm:gap-5">
          <SearchCard />
          <TrendingCompactSection title="Trending Now" items={trending} />
        </div>

        <aside className="mt-3.5 sm:mt-5 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:w-[260px]">
          <div id="hero-sticky-sidebar" className="flex flex-col gap-3.5 lg:sticky lg:top-20">
            <KeyHighlightsCard items={highlights} />
            <EVToolsCard />
          </div>
        </aside>
      </div>
    </Container>
  );
}
