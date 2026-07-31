import type { MetadataRoute } from "next";
import { cars } from "@/lib/data/cars";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { oems } from "@/lib/data/oems";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/cars`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/two-wheelers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/brands`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/compare`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const brandRoutes: MetadataRoute.Sitemap = oems.map((oem) => ({
    url: `${SITE_URL}/brands/${oem.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const carRoutes: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${SITE_URL}/cars/${car.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const twoWheelerRoutes: MetadataRoute.Sitemap = twoWheelers.map((tw) => ({
    url: `${SITE_URL}/two-wheelers/${tw.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...brandRoutes, ...carRoutes, ...twoWheelerRoutes];
}
