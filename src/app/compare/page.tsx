import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AdSlot } from "@/components/common/AdSlot";
import { CompareHero } from "@/components/compare/hero/CompareHero";
import { getVehicleBySlug } from "@/lib/data";
import { buildCompareSlug, MAX_COMPARE, MIN_COMPARE } from "@/lib/compare/slug";
import type { Vehicle } from "@/types/vehicle";

export const metadata: Metadata = {
  title: "Compare Electric Vehicles",
  description: "Compare price, battery, charging, ownership cost, running cost, features and performance across electric cars and two-wheelers.",
  alternates: { canonical: "/compare" },
};

/**
 * Picker/landing page. Resolves the legacy `?ids=` query param (the URL
 * contract 6+ site-wide entry points already depend on) — 2-3 valid,
 * same-category vehicles redirect straight to the canonical `/compare/[slug]`;
 * anything else (0 or 1 valid vehicle) renders the empty-slots hero to start
 * a new comparison, pre-filling whatever resolved.
 */
export default async function ComparePickerPage({
  searchParams,
}: PageProps<"/compare">) {
  const params = await searchParams;
  const idsParam = typeof params.ids === "string" ? params.ids : "";
  const slugs = idsParam ? idsParam.split(",") : [];

  const resolved = slugs
    .map((slug) => getVehicleBySlug(slug))
    .filter((v): v is Vehicle => Boolean(v));

  const category = resolved[0]?.category ?? null;
  const sameCategory = category ? resolved.filter((v) => v.category === category) : [];
  const deduped = sameCategory.filter((v, i) => sameCategory.findIndex((o) => o.slug === v.slug) === i).slice(0, MAX_COMPARE);

  if (deduped.length >= MIN_COMPARE) {
    redirect(`/compare/${buildCompareSlug(deduped)}`);
  }

  return (
    <>
      <Container className="hidden justify-center py-3.5 lg:flex">
        <AdSlot size="leaderboard" />
      </Container>
      <CompareHero initialVehicles={deduped} initialCategory={category} />
    </>
  );
}
