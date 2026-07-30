"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";

export const VDP_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "variants", label: "Variants" },
  { id: "battery", label: "Battery & Charging" },
  { id: "ownership-tools", label: "Ownership Tools" },
  { id: "compare-similar", label: "Compare" },
  { id: "colors", label: "Colours" },
  { id: "features", label: "Features" },
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "reviews", label: "Reviews" },
  { id: "faqs", label: "FAQs" },
] as const;

/** Sticky secondary nav below the main Navbar (h-16), scroll-spies section visibility. */
export function StickyTabs() {
  const [active, setActive] = useState<string>(VDP_SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = VDP_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top = visible[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-130px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-surface shadow-card">
      <Container>
        <nav aria-label="Vehicle sections" className="scroll-row -mx-1 flex gap-1 overflow-x-auto px-1 py-2">
          {VDP_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              className={`focus-ring shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                active === section.id ? "bg-primary-tint text-primary" : "text-ink-secondary hover:bg-surface-secondary hover:text-ink"
              }`}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}
