/**
 * Canonical site origin, used for `metadataBase`, every `alternates.canonical`,
 * the sitemap and JSON-LD `url` fields.
 *
 * Resolution order:
 *  1. `NEXT_PUBLIC_SITE_URL` — set this to the real origin once a domain exists.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` — so preview and production
 *     deploys emit self-consistent URLs without extra configuration.
 *  3. A clearly-fake placeholder.
 *
 * Landing on the placeholder is a real problem, not a cosmetic one: every
 * canonical tag would point at a domain nobody owns, which is worse for
 * indexing than not being crawled at all — search engines would consolidate
 * the pages onto a URL that doesn't resolve. `robots.ts` therefore blocks
 * crawling entirely while `SITE_URL_IS_PLACEHOLDER` is true, so the failure
 * mode is "not indexed yet" rather than "indexed under the wrong domain".
 * Set `NEXT_PUBLIC_SITE_URL` to fix it — see `.env.example`.
 */
const PLACEHOLDER_SITE_URL = "https://ev-motion.example.com";

function withProtocol(host: string): string {
  return host.startsWith("http") ? host : `https://${host}`;
}

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return withProtocol(configured).replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return withProtocol(vercelHost);

  return PLACEHOLDER_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

/** True when no real origin is configured — see the note above. */
export const SITE_URL_IS_PLACEHOLDER = SITE_URL === PLACEHOLDER_SITE_URL;
