import { BatteryCharging, Building2, House, Plug, ShieldCheck, Zap } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, LightPool, SectionHead } from "./Shell";
import { batteryBasisFor, BATTERY_BASIS_LABEL } from "@/lib/vehicle-battery";
import { batteryWarrantyFor } from "./warranty";

/**
 * MOCKUP battery & charging — the page's technical centrepiece, and the one
 * section that earns a full dark treatment.
 *
 * The charge window is drawn as a gauge rather than written as "56 min
 * (10-80%)", because the *shape* of the window is the point: an EV is
 * fast-charged in a band, not from empty to full. Home and public charging sit
 * beside it on a shared "what you actually do" framing instead of a table.
 *
 * Chemistry is not published for every vehicle. Where it is missing this
 * renders "Not officially specified" — the same rule as the production VDP.
 */

const GAUGE_RADIUS = 100;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

export function MockBattery({ vehicle }: { vehicle: VehicleDetail }) {
  const { battery, charging } = vehicle;
  const basis = batteryBasisFor(vehicle.sourceVehicle);
  const chargingCost = vehicle.ownershipTools.find((t) => t.id === "charging-cost");
  const v2v = vehicle.sourceVehicle.specs?.chargingExtra?.v2v;

  const fromPct = charging.dcFastChargeFromPct;
  const toPct = charging.dcFastChargeToPct;
  const spanPct = toPct - fromPct;

  const arcLength = (spanPct / 100) * GAUGE_CIRCUMFERENCE;
  const arcOffset = -(fromPct / 100) * GAUGE_CIRCUMFERENCE;

  // Range added across the fast-charge window, from the pack's own claimed range.
  const kmAdded = Math.round((spanPct / 100) * battery.araiRangeKm);

  const warranty = batteryWarrantyFor(vehicle);

  const packFacts = [
    {
      // Deliberately not "usable capacity": this figure is stamped `gross` for
      // this vehicle, and labelling a gross number as usable would misstate it
      // by several kWh. The basis is printed underneath instead.
      label: "Pack capacity",
      value: `${battery.capacityKwh} kWh`,
      note: basis ? BATTERY_BASIS_LABEL[basis] : "Basis not stated",
    },
    {
      label: "Cell chemistry",
      value: battery.chemistry ?? "Not officially specified",
      note: battery.chemistry ? undefined : "Tata has not published this",
      muted: !battery.chemistry,
    },
    {
      label: "Charging port",
      value: charging.connectorType ?? "Not officially specified",
      note: charging.connectorType ? "India DC fast-charging standard" : undefined,
      muted: !charging.connectorType,
    },
    {
      label: "Pack warranty",
      value: warranty ? warranty.long : "Not officially specified",
      note: warranty ? "Whichever comes first" : undefined,
      muted: !warranty,
    },
  ];

  const methods = [
    charging.dcFastChargeMinutes !== undefined && {
      icon: Zap,
      title: "DC fast charger",
      time: `${charging.dcFastChargeMinutes} min`,
      window: `${fromPct}% → ${toPct}%`,
      body: `Roughly a coffee stop on a highway run. Adds about ${kmAdded} km of claimed range in one session.`,
      accent: true,
      fill: 14,
    },
    {
      icon: House,
      title: "Home AC charger",
      time: `${charging.acHomeChargeHours} hr`,
      window: "0% → 100%",
      body: "The normal case. Plug in overnight and start every morning full — no public charger involved.",
      accent: false,
      fill: 100,
    },
    {
      icon: Building2,
      title: "Public AC point",
      time: "Varies",
      window: "Top-up",
      body: "Office and mall chargers are for topping up while parked, not for a planned full charge.",
      accent: false,
      fill: 45,
    },
  ].filter(
    (
      m,
    ): m is {
      icon: typeof Zap;
      title: string;
      time: string;
      window: string;
      body: string;
      accent: boolean;
      fill: number;
    } => Boolean(m),
  );

  return (
    <Band id="battery" tone="dark">
      <LightPool className="-top-1/4 left-1/2 h-[60%] w-[70%] -translate-x-1/2" />

      <Container className="relative">
        <SectionHead
          tone="dark"
          align="split"
          eyebrow="Battery & charging"
          title={
            <>
              A {battery.capacityKwh} kWh pack,
              <br className="hidden sm:block" /> and the window that matters
            </>
          }
          lead="Fast charging happens in a band, not from empty to full. Here is that band, what it adds, and what the alternatives actually cost you in time."
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* ---- Charge window gauge ---- */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            {charging.dcFastChargeMinutes !== undefined ? (
              <>
                <div className="relative w-full max-w-[280px]">
                  <svg viewBox="0 0 240 240" className="w-full -rotate-90" role="img" aria-label={`Fast charging from ${fromPct} to ${toPct} percent takes ${charging.dcFastChargeMinutes} minutes`}>
                    <defs>
                      <linearGradient id="mock-charge-arc" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1fa83c" />
                        <stop offset="100%" stopColor="#25d44a" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="120"
                      cy="120"
                      r={GAUGE_RADIUS}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="16"
                    />
                    <circle
                      cx="120"
                      cy="120"
                      r={GAUGE_RADIUS}
                      fill="none"
                      stroke="url(#mock-charge-arc)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray={`${arcLength} ${GAUGE_CIRCUMFERENCE - arcLength}`}
                      strokeDashoffset={arcOffset}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Kicker tone="dark" className="mb-2">
                      Fast charge
                    </Kicker>
                    <p className="flex items-baseline gap-1.5 font-extrabold leading-none tracking-[-0.04em] tabular-nums text-white">
                      <span className="text-[52px] sm:text-[62px]">{charging.dcFastChargeMinutes}</span>
                      <span className="text-[15px] font-bold tracking-normal text-white/45">min</span>
                    </p>
                    <p className="mt-2.5 rounded-full bg-primary-bright/15 px-3 py-1 text-[11px] font-bold text-primary-bright">
                      {fromPct}% → {toPct}%
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid w-full grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                  <div className="bg-surface-dark px-4 py-3.5 text-center">
                    <p className="text-[20px] font-extrabold tabular-nums text-white">~{kmAdded}</p>
                    <Kicker tone="dark" className="mt-1">
                      km added
                    </Kicker>
                  </div>
                  <div className="bg-surface-dark px-4 py-3.5 text-center">
                    <p className="text-[20px] font-extrabold tabular-nums text-white">
                      {chargingCost?.rows[1]?.value ?? "—"}
                    </p>
                    <Kicker tone="dark" className="mt-1">
                      per km at home
                    </Kicker>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-10 text-center">
                <BatteryCharging size={26} className="mx-auto mb-3 text-white/35" />
                <p className="text-[13px] font-bold text-white/80">DC fast-charging time not published</p>
                <p className="mx-auto mt-1.5 max-w-xs text-[11px] text-white/40">
                  {vehicle.brand} has not stated a figure for this model, so none is shown.
                </p>
              </div>
            )}
          </div>

          {/* ---- Methods + pack facts ---- */}
          <div className="flex min-w-0 flex-col gap-5">
            <div className="grid gap-3">
              {methods.map(({ icon: Icon, title, time, window, body, accent, fill }) => (
                <div
                  key={title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  {/* Proportional time indicator along the card's base */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-[3px] ${
                      accent ? "bg-gradient-to-r from-primary to-primary-bright" : "bg-white/15"
                    }`}
                    style={{ width: `${fill}%` }}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          accent ? "bg-primary-bright/15 text-primary-bright" : "bg-white/8 text-white/55"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-extrabold tracking-tight text-white">{title}</p>
                        <p className="text-[11px] text-white/40">{window}</p>
                      </div>
                    </div>
                    <p
                      className={`shrink-0 text-[20px] font-extrabold leading-none tabular-nums ${
                        accent ? "text-primary-bright" : "text-white/75"
                      }`}
                    >
                      {time}
                    </p>
                  </div>
                  <p className="mt-3 text-[11.5px] leading-relaxed text-white/45">{body}</p>
                </div>
              ))}
            </div>

            {/* Pack facts */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {packFacts.map((fact) => (
                <div key={fact.label} className="bg-surface-dark p-4 sm:p-5">
                  <Kicker tone="dark" className="mb-2">
                    {fact.label}
                  </Kicker>
                  <p
                    className={`text-[13px] font-bold leading-snug ${
                      fact.muted ? "text-white/40" : "text-white"
                    }`}
                  >
                    {fact.value}
                  </p>
                  {fact.note ? <p className="mt-1 text-[10px] text-white/35">{fact.note}</p> : null}
                </div>
              ))}
            </div>

            {v2v ? (
              <div className="flex items-center gap-3 rounded-2xl border border-primary-bright/20 bg-primary-bright/[0.07] px-5 py-4">
                <Plug size={16} className="shrink-0 text-primary-bright" />
                <p className="text-[12px] leading-relaxed text-white/70">
                  <span className="font-bold text-white">Vehicle-to-vehicle charging</span> — this pack can charge
                  another EV, which is a genuine differentiator in a market where the public network is still thin.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Assumption disclosure */}
        <p className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-white/35">
          <ShieldCheck size={13} className="mt-0.5 shrink-0 text-white/25" />
          {chargingCost?.summary ??
            "Charging costs depend on your local tariff; figures shown are illustrative."}
        </p>
      </Container>
    </Band>
  );
}
