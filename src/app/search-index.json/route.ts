import { buildSearchIndex } from "@/lib/search-index";

/**
 * The search index, served as a static, browser-cacheable JSON file.
 *
 * `force-static` makes `next build` emit this once at build time rather than
 * running it per request — the catalog is static TypeScript data, so the
 * response can never vary. That also means the index only refreshes on
 * deploy, which is correct here and would need revisiting if vehicle data
 * ever moves behind a live API.
 *
 * Fetched lazily by the search box on first focus, so it costs nothing on
 * initial page load and is served from cache for every subsequent page.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex(), {
    headers: {
      // Immutable within a deploy; a new deploy produces a new build id and
      // Next serves the regenerated file.
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
