import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyNewLead, isLeadNotifierConfigured } from "@/lib/leads/notify";
import type { ParsedLead } from "@/lib/leads/validation";

/**
 * Two properties matter more than the plumbing here:
 *
 *  1. An error reporter must not become a PII leak. `/privacy` states plainly
 *     that we do not store IP addresses and never log lead contact details;
 *     Sentry attaches request data by default, so `scrubEvent` is what keeps
 *     that page true (CLAUDE.md #24-25).
 *  2. A lead notification must never be able to fail a lead. Storage happens
 *     first and the notifier is not allowed to throw, so a chat service being
 *     down costs the alert, never the enquiry.
 */

const lead: ParsedLead = {
  kind: "test-drive",
  fields: { name: "Asha", mobile: "9876543210", email: "asha@example.com", message: "Weekend slot please" },
  context: { vehicleSlug: "tata-nexon-ev", city: "delhi", path: "/cars/tata-nexon-ev" },
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

/**
 * SENTRY_ENABLED is read at module load (NEXT_PUBLIC_* is inlined at build
 * time), so the env has to be stubbed BEFORE the module is imported — a
 * top-level import would capture the wrong value. Same pattern as
 * imagekit.test.ts.
 */
async function loadScrubEvent(dsn: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", dsn);
  return (await import("./sentry-config")).scrubEvent;
}

describe("scrubEvent — the error reporter must not leak", () => {
  it("drops the request body, which is where lead submissions live", async () => {
    const scrubEvent = await loadScrubEvent("https://k@o1.ingest.sentry.io/1");
    const event = {
      request: {
        data: { name: "Asha", mobile: "9876543210" },
        cookies: { session: "abc" },
        headers: { "x-forwarded-for": "203.0.113.9", "user-agent": "Mozilla/5.0", authorization: "Bearer x" },
      },
    };

    const scrubbed = scrubEvent(event as never) as typeof event | null;

    expect(scrubbed?.request.data).toBeUndefined();
    expect(scrubbed?.request.cookies).toBeUndefined();
    // The two headers that carry an IP — the thing /privacy promises we do not store.
    expect(scrubbed?.request.headers["x-forwarded-for"]).toBeUndefined();
    expect(scrubbed?.request.headers.authorization).toBeUndefined();
    // Genuinely useful, non-identifying diagnostics survive.
    expect(scrubbed?.request.headers["user-agent"]).toBe("Mozilla/5.0");
  });

  it("has no PII anywhere in the scrubbed payload", async () => {
    const scrubEvent = await loadScrubEvent("https://k@o1.ingest.sentry.io/1");
    const event = { request: { data: { mobile: "9876543210", email: "asha@example.com" }, headers: {} } };
    const blob = JSON.stringify(scrubEvent(event as never));
    expect(blob).not.toContain("9876543210");
    expect(blob).not.toContain("asha@example.com");
  });

  it("drops the event entirely when Sentry is not configured", async () => {
    // Belt and braces: beforeSend only runs once Sentry has initialised, which
    // cannot happen without a DSN. If it somehow does, nothing leaves.
    const scrubEvent = await loadScrubEvent("");
    expect(scrubEvent({ request: { headers: {} } } as never)).toBeNull();
  });
});

describe("lead notifications must never cost a lead", () => {
  it("no-ops when no webhook is configured", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(isLeadNotifierConfigured()).toBe(false);
    await expect(notifyNewLead(lead)).resolves.toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("resolves false rather than throwing when the webhook errors", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example/abc");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("ECONNREFUSED"));
    // The lead is already stored by the time this runs. Rejecting here would
    // turn a stored lead into a 502 for the person who submitted it.
    await expect(notifyNewLead(lead)).resolves.toBe(false);
  });

  it("resolves false rather than throwing on a non-2xx response", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example/abc");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("no_service", { status: 404 }));
    await expect(notifyNewLead(lead)).resolves.toBe(false);
  });

  it("posts a message carrying the details someone needs to act on", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example/abc");
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));

    await expect(notifyNewLead(lead)).resolves.toBe(true);

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://hooks.example/abc");
    const body = JSON.parse(String(init.body));
    // Both keys, so one env var works with Slack/Chat/Teams (`text`) and
    // Discord (`content`) alike.
    expect(body.text).toBe(body.content);
    expect(body.text).toContain("Test-drive booking");
    expect(body.text).toContain("Asha");
    expect(body.text).toContain("9876543210");
    expect(body.text).toContain("tata-nexon-ev");
  });

  it("gives up rather than hanging when the webhook never answers", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example/abc");
    // Reject on abort, the way a real fetch does — proving the AbortController
    // is wired, not just constructed.
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    );

    vi.useFakeTimers();
    const pending = notifyNewLead(lead);
    await vi.advanceTimersByTimeAsync(3000);
    vi.useRealTimers();

    await expect(pending).resolves.toBe(false);
  });
});
