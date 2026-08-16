import type { SearchIndex } from "@/types/search-index";

/**
 * Lazily fetches the search index and memoizes the in-flight promise, so
 * that the several search boxes on a page (Navbar, hero SearchCard, ...)
 * share one request rather than each triggering their own.
 *
 * The module-level cache is per page load; the HTTP response itself is
 * browser-cached across navigations, so a second page load is free.
 */
let indexPromise: Promise<SearchIndex> | null = null;

export const SEARCH_INDEX_URL = "/search-index.json";

export function loadSearchIndex(): Promise<SearchIndex> {
  indexPromise ??= fetch(SEARCH_INDEX_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`Search index request failed: ${res.status}`);
      return res.json() as Promise<SearchIndex>;
    })
    .catch((error) => {
      // Don't poison the cache — a transient failure should be retryable on
      // the next keystroke rather than disabling search for the session.
      indexPromise = null;
      throw error;
    });
  return indexPromise;
}

/** Test seam — resets the memoized promise between cases. */
export function resetSearchIndexCache(): void {
  indexPromise = null;
}
