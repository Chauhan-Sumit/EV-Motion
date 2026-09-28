/**
 * ============================================================================
 * MOCKUP-ONLY demo content. Not production data. Not imported by any real page.
 * ============================================================================
 *
 * Everything in this file exists so the /model-page-mockup design prototype can
 * show a *finished-looking* page. It is deliberately quarantined here, outside
 * `src/lib/data/`, because it breaks the project's honesty rules on purpose:
 * ratings, review text, news headlines and video entries below are INVENTED.
 *
 * The rules that still hold, and that this file must never be used to dodge:
 *
 *   - No invented vehicle SPECS. Every spec the mockup renders (range, pack
 *     size, power, torque, charge time, warranty, dimensions, safety, prices,
 *     variants, colours) comes from the real catalog record via
 *     `toVehicleDetail(...)` — never from here.
 *   - Nothing here may be promoted into `src/lib/data/`. If the production VDP
 *     ever wants reviews or news, they need a real source, not this.
 *   - The page renders a permanent "design prototype / demo content" banner so
 *     a reviewer can never mistake a screenshot of it for shipped truth.
 *
 * Delete this file with the mockup if the design is rejected.
 */

export interface DemoReview {
  id: string;
  author: string;
  city: string;
  ownedFor: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
}

/** INVENTED. Placeholder owner reviews — no real owner said any of this. */
export const demoReviews: DemoReview[] = [
  {
    id: "r1",
    author: "Owner A",
    city: "Gurugram",
    ownedFor: "14 months",
    rating: 5,
    title: "The running cost is the headline, not the range",
    body:
      "Charging at home overnight has taken my monthly fuel spend from about five thousand rupees to under a thousand. Range on the highway is lower than the claim, as expected, but two stops on a long drive is a rhythm you get used to quickly.",
    helpful: 132,
  },
  {
    id: "r2",
    author: "Owner B",
    city: "Pune",
    ownedFor: "8 months",
    rating: 4,
    title: "Excellent city car, plan your highway runs",
    body:
      "In the city it is genuinely effortless — one pedal driving, no gear changes, no noise. On highways I plan around fast chargers rather than assuming they will be free, which is more about the network than the car.",
    helpful: 87,
  },
  {
    id: "r3",
    author: "Owner C",
    city: "Bengaluru",
    ownedFor: "2 years",
    rating: 5,
    title: "Two years in, battery health still strong",
    body:
      "No meaningful range drop that I can measure, and service visits have been routine. The cabin tech feels a generation behind the drivetrain, but that is the only place I would ask for more.",
    helpful: 210,
  },
];

/** INVENTED. Rating distribution for the reviews above. */
export const demoRatingSummary = {
  average: 4.6,
  count: 512,
  distribution: [
    { stars: 5, share: 68 },
    { stars: 4, share: 21 },
    { stars: 3, share: 7 },
    { stars: 2, share: 3 },
    { stars: 1, share: 1 },
  ],
};

export interface DemoVideo {
  id: string;
  title: string;
  duration: string;
  kind: string;
}

/** INVENTED. Video slots — no video is actually embedded in the mockup. */
export const demoVideos: DemoVideo[] = [
  { id: "v1", title: "Full review — what it is like to live with", duration: "12:40", kind: "Review" },
  { id: "v2", title: "Real-world range test, city to highway", duration: "08:15", kind: "Range test" },
  { id: "v3", title: "Charging from 10 to 80 percent, timed", duration: "05:02", kind: "Charging" },
  { id: "v4", title: "Interior and cabin tech walkthrough", duration: "06:28", kind: "Interior" },
];

export interface DemoNews {
  id: string;
  headline: string;
  category: string;
  readTime: string;
}

/** INVENTED headlines. Production's LatestEVNewsSection deliberately renders an
 *  honest empty state instead — this exists only to show the layout. */
export const demoNews: DemoNews[] = [
  { id: "n1", headline: "What the revised state EV policy changes for buyers this year", category: "Policy", readTime: "4 min" },
  { id: "n2", headline: "Fast-charging corridors: which highways are actually covered", category: "Charging", readTime: "6 min" },
  { id: "n3", headline: "Battery warranties compared across every mass-market EV", category: "Ownership", readTime: "5 min" },
];

/** Journey pairs for the range visualisation. Straight-line-ish road distances,
 *  used only to give the range bars a human scale. */
export const demoJourneys = [
  { id: "j1", from: "Gurugram", to: "Jaipur", km: 270 },
  { id: "j2", from: "Gurugram", to: "Chandigarh", km: 250 },
  { id: "j3", from: "Gurugram", to: "Agra", km: 220 },
];

/** Editorial pull-outs for the story section. Written for the mockup. */
export const demoStoryPoints = [
  {
    id: "s1",
    kicker: "Why it matters",
    title: "The EV that made the segment mainstream",
    body: "It was the first electric SUV in India priced where mass-market buyers actually shop, and it is still the volume benchmark every rival is measured against.",
  },
  {
    id: "s2",
    kicker: "Who it suits",
    title: "Daily city driving with weekend range to spare",
    body: "A commuter that charges at home overnight and occasionally runs intercity gets the most out of this pack size without ever thinking about charging.",
  },
];
