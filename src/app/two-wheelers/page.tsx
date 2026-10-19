import type { Metadata } from "next";
import { TwoWheelersListingPage } from "@/components/vehicles/two-wheelers-listing/TwoWheelersListingPage";
import { buildTwoWheelersListingData, listedBikeBrandKeys } from "@/lib/two-wheelers-listing/page-data";
import { parseBikeQuery } from "@/lib/two-wheelers-listing/filters";

// Discontinued records are left out by `buildTwoWheelersListingData()` rather
// than offered as a fourth availability filter — a listing is what the site
// currently sells. Their detail pages stay reachable; see
// src/lib/vehicle-availability.ts.
export const metadata: Metadata = {
  title: "Electric Scooters & Bikes in India — Compare Prices, Range & Specs",
  description: `Browse ${buildTwoWheelersListingData().bikes.length} electric scooters and motorcycles from every major OEM in India. Filter by price, range, battery and brand to find the right EV.`,
  alternates: { canonical: "/two-wheelers" },
};

/**
 * The Scooters & Bikes listing (`components/vehicles/two-wheelers-listing/`,
 * `lib/two-wheelers-listing/`), in the style of the approved Electric Cars
 * listing. The parser also accepts the earlier listing's parameters (`oems`,
 * `type`, `budget`, `availability`, `battery`, `charging`, …) so existing links
 * into `/two-wheelers` keep working.
 */
export default async function TwoWheelersPage({ searchParams }: PageProps<"/two-wheelers">) {
  const data = buildTwoWheelersListingData();
  const initial = parseBikeQuery(await searchParams, listedBikeBrandKeys(data));
  return <TwoWheelersListingPage data={data} initial={initial} />;
}
