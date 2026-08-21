/**
 * Every business-specific value the Privacy Policy and Terms of Use need,
 * in one file, so filling them in is a single edit rather than a hunt through
 * two long documents.
 *
 * ⚠️ THE VALUES BELOW ARE PLACEHOLDERS. Replace all of them before launch.
 * `LEGAL_DETAILS_PENDING` derives itself from the square brackets, so the
 * moment the last placeholder is replaced the "being finalised" notice on
 * both pages disappears on its own — there is no second flag to remember.
 *
 * ⚠️ These documents were drafted against what the code actually does (see
 * `src/lib/leads/`, `src/lib/analytics/`, and the storage keys listed in the
 * policy), not from a template. That makes them accurate, not legally
 * reviewed. **Have someone qualified review both before launch** — this site
 * collects names, phone numbers and email addresses from the public, and
 * India's DPDP Act 2023 imposes real obligations on that.
 */

export const LEGAL_ENTITY = {
  /** Registered legal name, e.g. "EV Motion Technologies Private Limited". */
  name: "[REGISTERED ENTITY NAME]",
  /** How to describe the operator in prose, e.g. "a company registered in India". */
  description: "[ENTITY TYPE — e.g. a private limited company registered in India]",
  /** Full registered/postal address. Users need somewhere to send a data request. */
  address: "[REGISTERED ADDRESS]",
  /** General contact address. */
  email: "[CONTACT EMAIL]",
  /** DPDP Act 2023 expects a named contact for data-protection grievances. */
  grievanceOfficerName: "[GRIEVANCE OFFICER NAME]",
  grievanceOfficerEmail: "[GRIEVANCE OFFICER EMAIL]",
  /** City whose courts have jurisdiction, e.g. "Bengaluru, Karnataka". */
  jurisdiction: "[CITY, STATE]",
} as const;

/** Shown as "Last updated" on both documents. Bump when you change either. */
export const LEGAL_LAST_UPDATED = "21 August 2026";

/**
 * True while any value above is still a placeholder. Both pages render a
 * visible notice while this is true, so unfinished legal text can never
 * silently pass as final — the same honest-empty-state convention the rest of
 * the site uses for unsourced specs.
 */
export const LEGAL_DETAILS_PENDING: boolean = Object.values(LEGAL_ENTITY).some(
  (value) => value.includes("[") && value.includes("]"),
);

/**
 * Client-side storage the site uses. Listed in the Privacy Policy, and kept
 * here so the policy and the code cannot drift — if you add a key, add it
 * here and the policy updates itself.
 *
 * None of these are cookies and none are sent to a server. They exist so the
 * site remembers your preferences between visits.
 */
export const CLIENT_STORAGE_KEYS: { key: string; purpose: string; lifetime: string }[] = [
  { key: "ev-motion:city", purpose: "The city you selected, so prices stay local", lifetime: "Until you clear site data" },
  { key: "ev-motion:recent-cities", purpose: "Cities you recently picked, for quick reselection", lifetime: "Until you clear site data" },
  { key: "ev-motion:recent-searches", purpose: "Your recent searches, shown when you focus the search box", lifetime: "Until you clear site data" },
  { key: "ev-motion:recent-comparisons", purpose: "Comparisons you recently viewed, for the “Recently Compared” rail", lifetime: "Until you clear site data" },
  { key: "ev-motion:compare-recent-vehicles", purpose: "Vehicles you recently picked in the comparison tool, for quick reselection", lifetime: "Until you clear site data" },
  { key: "ev-motion:analytics-session", purpose: "A random ID grouping one visit’s analytics events", lifetime: "Deleted when you close the tab" },
];

/** Third parties that process data on our behalf. Named in the Privacy Policy. */
export const SUB_PROCESSORS: { name: string; role: string }[] = [
  { name: "Vercel", role: "Hosting and content delivery for the website itself" },
  { name: "Supabase", role: "The database that stores enquiry details and analytics events" },
  { name: "ImageKit", role: "Delivers the illustrations and images on the site" },
];
