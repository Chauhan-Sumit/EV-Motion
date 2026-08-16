/**
 * Lead capture — the domain shapes shared by the dialog, the API route and
 * the storage adapter. No runtime imports, so both client and server can
 * take these without pulling anything along.
 */

/** Which CTA produced the lead. Stored so enquiries can be routed and reported on. */
export type LeadKind = "best-price" | "test-drive" | "notify-launch" | "advertise" | "enquiry";

export const LEAD_KINDS: LeadKind[] = ["best-price", "test-drive", "notify-launch", "advertise", "enquiry"];

/** The field kinds the dialog can collect, and that the server knows how to validate. */
export type LeadFieldKey = "name" | "mobile" | "email" | "message" | "company";

export const LEAD_FIELD_KEYS: LeadFieldKey[] = ["name", "mobile", "email", "message", "company"];

/**
 * What the browser posts to `POST /api/leads`.
 *
 * `context` is derived by the client rather than supplied by the user, and is
 * treated as untrusted all the same — it is length-capped server-side like
 * everything else.
 */
export interface LeadSubmission {
  kind: LeadKind;
  fields: Partial<Record<LeadFieldKey, string>>;
  context?: {
    /** Vehicle the enquiry is about, when raised from a vehicle surface. */
    vehicleSlug?: string;
    /** Selected city at submit time, for routing to a regional dealer. */
    city?: string;
    /** Page the lead was raised from. */
    path?: string;
  };
  /**
   * Honeypot. Must be empty — it's hidden from humans, so anything in it is a
   * bot filling every input it can see. Named innocuously on purpose.
   */
  website?: string;
}

export type LeadOutcome =
  | { status: "stored" }
  /** Accepted and validated, but no storage backend is configured — see leadStore.ts. */
  | { status: "not-configured" }
  | { status: "invalid"; errors: Partial<Record<LeadFieldKey | "kind", string>> }
  | { status: "rate-limited"; retryAfterSeconds: number }
  | { status: "error" };
