import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildBrandPageData } from "@/lib/brand-page/page-data";
import { parseBrandSort } from "@/lib/brand-page/copy";
import { BrandPage } from "@/components/brands/brand-page/BrandPage";

/**
 * ============================================================================
 * /prototype/brands/mg — REVIEW ROUTE for the MG Motor brand page.
 * ============================================================================
 *
 * Everything this renders is the implementation meant to ship:
 * `components/brands/brand-page/` and `lib/brand-page/`. Only this route file
 * is temporary. On approval, `app/brands/[oem]/page.tsx` renders `<BrandPage>`
 * with the same two calls as below, and this folder is deleted.
 *
 * Until then it stays out of production: `noindex`, absent from `sitemap.ts`
 * (which enumerates routes explicitly), linked from nowhere, and a 404 when
 * `VERCEL_ENV === "production"`. `/brands/mg` itself is untouched.
 */

export const metadata: Metadata = {
  title: "MG Motor Electric Cars in India — Prices, Range & Specs (preview)",
  description: "Every MG Motor electric car on sale in India with ex-showroom prices, claimed range, battery and fast-charging time.",
  robots: { index: false, follow: false },
};

export default async function MgBrandPreview({ searchParams }: PageProps<"/prototype/brands/mg">) {
  if (process.env.VERCEL_ENV === "production") notFound();

  const data = buildBrandPageData("mg");
  if (!data) notFound();
  return <BrandPage data={data} initialSort={parseBrandSort((await searchParams).sort)} />;
}
