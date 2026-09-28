"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/** Height of the production Navbar this bar sticks beneath (`h-16`). */
const NAVBAR_HEIGHT = 64;
/** Extra slack so a section counts as "reached" slightly before it hits the bar. */
const SPY_OFFSET = 56;

/**
 * Sticky section nav, with the configured price and the primary CTA alongside.
 *
 * Scroll-spy is position-based rather than `IntersectionObserver`-based (the
 * approach production's `StickyTabs` takes) because this page's sections vary
 * enormously in height — Features is ~220px, Ownership Tools ~550px — and an
 * observer sorted by intersection ratio favours whichever section happens to
 * fill more of the viewport rather than the one the reader has reached.
 * Measuring section tops against a single scroll line always resolves to the
 * section the reader is actually in.
 *
 * The `atBottom` branch covers the last section, which starts below the
 * maximum scroll position (5462 against a 5357 ceiling, measured). The scroll
 * line still clears it there by ~68px, so the ordinary loop does select it
 * today — the branch is what stops that from depending on the final section's
 * height or on the sticky bar staying 53px tall.
 *
 * The active tab is scrolled into view inside its own strip, so on a phone the
 * highlight never sits off-screen.
 */
export function VdpStickyTabs({
  tabs,
  priceLabel,
}: {
  tabs: { id: string; label: string }[];
  priceLabel: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const stripRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  /** Set on the first real scroll or tab click, gating the strip auto-centre. */
  const hasMovedRef = useRef(false);

  const spy = useCallback(() => {
    frameRef.current = null;
    const barHeight = barRef.current?.offsetHeight ?? 0;
    const line = window.scrollY + NAVBAR_HEIGHT + barHeight + SPY_OFFSET;

    const marks = tabs
      .map((tab) => {
        const el = document.getElementById(tab.id);
        return el ? { id: tab.id, top: el.getBoundingClientRect().top + window.scrollY } : null;
      })
      .filter((mark): mark is { id: string; top: number } => mark !== null)
      .sort((a, b) => a.top - b.top);

    if (marks.length === 0) return;

    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    let best = marks[0].id;
    if (atBottom) {
      best = marks[marks.length - 1].id;
    } else {
      for (const mark of marks) if (mark.top <= line) best = mark.id;
    }
    setActive(best);
  }, [tabs]);

  useEffect(() => {
    const onScroll = () => {
      hasMovedRef.current = true;
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(spy);
    };
    // Scheduled rather than called straight away: a synchronous setState in an
    // effect body is a cascading render, and the initial highlight is correct
    // until the first frame lands anyway. It bypasses `onScroll` so the initial
    // spy does not count as the reader having moved.
    frameRef.current = requestAnimationFrame(spy);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [spy]);

  // Keep the highlighted tab visible inside the horizontally scrolling strip —
  // but only once the reader has actually moved. On first paint the spy lands
  // on the hero, and auto-centring that would scroll the four leading tabs out
  // of sight before anyone has touched the page.
  useEffect(() => {
    if (!hasMovedRef.current) return;
    const strip = stripRef.current;
    const current = strip?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    if (!strip || !current) return;
    const stripBox = strip.getBoundingClientRect();
    const tabBox = current.getBoundingClientRect();
    if (tabBox.left < stripBox.left || tabBox.right > stripBox.right) {
      strip.scrollTo({
        left: current.offsetLeft - stripBox.width / 2 + tabBox.width / 2,
        behavior: "smooth",
      });
    }
  }, [active]);

  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    hasMovedRef.current = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div
      ref={barRef}
      className="sticky top-16 z-40 border-b border-border bg-surface shadow-card"
    >
      <Container>
        <div className="flex items-center gap-3 py-2">
          <nav
            ref={stripRef}
            aria-label="Vehicle sections"
            className="scroll-row -mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1"
          >
            {tabs.map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                data-tab={tab.id}
                aria-current={active === tab.id ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  jumpTo(tab.id);
                }}
                className={cn(
                  "focus-ring shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors",
                  active === tab.id
                    ? "bg-primary-tint text-accent-foreground"
                    : "text-ink-secondary hover:bg-surface-secondary hover:text-ink",
                )}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <span className="text-[14px] font-bold tabular-nums text-ink">
              {priceLabel}{" "}
              <span className="text-[11px] font-medium text-ink-muted">ex-showroom</span>
            </span>
            <Button className="h-9 text-[13px]">Get Best Price</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
