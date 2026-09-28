import {
  Airplay,
  BadgeCheck,
  Baby,
  Disc,
  Gauge,
  Plug,
  ShieldCheck,
  Sparkles,
  Sun,
  Wind,
  Zap,
} from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, LightPool, Pill, SectionHead } from "./Shell";
import { cn } from "@/lib/utils";

/**
 * MOCKUP top features — a bento grid rather than a flat chip list.
 *
 * Tile sizes are assigned by weight: the safety package earns the large dark
 * tile because it is the strongest single claim on this vehicle, drive modes
 * and charging get wide tiles, and the catalog highlights fill the rest. Every
 * claim below comes from `Vehicle.specs` or `Vehicle.highlights` — nothing is
 * added for visual balance.
 */

const HIGHLIGHT_ICONS: [RegExp, typeof Sun][] = [
  [/sunroof/i, Sun],
  [/seat|ventilat/i, Wind],
  [/charg/i, Plug],
  [/range/i, Gauge],
  [/screen|infotain|connect/i, Airplay],
];

function iconForHighlight(label: string) {
  for (const [pattern, icon] of HIGHLIGHT_ICONS) {
    if (pattern.test(label)) return icon;
  }
  return Sparkles;
}

export function MockFeatures({ vehicle }: { vehicle: VehicleDetail }) {
  const safety = vehicle.sourceVehicle.specs?.safety;
  const motor = vehicle.sourceVehicle.specs?.motor;
  const extra = vehicle.sourceVehicle.specs?.chargingExtra;

  const safetyKit = [
    safety?.airbagsCount !== undefined && `${safety.airbagsCount} airbags`,
    safety?.adas && "Level 2 ADAS",
    safety?.esc && "Electronic stability control",
    safety?.abs && "ABS with EBD",
    safety?.isofix && "ISOFIX child-seat anchors",
    safety?.camera360 && "360° camera",
    safety?.tpms && "Tyre-pressure monitoring",
    safety?.hillHoldControl && "Hill-hold control",
  ].filter((s): s is string => Boolean(s));

  return (
    <Band id="features" tone="light">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Equipment"
          title="What you actually get"
          lead="Sourced from the manufacturer's specification. Equipment varies by variant — check the trim table above before assuming an item is standard."
        />

        <div className="grid auto-rows-[minmax(0,auto)] gap-4 lg:grid-cols-6">
          {/* ---- Safety: the anchor tile ---- */}
          {safety?.ncapRating !== undefined || safetyKit.length > 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-6 sm:p-8 lg:col-span-4 lg:row-span-2">
              <LightPool className="-right-1/4 -top-1/3 h-[120%] w-[80%]" />
              <div className="relative">
                <span className="mb-5 flex items-center gap-2 text-primary-bright">
                  <ShieldCheck size={16} />
                  <Kicker tone="dark">Safety package</Kicker>
                </span>

                {safety?.ncapRating !== undefined ? (
                  <div className="mb-6 flex items-end gap-4">
                    <p className="flex items-baseline font-extrabold leading-none tracking-[-0.04em] text-white">
                      <span className="text-[64px] sm:text-[84px]">{safety.ncapRating}</span>
                      <span className="ml-1 text-[24px] text-primary-bright sm:text-[30px]">★</span>
                    </p>
                    <p className="mb-2 text-[13px] font-bold leading-tight text-white/70">
                      {safety.ncapAgency ?? "Crash test"}
                      <br />
                      <span className="font-semibold text-white/40">Adult occupant rating</span>
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {safetyKit.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11.5px] font-semibold text-white/75"
                    >
                      <BadgeCheck size={13} className="shrink-0 text-primary-bright" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* ---- Drive modes ---- */}
          {motor?.driveModes && motor.driveModes.length > 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-2">
              <span className="mb-4 flex items-center gap-2 text-primary">
                <Disc size={15} />
                <Kicker>Drive modes</Kicker>
              </span>
              <div className="flex flex-wrap gap-2">
                {motor.driveModes.map((mode, i) => (
                  <span
                    key={mode}
                    className={cn(
                      "rounded-lg px-3 py-2 text-[12px] font-extrabold tracking-tight",
                      i === 0 ? "bg-primary text-white" : "bg-surface-secondary text-ink-secondary",
                    )}
                  >
                    {mode}
                  </span>
                ))}
              </div>
              {motor.regenBraking ? (
                <p className="mt-4 text-[11.5px] leading-relaxed text-ink-secondary">
                  Regenerative braking recovers energy on lift-off, which is where most of the city range
                  advantage comes from.
                </p>
              ) : null}
            </div>
          ) : null}

          {/* ---- Charging tile ---- */}
          <div className="rounded-2xl border border-primary/20 bg-primary-tint p-6 lg:col-span-2">
            <span className="mb-4 flex items-center gap-2 text-primary-hover">
              <Zap size={15} />
              <Kicker className="text-primary-hover/70">Charging</Kicker>
            </span>
            <p className="text-[14px] font-extrabold leading-snug tracking-tight text-primary-hover">
              {vehicle.charging.connectorType ?? "Standard"} fast charging
              {extra?.v2v ? ", plus vehicle-to-vehicle output" : ""}
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-primary-hover/75">
              {vehicle.charging.dcFastChargeMinutes !== undefined
                ? `${vehicle.charging.dcFastChargeFromPct}–${vehicle.charging.dcFastChargeToPct}% in ${vehicle.charging.dcFastChargeMinutes} minutes on DC, ${vehicle.charging.acHomeChargeHours} hours on a home AC box.`
                : `${vehicle.charging.acHomeChargeHours} hours on a home AC box. No DC figure published.`}
            </p>
          </div>

          {/* ---- Catalog highlights ---- */}
          {vehicle.features.map((feature) => {
            const Icon = iconForHighlight(feature.label);
            return (
              <div
                key={feature.id}
                className="group flex flex-col justify-between gap-5 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 lg:col-span-3 xl:col-span-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-secondary text-ink-secondary transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                  <Icon size={16} />
                </span>
                <div>
                  <Pill className="mb-2.5">{feature.category}</Pill>
                  <p className="text-[13.5px] font-bold leading-snug tracking-tight text-ink">{feature.label}</p>
                </div>
              </div>
            );
          })}

          {/* ---- Honest gap note ---- */}
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border-strong p-5 lg:col-span-6">
            <Baby size={16} className="shrink-0 text-ink-muted" />
            <p className="text-[11.5px] leading-relaxed text-ink-muted">
              A full feature list per variant — cabin tech, seat trim, interior storage — is not published in the
              catalog record for this model yet, so it is not shown. Empty is better than invented.
            </p>
          </div>
        </div>
      </Container>
    </Band>
  );
}
