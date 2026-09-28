"use client";

import { useState } from "react";
import { Image as IkImage } from "@imagekit/next";
import { Info } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, SectionHead } from "./Shell";
import { IMAGEKIT_CONFIGURED } from "@/lib/imagekit";
import { illustrationFor } from "@/lib/vehicle-illustrations";
import { cn } from "@/lib/utils";

/**
 * MOCKUP colour showcase.
 *
 * Dark on purpose: paint reads better against a dark stage than against white,
 * and this is the second of the page's three dark anchor moments.
 *
 * An important honesty constraint shapes the design. The vehicle artwork is a
 * generic body-type illustration in a fixed colour — tinting it to fake each
 * paint option would be inventing a picture of a product. So the *stage* takes
 * the colour instead: the backdrop wash, the light pool and a large paint chip
 * respond to the selection while the vehicle itself stays as-drawn, and the
 * caption says exactly that.
 */
export function MockColours({ vehicle }: { vehicle: VehicleDetail }) {
  const [selected, setSelected] = useState(0);
  const colour = vehicle.colors[selected];
  const illustration = IMAGEKIT_CONFIGURED
    ? illustrationFor({ category: vehicle.category, bodyType: vehicle.sourceVehicle.bodyType })
    : undefined;

  if (vehicle.colors.length === 0) return null;

  return (
    <Band id="colours" tone="dark">
      <Container className="relative">
        <SectionHead
          tone="dark"
          align="split"
          eyebrow="Exterior"
          title={`${vehicle.colors.length} factory colours`}
          lead="Every shade offered from the factory, with the official name. Wraps and dealer-applied finishes are not included."
        />

        <div className="overflow-hidden rounded-[24px] border border-white/10">
          {/* ---- Stage ---- */}
          <div
            className="relative aspect-[16/10] transition-[background] duration-700 sm:aspect-[21/9]"
            style={{
              background: `radial-gradient(80% 90% at 50% 108%, ${colour.hex}55 0%, ${colour.hex}18 42%, rgba(11,18,16,0) 72%), linear-gradient(180deg, #0b1210 0%, #0e1a16 100%)`,
            }}
          >
            {/* Paint chip behind the vehicle */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[62%] w-[62%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[2px] transition-colors duration-700 sm:h-[78%] sm:w-[46%]"
              style={{
                background: `radial-gradient(circle at 34% 30%, ${colour.hex}, ${colour.hex}00 72%)`,
              }}
            />

            {illustration ? (
              <div className="absolute inset-x-[10%] bottom-[16%] top-[12%]">
                <IkImage
                  src={illustration.path}
                  alt={`${vehicle.brand} ${vehicle.name} — generic illustration shown against the ${colour.name} paint swatch`}
                  fill
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-[12px] text-white/40">
                Vehicle illustration unavailable
              </div>
            )}

            {/* Colour name, set large */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8">
              <Kicker tone="dark" className="mb-2">
                Colour {selected + 1} of {vehicle.colors.length}
              </Kicker>
              <p className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-white sm:text-[40px] lg:text-[48px]">
                {colour.name}
              </p>
            </div>
          </div>

          {/* ---- Swatch rail ---- */}
          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 bg-surface-dark p-5 sm:gap-4 sm:p-6">
            {vehicle.colors.map((c, i) => {
              const active = i === selected;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-pressed={active}
                  aria-label={c.name}
                  title={c.name}
                  className={cn(
                    "focus-ring group flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 transition-colors",
                    active ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-offset-2 ring-offset-surface-dark transition-all",
                      active ? "ring-2 ring-primary-bright" : "ring-1 ring-white/20",
                    )}
                  >
                    <span
                      className="h-7 w-7 rounded-full"
                      style={{ backgroundColor: c.hex, boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.35)" }}
                    />
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-[12px] font-bold transition-colors",
                      active ? "text-white" : "text-white/50 group-hover:text-white/80",
                    )}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-white/35">
          <Info size={13} className="mt-0.5 shrink-0" />
          Swatches approximate the factory paint names; screen colours vary. The vehicle shown is a generic
          body-type illustration, not a photograph of this model in this colour — it is deliberately not recoloured
          to match each swatch.
        </p>
      </Container>
    </Band>
  );
}
