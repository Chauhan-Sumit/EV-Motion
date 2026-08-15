import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";

/**
 * No real news data source exists anywhere in this project — the VDP's
 * SectionLatestNews.tsx uses the same honest-empty-state pattern instead of
 * fabricated headlines/thumbnails, and this homepage section follows suit
 * rather than inventing article cards. Swap this for real cards the moment
 * a news source exists — the layout (Container + BlockHeading) is already
 * consistent with every other homepage section, ready to hold a
 * scroll-row of cards once there's real content.
 */
export function LatestEVNewsSection() {
  return (
    <section className="py-8">
      <Container>
        <BlockHeading title="Latest EV News" />
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-secondary px-4 py-10 text-center">
          <Newspaper size={24} className="text-ink-muted" />
          <p className="text-[13px] font-semibold text-ink">No news yet</p>
          <p className="max-w-xs text-[11.5px] text-ink-muted">
            EV news coverage will appear here once published — check back soon.
          </p>
        </div>
      </Container>
    </section>
  );
}
