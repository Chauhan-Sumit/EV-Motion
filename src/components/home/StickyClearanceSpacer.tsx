"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders a spacer sized to exactly clear the early sticky sidebar
 * (Highlights + EV Tools in HeroSearchSection, id="hero-sticky-sidebar")
 * before this aside's own content (Popular Comparisons, etc.) begins.
 *
 * That sidebar is intentionally taken out of the grid flow in
 * HeroSearchSection (see its comment) so it doesn't leave dead space below
 * Trending Now — but that means its real height, and therefore how far it
 * overflows into this aside, depends on actual content (highlight values,
 * tool labels) and viewport width. A hardcoded padding guess (lg:pt-40) sat
 * here before this and broke — both when the sidebar's content pushed it
 * taller than expected and at viewport widths the guess wasn't measured at.
 * Measuring the real gap at runtime instead of guessing a fixed number.
 */
export function StickyClearanceSpacer() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function measure() {
      const spacer = spacerRef.current;
      const sidebar = document.getElementById("hero-sticky-sidebar");
      if (!spacer) return;

      // Below lg the hero sidebar is in normal flow (not absolutely
      // positioned), so there's nothing to clear.
      if (!sidebar || window.innerWidth < 1024) {
        setHeight(0);
        return;
      }

      const gap = sidebar.getBoundingClientRect().bottom - spacer.getBoundingClientRect().top;
      setHeight(Math.max(0, Math.ceil(gap)));
    }

    measure();
    // Re-measure after the first paint in case fonts/layout shift slightly,
    // and on resize since the gap is viewport-width-dependent.
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return <div ref={spacerRef} aria-hidden style={{ height }} />;
}
