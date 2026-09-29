import type {
  AdInventory,
  DailyDistanceRange,
  GalleryShot,
  SectionCopy,
} from "./types";

/**
 * Page chrome: everything on the Vehicle Detail Page that is the same for
 * every vehicle — section order and headings, the section-nav tabs, the ad
 * inventory, the gallery slot briefs, and the ownership-tool slider range.
 *
 * Kept out of `buildVdpViewModel()` so the page's *structure* can be read and
 * changed in one short file, without wading through the catalogue mapping.
 * The section titles below are deliberately free of any model name; the one
 * that needs it (`Overview`) gets it interpolated per vehicle.
 */

/** Ordered exactly as the sections appear in the document. */
export const VDP_SECTION_ORDER = [
  "images",
  "overview",
  "variants",
  "battery",
  "real-world-range",
  "ownership-tools",
  "specifications",
  "compare",
  "features",
  "videos",
  "reviews",
  "faqs",
  "similar",
  "news",
] as const;

/**
 * The sticky nav. One tab per section, in document order — a 1:1 mirror of the
 * sections actually on the page. Do not add an entry for a sub-block nested
 * inside a section (the colour picker inside Variants had one, and the
 * highlight flicked between the two while scrolling a single section).
 */
export const VDP_TABS: { id: string; label: string }[] = [
  { id: "images", label: "Images" },
  { id: "overview", label: "Overview" },
  { id: "variants", label: "Variants" },
  { id: "battery", label: "Battery & Charging" },
  { id: "real-world-range", label: "Real World Range" },
  { id: "ownership-tools", label: "Ownership Tools" },
  { id: "specifications", label: "Specifications" },
  { id: "compare", label: "Compare" },
  { id: "features", label: "Features" },
  { id: "videos", label: "Videos" },
  { id: "reviews", label: "Reviews" },
  { id: "faqs", label: "FAQs" },
  { id: "similar", label: "Similar" },
  { id: "news", label: "News" },
];

/** Section eyebrow/title/lead. `{name}` is replaced with the model name. */
export function vdpSections(
  name: string,
  categoryNoun: string,
  /** Published connector, or null. Only claimed when the maker states one. */
  chargingPort: string | null,
): SectionCopy[] {
  // "Similar Cars" on a car, exactly as approved; the noun follows the data
  // rather than being genericised to "Vehicles". Splits on hyphens too, so
  // "two-wheelers" title-cases to "Two-Wheelers" rather than "Two-wheelers".
  const categoryNounTitle = categoryNoun
    .split(" ")
    .map((word) =>
      word === "EVs"
        ? word
        : word
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join("-"),
    )
    .join(" ");
  return [
    { id: "overview", eyebrow: "Overview", title: `${name} at a glance` },
    {
      id: "variants",
      eyebrow: "Variants",
      title: "Choose your variant",
      lead: "Pick a variant and a colour — the preview redraws instantly, and price, on-road, EMI, range and running cost all follow.",
    },
    {
      id: "battery",
      eyebrow: "Battery & Charging",
      title: "Battery and charging",
      lead: chargingPort
        ? `${chargingPort} port, so every public DC network in India works without an adapter.`
        : "How long a charge takes, at home and on a fast charger.",
    },
    {
      id: "real-world-range",
      eyebrow: "Real World Range",
      title: "What you'll actually get",
      lead: "The claimed figure is a test-cycle number. These are estimates derived from it — the multiplier used is printed on each one.",
    },
    {
      id: "ownership-tools",
      eyebrow: "Ownership Tools",
      title: "Cost of ownership",
      lead: "The question behind range, charging and price. Set your daily drive and the numbers follow.",
    },
    { id: "specifications", eyebrow: "Specifications", title: "Full specifications" },
    {
      id: "compare",
      eyebrow: "Compare",
      title: "Compare with alternatives",
      lead: `The two ${categoryNoun} shoppers put beside it most often.`,
    },
    { id: "features", eyebrow: "Features", title: "Top features" },
    {
      id: "videos",
      eyebrow: "Videos",
      title: "Videos and walkarounds",
      lead: "No videos are on file yet. These are the three that convert best on a vehicle page.",
    },
    {
      id: "reviews",
      eyebrow: "Reviews",
      title: "Owner reviews",
      lead: "No ratings on file yet — the layout below is the structure each review will fill.",
    },
    { id: "faqs", eyebrow: "FAQs", title: "Frequently asked questions" },
    {
      id: "similar",
      eyebrow: `Similar ${categoryNounTitle}`,
      title: `Similar electric ${categoryNoun}`,
      lead: `Electric ${categoryNoun} shoppers view in the same session.`,
    },
    {
      id: "news",
      eyebrow: "News",
      title: `Latest news on the ${name}`,
    },
  ];
}

/**
 * Gallery frames. Frame one is the live, re-colouring illustration; the rest
 * are labelled briefs for photography that does not exist yet. The catalogue
 * has no licensed photography for any of its 123 vehicles, so the honest thing
 * is to state the shot each slot wants rather than invent a picture.
 */
export const VDP_SHOTS: GalleryShot[] = [
  {
    id: "side",
    kind: "illustration",
    label: "Side profile",
    shortLabel: "Side",
    note: "Live illustration in the selected colour.",
  },
  {
    id: "front-three-quarter",
    kind: "slot",
    label: "Three-quarter front",
    shortLabel: "Front ¾",
    note: "2400 × 1350 · three-quarter front, neutral studio floor",
  },
  {
    id: "rear-three-quarter",
    kind: "slot",
    label: "Rear three-quarter",
    shortLabel: "Rear ¾",
    note: "2400 × 1350 · rear three-quarter, tail lights lit",
  },
  {
    id: "interior",
    kind: "slot",
    label: "Front row interior",
    shortLabel: "Interior",
    note: "2400 × 1350 · dashboard and front seats, driver's side",
  },
  {
    id: "charging",
    kind: "slot",
    label: "Charging port",
    shortLabel: "Charging",
    note: "2400 × 1350 · CCS2 port open, cable connected",
  },
];

/** Placements and notes carried over verbatim from the approved prototype. */
export const VDP_ADS: AdInventory = {
  heroLeaderboard: {
    size: "leaderboard",
    note: "Above the hero — first impression, desktop only.",
  },
  inContent: {
    size: "banner",
    note: "In-content, after the spec sheet — high dwell, just before the comparison decision point.",
  },
  railTop: {
    size: "rectangle",
    note: "Top of the rail, above the fold — the highest-value slot on the page.",
  },
  railUnderPrice: {
    size: "rectangle",
    note: "Directly under the price panel — read straight after the CTA.",
  },
  railSticky: {
    size: "sticky",
    note: "Sticks to the viewport from here down, through the comparison, review and FAQ sections.",
  },
};

export const VDP_DAILY_DISTANCE: DailyDistanceRange = {
  min: 10,
  max: 150,
  step: 5,
  default: 40,
  ticks: [10, 80, 150],
};

/** The three video slots the design briefs, in order. */
export const VDP_VIDEO_SLOTS = [
  { id: "walkaround", title: "Full walkaround", note: "Exterior, cabin, boot · slot", duration: "4:00" },
  { id: "road-test", title: "Road test & real range", note: "Highway and city loop · slot", duration: "8:00" },
  { id: "charging", title: "Charging in practice", note: "DC stop and home setup · slot", duration: "3:00" },
];
