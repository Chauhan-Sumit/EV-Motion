import { Info, MapPin, Route } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Band, Container, Kicker, SectionHead } from "./Shell";
import { demoJourneys } from "./demo-content";
import { cn } from "@/lib/utils";

/**
 * MOCKUP real-world range.
 *
 * Production shows four stacked progress bars in a 280px sidebar widget. Here
 * the same four figures share one 0-to-claim scale so they can be *compared*,
 * with real journey distances marked across it — the question a buyer actually
 * has is "does this reach the place I drive to", not "what is 75% of 465".
 *
 * The honesty rule from the production widget carries over verbatim: only the
 * ARAI figure is a manufacturer claim; the other three are it multiplied by a
 * stated factor, and the multiplier is printed next to each one.
 */
export function MockRange({ vehicle }: { vehicle: VehicleDetail }) {
  const r = vehicle.realWorldRange;
  const max = r.araiKm;
  const pctOf = (km: number) => (km / max) * 100;

  const tracks = [
    {
      id: "city",
      label: "City driving",
      km: r.cityKm,
      note: `${Math.round(r.factors.city * 100)}% of claim`,
      body: "Stop-start traffic, low speeds, regen doing most of the braking.",
      className: "from-primary to-primary-bright",
    },
    {
      id: "mixed",
      label: "Mixed use",
      km: r.mixedKm,
      note: `${Math.round(r.factors.mixed * 100)}% of claim`,
      body: "The realistic everyday number for most owners.",
      className: "from-[#2563eb] to-[#60a5fa]",
      emphasis: true,
    },
    {
      id: "highway",
      label: "Highway cruising",
      km: r.highwayKm,
      note: `${Math.round(r.factors.highway * 100)}% of claim`,
      body: "Sustained high speed is the hardest case for any EV.",
      className: "from-[#d95000] to-[#f59e0b]",
    },
  ];

  // Ticks every 100 km up to the claim.
  const ticks = Array.from({ length: Math.floor(max / 100) + 1 }, (_, i) => i * 100);

  return (
    <Band id="range" tone="light">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Real-world range"
          title="How far it actually goes"
          lead="One scale, four figures, and the journeys they cover. Only the ARAI number is a manufacturer claim — the rest are modelled from it, and the multiplier is shown."
        />

        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="p-5 sm:p-8">
            {/* ---- Claim reference ---- */}
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
              <div>
                <Kicker className="mb-1.5">Manufacturer claim (ARAI)</Kicker>
                <p className="flex items-baseline gap-2 text-[34px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink sm:text-[42px]">
                  {r.araiKm}
                  <span className="text-[14px] font-bold tracking-normal text-ink-muted">km</span>
                </p>
              </div>
              <p className="max-w-sm text-[11px] leading-relaxed text-ink-muted">
                The ARAI test cycle is run under controlled conditions. Treat it as the ceiling, not the
                expectation.
              </p>
            </div>

            {/* ---- Shared scale with journey markers ---- */}
            <div className="relative">
              {/* Journey markers */}
              <div className="relative mb-3 hidden h-14 sm:block">
                {demoJourneys.map((j, i) => (
                  <div
                    key={j.id}
                    className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center"
                    style={{ left: `${pctOf(j.km)}%` }}
                  >
                    <span
                      className={cn(
                        "whitespace-nowrap rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-bold text-ink-secondary shadow-card",
                        i === 1 && "translate-y-[-22px]",
                      )}
                    >
                      <MapPin size={10} className="mr-1 inline-block text-primary" />
                      {j.from} → {j.to}
                      <span className="ml-1.5 tabular-nums text-ink-muted">{j.km} km</span>
                    </span>
                    <span className="mt-1 h-3 w-px bg-border-strong" aria-hidden="true" />
                  </div>
                ))}
              </div>

              {/* Tracks */}
              <div className="relative flex flex-col gap-5">
                {/* Dashed journey guides running through every track */}
                <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
                  {demoJourneys.map((j) => (
                    <span
                      key={j.id}
                      className="absolute inset-y-0 w-px border-l border-dashed border-border-strong/70"
                      style={{ left: `${pctOf(j.km)}%` }}
                    />
                  ))}
                </div>

                {tracks.map((t) => (
                  <div key={t.id} className="relative">
                    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div className="flex items-baseline gap-2">
                        <p
                          className={cn(
                            "text-[13px] font-extrabold tracking-tight",
                            t.emphasis ? "text-ink" : "text-ink-secondary",
                          )}
                        >
                          {t.label}
                        </p>
                        {t.emphasis ? (
                          <span className="rounded-full bg-primary-tint px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-primary-hover">
                            Most likely
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[10px] text-ink-muted">Est. {t.note}</p>
                    </div>

                    <div className="relative h-11 overflow-hidden rounded-xl bg-surface-secondary">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 flex items-center justify-end rounded-xl bg-gradient-to-r pr-3.5",
                          t.className,
                        )}
                        style={{ width: `${pctOf(t.km)}%` }}
                      >
                        <span className="text-[13px] font-extrabold tabular-nums text-white drop-shadow-sm">
                          {t.km} km
                        </span>
                      </div>
                    </div>

                    <p className="mt-1.5 text-[11px] text-ink-muted">{t.body}</p>
                  </div>
                ))}
              </div>

              {/* Axis */}
              <div className="relative mt-5 h-5 border-t border-border">
                {ticks.map((tick) => (
                  <span
                    key={tick}
                    className="absolute top-0 -translate-x-1/2 pt-1.5 text-[10px] font-semibold tabular-nums text-ink-muted"
                    style={{ left: `${pctOf(tick)}%` }}
                  >
                    {tick}
                  </span>
                ))}
                <span className="absolute right-0 top-0 pt-1.5 text-[10px] font-bold tabular-nums text-ink">
                  {max} km
                </span>
              </div>
            </div>
          </div>

          {/* ---- Journey list (mobile-friendly restatement of the markers) ---- */}
          <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
            {demoJourneys.map((j) => {
              const fits = j.km <= r.highwayKm;
              return (
                <div key={j.id} className="flex items-center gap-3 bg-surface px-5 py-4">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      fits ? "bg-primary-tint text-primary" : "bg-surface-secondary text-ink-muted",
                    )}
                  >
                    <Route size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-ink">
                      {j.from} → {j.to}
                    </p>
                    <p className="text-[11px] text-ink-secondary">
                      {j.km} km ·{" "}
                      <span className={fits ? "font-semibold text-primary" : "text-ink-muted"}>
                        {fits ? "one charge" : "one stop"}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-ink-muted">
          <Info size={13} className="mt-0.5 shrink-0" />
          City, mixed and highway figures are the ARAI claim multiplied by {Math.round(r.factors.city * 100)}%,{" "}
          {Math.round(r.factors.mixed * 100)}% and {Math.round(r.factors.highway * 100)}% respectively. They are a
          disclosed model, not measured results — actual range varies with load, terrain, weather, climate control
          and driving style. Journey distances are approximate road distances.
        </p>
      </Container>
    </Band>
  );
}
