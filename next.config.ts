import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
      {
        // ImageKit delivery domain for vehicle photos — see src/lib/imagekit.ts.
        // Scoped to our account id (from NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT); update
        // if the ImageKit account/endpoint ever changes.
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/brgzgc3ln/**",
      },
    ],
  },
};

/**
 * Sentry's build plugin is applied **only when a DSN is configured**.
 *
 * `withSentryConfig` otherwise injects its build steps, tries to resolve an
 * org/project, and warns on every build of a repo that has no Sentry account —
 * noise that trains people to ignore build output. Unwrapped is the correct
 * state for a deployment without Sentry, not a degraded one.
 *
 * Source maps are uploaded only when SENTRY_AUTH_TOKEN is also present (set it
 * in the Vercel environment, never commit it). Without the token the plugin
 * still wires error capture; you just get minified stack traces, which is why
 * `analytics/reportError.ts` deliberately reports `digest` rather than stacks.
 */
const sentryEnabled = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      // Route browser error reports through our own origin so ad blockers,
      // which block requests to sentry.io by default, do not silently swallow
      // exactly the reports we installed this to receive.
      tunnelRoute: "/monitoring",
      sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
      // Strips the Sentry SDK's own debug logging from the production bundle.
      disableLogger: true,
    })
  : nextConfig;
