"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";
import { VehicleImage } from "@/components/vehicles/VehicleImage";

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export function SectionColors({ vehicle }: { vehicle: VehicleDetail }) {
  const [activeId, setActiveId] = useState(vehicle.colors[0]?.id);
  const active = vehicle.colors.find((c) => c.id === activeId) ?? vehicle.colors[0];

  return (
    <VehicleSection id="colors" title="Available Colours" description={`${vehicle.name} is available in ${vehicle.colors.length} colours.`}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,200px)_1fr] lg:items-center">
        <div role="radiogroup" aria-label="Choose a colour" className="grid grid-cols-4 gap-2.5 lg:grid-cols-2">
          {vehicle.colors.map((color) => {
            const isActive = active?.id === color.id;
            return (
              <button
                key={color.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={color.name}
                onClick={() => setActiveId(color.id)}
                className="focus-ring flex flex-col items-center gap-1.5 lg:flex-row lg:justify-start"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-transform ${
                    isActive ? "scale-110 border-primary" : "border-border"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isActive ? <Check size={14} color={isLight(color.hex) ? "#1C1C1C" : "#FFFFFF"} /> : null}
                </span>
                <span className="text-[10px] text-ink-muted">{color.name}</span>
              </button>
            );
          })}
        </div>

        <div>
          <div className="relative h-48 overflow-hidden rounded-xl border border-border bg-white sm:h-64">
            <VehicleImage
              vehicle={vehicle.sourceVehicle}
              color={vehicle.oemColor}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="h-full w-full"
            />
          </div>
          <p className="mt-2 text-[10px] text-ink-muted">Photo shown is representative and may not reflect every available colour.</p>
        </div>
      </div>
    </VehicleSection>
  );
}
