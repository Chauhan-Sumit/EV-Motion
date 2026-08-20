import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `IMAGEKIT_CONFIGURED` is the single condition four render paths branch on —
 * `PlaceholderImage` (the AI body-type illustration), `VehicleImage` (a real
 * photo), `VehicleGallery` (gallery slots) and `structured-data.ts` (the
 * JSON-LD `image` property). Each falls back to the SVG icon / branded
 * placeholder / "coming soon" slot / no property when it is false.
 *
 * It matters because `@imagekit/next` does NOT fail loudly without an
 * endpoint: `<Image>` and `buildSrc` still emit a src, just one with no host
 * in front of the path, so the page renders broken images rather than
 * nothing. `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` was unset in the Vercel
 * environment until 2026-08-20 and silently broke every vehicle illustration
 * in Production (HANDOFF.md sub-batch 4) — this pins the guard that now
 * catches that.
 *
 * The flag is computed at module load (NEXT_PUBLIC_* is inlined at build
 * time), so each case needs a fresh module registry.
 */

async function configuredWith(endpoint: string | undefined): Promise<boolean> {
  vi.resetModules();
  if (endpoint === undefined) vi.stubEnv("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT", undefined);
  else vi.stubEnv("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT", endpoint);
  const { IMAGEKIT_CONFIGURED } = await import("./imagekit");
  return IMAGEKIT_CONFIGURED;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("IMAGEKIT_CONFIGURED", () => {
  it("is false when the endpoint is unset — the Production failure that happened", () => {
    return expect(configuredWith(undefined)).resolves.toBe(false);
  });

  it("is false when the endpoint is set to an empty string", () => {
    // A present-but-empty env var is the more likely misconfiguration of the
    // two, and `?? ""` would let it through as a "value" without this check.
    return expect(configuredWith("")).resolves.toBe(false);
  });

  it("is true for a real endpoint", () => {
    return expect(configuredWith("https://ik.imagekit.io/evmotion")).resolves.toBe(true);
  });
});
