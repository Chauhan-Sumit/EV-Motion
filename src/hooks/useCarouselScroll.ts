"use client";

import { useRef } from "react";

/**
 * Horizontal-scroll carousel controls. Scrolls by exactly one card's width
 * (plus gap) at a time, using whichever child carries [data-carousel-item].
 */
export function useCarouselScroll<T extends HTMLElement = HTMLDivElement>() {
  const trackRef = useRef<T>(null);

  function scrollByCards(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-item]");
    const gap = 18;
    const distance = (card?.offsetWidth ?? 260) + gap;
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  return { trackRef, scrollByCards };
}
