import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * ============================================================================
 * GET /prototype/vehicle-page — ISOLATED DESIGN PROTOTYPE. Not a product page.
 * ============================================================================
 *
 * Serves `prototypes/vehicle-page/nexon-ev-redesign.html` verbatim, so the
 * proposed Vehicle Detail Page redesign can be reviewed in a browser before
 * anyone decides to implement it.
 *
 * Why a **route handler** and not a `page.tsx`:
 *
 *   - The design is a complete, self-contained HTML document — its own
 *     `<head>`, its own token block, its own nav and footer, its own script
 *     that draws the car SVG and recalculates the EMI/variant/colour controls.
 *     A route handler returns a raw `Response`, so the browser renders that
 *     document exactly as designed. A `page.tsx` would be wrapped by the root
 *     layout and arrive with the production `<Navbar>` and `<Footer>` stacked
 *     on top of the mockup's own.
 *   - Byte-for-byte fidelity is the point. Nothing here re-implements,
 *     re-interprets or "ports" the design, so what is reviewed is precisely
 *     what was designed.
 *
 * Isolation guarantees — this prototype:
 *
 *   - imports nothing from `src/` and is imported by nothing;
 *   - touches no existing route, component, data file or style;
 *   - is absent from `sitemap.ts` (which enumerates routes explicitly, so
 *     nothing had to be excluded) and is sent `X-Robots-Tag: noindex`;
 *   - never serves on a production deployment (see the `VERCEL_ENV` gate),
 *     while still working in a local `next build && next start`.
 *
 * Deleting `src/app/prototype/` and `prototypes/` removes it whole, with no
 * other file to clean up.
 */

// Read from disk per request rather than inlining at build time, so edits to
// the HTML show up on a refresh during a review session.
export const dynamic = "force-dynamic";

const PROTOTYPE_FILE = path.join(process.cwd(), "prototypes", "vehicle-page", "nexon-ev-redesign.html");

export async function GET(): Promise<Response> {
  // A design prototype has no business being reachable on the live site. Local
  // dev, preview builds and `next start` all still serve it.
  if (process.env.VERCEL_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  let html: string;
  try {
    html = await readFile(PROTOTYPE_FILE, "utf8");
  } catch {
    return new Response(
      `Prototype source missing. Expected it at:\n\n  ${PROTOTYPE_FILE}\n`,
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}
