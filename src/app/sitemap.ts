import type { MetadataRoute } from "next";
import { cars } from "@/lib/data/cars";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { commercial } from "@/lib/data/commercial";
import { oems } from "@/lib/data/oems";
import { routeSegmentFor } from "@/lib/data/categories";
import { SITE_URL } from "@/lib/site";
import { popularComparisonPairs } from "@/lib/compare/popular-pairs";
import type { Vehicle } from "@/types/vehicle";

function vehicleRoutes(vehicles: Vehicle[]): MetadataRoute.Sitemap {
  return vehicles.map((vehicle) => ({
    url: `${SITE_URL}/${routeSegmentFor(vehicle.category)}/${vehicle.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/cars`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/two-wheelers`, changeFrequency: "daily", priority: 0.9 },
    // Listed only once it has vehicles — submitting an empty listing page
    // ("Browse 0 commercial electric vehicles") is a thin-content signal.
    // The route itself keeps working either way; see src/lib/data/commercial.ts.
    ...(commercial.length > 0
      ? [{ url: `${SITE_URL}/commercial`, changeFrequency: "daily" as const, priority: 0.9 }]
      : []),
    { url: `${SITE_URL}/brands`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/compare`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const brandRoutes: MetadataRoute.Sitemap = oems.map((oem) => ({
    url: `${SITE_URL}/brands/${oem.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // The same set `/compare/[slug]` pre-renders, so sitemap and pre-render
  // coverage can't drift apart. This used to list only the six hand-curated
  // homepage pairs, leaving every other comparison page — the highest-intent
  // organic queries this site has — undiscoverable.
  const compareRoutes: MetadataRoute.Sitemap = popularComparisonPairs().map((pair) => ({
    url: `${SITE_URL}/compare/${pair.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...brandRoutes,
    ...compareRoutes,
    ...vehicleRoutes(cars),
    ...vehicleRoutes(twoWheelers),
    ...vehicleRoutes(commercial),
  ];
}
