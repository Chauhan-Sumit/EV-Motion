import type { SearchScope } from "@/lib/search";

/**
 * Curated "Popular Searches" suggestions, per category scope.
 *
 * Every term must resolve through `searchVehicles()` to a real vehicle,
 * brand or category route — a suggestion that returns nothing is a dead end
 * in the UI (CLAUDE.md point 10). `src/lib/search.test.ts` asserts this for
 * every term, so a data batch that renames or drops a model fails the suite
 * rather than shipping a broken chip.
 *
 * Bare model names ("Nexon EV", not "Tata Nexon EV") were originally
 * required because the matcher couldn't bridge a brand's full legal name
 * sitting between the typed words. Multi-word queries are tokenized now, so
 * that constraint is lifted — but bare names remain the safer default.
 *
 * Lives here rather than in `VehicleSearchBox` so that non-UI consumers (the
 * compare page's vehicle picker, tests) can read it without pulling a React
 * component and its ImageKit dependency along with it.
 */
/**
 * A term must also name something the site currently SELLS. "Chetak Premium"
 * was replaced by "Chetak C3501" on 2026-08-21 when that record became
 * `discontinued`: discontinued vehicles are out of the search index, so the
 * term would have failed the resolution test above — but the real objection is
 * that a "Popular Searches" chip is a recommendation, and recommending a
 * scooter Bajaj no longer sells is the same mistake in a smaller box.
 */
export const POPULAR_SEARCHES_BY_SCOPE: Record<SearchScope, string[]> = {
  car: ["Nexon EV", "SUV", "Creta Electric", "Hatchback", "Windsor EV", "Sedan"],
  "2-wheeler": ["S1 Pro", "Scooter", "450X", "Motorcycle", "iQube", "Chetak C3501"],
  commercial: ["3-Wheeler", "Truck", "Van", "Bus"],
  all: ["Nexon EV", "SUV", "S1 Pro", "Scooter", "450X", "Creta Electric"],
};
