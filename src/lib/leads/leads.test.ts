import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isHoneypotTripped, normalizeMobile, parseLeadSubmission, validateField } from "./validation";
import { checkRateLimit, clientKey, resetRateLimits } from "./rateLimit";
import { supabaseConfig } from "./supabaseLeadStore";

/**
 * The lead endpoint is the only place on this site that accepts untrusted
 * input and writes it to a database, and the data it handles is personal —
 * names, phone numbers, email addresses. The validation here is the actual
 * gate (the dialog's copy of it is only a convenience), so these tests treat
 * it as a security boundary rather than a formatting helper.
 */

describe("normalizeMobile", () => {
  it("strips the formatting a person would reasonably type", () => {
    expect(normalizeMobile("+91 98765-43210")).toBe("9876543210");
    expect(normalizeMobile("98765 43210")).toBe("9876543210");
    expect(normalizeMobile("(9876) 543210")).toBe("9876543210");
    expect(normalizeMobile("919876543210")).toBe("9876543210");
  });

  it("leaves an already-clean number untouched", () => {
    expect(normalizeMobile("9876543210")).toBe("9876543210");
  });
});

describe("validateField", () => {
  it("accepts Indian mobile numbers starting 6-9", () => {
    for (const value of ["9876543210", "6000000000", "+91 98765 43210"]) {
      expect(validateField("mobile", "Mobile number", value)).toBeNull();
    }
  });

  it("rejects malformed mobile numbers", () => {
    for (const value of ["1234567890", "98765", "98765432101", "abcdefghij"]) {
      expect(validateField("mobile", "Mobile number", value)).not.toBeNull();
    }
  });

  it("accepts and rejects emails on shape", () => {
    expect(validateField("email", "Email", "someone@example.com")).toBeNull();
    for (const value of ["someone@", "@example.com", "someone example.com", "a@b"]) {
      expect(validateField("email", "Email", value)).not.toBeNull();
    }
  });

  it("treats whitespace-only input as missing", () => {
    expect(validateField("required", "Your name", "   ")).toBe("Please enter your your name.");
  });

  it("lets optional fields be blank", () => {
    expect(validateField("optional", "Message", "")).toBeNull();
  });
});

describe("parseLeadSubmission", () => {
  const valid = {
    kind: "best-price",
    fields: { name: "Asha", mobile: "9876543210" },
  };

  it("accepts a well-formed submission", () => {
    const result = parseLeadSubmission(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.lead.kind).toBe("best-price");
      expect(result.lead.fields.name).toBe("Asha");
      expect(result.lead.fields.mobile).toBe("9876543210");
    }
  });

  it("normalizes the mobile number before storing it", () => {
    // The database has a ^[6-9][0-9]{9}$ check constraint, so a formatted
    // number has to be normalized here or the insert fails.
    const result = parseLeadSubmission({ ...valid, fields: { mobile: "+91 98765-43210" } });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lead.fields.mobile).toBe("9876543210");
  });

  it("rejects a non-object body", () => {
    for (const body of [null, undefined, "string", 42, []]) {
      expect(parseLeadSubmission(body).ok).toBe(false);
    }
  });

  it("rejects an unknown lead kind", () => {
    const result = parseLeadSubmission({ ...valid, kind: "not-a-real-kind" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.kind).toBeDefined();
  });

  it("requires at least one way to contact the person back", () => {
    // A lead with neither phone nor email is unusable, and the database
    // enforces the same thing via leads_has_contact.
    const result = parseLeadSubmission({ kind: "enquiry", fields: { name: "Asha" } });
    expect(result.ok).toBe(false);
  });

  it("accepts email-only and mobile-only leads", () => {
    expect(parseLeadSubmission({ kind: "enquiry", fields: { email: "a@b.com" } }).ok).toBe(true);
    expect(parseLeadSubmission({ kind: "enquiry", fields: { mobile: "9876543210" } }).ok).toBe(true);
  });

  it("drops unknown field keys instead of passing them through", () => {
    // The allow-list is what stops a caller pushing arbitrary columns at the
    // database through the generic `fields` bag.
    const result = parseLeadSubmission({
      ...valid,
      fields: { ...valid.fields, id: "spoofed", status: "closed", is_admin: "true" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.lead.fields).sort()).toEqual(["mobile", "name"]);
    }
  });

  it("ignores non-string field values", () => {
    const result = parseLeadSubmission({ ...valid, fields: { name: { evil: true }, mobile: "9876543210" } });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lead.fields.name).toBeUndefined();
  });

  it("caps field lengths so a paste bomb can't be stored", () => {
    const result = parseLeadSubmission({ ...valid, fields: { ...valid.fields, name: "a".repeat(5000) } });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lead.fields.name!.length).toBe(80);
  });

  it("caps context values too", () => {
    const result = parseLeadSubmission({ ...valid, context: { path: "/".repeat(5000) } });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lead.context.path!.length).toBe(200);
  });

  it("keeps only known context keys", () => {
    const result = parseLeadSubmission({
      ...valid,
      context: { vehicleSlug: "tata-nexon-ev", city: "Delhi", path: "/cars", injected: "x" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.lead.context).sort()).toEqual(["city", "path", "vehicleSlug"]);
    }
  });

  it("defaults context to an empty object when absent", () => {
    const result = parseLeadSubmission(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lead.context).toEqual({});
  });
});

