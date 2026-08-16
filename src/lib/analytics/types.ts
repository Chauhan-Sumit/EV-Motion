/**
 * Analytics — event shapes shared by the browser, the ingest route and the
 * store. No runtime imports, so both sides can take these freely.
 *
 * **Privacy posture, decided deliberately and worth keeping.** This is
 * first-party, cookie-less product analytics, not visitor tracking:
 *
 *  - No cookies and no persistent identifier. The session id lives in
 *    `sessionStorage` and dies with the tab, so there is nothing to follow a
 *    person across visits, let alone across sites. That is also why the site
 *    needs no analytics consent banner.
 *  - No IP address is ever stored. The ingest route uses it for rate
 *    limiting and discards it — it is personal data under India's DPDP Act
 *    and the GDPR, and nothing here needs it.
 *  - No personal data in payloads. A `lead_submitted` event records which
 *    CTA converted and for which vehicle, never the submitter's name, phone
 *    or email — those live only in `public.leads`, behind RLS.
 *
 * If a future change would break any of those four properties, it needs a
 * privacy-policy conversation first, not just a code review.
 */

export type AnalyticsEventName =
  /** A search was run. `resultCount: 0` is the most valuable signal here — see below. */
  | "search"
  /** A vehicle detail page was viewed. Real popularity, as opposed to the derived rankings. */
  | "vehicle_view"
  /** A comparison was viewed. */
  | "compare_view"
  /** A lead was accepted. Records the CTA and vehicle only — never the contact details. */
  | "lead_submitted"
  /** A client- or server-side error was reported. */
  | "error";

/**
 * Zero-result searches deserve special mention: they are a direct, ranked
 * list of what this catalog is missing, written by real users. That feeds
 * Batch 7 (specs and coverage) far better than guessing which vehicles to
 * research next.
 */
export interface AnalyticsEvent {
  name: AnalyticsEventName;
  /** Page the event was raised from. */
  path?: string;
  /** Free-form, event-specific detail. Length-capped and allow-listed server-side. */
  props?: Record<string, string | number | boolean | null>;
  /** Milliseconds since epoch, set by the client so batched events keep their real order. */
  at: number;
}

export interface AnalyticsBatch {
  /** Tab-scoped anonymous id. Rotates whenever the tab is closed. */
  sessionId: string;
  events: AnalyticsEvent[];
}

export type AnalyticsOutcome =
  | { status: "accepted"; count: number }
  | { status: "not-configured" }
  | { status: "invalid" }
  | { status: "rate-limited" };
