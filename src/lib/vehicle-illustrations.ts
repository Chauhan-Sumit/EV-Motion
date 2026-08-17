// EV Motion - AI-generated vehicle-type illustrations.
//
// ===========================================================================
// WHAT THIS IS, AND THE LINE IT MUST NOT CROSS
// ===========================================================================
// These are generic, deliberately non-photorealistic illustrations of a
// *vehicle type* - "a compact electric SUV", "a step-through scooter". They are
// NOT depictions of any particular model. Every SUV in the catalog shares one
// image, which is exactly what makes them honest: a visitor sees the same
// drawing on the Nexon EV and the Windsor EV and reads it as category art, the
// same way the hand-drawn SVG icon it replaces was read. It is a better-crafted
// placeholder, not a photo.
//
// Three rules follow from that, and breaking any of them turns an honest
// placeholder into a fabricated claim about a real product:
//
//   1. NEVER key an illustration to a specific model, trim or brand. The unit
//      is the body type. `Vehicle.images.photoUrl` remains the only field that
//      claims "this is what this vehicle looks like", and it stays empty until
//      real licensed photography exists - see HANDOFF.md's Batch 7.
//   2. NEVER prompt for photorealism. A photoreal prompt was tried first and
//      returned a near-copy of a specific real production SUV's design, because
//      that is what the model was trained on. A photoreal "generic EV" is a
//      trade-dress problem wearing a disguise; a flat vector drawing is not.
//      The style string below is load-bearing, not decoration.
//   3. NEVER let brand marks in. Badges, lettering, logos and number plates are
//      negatively prompted for the same reason.
//
// `vehicle-illustrations.test.ts` enforces 2 and 3 mechanically, and scans every
// subject prompt for any real OEM or model name to enforce 1.
//
// ===========================================================================
// HOW THE ASSETS GET HERE
// ===========================================================================
// `scripts/generate-vehicle-illustrations.mts` (run manually, never at request
// time) generates each illustration through ImageKit's `ik-genimg` text-to-image
// transformation, strips the background to a transparent PNG, and uploads the
// result to the media library at the stable `path` recorded below.
//
// The generated asset is *persisted* rather than served straight off the
// `ik-genimg` URL on purpose. Delivering the generation URL would embed the
// whole prompt in every page's HTML, re-run a paid, non-deterministic AI
// generation on any cache purge, and make the image silently change under us.
// A committed path is stable, cacheable and reviewable.
//
// `prompt` and `generatedOn` are kept here as the in-repo provenance record:
// this file is the answer to "where did this picture come from?".

import type { CarBodyType, CommercialType, TwoWheelerType, VehicleCategory } from "@/types/vehicle";
// Data-free by construction, and listed in CLAUDE.md point 23 as safe to import
// from a client component - which this module must stay, since it renders inside
// `PlaceholderImage`.
import { filterConfigFor } from "./vehicle-filter-options";

/** `"<category>:<sub-type>"`, e.g. `"car:suv"`, `"2-wheeler:scooter"`. */
export type IllustrationKey =
  | `car:${CarBodyType}`
  | `2-wheeler:${TwoWheelerType}`
  | `commercial:${CommercialType}`;

export interface VehicleIllustration {
  /** Stable ImageKit path of the generated, background-removed PNG. */
  path: string;
  /** The subject half of the generation prompt; `ILLUSTRATION_STYLE` is appended. */
  prompt: string;
  /** ISO date the asset was generated and uploaded. */
  generatedOn: string;
}

/**
 * Appended to every subject prompt so all illustrations share one visual
 * language - a mismatched set would look worse than the uniform SVG icon it
 * replaces. The "not photorealistic" and "no logos/badges/number plate"
 * clauses are the honesty guard described at the top of this file; don't drop
 * them to get a "nicer" render.
 */
export const ILLUSTRATION_STYLE =
  "flat vector illustration, side profile, centred, solid emerald green bodywork " +
  "with light grey glazing and dark grey tyres, plain flat white background, bold " +
  "simple geometric shapes, even lighting, no gradients, no text, no lettering, " +
  "no logos, no badges, no brand marks, no number plate, no people, no background " +
  "scenery, editorial infographic style, deliberately not photorealistic";

/**
 * Applied to the generated image before upload: strip the flat white
 * background so the cutout composites over each OEM's brand-tinted gradient in
 * `PlaceholderImage`, and force PNG because JPEG has no alpha channel (a `.jpg`
 * output silently flattens the transparency back to white).
 */
export const ILLUSTRATION_TRANSFORMATION = "e-bgremove,f-png";

/**
 * Every illustration that has been generated. A body type absent from this map
 * simply falls back to `PlaceholderImage`'s hand-drawn SVG icon, so this can be
 * filled in incrementally - commercial types are intentionally absent until
 * `commercial.ts` has real vehicles (batch log's Batch 5).
 */
