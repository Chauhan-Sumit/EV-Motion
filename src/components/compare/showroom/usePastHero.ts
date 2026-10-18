"use client";

import { useEffect, useState } from "react";

/**
 * True once the hero's slot grid has scrolled up out of view — the cue for
 * the dock's mini cars and the floating tray. `#offers` in view hides the
 * tray again, since it would cover the form it points to.
 */
export function useScrollCues(): { pastHero: boolean; atOffers: boolean } {
  const [pastHero, setPastHero] = useState(false);
  const [atOffers, setAtOffers] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const slots = document.querySelector('[aria-label="Vehicles being compared"]');
    const offers = document.getElementById("offers");
    const ios: IntersectionObserver[] = [];
    if (slots) {
      const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
      io.observe(slots);
      ios.push(io);
    }
    if (offers) {
      const io = new IntersectionObserver(([e]) => setAtOffers(e.isIntersecting), { threshold: 0.2 });
      io.observe(offers);
      ios.push(io);
    }
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  return { pastHero, atOffers };
}
