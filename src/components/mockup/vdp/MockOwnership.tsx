import { ArrowRight, Calculator, Fuel, IndianRupee, PiggyBank, Zap } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, SectionHead } from "./Shell";

/**
 * MOCKUP ownership / running cost.
 *
 * The single most persuasive number on an EV page is the gap between what it
 * costs to run and what a petrol equivalent costs, so this section leads with
 * that gap drawn to scale instead of listing three rows of rupees. The
 * calculator cards keep their assumption text — every figure here is
 * reproducible from the assumptions printed beneath it, which is exactly how
 * the production tools are written.
 */

function parseINR(value: string): number {
  return Number(value.replace(/[^\d.]/g, ""));
}

export function MockOwnership({ vehicle }: { vehicle: VehicleDetail }) {
  const running = vehicle.ownershipTools.find((t) => t.id === "running-cost");
  const charging = vehicle.ownershipTools.find((t) => t.id === "charging-cost");

  const electricity = running ? parseINR(running.rows[0].value) : 0;
  const fuel = running ? parseINR(running.rows[1].value) : 0;
  const saving = running ? parseINR(running.rows[2].value) : 0;
  const fuelScale = fuel > 0 ? (electricity / fuel) * 100 : 0;
  const fiveYear = saving * 60;

  return (
    <Band id="ownership" tone="tinted">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Cost of ownership"
          title="What it costs to actually run"
          lead={running?.summary}
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-5">
          {/* ---- The gap, drawn to scale ---- */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-8">
            <Kicker className="mb-6">Monthly running cost, side by side</Kicker>

            <div className="flex flex-col gap-6">
              {/* Petrol reference */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[12px] font-bold text-ink-secondary">
                    <Fuel size={14} className="text-ink-muted" />
                    Comparable petrol
                  </span>
                  <span className="text-[15px] font-extrabold tabular-nums text-ink">
                    ₹{fuel.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-12 w-full rounded-xl bg-surface-secondary ring-1 ring-inset ring-border" />
              </div>

              {/* Electric */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-[12px] font-bold text-primary">
                    <Zap size={14} />
                    This EV, charged at home
                  </span>
                  <span className="text-[15px] font-extrabold tabular-nums text-primary">
                    ₹{electricity.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="relative h-12 w-full rounded-xl bg-surface-secondary">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-primary to-primary-bright"
                    style={{ width: `${Math.max(fuelScale, 6)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* The saving */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-border pt-7">
              <div>
                <Kicker className="mb-2">You keep, every month</Kicker>
                <p className="flex items-baseline font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ink">
                  <IndianRupee size={26} className="mr-0.5 translate-y-[2px] text-primary" strokeWidth={2.5} />
                  <span className="text-[46px] text-primary sm:text-[58px]">
                    {saving.toLocaleString("en-IN")}
                  </span>
                </p>
              </div>

              <div className="rounded-xl bg-primary-tint px-5 py-4">
                <Kicker className="mb-1 text-primary-hover/70">Over five years</Kicker>
                <p className="text-[20px] font-extrabold tabular-nums text-primary-hover">
                  ₹{fiveYear.toLocaleString("en-IN")}
                </p>
                <p className="mt-0.5 text-[10px] text-primary-hover/70">at the same usage</p>
              </div>
            </div>
          </div>

          {/* ---- Calculators ---- */}
          <div className="flex min-w-0 flex-col gap-4">
            {charging ? (
              <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-primary">
                    <Zap size={15} />
                  </span>
                  <p className="text-[13px] font-extrabold tracking-tight text-ink">{charging.title}</p>
                </div>
                <dl className="divide-y divide-border">
                  {charging.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3 py-2.5">
                      <dt className="text-[11.5px] text-ink-secondary">{row.label}</dt>
                      <dd className="text-[13px] font-extrabold tabular-nums text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-[10px] leading-relaxed text-ink-muted">{charging.summary}</p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <PiggyBank size={15} />
                </span>
                <p className="text-[13px] font-extrabold tracking-tight text-ink">State subsidy</p>
              </div>
              <p className="text-[11.5px] leading-relaxed text-ink-secondary">
                Road tax waivers and registration exemptions vary by state, and are applied to the on-road price
                for your selected city. Confirm the amount against your state EV policy before you buy.
              </p>
              <button
                type="button"
                className="focus-ring mt-4 flex items-center gap-1.5 text-[11px] font-bold text-primary"
              >
                Check my state
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-surface-dark p-5 sm:p-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-bright/15 text-primary-bright">
                <Calculator size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-white">Build a full EMI plan</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                  Down payment, tenure and rate — see the monthly figure before you talk to anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Band>
  );
}
