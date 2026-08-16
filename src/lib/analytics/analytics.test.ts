import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { parseAnalyticsBatch } from "./validation";
import { pendingAnalyticsCount, resetAnalyticsQueue, track } from "./track";

/**
 * `/api/events` is a public, unauthenticated write endpoint — the easiest
 * thing on the site to pollute. These tests treat the parser as the boundary
 * that keeps it bounded: fixed event names, capped prop counts, capped value
 * lengths, capped batch size, and no way to change the shape of a row.
 *
 * They also pin the privacy properties. If a change makes one of these fail,
 * that is a privacy-policy conversation, not a broken assertion to update.
 */

const NOW = 1_760_000_000_000;
const valid = {
  sessionId: "abc-123",
  events: [{ name: "search", path: "/cars", props: { query: "nexon", resultCount: 3 }, at: NOW }],
};

describe("parseAnalyticsBatch", () => {
  it("accepts a well-formed batch", () => {
    const parsed = parseAnalyticsBatch(valid, NOW);
    expect(parsed?.sessionId).toBe("abc-123");
    expect(parsed?.events).toHaveLength(1);
    expect(parsed?.events[0].props).toEqual({ query: "nexon", resultCount: 3 });
  });

  it("rejects malformed or empty input", () => {
    for (const body of [null, undefined, "string", 42, [], {}, { sessionId: "a" }, { sessionId: "a", events: [] }]) {
      expect(parseAnalyticsBatch(body, NOW), JSON.stringify(body)).toBeNull();
    }
  });

  it("requires a session id", () => {
    expect(parseAnalyticsBatch({ ...valid, sessionId: "" }, NOW)).toBeNull();
    expect(parseAnalyticsBatch({ ...valid, sessionId: "   " }, NOW)).toBeNull();
    expect(parseAnalyticsBatch({ ...valid, sessionId: 123 }, NOW)).toBeNull();
  });

  it("drops events with an unknown name rather than storing them", () => {
    const parsed = parseAnalyticsBatch(
      { ...valid, events: [{ name: "drop_tables", at: NOW }, valid.events[0]] },
      NOW,
    );
    expect(parsed?.events).toHaveLength(1);
    expect(parsed?.events[0].name).toBe("search");
  });

  it("returns null when no event survives validation", () => {
    expect(parseAnalyticsBatch({ ...valid, events: [{ name: "nope", at: NOW }] }, NOW)).toBeNull();
  });

  it("caps the number of events per batch", () => {
    const events = Array.from({ length: 200 }, () => ({ name: "search", at: NOW }));
    expect(parseAnalyticsBatch({ ...valid, events }, NOW)!.events.length).toBe(20);
  });

  it("caps the number of props per event", () => {
    const props = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`k${i}`, "v"]));
    const parsed = parseAnalyticsBatch({ ...valid, events: [{ name: "search", props, at: NOW }] }, NOW);
    expect(Object.keys(parsed!.events[0].props!).length).toBe(10);
  });

  it("caps value and path lengths", () => {
    const parsed = parseAnalyticsBatch(
      {
        ...valid,
        events: [{ name: "search", path: "/".repeat(9999), props: { query: "x".repeat(9999) }, at: NOW }],
      },
      NOW,
    );
    expect((parsed!.events[0].props!.query as string).length).toBe(300);
    expect(parsed!.events[0].path!.length).toBe(200);
  });

  it("drops non-scalar prop values instead of stringifying them", () => {
    // Stringifying would let a caller smuggle arbitrary structure into jsonb.
    const parsed = parseAnalyticsBatch(
      {
        ...valid,
        events: [{ name: "search", props: { nested: { a: 1 }, list: [1, 2], ok: "yes" }, at: NOW }],
      },
      NOW,
    );
    expect(parsed!.events[0].props).toEqual({ ok: "yes" });
  });

  it("keeps booleans, nulls and numbers, and rejects non-finite numbers", () => {
    const parsed = parseAnalyticsBatch(
      {
        ...valid,
        events: [{ name: "search", props: { b: false, n: null, num: 0, bad: Infinity }, at: NOW }],
      },
      NOW,
    );
    expect(parsed!.events[0].props).toEqual({ b: false, n: null, num: 0, bad: null });
  });

  it("clamps a wildly-skewed client clock to server time", () => {
    // A client clock set to 1970 or 2099 would otherwise scatter rows across
    // the table's time index and quietly corrupt every time-bucketed query.
    for (const at of [0, 4_102_444_800_000, -1]) {
      const parsed = parseAnalyticsBatch({ ...valid, events: [{ name: "search", at }] }, NOW);
      expect(parsed!.events[0].at).toBe(NOW);
    }
  });

  it("preserves a plausible client timestamp so batched events keep their order", () => {
    const earlier = NOW - 3000;
    const parsed = parseAnalyticsBatch(
      { ...valid, events: [{ name: "search", at: earlier }, { name: "vehicle_view", at: NOW }] },
      NOW,
    );
    expect(parsed!.events.map((e) => e.at)).toEqual([earlier, NOW]);
  });

  it("defaults a missing or non-numeric timestamp to now", () => {
    const parsed = parseAnalyticsBatch({ ...valid, events: [{ name: "search", at: "yesterday" }] }, NOW);
    expect(parsed!.events[0].at).toBe(NOW);
  });

  it("omits props entirely when none survive", () => {
    const parsed = parseAnalyticsBatch({ ...valid, events: [{ name: "search", props: {}, at: NOW }] }, NOW);
    expect(parsed!.events[0].props).toBeUndefined();
  });
});

