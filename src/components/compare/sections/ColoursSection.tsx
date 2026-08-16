"use client";

import { useState } from "react";
import { Check, Palette } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { UnavailableValue } from "@/components/common/UnavailableValue";

/** Colour swatches per vehicle — no manufacturer images, clickable selector, matches the honesty-first no-external-imagery policy already used sitewide. */
export function ColoursSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(vehicles.map((v) => [v.slug, v.colors[0]?.id ?? ""])),
  );

  return (
    <CompareSectionCard id="colours" title="Colours" description="Available colour options — swatches only, no manufacturer imagery." icon={Palette}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => {
          const activeId = selected[v.slug];
          const activeColor = v.colors.find((c) => c.id === activeId) ?? v.colors[0];
          return (
            <div key={v.slug} className="rounded-xl border border-border bg-surface-secondary/40 p-3.5">
              <p className="text-[12px] font-bold text-ink">{v.name}</p>
              {v.colors.length === 0 ? (
                <div className="mt-2">
                  <UnavailableValue />
                </div>
              ) : (
                <>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {v.colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelected((prev) => ({ ...prev, [v.slug]: c.id }))}
                        aria-label={c.name}
                        aria-pressed={c.id === activeId}
                        title={c.name}
                        className="focus-ring relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border-strong shadow-card transition-transform hover:scale-110"
                        style={{ backgroundColor: c.hex }}
                      >
                        {c.id === activeId ? (
                          <Check
                            size={13}
                            className="drop-shadow-[0_0_2px_rgba(0,0,0,0.6)]"
                            style={{ color: "#fff" }}
                          />
                        ) : null}
                      </button>
                    ))}
                  </div>
                  {activeColor ? <p className="mt-2 text-[11px] font-semibold text-ink-secondary">{activeColor.name}</p> : null}
                </>
              )}
            </div>
          );
        })}
      </div>
    </CompareSectionCard>
  );
}
