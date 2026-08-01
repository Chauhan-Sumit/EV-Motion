import { loadRecentSearches, saveRecentSearch } from "@/lib/search-history";

const RECENT_COMPARISONS_KEY = "ev-motion:recent-comparisons";
const MAX_RECENT = 6;

/** Compare-slug persistence for the "Recently Compared" ending-section rail — same localStorage pattern as recent searches, keyed separately. */
export function loadRecentComparisonSlugs(excludeSlug?: string): string[] {
  const slugs = loadRecentSearches(RECENT_COMPARISONS_KEY);
  return excludeSlug ? slugs.filter((s) => s !== excludeSlug) : slugs;
}

export function saveRecentComparison(slug: string): void {
  const current = loadRecentSearches(RECENT_COMPARISONS_KEY);
  saveRecentSearch(RECENT_COMPARISONS_KEY, slug, current, MAX_RECENT);
}
