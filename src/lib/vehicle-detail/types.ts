import type { StateCharges } from "@/lib/data/state-charges";
import type { VehicleCategory } from "@/types/vehicle";

/**
 * Domain types for the Vehicle Detail Page.
 *
 * This is the page-shaped view model every vehicle is rendered through —
 * cars, scooters, motorcycles and commercial EVs alike. `VehicleDetail`
 * (the catalogue-shaped model) is mapped onto it by `buildVdpViewModel()`,
 * which is the only place the two vocabularies meet.
 */

/**
 * Body silhouette used by the illustration. Not a likeness of any real model —
 * one drawing serves every vehicle of that shape.
 *
 * Deliberately fewer shapes than the catalogue has body types: `sedan` and
 * `muv` cars reuse `coupe` and `suv`, and all five commercial types reduce to
 * `van` or `three-wheeler`. Drawing a distinct silhouette per body type would
 * imply a precision these generic drawings do not have.
 */
export type BodyShape =
  | "suv"
  | "hatch"
  | "coupe"
  | "scooter"
  | "motorcycle"
  | "van"
  | "three-wheeler";

export interface Variant {
  id: string;
  name: string;
  batteryKwh: number;
  rangeKm: number;
  exShowroom: number;
  /** Minutes for a 10 → 80% DC charge, or `null` where the maker publishes none. */
  dcFastChargeMinutes: number | null;
  /** Flags the value pick. At most one variant should carry it. */
  recommended?: boolean;
}

export interface Colour {
  id: string;
  name: string;
  hex: string;
}

/**
 * A frame in the hero gallery. `illustration` renders the live, re-colouring
 * drawing; `slot` is a labelled placeholder for photography that does not
 * exist yet — the prototype shows the brief rather than inventing a picture.
 */
export interface GalleryShot {
  id: string;
  kind: "illustration" | "slot";
  label: string;
  shortLabel: string;
  note: string;
}

/** A spec row whose value never changes with the configuration. */
export interface StaticSpec {
  label: string;
  value: string;
  /** Renders muted, for figures the maker has not published. */
  unpublished?: boolean;
}

/**
 * A spec row whose value comes from the selected variant. Keeping these as a
 * token rather than a function keeps `mock-data.ts` free of logic.
 */
export type VariantSpecSource = "battery" | "range" | "dcFastCharge";

export interface VariantSpec {
  label: string;
  from: VariantSpecSource;
}

export type SpecDefinition = (StaticSpec & { from?: never }) | VariantSpec;

/** A resolved spec row, ready to render. */
export interface SpecRow {
  label: string;
  value: string;
  unpublished: boolean;
}

/**
 * A comparison column. `self` marks the car this page is about — its rows are
 * filled from the live configuration rather than from static text.
 */
export type CompareValue = string | { live: "onRoad" | "range" | "battery" };

export interface CompareColumn {
  id: string;
  name: string;
  brand: string;
  shape: BodyShape;
  hex: string;
  self?: boolean;
  rows: { label: string; value: CompareValue }[];
}

export interface SimilarVehicle {
  id: string;
  brand: string;
  name: string;
  price: number;
  priceBasis: string;
  summary: string;
  shape: BodyShape;
  hex: string;
}

export interface Feature {
  category: string;
  label: string;
}

