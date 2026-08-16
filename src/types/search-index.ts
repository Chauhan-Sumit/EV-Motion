// EV Motion — the shape of the client-side search index.
//
// This file deliberately contains types only, with no runtime imports: it is
// shared between `src/lib/search-index.ts` (server, builds the index from the
// full catalog) and `src/lib/search.ts` (runs in the browser). If a value
// import ever lands here, the whole vehicle database follows it into the
// client bundle — the exact problem this index exists to solve.

import type { VehicleCategory } from "./vehicle";

/**
 * The minimum a search result needs to be matched, ranked, linked and
 * rendered. Roughly a tenth the size of the `Vehicle` record it is projected
 * from: no description, variants, highlights, colors, specs or pricing.
 *
 * `oemColor` is resolved at build time so the browser never has to load
 * `oems.ts` just to tint a placeholder thumbnail.
 */
export interface VehicleIndexEntry {
  id: string;
  slug: string;
  category: VehicleCategory;
  /** OEM key, for brand-match suggestions. */
  oem: string;
  oemName: string;
  modelName: string;
  oemColor: string;
  /** Nested to stay structurally assignable to `VehicleImageSubject`. */
  images: { photoUrl?: string };
}

/** Just enough of an `Oem` to offer a "View all N <brand> vehicles" link. */
export interface OemIndexEntry {
  key: string;
  slug: string;
  name: string;
}

export interface SearchIndex {
  vehicles: VehicleIndexEntry[];
  oems: OemIndexEntry[];
}