describe("honeypot", () => {
  it("trips on any non-empty value", () => {
    expect(isHoneypotTripped({ website: "http://spam.example" })).toBe(true);
    expect(isHoneypotTripped({ website: "   x" })).toBe(true);
  });

  it("does not trip for a real submission", () => {
    expect(isHoneypotTripped({ website: "" })).toBe(false);
    expect(isHoneypotTripped({ website: "   " })).toBe(false);
    expect(isHoneypotTripped({ kind: "best-price" })).toBe(false);
  });
});

describe("checkRateLimit", () => {
  beforeEach(() => resetRateLimits());

  it("allows requests up to the limit and blocks the next", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("1.2.3.4").allowed, `request ${i + 1}`).toBe(true);
    }
    const blocked = checkRateLimit("1.2.3.4");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks each client separately", () => {
    for (let i = 0; i < 5; i++) checkRateLimit("1.1.1.1");
    expect(checkRateLimit("1.1.1.1").allowed).toBe(false);
    expect(checkRateLimit("2.2.2.2").allowed).toBe(true);
  });

  it("lets a client through again once its window expires", () => {
    const opts = { windowMs: 20, max: 1 };
    expect(checkRateLimit("3.3.3.3", opts).allowed).toBe(true);
    expect(checkRateLimit("3.3.3.3", opts).allowed).toBe(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(checkRateLimit("3.3.3.3", opts).allowed).toBe(true);
        resolve();
      }, 30);
    });
  });

  it("reports a retry delay within the window", () => {
    const opts = { windowMs: 60_000, max: 1 };
    checkRateLimit("4.4.4.4", opts);
    const blocked = checkRateLimit("4.4.4.4", opts);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(blocked.retryAfterSeconds).toBeLessThanOrEqual(60);
  });
});

describe("clientKey", () => {
  it("takes the first hop of x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.5, 70.41.3.18" });
    expect(clientKey(headers)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip, then to a constant", () => {
    expect(clientKey(new Headers({ "x-real-ip": "203.0.113.9" }))).toBe("203.0.113.9");
    expect(clientKey(new Headers())).toBe("unknown");
  });
});

describe("supabaseConfig", () => {
  const saved = { ...process.env };

  afterEach(() => {
    process.env = { ...saved };
  });

  function withEnv(vars: Record<string, string | undefined>) {
    for (const [k, v] of Object.entries(vars)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }

  it("is null until a URL and some key are configured", () => {
    withEnv({
      SUPABASE_URL: undefined,
      SUPABASE_SECRET_KEY: undefined,
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      SUPABASE_PUBLISHABLE_KEY: undefined,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined,
    });
    expect(supabaseConfig()).toBeNull();

    withEnv({ SUPABASE_URL: "https://x.supabase.co" });
    expect(supabaseConfig()).toBeNull();
  });

  it("prefers a secret key over a publishable one", () => {
    // They imply different RLS setups, so picking the wrong one silently
    // would mean inserts failing against a deny-all policy set.
    withEnv({
      SUPABASE_URL: "https://x.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_aaa",
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_bbb",
    });

    const config = supabaseConfig();
    expect(config?.mode).toBe("secret");
    expect(config?.key).toBe("sb_secret_aaa");
  });

  it("accepts the legacy service_role variable name", () => {
    withEnv({
      SUPABASE_URL: "https://x.supabase.co",
      SUPABASE_SECRET_KEY: undefined,
      SUPABASE_SERVICE_ROLE_KEY: "legacy-jwt",
      SUPABASE_PUBLISHABLE_KEY: undefined,
    });
    expect(supabaseConfig()?.mode).toBe("secret");
  });

  it("falls back to a publishable key and reports that mode", () => {
    withEnv({
      SUPABASE_URL: "https://x.supabase.co",
      SUPABASE_SECRET_KEY: undefined,
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      SUPABASE_PUBLISHABLE_KEY: "sb_publishable_bbb",
    });

    const config = supabaseConfig();
    expect(config?.mode).toBe("publishable");
  });

  it("strips a trailing slash from the URL so request paths don't double up", () => {
    withEnv({ SUPABASE_URL: "https://x.supabase.co/", SUPABASE_SECRET_KEY: "sb_secret_aaa" });
    expect(supabaseConfig()?.url).toBe("https://x.supabase.co");
  });
});