export interface VideoSlot {
  id: string;
  title: string;
  note: string;
  duration: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

/** Star-count histogram for the reviews block. All zero until reviews exist. */
export interface ReviewSummary {
  averageRating: number | null;
  totalRatings: number;
  histogram: { stars: number; count: number }[];
  /** Field labels a real review will fill — the layout, not invented content. */
  placeholderFields: { heading: string; meta: string };
}

/**
 * Every number this page derives is traceable to one of these, so the
 * assumptions behind a figure can be read off the page instead of guessed at.
 *
 * Built at render time by `useVdpPricingAssumptions()`, not baked into the
 * view model: `city`/`state`/`charges` come from the global `LocationContext`,
 * and these routes are statically generated, so a city baked in at build time
 * would be wrong for everyone who has picked a different one.
 *
 * The rate and the RTO charges come from `@/lib/vehicle-pricing` — this page
 * does **not** own an EMI rate or an on-road formula of its own. See
 * CLAUDE.md #16: there is exactly one pricing system on this site.
 */
export interface PricingAssumptions {
  /** Per-state RTO/road-tax/insurance rates, from `chargesForState(city.state)`. */
  charges: StateCharges;
  /** Annual reducing-balance rate, from the pricing service configuration. */
  annualRatePct: number;
  defaultTenureMonths: number;
  tenureOptions: { min: number; max: number; step: number };
  downPaymentOptions: { min: number; max: number; step: number };
  electricityCostPerUnit: number;
  petrolPricePerLitre: number;
  petrolKmPerLitre: number;
  /** What the petrol comparator is, e.g. "scooter" — printed in the disclosure. */
  petrolComparatorLabel: string;
  daysPerMonth: number;
  city: string;
  state: string;
}

export interface DailyDistanceRange {
  min: number;
  max: number;
  step: number;
  default: number;
  ticks: number[];
}

/** Section chrome — the eyebrow/title/lead that sits above each band. */
export interface SectionCopy {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
}

/**
 * Ad unit sizes the design uses. `leaderboard`, `rectangle` and `sticky` map
 * straight onto the shared `@/components/common/AdSlot`; `banner` (728 × 90)
 * is the one the shared component does not carry yet.
 */
export type AdSlotSize = "leaderboard" | "banner" | "rectangle" | "sticky";

export interface AdPlacement {
  size: AdSlotSize;
  /**
   * Why the slot sits where it does. Shown on the placeholder, because the
   * point of an ad slot in a design review is the placement argument, not the
   * grey box.
   */
  note: string;
}

/**
 * The five ad units, keyed by position. Carried here rather than inline in the
 * components so the page's whole ad inventory can be read — and argued with —
 * in one place.
 */
export interface AdInventory {
  /** 970 × 90, full-bleed band between the header and the hero. Desktop only. */
  heroLeaderboard: AdPlacement;
  /** 728 × 90, in the content column between the spec sheet and the comparison. */
  inContent: AdPlacement;
  /** 300 × 250, first thing in the right rail, above the price panel. */
  railTop: AdPlacement;
  /** 300 × 250, directly beneath the price panel. */
  railUnderPrice: AdPlacement;
  /** 300 × 600, foot of the rail; sticks for the length of the article. */
  railSticky: AdPlacement;
}

/**
 * Real-world range. A disclosed *model*, not a manufacturer figure: only
 * `araiKm` is claimed data, and the other three are it multiplied by the
 * factors shown alongside, so the page states the derivation instead of
 * implying someone measured it.
 */
export interface RealWorldRange {
  araiKm: number;
  cityKm: number;
  highwayKm: number;
  mixedKm: number;
  factors: { city: number; highway: number; mixed: number };
}

export interface VdpViewModel {
  /** Catalogue identity, for CTAs, analytics and links back to the record. */
  slug: string;
  category: VehicleCategory;
  brand: string;
  name: string;
  bodyType: string;
  shape: BodyShape;
  statement: string;
  badges: string[];
  overview: string;
  variants: Variant[];
  colours: Colour[];
  shots: GalleryShot[];
  /** Static headline chips in the hero strip. Range/battery/DC are prepended from the variant. */
  staticQuickSpecs: { label: string; value: string; unit: string }[];
  atAGlance: SpecDefinition[];
  specSheet: SpecDefinition[];
  ads: AdInventory;
  acChargeTime: string;
  /** The same AC charge time in minutes — the scale both charge bars share. */
  acChargeMinutes: number;
  chargingPort: string;
  batteryChemistry: string | null;
  features: Feature[];
  videos: VideoSlot[];
  reviews: ReviewSummary;
  faqs: Faq[];
  compare: CompareColumn[];
  similar: SimilarVehicle[];
  realWorldRange: RealWorldRange;
  dailyDistance: DailyDistanceRange;
  /**
   * The sticky section nav. One entry per `<section>` on the page, in document
   * order — the list must stay a 1:1 mirror of `sections` plus the hero
   * (`images`), which has no `SectionCopy` of its own because it renders no
   * heading block. Do not add an entry for a sub-block nested inside a section:
   * the colour picker inside Variants had one, and the nav highlight flicked
   * between the two as the reader scrolled a single section.
   */
  tabs: { id: string; label: string }[];
  sections: SectionCopy[];
}
