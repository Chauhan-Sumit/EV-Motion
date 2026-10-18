import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { buildCompareSlug, SHOWROOM_MAX_COMPARE } from "@/lib/compare/slug";
import { parseCompareSlug } from "@/lib/compare/parse-slug";
import { buildShowroomPageData } from "@/lib/compare/showroom/page-data";
import { breadcrumbJsonLd, comparisonItemListJsonLd, faqJsonLd } from "@/lib/structured-data";
import { CompareShowroom } from "@/components/compare/showroom/CompareShowroom";

/**
 * ============================================================================
 * /prototype/compare/[slug] — REVIEW ROUTE for the showroom Compare page.
 * ============================================================================
 *
 * Everything this renders is the real implementation that is meant to ship:
 * `components/compare/showroom/` and `lib/compare/showroom/`. Only this route
 * file is temporary. On approval, `app/compare/[slug]/page.tsx` renders
 * `<CompareShowroom basePath="/compare" />` with the same data call and
 * structured data as here, and this folder is deleted.
 *
 * Until then it stays out of production: `noindex`, absent from
 * `sitemap.ts` (which enumerates routes explicitly), linked from nowhere, and
 * a 404 when `VERCEL_ENV === "production"`. `/compare` itself is untouched.
 */

const BASE_PATH = "/prototype/compare";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/prototype/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vehicles = parseCompareSlug(slug, SHOWROOM_MAX_COMPARE);
  if (!vehicles) return { title: "Comparison not found", robots: { index: false, follow: false } };
  const names = vehicles.map((v) => `${v.oemName} ${v.modelName}`);
  return {
    title: `${names.join(" vs ")} — Compare Price, Range & Specs`,
    description: `Compare ${names.join(", ")} on on-road price, real-world range, fast-charging speed, running cost, safety and full specifications.`,
    robots: { index: false, follow: false },
  };
}

export default async function ShowroomComparePreview({ params }: PageProps<"/prototype/compare/[slug]">) {
  if (process.env.VERCEL_ENV === "production") notFound();

  const { slug } = await params;
  const vehicles = parseCompareSlug(slug, SHOWROOM_MAX_COMPARE);
  if (!vehicles) notFound();

  const canonicalSlug = buildCompareSlug(vehicles, SHOWROOM_MAX_COMPARE);
  if (canonicalSlug !== slug) redirect(`${BASE_PATH}/${canonicalSlug}`);

  const path = `${BASE_PATH}/${canonicalSlug}`;
  const data = buildShowroomPageData(vehicles);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonItemListJsonLd(vehicles, path)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Compare", path: "/compare" },
              { name: vehicles.map((v) => v.modelName).join(" vs "), path },
            ]),
          ),
        }}
      />
      {data.faqs.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(data.faqs)) }} /> : null}
      <CompareShowroom vehicles={data.vehicles} candidates={data.candidates} popular={data.popular} basePath={BASE_PATH} />
    </>
  );
}
