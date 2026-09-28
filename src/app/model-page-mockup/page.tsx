import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cars } from "@/lib/data/cars";
import { getSimilarVehicleDetails, toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { MockupBanner } from "@/components/mockup/vdp/MockupBanner";
import { MockHero } from "@/components/mockup/vdp/MockHero";
import { MockSubNav } from "@/components/mockup/vdp/MockSubNav";
import { MockNumbers } from "@/components/mockup/vdp/MockNumbers";
import { MockStory } from "@/components/mockup/vdp/MockStory";
import { MockVariants } from "@/components/mockup/vdp/MockVariants";
import { MockBattery } from "@/components/mockup/vdp/MockBattery";
import { MockRange } from "@/components/mockup/vdp/MockRange";
import { MockOwnership } from "@/components/mockup/vdp/MockOwnership";
import { MockCompare } from "@/components/mockup/vdp/MockCompare";
import { MockColours } from "@/components/mockup/vdp/MockColours";
import { MockFeatures } from "@/components/mockup/vdp/MockFeatures";
import { MockGallery } from "@/components/mockup/vdp/MockGallery";
import { MockVideos } from "@/components/mockup/vdp/MockVideos";
import { MockReviews } from "@/components/mockup/vdp/MockReviews";
import { MockFaqs } from "@/components/mockup/vdp/MockFaqs";
import { MockSimilar } from "@/components/mockup/vdp/MockSimilar";
import { MockNews } from "@/components/mockup/vdp/MockNews";
import { MockPriceDock } from "@/components/mockup/vdp/MockPriceDock";

/**
 * ============================================================================
 * /model-page-mockup — ISOLATED DESIGN PROTOTYPE. Not a production route.
 * ============================================================================
 *
 * A visual proposal for a redesigned Vehicle Detail Page, built so the design
 * can be reviewed before anything is committed to. It:
 *
 *   - touches no existing route, component or data file — every file it needs
 *     lives under `src/app/model-page-mockup/` or `src/components/mockup/`;
 *   - reads the real Nexon EV catalog record through the same
 *     `toVehicleDetail()` adapter production uses, so every spec on screen is
 *     the real figure rather than a design placeholder;
 *   - keeps its invented content (ratings/reviews/videos/news) quarantined in
 *     `src/components/mockup/vdp/demo-content.ts` and labelled on the page.
 *
 * Marked `noindex` and absent from `sitemap.ts` (which enumerates routes
 * explicitly, so nothing had to be excluded). Navbar and Footer come from the
 * root layout, exactly as on the real VDP.
 *
 * The page's visual rhythm is deliberate — dark anchor bands at the hero,
 * battery and colours, with light and tinted bands alternating between them,
 * so no two adjacent sections read as the same card:
 *
 *   hero (dark) → numbers (tinted) → story (light) → variants (tinted)
 *   → battery (DARK) → range (light) → ownership (tinted) → compare (light)
 *   → colours (DARK) → features (light) → gallery (tinted) → videos (light)
 *   → reviews (tinted) → FAQs (light) → similar (tinted) → news (light)
 *
 * If the design is rejected, deleting this directory and
 * `src/components/mockup/` removes it whole.
 */

const MOCKUP_VEHICLE_SLUG = "tata-nexon-ev";

export const metadata: Metadata = {
  title: "Vehicle Page — Design Prototype",
  description: "Internal design prototype for the EV Motion Vehicle Detail Page. Not a live product page.",
  robots: { index: false, follow: false },
};

export default function ModelPageMockup() {
  const source = cars.find((c) => c.slug === MOCKUP_VEHICLE_SLUG);
  if (!source) notFound();

  const vehicle = toVehicleDetail(source);
  const similar = getSimilarVehicleDetails(vehicle);

  return (
    <>
      <MockupBanner />

      <MockHero vehicle={vehicle} />
      <MockSubNav vehicle={vehicle} />

      <MockNumbers vehicle={vehicle} />
      <MockStory vehicle={vehicle} />
      <MockVariants vehicle={vehicle} />
      <MockBattery vehicle={vehicle} />
      <MockRange vehicle={vehicle} />
      <MockOwnership vehicle={vehicle} />
      <MockCompare vehicle={vehicle} rivals={similar.slice(0, 2)} />
      <MockColours vehicle={vehicle} />
      <MockFeatures vehicle={vehicle} />
      <MockGallery vehicle={vehicle} />
      <MockVideos />
      <MockReviews />
      <MockFaqs vehicle={vehicle} />
      <MockSimilar vehicles={similar.slice(0, 4)} />
      <MockNews />

      <MockPriceDock vehicle={vehicle} />
    </>
  );
}
