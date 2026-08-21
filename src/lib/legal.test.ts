import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CLIENT_STORAGE_KEYS, LEGAL_DETAILS_PENDING, LEGAL_ENTITY, SUB_PROCESSORS } from "./legal";

/**
 * The Privacy Policy makes checkable claims about what the site stores. The
 * risk is not that it is wrong today — it was written against the code — but
 * that someone adds a sixth `localStorage` key next month and the policy
 * silently becomes an incomplete disclosure.
 *
 * Same shape of guard as `vehicle-filter-options.test.ts` (CLAUDE.md #5a):
 * catch the drift that `tsc`, `eslint` and `next build` are all blind to.
 */

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, acc);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) acc.push(full);
  }
  return acc;
}

/** Every `"ev-motion:…"` string literal in the app — the site's storage-key convention. */
function storageKeysInSource(): Set<string> {
  const found = new Set<string>();
  for (const file of sourceFiles("src")) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/["'`](ev-motion:[a-z0-9-]+)["'`]/g)) found.add(match[1]);
  }
  return found;
}

describe("privacy policy disclosures stay true", () => {
  it("discloses every client-side storage key the code actually uses", () => {
    const inCode = storageKeysInSource();
    const disclosed = new Set(CLIENT_STORAGE_KEYS.map((k) => k.key));

    const undisclosed = [...inCode].filter((k) => !disclosed.has(k)).sort();
    expect(
      undisclosed,
      `These storage keys are used in src/ but not listed in CLIENT_STORAGE_KEYS, so the Privacy Policy does not disclose them: ${undisclosed.join(", ")}`,
    ).toEqual([]);
  });

  it("does not disclose keys that no longer exist", () => {
    // A policy listing storage the site stopped using is inaccurate in the
    // other direction, and reads as carelessness rather than caution.
    const inCode = storageKeysInSource();
    const stale = CLIENT_STORAGE_KEYS.map((k) => k.key).filter((k) => !inCode.has(k)).sort();
    expect(stale, `Listed in the Privacy Policy but no longer used in src/: ${stale.join(", ")}`).toEqual([]);
  });

  it("gives every disclosed key a purpose and a lifetime", () => {
    for (const row of CLIENT_STORAGE_KEYS) {
      expect(row.purpose.trim().length, `${row.key} has no purpose`).toBeGreaterThan(0);
      expect(row.lifetime.trim().length, `${row.key} has no lifetime`).toBeGreaterThan(0);
    }
  });

  it("names at least one processor, each with a stated role", () => {
    expect(SUB_PROCESSORS.length).toBeGreaterThan(0);
    for (const p of SUB_PROCESSORS) expect(p.role.trim().length, `${p.name} has no role`).toBeGreaterThan(0);
  });

  it("still sets no cookies, which is what the policy claims", () => {
    // The policy states plainly that the site uses no cookies and therefore
    // needs no banner. If that ever stops being true, this fails first.
    const offenders = sourceFiles("src").filter((file) => /document\.cookie|cookies\(\)/.test(readFileSync(file, "utf8")));
    expect(offenders, `Privacy Policy claims no cookies, but these files touch cookies: ${offenders.join(", ")}`).toEqual([]);
  });
});

describe("placeholder tracking", () => {
  it("flags itself as pending while entity details are unfilled", () => {
    // Not an assertion that placeholders are gone — that would fail the suite
    // for a reason unrelated to code quality. It asserts the DETECTION works,
    // so the on-page "being finalised" notice appears exactly when it should
    // and disappears by itself once src/lib/legal.ts is filled in.
    const hasPlaceholder = Object.values(LEGAL_ENTITY).some((v) => v.includes("[") && v.includes("]"));
    expect(LEGAL_DETAILS_PENDING).toBe(hasPlaceholder);
  });

  it("leaves a visible trail of what still needs filling in", () => {
    const pending = Object.entries(LEGAL_ENTITY)
      .filter(([, v]) => v.includes("[") && v.includes("]"))
      .map(([k]) => k);
    // Informational: prints the outstanding fields when the suite runs, so
    // "what is left before launch" is answerable from `npm test`.
    if (pending.length > 0) {
      console.log(`[legal] ${pending.length} entity field(s) still placeholder: ${pending.join(", ")}`);
    }
    expect(Array.isArray(pending)).toBe(true);
  });
});
