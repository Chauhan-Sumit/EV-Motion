"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, RotateCw, Car, Armchair, Palette, Video } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleImage } from "@/components/vehicles/VehicleImage";

interface GallerySlot {
  id: string;
  label: string;
  hasImage: boolean;
}

const QUICK_JUMPS = [
  { id: "360", label: "360° View", icon: RotateCw },
  { id: "exterior", label: "Exterior", icon: Car },
  { id: "interior", label: "Interior", icon: Armchair },
  { id: "colors", label: "Colours", icon: Palette, href: "#colors" },
  { id: "videos", label: "Videos", icon: Video, href: "#videos" },
] as const;

/**
 * Slot 0 always renders via VehicleImage — a real photo when the vehicle has
 * one, or our branded placeholder otherwise, since either reads as finished.
 * The remaining slots are honest "photo coming soon" placeholders, matching
 * how few of our 36 vehicles have more than one confirmed real angle.
 */
function buildSlots(): GallerySlot[] {
  return [
    { id: "ext-1", label: "Exterior", hasImage: true },
    { id: "ext-2", label: "Exterior", hasImage: false },
    { id: "int-1", label: "Interior", hasImage: false },
    { id: "int-2", label: "Interior", hasImage: false },
    { id: "360", label: "360° View", hasImage: false },
    { id: "color-1", label: "Colours", hasImage: false },
  ];
}

export function VehicleGallery({ vehicle }: { vehicle: VehicleDetail }) {
  const [slots] = useState<GallerySlot[]>(buildSlots);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = slots[activeIndex];

  function go(direction: 1 | -1) {
    setActiveIndex((i) => (i + direction + slots.length) % slots.length);
  }

  function jumpToLabel(label: string) {
    const index = slots.findIndex((s) => s.label === label);
    if (index >= 0) setActiveIndex(index);
  }

  const VISIBLE_THUMBS = 4;
  const visibleSlots = slots.slice(0, VISIBLE_THUMBS);
  const overflowCount = slots.length - VISIBLE_THUMBS;

  return (
    <div className="min-w-0">
      {/* Main image with arrows */}
      <div className="relative h-56 overflow-hidden rounded-xl border border-border bg-white sm:h-72 lg:h-[280px]">
        {active.hasImage ? (
          <VehicleImage
            vehicle={vehicle.sourceVehicle}
            color={vehicle.oemColor}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-surface-secondary text-center">
            <ImageOff size={22} className="text-ink-muted" />
            <p className="text-[12px] font-semibold text-ink">{active.label} photo coming soon</p>
          </div>
        )}

        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => go(-1)}
          className="focus-ring absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-ink-secondary shadow-card hover:text-primary"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => go(1)}
          className="focus-ring absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-ink-secondary shadow-card hover:text-primary"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="mt-2.5 grid grid-cols-5 gap-1.5">
        {visibleSlots.map((slot, index) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`View ${slot.label}${slot.hasImage ? "" : " (photo coming soon)"}`}
            aria-current={activeIndex === index}
            className={`relative h-12 overflow-hidden rounded-md border sm:h-14 ${
              activeIndex === index ? "border-primary" : "border-border"
            }`}
          >
            {slot.hasImage ? (
              <VehicleImage vehicle={vehicle.sourceVehicle} color={vehicle.oemColor} sizes="80px" className="h-full w-full" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-secondary">
                <ImageOff size={13} className="text-ink-muted" />
              </div>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveIndex(VISIBLE_THUMBS)}
          aria-label={`${overflowCount} more photo slots`}
          className="relative flex h-12 items-center justify-center rounded-md border border-border bg-surface-secondary text-[11px] font-bold text-ink-secondary sm:h-14"
        >
          +{overflowCount}
        </button>
      </div>

      {/* Quick-jump row */}
      <div className="scroll-row mt-2.5 flex gap-1.5 overflow-x-auto">
        {QUICK_JUMPS.map((jump) =>
          "href" in jump ? (
            <a
              key={jump.id}
              href={jump.href}
              className="focus-ring flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <jump.icon size={13} />
              {jump.label}
            </a>
          ) : (
            <button
              key={jump.id}
              type="button"
              onClick={() => jumpToLabel(jump.label)}
              className="focus-ring flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <jump.icon size={13} />
              {jump.label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