export const VEHICLE_ILLUSTRATIONS: Partial<Record<IllustrationKey, VehicleIllustration>> = {
  "car:hatchback": {
    path: "/illustrations/vehicle-types/car-hatchback.png",
    prompt: "a generic unbranded small five-door electric hatchback car",
    generatedOn: "2026-08-17",
  },
  "car:suv": {
    path: "/illustrations/vehicle-types/car-suv.png",
    prompt: "a generic unbranded compact electric SUV with a raised ride height",
    generatedOn: "2026-08-17",
  },
  "car:sedan": {
    path: "/illustrations/vehicle-types/car-sedan.png",
    prompt: "a generic unbranded electric sedan car with a three-box silhouette and a separate boot",
    generatedOn: "2026-08-17",
  },
  "car:muv": {
    path: "/illustrations/vehicle-types/car-muv.png",
    prompt: "a generic unbranded seven-seat electric MPV people carrier with a long boxy cabin",
    generatedOn: "2026-08-17",
  },
  "2-wheeler:motorcycle": {
    path: "/illustrations/vehicle-types/two-wheeler-motorcycle.png",
    prompt:
      "a generic unbranded electric motorcycle with a tank-shaped centre body, " +
      "a straight handlebar and an exposed frame",
    generatedOn: "2026-08-17",
  },

  // -- NOT YET GENERATED: 2-wheeler:scooter ---------------------------------
  // Deliberately commented out rather than declared, because a declared `path`
  // with no asset behind it renders a broken image. Absent, the 54 scooters
  // fall back to the SVG icon exactly as before - which is why this map is
  // Partial.
  //
  // The ImageKit account hit its AI-generation cap after the five illustrations
  // above; a known-good prompt then returned 403 at a fresh path too, so this
  // is a provider limit, not a bad prompt. To finish it once the cap resets:
  //
  //   node --env-file=.env.local scripts/generate-vehicle-illustrations.mts --only=2-wheeler:scooter
  //
  // and uncomment this entry. This is the highest-value one left: scooters are
  // 54 of the 68 two-wheelers, the largest single sub-type in the catalog.
  //
  // Keep the wording. "electric scooter" alone yields a stand-up kick scooter,
  // which is the wrong vehicle entirely for this market - the
  // step-through/footboard/apron/long-seat phrasing is what pins it to an
  // Indian-market motor scooter. Verified by a probe that produced exactly that
  // wrong result.
  //
  // "2-wheeler:scooter": {
  //   path: "/illustrations/vehicle-types/two-wheeler-scooter.png",
  //   prompt:
  //     "a generic unbranded step-through electric motor scooter with a flat footboard, " +
  //     "a front apron and one long seat",
  //   generatedOn: "TODO",
  // },
};

/**
 * The fields needed to pick an illustration. A full `Vehicle` satisfies this
 * structurally; a lightweight `VehicleIndexEntry` (search thumbnails) carries
 * no sub-type, so it resolves to `undefined` and keeps the SVG icon - correct
 * at 44px, and it keeps the search index lean (see CLAUDE.md point 23).
 */
export interface VehicleIllustrationSubject {
  category: VehicleCategory;
  bodyType?: CarBodyType;
  twoWheelerType?: TwoWheelerType;
  commercialType?: CommercialType;
}

/**
 * A vehicle only ever carries one of the three sub-type fields, so the `??`
 * chain reads it without a per-category branch - same shape as
 * `vehicle-filter-options.test.ts` and `VehicleListing.tsx`. Impossible
 * combinations ("car:scooter") simply miss the registry and return undefined.
 */
export function illustrationFor(subject: VehicleIllustrationSubject): VehicleIllustration | undefined {
  const subType = subject.bodyType ?? subject.twoWheelerType ?? subject.commercialType;
  if (!subType) return undefined;
  return VEHICLE_ILLUSTRATIONS[`${subject.category}:${subType}` as IllustrationKey];
}

/** Full generation prompt for an illustration - subject plus the shared style. */
export function fullPromptFor(illustration: VehicleIllustration): string {
  return `${illustration.prompt}, ${ILLUSTRATION_STYLE}`;
}

/**
 * Human label for a subject's sub-type - "SUV", "Scooter", "3-Wheeler Cargo".
 * Reuses the filter registry's own labels rather than declaring a second set
 * that could drift from it. Used to say out loud, in the accessible name, which
 * *type* is being illustrated - the disclosure that keeps a generic drawing
 * from reading as a photo of the specific vehicle beside it.
 */
export function subTypeLabelFor(subject: VehicleIllustrationSubject): string | undefined {
  const subType = subject.bodyType ?? subject.twoWheelerType ?? subject.commercialType;
  if (!subType) return undefined;
  return filterConfigFor(subject.category).subTypeOptions.find((option) => option.value === subType)?.label;
}
