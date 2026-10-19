import type { Metadata } from "next";
import { CarsListingPage } from "@/components/vehicles/cars-listing/CarsListingPage";
import { buildCarsListingData, listedBrandKeys } from "@/lib/cars-listing/page-data";
import { parseListingQuery } from "@/lib/cars-listing/filters";

// Discontinued records are left out by `buildCarsListingData()` rather than
// offered as a fourth availability filter — a listing is what the site
// currently sells. Their detail pages stay reachable; see
// src/lib/vehicle-availability.ts.
export const metadata: Metadata = {
  title: "Electric Cars in India — Compare Prices, Range & Specs",
  description: `Browse ${buildCarsListingData().cars.length} electric cars from every major OEM in India. Filter by price, range, battery, body type and brand to find the right EV.`,
  alternates: { canonical: "/cars" },
};

/**
 * The Electric Cars listing — the approved design (`components/vehicles/
 * cars-listing/`, `lib/cars-listing/`). Server-rendered from the query string;
 * the parser also accepts the earlier listing's parameters (`oems`, `type`,
 * `budget`, `availability`, `charging`, …) so existing links into `/cars` keep
 * working.
 */
export default async function CarsPage({ searchParams }: PageProps<"/cars">) {
  // Built per request, so NCAP expiry (`ncapResultFor`) is judged against today, not the last deploy.
  const data = buildCarsListingData();
  const initial = parseListingQuery(await searchParams, listedBrandKeys(data));
  return <CarsListingPage data={data} initial={initial} />;
}
