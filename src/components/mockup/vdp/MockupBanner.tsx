import { FlaskConical } from "lucide-react";
import { Container } from "./Shell";

/**
 * Permanent, non-dismissible marker that this route is a design prototype.
 *
 * It exists so nobody — reviewer, screenshot, stakeholder link — can mistake
 * this page for the shipped Vehicle Detail Page, and so the invented ratings,
 * reviews, news and video entries on it are labelled at the point of use. If
 * this design is approved and rebuilt for production, the banner does not come
 * with it; the demo content does not either.
 */
export function MockupBanner() {
  return (
    <div className="border-b border-primary/20 bg-primary-tint">
      <Container className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
        <span className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.6px] text-white">
          <FlaskConical size={12} />
          Design prototype
        </span>
        <p className="text-[11px] leading-relaxed text-primary-hover">
          <span className="font-bold">Not the live Vehicle Detail Page.</span> Specs, prices, variants, colours
          and dimensions are real catalog data; ratings, reviews, videos and news are placeholder demo content
          for layout only.
        </p>
      </Container>
    </div>
  );
}
