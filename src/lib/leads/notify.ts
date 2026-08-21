import type { ParsedLead } from "./validation";

/**
 * Sends a notification when a lead arrives.
 *
 * **Why this exists.** `public.leads` is RLS deny-all with no admin UI, so
 * until now a submitted enquiry sat in the database until somebody thought to
 * open the Supabase dashboard. For a lead-generation site that is the same as
 * losing it: the value of an enquiry decays in hours, not days.
 *
 * **Deliberately a generic webhook rather than an email provider.** One
 * `LEAD_WEBHOOK_URL` works with Slack, Discord, Google Chat, Microsoft Teams,
 * Zapier, Make and n8n, needs no new vendor account or API key, and no DNS or
 * domain-verification work. Email can be added behind the same seam later if
 * it is wanted; this is `leadStore.ts`'s adapter pattern again.
 *
 * ⚠️ **PRIVACY: this sends the submitter's name and contact details to
 * whatever URL you configure.** That is the point — a notification you have to
 * go and look something up from does not solve the problem. But it means the
 * destination must be a private channel your team controls, not a shared or
 * public one. `/privacy` covers this as a disclosure to "service providers who
 * process data on our behalf"; if you point it somewhere unusual, check that
 * is still true.
 */

/** How long to wait before giving up. A lead must never be lost because a chat service was slow. */
const TIMEOUT_MS = 2500;

export function isLeadNotifierConfigured(): boolean {
  return Boolean(process.env.LEAD_WEBHOOK_URL);
}

const KIND_LABEL: Record<string, string> = {
  "best-price": "Best-price request",
  "test-drive": "Test-drive booking",
  "notify-launch": "Launch notification signup",
  advertise: "Advertising enquiry",
  enquiry: "General enquiry",
};

/** Plain text, because every target service renders it: Slack, Discord, Chat and Teams all accept it. */
function formatMessage(lead: ParsedLead): string {
  const lines: string[] = [`🚗 ${KIND_LABEL[lead.kind] ?? lead.kind}`];

  if (lead.fields.name) lines.push(`Name: ${lead.fields.name}`);
  if (lead.fields.mobile) lines.push(`Mobile: ${lead.fields.mobile}`);
  if (lead.fields.email) lines.push(`Email: ${lead.fields.email}`);
  if (lead.fields.company) lines.push(`Company: ${lead.fields.company}`);
  if (lead.fields.message) lines.push(`Message: ${lead.fields.message}`);

  if (lead.context.vehicleSlug) lines.push(`Vehicle: ${lead.context.vehicleSlug}`);
  if (lead.context.city) lines.push(`City: ${lead.context.city}`);
  if (lead.context.path) lines.push(`From: ${lead.context.path}`);

  return lines.join("\n");
}

/**
 * Fire the notification. Returns `false` when nothing was sent, for any
 * reason — this **never throws and never rejects**, because a chat webhook
 * being down must not turn a successfully-stored lead into an error for the
 * person who submitted it.
 *
 * Awaited by the route rather than left floating: on serverless, a promise
 * still in flight when the handler returns can be killed with the instance.
 * A short timeout bounds the cost of that choice.
 */
export async function notifyNewLead(lead: ParsedLead): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  const text = formatMessage(lead);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `text` covers Slack, Google Chat and Teams; `content` covers Discord.
      // Sending both means one env var works with any of them, and the extra
      // key is ignored by each.
      body: JSON.stringify({ text, content: text }),
      signal: controller.signal,
    });

    clearTimeout(timer);
    if (!response.ok) {
      // Status only. The body could echo the payload back, and the payload is
      // the lead — CLAUDE.md #24: never log a lead object.
      console.error(`[leads] notification failed: HTTP ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(
      `[leads] notification failed: ${error instanceof Error ? error.name : "unknown error"}`,
    );
    return false;
  }
}
