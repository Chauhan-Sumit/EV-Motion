import { Image as IkImage } from "@imagekit/next";
import { ArrowRight, Crown } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, Pill, SectionHead } from "./Shell";
import { IMAGEKIT_CONFIGURED } from "@/lib/imagekit";
import { illustrationFor } from "@/lib/vehicle-illustrations";
import { cn } from "@/lib/utils";

/**
 * MOCKUP comparison.
 *
 * Production renders a spec table with a column per vehicle. Here each rival
 * becomes a card and each metric a bar scaled against the best value in the
 * set, so "how much better" is visible rather than needing to be worked out
 * from two numbers. The subject vehicle's column is elevated, and the leading
 * value on each metric is marked.
 *
 * A metric no vehicle in the set has published is dropped entirely rather than
 * being drawn as a zero-length bar.
 */

interface Metric {
  id: string;
  label: string;
  unit: string;
  lowerIsBetter?: boolean;
  get: (v: VehicleDetail) => number | undefined;
  format?: (n: number) => string;
}

const METRICS: Metric[] = [
  { id: "range", label: "ARAI range", unit: "km", get: (v) => v.quickSpecs.rangeKm },
  { id: "battery", label: "Battery", unit: "kWh", get: (v) => v.quickSpecs.batteryKwh },
  { id: "power", label: "Peak power", unit: "kW", get: (v) => v.quickSpecs.powerKw },
  {
    id: "charge",
    label: "DC 10–80%",
    unit: "min",
    lowerIsBetter: true,
    get: (v) => v.quickSpecs.fastChargeMinutes,
  },
  {
    id: "price",
    label: "Starts at",
    unit: "",
    lowerIsBetter: true,
    get: (v) => v.priceRangeLakh[0],
    format: (n) => `₹${n.toFixed(2)}L`,
  },
];

export function MockCompare({
  vehicle,
  rivals,
}: {
  vehicle: VehicleDetail;
  rivals: VehicleDetail[];
}) {
  const set = [vehicle, ...rivals];

  // Only keep metrics at least two vehicles have published — a bar chart of one
  // value is not a comparison.
  const usable = METRICS.filter((m) => set.filter((v) => m.get(v) !== undefined).length >= 2);

  const bestFor = new Map<string, number>();
  usable.forEach((m) => {
    const values = set.map((v) => m.get(v)).filter((n): n is number => n !== undefined);
    bestFor.set(m.id, m.lowerIsBetter ? Math.min(...values) : Math.max(...values));
  });

  const winsFor = (v: VehicleDetail) =>
    usable.filter((m) => {
      const value = m.get(v);
      return value !== undefined && value === bestFor.get(m.id);
    }).length;

  return (
    <Band id="compare" tone="light">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Head to head"
          title="Against the obvious alternatives"
          lead="Bars are scaled against the best figure in this set. Where a manufacturer has not published a number, the row is left out rather than guessed at."
          action={
            /* Inert in the prototype, like every other CTA here — the real page
               would link to /compare. */
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-[12px] font-bold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
            >
              Build your own comparison
              <ArrowRight size={14} />
            </button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          {set.map((v, index) => {
            const isSubject = index === 0;
            const illustration = IMAGEKIT_CONFIGURED
              ? illustrationFor({ category: v.category, bodyType: v.sourceVehicle.bodyType })
              : undefined;
            const wins = winsFor(v);

            return (
              <div
                key={v.id}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-2xl border transition-shadow",
                  isSubject
                    ? "border-primary bg-surface shadow-card-hover ring-1 ring-inset ring-primary/20"
                    : "border-border bg-surface",
                )}
              >
                {/* Card head */}
                <div className={cn("relative p-5", isSubject ? "bg-primary-tint" : "bg-surface-secondary")}>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <Kicker className={isSubject ? "text-primary-hover/70" : undefined}>{v.brand}</Kicker>
                    {isSubject ? <Pill accent>This car</Pill> : null}
                  </div>

                  <div className="relative mb-3 h-20">
                    {illustration ? (
                      <IkImage
                        src={illustration.path}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 30vw, 90vw"
                        className="object-contain"
                      />
                    ) : null}
                  </div>

                  <p
                    className={cn(
                      "truncate text-[16px] font-extrabold tracking-tight",
                      isSubject ? "text-primary-hover" : "text-ink",
                    )}
                  >
                    {v.name}
                  </p>
                  <p className="mt-1 text-[12px] font-bold tabular-nums text-ink-secondary">
                    ₹{v.priceRangeLakh[0].toFixed(2)}L – ₹{v.priceRangeLakh[1].toFixed(2)}L
                  </p>

                  {wins > 0 ? (
                    <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.6px] text-primary-hover">
                      <Crown size={12} />
                      Leads on {wins} of {usable.length}
                    </p>
                  ) : (
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.6px] text-ink-muted">
                      Leads on none
                    </p>
                  )}
                </div>

                {/* Metric bars */}
                <div className="flex flex-1 flex-col gap-4 p-5">
                  {usable.map((m) => {
                    const value = m.get(v);
                    const best = bestFor.get(m.id);
                    const isBest = value !== undefined && value === best;

                    // Bar length: for higher-is-better, share of the best value.
                    // For lower-is-better, invert so the best value is fullest.
                    let width = 0;
                    if (value !== undefined && best !== undefined && value > 0) {
                      width = m.lowerIsBetter ? (best / value) * 100 : (value / best) * 100;
                    }

                    return (
                      <div key={m.id}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-2">
                          <span className="text-[11px] text-ink-muted">{m.label}</span>
                          <span
                            className={cn(
                              "text-[12.5px] font-extrabold tabular-nums",
                              value === undefined ? "text-ink-muted" : isBest ? "text-primary" : "text-ink",
                            )}
                          >
                            {value === undefined
                              ? "Not specified"
                              : m.format
                                ? m.format(value)
                                : `${value}${m.unit ? ` ${m.unit}` : ""}`}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-secondary">
                          {value !== undefined ? (
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                isBest ? "bg-gradient-to-r from-primary to-primary-bright" : "bg-border-strong",
                              )}
                              style={{ width: `${Math.max(width, 4)}%` }}
                            />
                          ) : (
                            <div className="h-full w-full bg-[repeating-linear-gradient(45deg,var(--border),var(--border)_3px,transparent_3px,transparent_6px)]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border p-4">
                  <button
                    type="button"
                    className={cn(
                      "focus-ring flex h-10 w-full items-center justify-center rounded-lg text-[12px] font-bold transition-colors",
                      isSubject
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "border border-border text-ink-secondary hover:border-primary hover:text-primary",
                    )}
                  >
                    {isSubject ? "You are here" : `Compare with ${v.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Band>
  );
}
