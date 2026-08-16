import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests for this repo's pure logic — the pricing system, the compare
 * winner engine, slug handling, search, and the data-honesty and
 * filter-bound invariants documented in CLAUDE.md.
 *
 * Deliberately node-environment and component-free: there is no jsdom, no
 * React Testing Library and no `@vitejs/plugin-react` here. Everything under
 * test is a plain function, and keeping it that way means the suite runs in
 * under a second and stays worth running on every change. UI behaviour is
 * still verified in a real browser (CLAUDE.md point 12), which catches the
 * things that actually broke in this project — RSC boundary violations,
 * layout overflow, hydration — none of which a jsdom render would have
 * caught anyway.
 */
export default defineConfig({
  resolve: {
    alias: {
      // Mirrors tsconfig's `@/*` path mapping. Set here rather than via
      // vite-tsconfig-paths to avoid another dependency for one alias.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    reporters: "dot",
  },
});
