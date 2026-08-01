"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";

export const COMPARE_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "price", label: "Price" },
  { id: "battery", label: "Battery" },
  { id: "charging", label: "Charging" },
  { id: "performance", label: "Performance" },
  { id: "ownership", label: "Ownership" },
  { id: "running-cost", label: "Running Cost" },
  { id: "dimensions", label: "Dimensions" },
  { id: "safety", label: "Safety" },
  { id: "features", label: "Features" },
  { id: "warranty", label: "Warranty" },
  { id: "colours", label: "Colours" },
  { id: "pros-cons", label: "Pros & Cons" },
  { id: "expert-verdict", label: "Expert Verdict" },
  { id: "reviews", label: "Reviews" },
  { id: "news", label: "News" },
  { id: "faqs", label: "FAQs" },
] as const;

/** Sticky secondary nav below the main Navbar — scroll-spy pattern generalized from the VDP's StickyTabs, with a spring-animated underline that slides between the active section instead of a hard cut. */
export function CompareStickyNav() {
  const [active, setActive] = useState<string>(COMPARE_SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const elements = COMPARE_SECTIONS.map((s) => document.getElementById(s.id)).filter(
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
    <div className="sticky top-16 z-40 border-b border-border bg-surface/95 shadow-card backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <Container>
        <nav aria-label="Comparison sections" className="scroll-row -mx-1 flex gap-1 overflow-x-auto px-1">
          {COMPARE_SECTIONS.map((section) => {
            const isActive = active === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`focus-ring relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-ink-secondary hover:text-ink"
                }`}
              >
                {section.label}
                {isActive ? (
                  <motion.span
                    layoutId="compare-nav-underline"
                    className="absolute inset-x-2.5 -bottom-px h-[2.5px] rounded-full bg-primary"
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
                  />
                ) : null}
              </a>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
