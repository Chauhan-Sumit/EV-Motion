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

if (!IMAGEKIT_URL_ENDPOINT && process.env.NODE_ENV !== "production") {
  // Fails loudly in dev rather than silently rendering broken image URLs.
  console.warn("[imagekit] NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not set — check .env.local");
}
