"use client";

import { useEffect, useRef, useState } from "react";
import { formatPriceLakh, cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { btn, WRAP } from "./ui";
import { useScrollCues } from "./usePastHero";
import { artOf, ShowroomCar } from "./ShowroomCar";

export const SECTION_TABS = [
  ["lens", "Key differences"],
  ["glance", "At a glance"],
  ["verdict", "Verdict"],
  ["ev", "EV ownership"],
  ["cost", "Price & cost"],
  ["size", "Size"],
  ["specs", "Specifications"],
  ["pros", "Pros & cons"],
  ["faq", "FAQs"],
] as const;

/** Sticky section tabs, with the compared cars sliding in once the hero is passed. */
export function StickyDock() {
  const { vehicles } = useShowroom();
  const { pastHero } = useScrollCues();
  const [active, setActive] = useState<string>(SECTION_TABS[0][0]);
  const tabsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const [id] of SECTION_TABS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const nav = tabsRef.current;
    const tab = nav?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (nav && tab) nav.scrollTo({ left: tab.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  return (
    <div className="sticky top-16 z-40 border-b border-border bg-white/[.97] backdrop-blur-[18px] backdrop-saturate-[1.7] print:hidden">
      <div className={WRAP}>
        <div
          aria-hidden="true"
          className={cn(
            "grid items-center gap-2.5 overflow-hidden transition-[max-height,opacity,padding] duration-[350ms] ease-[cubic-bezier(.2,.7,.2,1)] md:gap-[18px]",
            pastHero ? "max-h-20 py-2.5 opacity-100" : "max-h-0 opacity-0",
          )}
          style={{ gridTemplateColumns: `repeat(${vehicles.length}, minmax(0,1fr)) auto` }}
        >
          {vehicles.map((v) => (
            <div key={v.detail.slug} className="flex min-w-0 items-center gap-3">
              <span className="hidden w-[62px] flex-none md:block">
                <ShowroomCar vehicle={artOf(v.detail.sourceVehicle)} paint={v.color.paint} alt="" detail={false} />
              </span>
              <div className="min-w-0">
                <b className="block truncate text-xs leading-tight md:text-[14.5px]">{v.detail.name}</b>
                <span className="block truncate text-[11px] tabular-nums text-ink-muted md:text-[12.5px]">{formatPriceLakh(v.onRoad / 100000)} on-road</span>
              </div>
            </div>
          ))}
          <a href="#offers" tabIndex={-1} className={cn(btn.sm, btn.green, "hidden md:inline-flex")}>
            Get best offers
          </a>
        </div>
        <div className={cn("flex h-[54px] items-center gap-[18px] border-t", pastHero ? "border-border/60" : "border-transparent")}>
          <nav ref={tabsRef} aria-label="Comparison sections" className="flex h-full flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SECTION_TABS.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={cn(
                  "flex h-full items-center whitespace-nowrap px-3 text-sm font-medium text-ink-muted shadow-[inset_0_-2px_0_transparent] transition-[color,box-shadow] hover:text-ink",
                  active === id && "font-semibold text-ink shadow-[inset_0_-2px_0_var(--primary)]",
                )}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
