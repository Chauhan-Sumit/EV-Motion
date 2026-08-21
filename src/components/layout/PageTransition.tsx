"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Fades each page in on client-side navigation — **but never on the first
 * load.**
 *
 * That distinction is load-bearing, and getting it wrong was a real
 * performance bug found in the 2026-08-21 audit. This component used to pass
 * `initial={{ opacity: 0, y: 8 }}` unconditionally, so framer-motion rendered
 * `<div style="opacity:0;transform:translateY(8px)">` into the **server HTML of
 * every route**. The page was therefore invisible until React hydrated and the
 * animation ran:
 *
 *   - Mobile LCP was **6.6 s**, of which **93% was "render delay"** — TTFB was
 *     only 454 ms, so the content was sitting there, unpainted, waiting on JS.
 *   - With JavaScript blocked or broken, the entire site rendered blank while
 *     the HTML underneath was perfectly complete.
 *
 * The fix is not to drop the transition — it is a locked design decision and
 * still runs on every navigation. It is to skip it for the one render where
 * there is nothing to transition *from*.
 *
 * **`hasNavigated` is module-scoped on purpose.** `src/app/template.tsx`
 * remounts this component on every navigation, so component state or a plain
 * ref would reset each time and every page would be treated as a first load.
 * On the server it is always `false`, so SSR always emits visible markup;
 * the first client render reads `false` too (matching the server, so no
 * hydration mismatch), and only then does the effect flip it.
 */
let hasNavigated = false;

export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  // Snapshot at mount, before the effect below flips the module flag. A
  // `useState` initializer rather than a ref: it runs exactly once per mount
  // and is readable during render, which reading `ref.current` is not
  // (react-hooks/refs).
  const [isNavigation] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  // `false` tells framer-motion to render at the target values immediately —
  // no inline opacity:0, nothing for the browser to wait on.
  const shouldAnimateIn = isNavigation && !shouldReduceMotion;

  return (
    <motion.div
      initial={shouldAnimateIn ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
