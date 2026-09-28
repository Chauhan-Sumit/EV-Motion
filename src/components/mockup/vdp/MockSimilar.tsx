import { Image as IkImage } from "@imagekit/next";
import { ArrowRight, BatteryCharging, Gauge } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, SectionHead } from "./Shell";
import { IMAGEKIT_CONFIGURED } from "@/lib/imagekit";
import { illustrationFor } from "@/lib/vehicle-illustrations";

/**
 * MOCKUP "similar EVs" rail. A horizontal scroller on small screens, a grid
 * from `sm` up — the same single-row scroll pattern the approved homepage
 * listing rows use, so it reads as part of the same site.
 */
export function MockSimilar({ vehicles }: { vehicles: VehicleDetail[] }) {
  if (vehicles.length === 0) return null;

  return (
    <Band id="similar" tone="tinted">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Keep looking"
          title="Similar electric cars"
          lead="Matched on body type, price band and range — not on who is paying for placement."
        />

        <div className="scroll-row -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {vehicles.map((v) => {
            const illustration = IMAGEKIT_CONFIGURED
              ? illustrationFor({ category: v.category, bodyType: v.sourceVehicle.bodyType })
              : undefined;

            return (
              <article
                key={v.id}
                className="group flex w-[248px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:w-auto"
              >
                <div className="relative h-32 bg-surface-secondary">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(70% 60% at 50% 100%, rgba(31,168,60,0.14) 0%, rgba(31,168,60,0) 70%)",
                    }}
                  />
                  {illustration ? (
                    <IkImage
                      src={illustration.path}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22vw, 248px"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <Kicker className="mb-1.5">{v.brand}</Kicker>
                  <p className="truncate text-[14px] font-extrabold tracking-tight text-ink">{v.name}</p>
                  <p className="mt-1 text-[12.5px] font-bold tabular-nums text-primary">
                    ₹{v.priceRangeLakh[0].toFixed(2)}L – ₹{v.priceRangeLakh[1].toFixed(2)}L
                  </p>

                  <div className="mt-4 flex items-center gap-4 border-t border-border pt-3.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-secondary">
                      <Gauge size={13} className="text-ink-muted" />
                      {v.quickSpecs.rangeKm} km
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-secondary">
                      <BatteryCharging size={13} className="text-ink-muted" />
                      {v.quickSpecs.batteryKwh} kWh
                    </span>
                  </div>

                  <span className="mt-4 flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View details
                    <ArrowRight size={12} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Band>
  );
}
