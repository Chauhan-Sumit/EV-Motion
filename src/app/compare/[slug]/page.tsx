import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { parseCompareSlug, buildCompareSlug } from "@/lib/compare/slug";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { breadcrumbJsonLd, comparisonItemListJsonLd, faqJsonLd } from "@/lib/structured-data";
import { computeComparisonFaqs } from "@/lib/compare/faqs";
import { ComparePageContent } from "@/components/compare/ComparePageContent";

/**
 * No `generateStaticParams` here — unlike every sibling `[slug]` route in
 * this app (which enumerates a finite dataset), the combinatorial space of
 * 2- and 3-vehicle comparisons (C(54,2)+C(54,3) for cars alone) is far too
 * large to pre-render. Renders on demand instead (`dynamicParams` defaults
 * to true). Don't "fix" this to match the sibling routes.
 */

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
      <ComparePageContent vehicles={details} />
    </>
  );
}
