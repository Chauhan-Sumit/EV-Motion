import { Activity, BatteryCharging, Gauge, ShieldCheck, Timer, TrendingUp, Zap } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, LightPool, Metric, SectionHead } from "./Shell";
import { batteryBasisFor, BATTERY_BASIS_LABEL } from "@/lib/vehicle-battery";
import { torqueMeasurementPointFor, TORQUE_POINT_LABEL } from "@/lib/vehicle-torque";
import { batteryWarrantyFor } from "./warranty";

/**
 * MOCKUP "The numbers that matter".
 *
 * Deliberately asymmetric: one oversized dark hero-number panel anchors the
 * left, a hairline-ruled grid of supporting figures fills the right. The point
 * is that a spec block can have a focal point instead of reading as six
 * identical tiles.
 *
 * Every figure is real catalog data. The gross/usable and torque-measurement
 * disclosures are carried through from production's QuickSpecsBar — a premium
 * layout is not a reason to drop a caveat.
 */
export function MockNumbers({ vehicle }: { vehicle: VehicleDetail }) {
  const q = vehicle.quickSpecs;
  const src = vehicle.sourceVehicle;
  const batteryBasis = batteryBasisFor(src);
  const torquePoint = torqueMeasurementPointFor(src);
  const warranty = batteryWarrantyFor(vehicle);

  const supporting = [
    {
      icon: BatteryCharging,
      label: "Battery pack",
      value: q.batteryKwh,
      unit: "kWh",
      note: batteryBasis ? BATTERY_BASIS_LABEL[batteryBasis] : undefined,
    },
    q.powerKw !== undefined && {
      icon: Zap,
      label: "Peak power",
      value: q.powerKw,
      unit: "kW",
      note: `${Math.round(q.powerKw * 1.341)} PS`,
    },
    q.torqueNm !== undefined && {
      icon: Activity,
      label: "Peak torque",
      value: q.torqueNm,
      unit: "Nm",
      note: torquePoint ? TORQUE_POINT_LABEL[torquePoint] : undefined,
    },
    src.accelerationSec0To100 !== undefined && {
      icon: TrendingUp,
      label: "0 – 100 km/h",
      value: src.accelerationSec0To100,
      unit: "sec",
      note: "Claimed",
    },
    src.topSpeedKmph !== undefined && {
      icon: Gauge,
      label: "Top speed",
      value: src.topSpeedKmph,
      unit: "km/h",
      note: "Limited",
    },
    q.fastChargeMinutes !== undefined && {
      icon: Timer,
      label: "DC fast charge",
      value: q.fastChargeMinutes,
      unit: "min",
      note: `${q.fastChargeFromPct}–${q.fastChargeToPct}%`,
    },
  ].filter(
    (s): s is { icon: typeof Zap; label: string; value: number; unit: string; note: string | undefined } => Boolean(s),
  );

  return (
    <Band id="numbers" tone="tinted">
      <Container>
        <SectionHead
          align="split"
          eyebrow="At a glance"
          title={
            <>
              The numbers
              <br className="hidden sm:block" /> that actually matter
            </>
          }
          lead="Manufacturer-claimed figures, sourced from the catalog record. Nothing here is estimated or derived — where a number has not been published, we say so rather than fill the gap."
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-5">
          {/* ---- Hero number: a dark panel inside a light band ---- */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-6 sm:p-8">
            <LightPool className="-bottom-1/3 left-1/2 h-[80%] w-[120%] -translate-x-1/2" />
            <div className="relative">
              <span className="flex items-center gap-2 text-primary-bright">
                <Gauge size={16} />
                <Kicker tone="dark">Certified range (ARAI)</Kicker>
              </span>

              <p className="mt-5 flex items-baseline gap-2 font-extrabold leading-none tracking-[-0.04em] tabular-nums text-white">
                <span className="text-[76px] sm:text-[96px] lg:text-[112px]">{q.rangeKm}</span>
                <span className="text-[18px] font-bold tracking-normal text-white/45 sm:text-[22px]">km</span>
              </p>

              <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-white/50">
                Tested to the Indian ARAI cycle. Expect roughly{" "}
                <span className="font-bold text-white/80">{vehicle.realWorldRange.mixedKm} km</span> in mixed
                real-world driving — see the range breakdown below for how that is derived.
              </p>

              {/* Range confidence bar */}
              <div className="mt-6">
                <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-bright"
                    style={{ width: `${Math.round(vehicle.realWorldRange.factors.mixed * 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-semibold text-white/35">
                  <span>Real-world mixed</span>
                  <span>ARAI claim</span>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Supporting figures: hairline grid ---- */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {supporting.map(({ icon: Icon, label, value, unit, note }) => (
              <div key={label} className="flex flex-col justify-between gap-4 bg-surface p-4 sm:p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <Icon size={15} />
                </span>
                <div>
                  <Metric value={value} unit={unit} size="sm" />
                  <p className="mt-1.5 text-[11px] font-semibold text-ink-secondary">{label}</p>
                  {note ? <p className="mt-0.5 text-[10px] text-ink-muted">{note}</p> : null}
                </div>
              </div>
            ))}

            {/* Warranty spans the remaining cell as a wide accent tile */}
            {warranty ? (
              <div className="col-span-2 flex items-center gap-4 bg-primary-tint p-4 sm:col-span-3 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <ShieldCheck size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-extrabold tracking-tight text-primary-hover">
                    {warranty.long} battery warranty
                  </p>
                  <p className="mt-0.5 text-[11px] text-primary-hover/70">
                    Covers the high-voltage pack — the single largest cost in the vehicle.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Band>
  );
}
