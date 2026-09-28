import { Image as IkImage } from "@imagekit/next";
import { Armchair, Camera, Car, ImageOff, Lock, RotateCcw } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, SectionHead } from "./Shell";
import { IMAGEKIT_CONFIGURED } from "@/lib/imagekit";
import { illustrationFor } from "@/lib/vehicle-illustrations";
import { cn } from "@/lib/utils";

/**
 * MOCKUP gallery.
 *
 * No vehicle in this catalog has licensed photography, and inventing some for
 * a design mockup would be exactly the wrong thing to prototype — the real
 * page will have this same constraint on launch day. So the empty state *is*
 * the design: an asymmetric mosaic of composed placeholder slots, each naming
 * what will fill it, with one live tile showing the generic illustration.
 *
 * It should read as "photography pending", never as "broken images".
 */

interface Slot {
  id: string;
  label: string;
  icon: typeof Car;
  /** Tailwind span classes for the mosaic. */
  span: string;
  live?: boolean;
}

const SLOTS: Slot[] = [
  { id: "front-three-quarter", label: "Front three-quarter", icon: Car, span: "sm:col-span-4 sm:row-span-2", live: true },
  { id: "rear", label: "Rear three-quarter", icon: Car, span: "sm:col-span-2" },
  { id: "profile", label: "Side profile", icon: Car, span: "sm:col-span-2" },
  { id: "cabin", label: "Cabin, front", icon: Armchair, span: "sm:col-span-2" },
  { id: "dash", label: "Dashboard detail", icon: Armchair, span: "sm:col-span-2" },
  { id: "spin", label: "360° exterior spin", icon: RotateCcw, span: "sm:col-span-2" },
  { id: "boot", label: "Boot space", icon: Car, span: "sm:col-span-2" },
];

export function MockGallery({ vehicle }: { vehicle: VehicleDetail }) {
  const illustration = IMAGEKIT_CONFIGURED
    ? illustrationFor({ category: vehicle.category, bodyType: vehicle.sourceVehicle.bodyType })
    : undefined;

  return (
    <Band id="gallery" tone="tinted">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Gallery"
          title="Photography, pending"
          lead="We publish licensed photography only. Until a shoot is licensed for this model, the slots stay empty and labelled rather than being filled with stock or scraped images."
        />

        <div className="grid auto-rows-[128px] grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-6">
          {SLOTS.map((slot) => {
            const live = slot.live && Boolean(illustration);
            return (
              <div
                key={slot.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl transition-colors",
                  slot.span,
                  live
                    ? "border border-border bg-surface"
                    : "border border-dashed border-border-strong bg-surface/60",
                )}
              >
                {live && illustration ? (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(70% 60% at 50% 96%, rgba(31,168,60,0.16) 0%, rgba(31,168,60,0) 68%)",
                      }}
                    />
                    <IkImage
                      src={illustration.path}
                      alt={`${vehicle.brand} ${vehicle.name} — generic electric SUV illustration, not a photograph of this vehicle`}
                      fill
                      sizes="(min-width: 640px) 60vw, 100vw"
                      className="object-contain p-5"
                    />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-bold text-ink-secondary shadow-card backdrop-blur-sm">
                      <Camera size={11} className="text-primary" />
                      Generic illustration
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center">
                    <slot.icon size={17} className="text-ink-muted/60" />
                    <p className="text-[11px] font-bold leading-tight text-ink-secondary">{slot.label}</p>
                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.6px] text-ink-muted">
                      <ImageOff size={9} />
                      Coming soon
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
            <Lock size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-bold text-ink">Why there are no photos here</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink-secondary">
              Manufacturer press images carry usage restrictions and scraped images carry copyright risk. Slots
              fill as photography is licensed, model by model.
            </p>
          </div>
          <Kicker className="shrink-0">0 of {SLOTS.length} licensed</Kicker>
        </div>
      </Container>
    </Band>
  );
}
