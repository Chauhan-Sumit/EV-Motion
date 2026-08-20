import type { LaunchStatus } from "@/types/vehicle";

/**
 * The one predicate that decides whether a vehicle is part of what the site
 * is currently selling.
 *
 * `LaunchStatus` gained `"discontinued"` so records like `bajaj-chetak-2901`
 * and `bajaj-chetak-premium` — scooters Bajaj has replaced with the C-series —
 * can say so instead of claiming to be `"available"` (HANDOFF.md sub-batch 9).
 * The records are kept, not deleted: people own these scooters, look them up,
 * and have their URLs.
 *
 * The split that follows from that:
 *
 * **Excluded** (surfaces that present a vehicle as something to buy) —
 * `/cars`, `/two-wheelers`, `/commercial` listings, brand pages, every
 * homepage rail (popular, trending, ranked, upcoming, highlights), related/
 * similar recommendations, the pre-rendered comparison set, and the compare
 * picker.
 *
 * **Kept working** (surfaces where the vehicle is the thing being asked for) —
 * its detail page and that page's static params, its sitemap entry, any
 * comparison page naming it (`/compare/[slug]` renders arbitrary pairs on
 * demand), and its structured data, which reports `schema.org/Discontinued`
 * rather than pretending the offer is live.
 *
 * **Search sits on the "kept" side, and the distinction is the point.** A
 * discontinued vehicle stays in `/search-index.json` and stays findable by
 * name, because searching is asking for a specific thing rather than being
 * recommended one — someone who owns a Chetak Premium must be able to reach
 * its page. What search does NOT do is let it pass as current stock: the
 * index entry carries `discontinued: true` and the dropdown renders a
 * "Discontinued" label beside the result. Curated *popular-search* chips are
 * a different thing again — those are recommendations and do point only at
 * current vehicles.
 *
 * Data-free by construction (types only), so it is safe to import from a
 * `"use client"` component — CLAUDE.md #23.
 */

/** The one field this reads. A full `Vehicle` satisfies it structurally. */
export interface AvailabilitySubject {
  launchStatus: LaunchStatus;
}

export function isDiscontinued(vehicle: AvailabilitySubject): boolean {
  return vehicle.launchStatus === "discontinued";
}

/** Inverse of `isDiscontinued`, as a named predicate so call sites read as intent rather than as a negation. */
export function isCurrentlySold(vehicle: AvailabilitySubject): boolean {
  return !isDiscontinued(vehicle);
}

/**
 * The same decision, expressed as schema.org markup for a vehicle's Offer.
 *
 * `Discontinued` is a real schema.org value and is the honest answer for a
 * record the OEM no longer sells. These pages stay published and indexed on
 * purpose, so the markup has to say what the page is rather than claim the
 * offer is live.
 *
 * Lives here rather than in `structured-data.ts` so it sits beside the policy
 * it derives from — and so it stays testable: `structured-data.ts` imports
 * `@imagekit/next`, whose `exports` map advertises `main`/`module` instead of
 * `import`/`require` and therefore does not resolve under Vitest's resolver.
 */
export function schemaAvailabilityFor(vehicle: AvailabilitySubject): string {
  if (vehicle.launchStatus === "discontinued") return "https://schema.org/Discontinued";
  if (vehicle.launchStatus === "upcoming") return "https://schema.org/PreOrder";
  return "https://schema.org/InStock";
}
