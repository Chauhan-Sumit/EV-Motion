"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "./Shell";
import { cn } from "@/lib/utils";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { formatPriceRangeLakh } from "@/lib/utils";

/**
 * MOCKUP sticky section nav. Appears once the hero has scrolled past, and
 * carries the vehicle name + price + CTA with it — so the primary action is
 * never more than a glance away without needing a separate floating bar on
 * desktop. Below `sm` the CTA moves to `MockPriceDock`.
 */

const SECTIONS = [
  { id: "numbers", label: "Numbers" },
  { id: "story", label: "Overview" },
  { id: "variants", label: "Variants" },
  { id: "battery", label: "Battery" },
  { id: "range", label: "Range" },
  { id: "ownership", label: "Ownership" },
  { id: "compare", label: "Compare" },
  { id: "colours", label: "Colours" },
  { id: "features", label: "Features" },
  { id: "gallery", label: "Gallery" },
  { id: "reviews", label: "Reviews" },
  { id: "faqs", label: "FAQs" },
];

export function MockSubNav({ vehicle }: { vehicle: VehicleDetail }) {
  const pricing = useVehiclePricing(vehicle);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState<string>("numbers");

  useEffect(() => {
    const sentinel = document.getElementById("mock-subnav-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="mock-subnav-sentinel" aria-hidden="true" className="h-px w-full" />
      <div
        className={cn(
          "sticky top-16 z-40 border-b border-border bg-surface/95 backdrop-blur-md transition-shadow",
          stuck && "shadow-card",
        )}
      >
        <Container className="flex items-center gap-4">
          {/* Condensed vehicle identity — fades in only once the hero is gone */}
          <div
            className={cn(
              "hidden shrink-0 items-center gap-2.5 border-r border-border py-2.5 pr-4 transition-all duration-200 lg:flex",
              stuck ? "max-w-[280px] opacity-100" : "max-w-0 overflow-hidden opacity-0",
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[12px] font-extrabold leading-tight text-ink">{vehicle.name}</p>
              <p className="truncate text-[10px] font-bold text-primary">
                {formatPriceRangeLakh(pricing.exShowroomRangeLakh[0], pricing.exShowroomRangeLakh[1], " – ")}
              </p>
            </div>
          </div>

          <nav aria-label="Vehicle sections" className="scroll-row -mb-px flex min-w-0 flex-1 gap-0.5 overflow-x-auto">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "focus-ring flex shrink-0 items-center whitespace-nowrap border-b-[3px] px-3 py-3.5 text-[12px] font-bold transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-ink-secondary hover:text-primary",
                  )}
                >
                  {s.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className={cn(
              "focus-ring hidden shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-bold text-white transition-all hover:bg-primary-hover lg:flex",
              stuck ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            Get On-Road Price
            <ChevronRight size={14} />
          </button>
        </Container>
      </div>
    </>
  );
}
