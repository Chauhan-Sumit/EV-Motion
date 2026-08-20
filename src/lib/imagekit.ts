/**
 * Central ImageKit config. Reused anywhere the app needs to build an
 * ImageKit URL or render `@imagekit/next`'s <Image>/<Video> components.
 *
 * NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT / NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY are
 * safe to expose to the client. IMAGEKIT_PRIVATE_KEY (server-only, no
 * NEXT_PUBLIC_ prefix) must never be imported from a "use client" file.
 */
export const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";
export const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "";

/**
 * Whether ImageKit can actually serve an image right now.
 *
 * Without a URL endpoint, `@imagekit/next`'s <Image>/`buildSrc` still emit a
 * URL — one with nothing in front of the path — so every ImageKit-delivered
 * image renders as a broken image rather than as nothing. That is not
 * hypothetical: `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` was unset in the Vercel
 * environment until 2026-08-20 and silently broke every AI vehicle
 * illustration in Production (HANDOFF.md sub-batch 4).
 *
 * So every caller that would render an ImageKit asset checks this first and
 * falls back to the SVG icon / branded placeholder / "coming soon" slot it
 * already has. Same rule as the illustration registry's "never declare a
 * `path` before the asset exists" (CLAUDE.md #26): a missing image should
 * degrade to the placeholder, never to a broken one.
 *
 * `NEXT_PUBLIC_*` is inlined at build time, so this is a build-time constant
 * in client bundles — a deploy with the variable unset falls back everywhere
 * rather than half-rendering.
 */
export const IMAGEKIT_CONFIGURED = IMAGEKIT_URL_ENDPOINT.length > 0;

if (!IMAGEKIT_CONFIGURED && process.env.NODE_ENV !== "production") {
  // Fails loudly in dev rather than silently falling back everywhere.
  console.warn("[imagekit] NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not set — check .env.local");
}