describe("privacy properties", () => {
  it("has no field for an IP address anywhere in the accepted shape", () => {
    // The route uses the IP for rate limiting and discards it. Nothing in a
    // parsed batch should be able to carry it as a first-class field.
    const parsed = parseAnalyticsBatch(valid, NOW)!;
    expect(Object.keys(parsed)).toEqual(["sessionId", "events"]);
    expect(Object.keys(parsed.events[0]).sort()).toEqual(["at", "name", "path", "props"]);
  });

  it("does not treat a client-supplied identifier as durable", () => {
    // sessionId is whatever the tab generated; it is stored as-is but carries
    // no meaning beyond grouping one tab's events. Nothing derives an
    // identity from it, and it is capped so it can't smuggle a payload.
    const parsed = parseAnalyticsBatch({ ...valid, sessionId: "x".repeat(500) }, NOW);
    expect(parsed!.sessionId.length).toBe(64);
  });
});

describe("track() dedupe window", () => {
  // jsdom isn't available, so stand up the minimum `track` reads: window
  // (for location.pathname) and document (for its lifecycle listeners).
  // `navigator` is deliberately not stubbed — it is getter-only in Node, and
  // only `send()` touches it, which these tests never reach since they assert
  // on queue depth rather than flushing.
  const g = globalThis as Record<string, unknown>;

  beforeEach(() => {
    g.window = { location: { pathname: "/cars/x" }, addEventListener() {} };
    g.document = { addEventListener() {}, visibilityState: "visible" };
    resetAnalyticsQueue();
  });

  afterEach(() => {
    delete g.window;
    delete g.document;
    resetAnalyticsQueue();
  });

  it("suppresses an identical event repeated immediately", () => {
    // React StrictMode double-invokes effects in dev, which produced two
    // vehicle_view rows 3ms apart from a single page load.
    track("vehicle_view", { slug: "tata-nexon-ev", category: "car" });
    track("vehicle_view", { slug: "tata-nexon-ev", category: "car" });
    expect(pendingAnalyticsCount()).toBe(1);
  });

  it("still records a genuinely different event", () => {
    track("vehicle_view", { slug: "tata-nexon-ev", category: "car" });
    track("vehicle_view", { slug: "kia-ev6", category: "car" });
    expect(pendingAnalyticsCount()).toBe(2);
  });

  it("distinguishes events by name and path as well as props", () => {
    track("search", { query: "nexon" });
    track("compare_view", { query: "nexon" });
    expect(pendingAnalyticsCount()).toBe(2);
  });

  it("never throws, even with no browser globals at all", () => {
    delete g.window;
    expect(() => track("search", { query: "x" })).not.toThrow();
  });
});
