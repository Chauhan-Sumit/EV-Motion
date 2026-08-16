import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { buildCompareSlug } from "@/lib/compare/slug";
import { parseCompareSlug } from "@/lib/compare/parse-slug";
import { popularComparisonPairs } from "@/lib/compare/popular-pairs";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { breadcrumbJsonLd, comparisonItemListJsonLd, faqJsonLd } from "@/lib/structured-data";
import { computeComparisonFaqs } from "@/lib/compare/faqs";
import { ComparePageContent } from "@/components/compare/ComparePageContent";
import { TrackPageView } from "@/components/common/TrackPageView";

/**
 * Pre-renders the *popular* comparisons only, not the whole combinatorial
 * space — see `popularComparisonPairs()` for the reasoning. The full space
 * (C(54,2)+C(54,3) for cars alone) remains far too large to enumerate, so
 * don't widen this to every possible pair; `dynamicParams` stays at its
 * default `true`, and any comparison outside this set renders on demand
 * exactly as it did before.
 */
export function generateStaticParams() {
  return popularComparisonPairs().map((pair) => ({ slug: pair.slug }));
}

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vehicles = parseCompareSlug(slug);
  if (!vehicles) return { title: "Comparison not found" };

  const names = vehicles.map((v) => `${v.oemName} ${v.modelName}`);
  const title = `${names.join(" vs ")} — Compare Price, Range & Specs`;
  const description = `Compare ${names.join(", ")} on price, battery, charging, performance, ownership cost and more.`;
  const canonical = `/compare/${buildCompareSlug(vehicles)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComparisonPage({ params }: PageProps<"/compare/[slug]">) {
  const { slug } = await params;
  const vehicles = parseCompareSlug(slug);
  if (!vehicles) notFound();

  const canonicalSlug = buildCompareSlug(vehicles);
  if (canonicalSlug !== slug) redirect(`/compare/${canonicalSlug}`);

  const path = `/compare/${canonicalSlug}`;
  const details = vehicles.map(toVehicleDetail);
  const comparisonFaqs = computeComparisonFaqs(details);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonItemListJsonLd(vehicles, path)) }}
      />
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
      {comparisonFaqs.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(comparisonFaqs)) }}
        />
      ) : null}
      <TrackPageView event="compare_view" slug={canonicalSlug} category={vehicles[0].category} />
      <ComparePageContent vehicles={details} />
    </>
  );
}
