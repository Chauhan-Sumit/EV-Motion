import { LEAD_FIELD_KEYS, LEAD_KINDS, type LeadFieldKey, type LeadSubmission } from "./types";

/**
 * One set of validation rules, used by both the dialog (for instant feedback)
 * and the API route (as the actual gate).
 *
 * The server re-validates from scratch rather than trusting the client's
 * word: the browser check is a convenience, and anyone can POST to the
 * endpoint directly. These rules previously lived inside
 * `LeadCaptureDialog.tsx`, where the server had no way to reach them.
 */

/** Indian mobile numbers: 10 digits starting 6-9. Tolerates spaces, dashes and a +91 prefix. */
const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Per-field caps. Anything longer is a paste-bomb or an injection attempt, not a name. */
export const MAX_FIELD_LENGTH: Record<LeadFieldKey, number> = {
  name: 80,
  mobile: 20,
  email: 160,
  message: 1000,
  company: 120,
};

const MAX_CONTEXT_LENGTH = 200;

/** Strips formatting a person might reasonably type: "+91 98765-43210" -> "9876543210". */
export function normalizeMobile(value: string): string {
  const digits = value.replace(/[\s\-()]/g, "").replace(/^\+?91/, "");
  return digits;
}

export type FieldValidation = "required" | "mobile" | "email" | "optional";

export function validateField(kind: FieldValidation, label: string, rawValue: string): string | null {
  const value = rawValue.trim();

  if (kind === "optional") return null;
  if (!value) return `Please enter your ${label.toLowerCase()}.`;

  if (kind === "mobile") {
    return MOBILE_PATTERN.test(normalizeMobile(value)) ? null : "Please enter a valid 10-digit mobile number.";
  }
  if (kind === "email") {
    return EMAIL_PATTERN.test(value) ? null : "Please enter a valid email address.";
  }
  return null;
}

export interface ParsedLead {
  kind: LeadSubmission["kind"];
  fields: Partial<Record<LeadFieldKey, string>>;
  context: NonNullable<LeadSubmission["context"]>;
}

export type ParseResult =
  | { ok: true; lead: ParsedLead }
  | { ok: false; errors: Partial<Record<LeadFieldKey | "kind", string>> };

function clamp(value: string, max: number): string {
  return value.trim().slice(0, max);
}

/**
 * Validates and normalizes an untrusted request body.
 *
 * Deliberately allow-list based: unknown field keys are dropped rather than
 * passed through, so a caller can't push arbitrary columns at the database
 * through the generic `fields` bag.
 */
export function parseLeadSubmission(body: unknown): ParseResult {
  const errors: Partial<Record<LeadFieldKey | "kind", string>> = {};

  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: { kind: "Malformed request." } };
  }

  const raw = body as Record<string, unknown>;

  const kind = raw.kind;
  if (typeof kind !== "string" || !LEAD_KINDS.includes(kind as LeadSubmission["kind"])) {
    errors.kind = "Unknown enquiry type.";
  }

  const rawFields = typeof raw.fields === "object" && raw.fields !== null ? (raw.fields as Record<string, unknown>) : {};
  const fields: Partial<Record<LeadFieldKey, string>> = {};

  for (const key of LEAD_FIELD_KEYS) {
    const value = rawFields[key];
    if (typeof value !== "string") continue;
    const trimmed = clamp(value, MAX_FIELD_LENGTH[key]);
    if (trimmed) fields[key] = key === "mobile" ? normalizeMobile(trimmed) : trimmed;
  }

  // Every lead needs at least one way to reach the person back.
  if (!fields.mobile && !fields.email) {
    errors.mobile = "Please provide a mobile number or an email address.";
  }
  if (fields.mobile && !MOBILE_PATTERN.test(fields.mobile)) {
    errors.mobile = "Please enter a valid 10-digit mobile number.";
  }
  if (fields.email && !EMAIL_PATTERN.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const rawContext =
    typeof raw.context === "object" && raw.context !== null ? (raw.context as Record<string, unknown>) : {};
  const context: ParsedLead["context"] = {};
  for (const key of ["vehicleSlug", "city", "path"] as const) {
    const value = rawContext[key];
    if (typeof value === "string" && value.trim()) context[key] = clamp(value, MAX_CONTEXT_LENGTH);
  }

  return { ok: true, lead: { kind: kind as LeadSubmission["kind"], fields, context } };
}

/** True when the honeypot was filled — a bot, not a person. */
export function isHoneypotTripped(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const website = (body as Record<string, unknown>).website;
  return typeof website === "string" && website.trim().length > 0;
}
