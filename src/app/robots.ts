import type { MetadataRoute } from "next";
import { SITE_URL, SITE_URL_IS_PLACEHOLDER } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // No real domain configured yet — see the note in `@/lib/site`. Every
  // canonical on the site would point at a domain nobody owns, so block
  // crawling until `NEXT_PUBLIC_SITE_URL` is set rather than have the site
  // indexed against a fake origin. Setting that env var restores the normal
  // allow-all rules and the sitemap reference automatically.
  if (SITE_URL_IS_PLACEHOLDER) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
