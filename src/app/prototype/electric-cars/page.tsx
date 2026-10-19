import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildCarsListingData, listedBrandKeys } from "@/lib/cars-listing/page-data";
import { parseListingQuery } from "@/lib/cars-listing/filters";
import { CarsListingPage } from "@/components/vehicles/cars-listing/CarsListingPage";

/**
 * ============================================================================
 * /prototype/electric-cars — REVIEW ROUTE for the Electric Cars listing.
 * ============================================================================
 *
 * Everything this renders is the implementation meant to ship:
 * `components/vehicles/cars-listing/` and `lib/cars-listing/`. Only this route
 * file is temporary. On approval, `app/cars/page.tsx` renders
 * `<CarsListingPage>` with the same two calls as below, and this folder is
 * deleted.
 *
 * Until then it stays out of production: `noindex`, absent from `sitemap.ts`
 * (which enumerates routes explicitly), linked from nowhere, and a 404 when
 * `VERCEL_ENV === "production"`. `/cars` itself is untouched.
 */

export const metadata: Metadata = {
  title: "Electric Cars in India — Prices, Range, Charging & Specs (preview)",
  description: "Every electric car on sale or coming soon in India with ex-showroom prices, claimed range, battery, fast-charging time and safety ratings.",
  robots: { index: false, follow: false },
};

export default async function ElectricCarsPreview({ searchParams }: PageProps<"/prototype/electric-cars">) {
  if (process.env.VERCEL_ENV === "production") notFound();

  const data = buildCarsListingData();
  const initial = parseListingQuery(await searchParams, listedBrandKeys(data));
  return <CarsListingPage data={data} initial={initial} />;
}
