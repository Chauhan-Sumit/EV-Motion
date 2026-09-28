"use client";

import { useState } from "react";
import { Image as IkImage } from "@imagekit/next";
import {
  Armchair,
  BatteryCharging,
  Car,
  ChevronLeft,
  ChevronRight,
  Gauge,
  GitCompareArrows,
  Heart,
  ImageOff,
  MapPin,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Zap,
} from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Container, GlassPanel, Kicker, LightPool, Metric, Pill } from "./Shell";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";
import { IMAGEKIT_CONFIGURED } from "@/lib/imagekit";
import { illustrationFor } from "@/lib/vehicle-illustrations";
import { cn, formatPriceRangeLakh } from "@/lib/utils";
import { demoRatingSummary } from "./demo-content";
import { batteryWarrantyFor } from "./warranty";

/**
 * MOCKUP hero — a dark cinematic stage rather than the production hero's two
 * white cards sitting side by side.
 *
 * The dark treatment is not a new palette: it is the same `--surface-dark`
 * band + green light pool + `--primary-bright` accents the approved homepage
 * hero already uses, applied to a vehicle stage. Light/white remains the
 * page's base tone from the next band onwards.
 */

const MEDIA_TABS = [
  { id: "exterior", label: "Exterior", icon: Car, count: 12 },
  { id: "interior", label: "Interior", icon: Armchair, count: 8 },
  { id: "360", label: "360", icon: RotateCcw, count: 1 },
] as const;

type MediaTabId = (typeof MEDIA_TABS)[number]["id"];

const SHOTS = [0, 1, 2, 3, 4];

export function MockHero({ vehicle }: { vehicle: VehicleDetail }) {
  const pricing = useVehiclePricing(vehicle);
  const [tab, setTab] = useState<MediaTabId>("exterior");
  const [shot, setShot] = useState(0);

  const q = vehicle.quickSpecs;
  const warranty = batteryWarrantyFor(vehicle);
  const illustration = IMAGEKIT_CONFIGURED
    ? illustrationFor({ category: vehicle.category, bodyType: vehicle.sourceVehicle.bodyType })
    : undefined;

  // Only the primary slot carries artwork; the rest stay honest empty slots,
  // exactly as production's gallery treats them — no vehicle in the catalog
  // has real photography yet.
  const hasArtwork = tab === "exterior" && shot === 0 && Boolean(illustration);
  const activeTabLabel = MEDIA_TABS.find((t) => t.id === tab)?.label ?? "Exterior";

  const heroSpecs = [
    { icon: Gauge, label: "ARAI Range", value: q.rangeKm, unit: "km" },
    { icon: BatteryCharging, label: "Battery", value: q.batteryKwh, unit: "kWh" },
    q.powerKw !== undefined && { icon: Zap, label: "Power", value: q.powerKw, unit: "kW" },
    q.fastChargeMinutes !== undefined && {
      icon: Timer,
      label: `DC ${q.fastChargeFromPct}-${q.fastChargeToPct}%`,
      value: q.fastChargeMinutes,
      unit: "min",
    },
    warranty !== undefined && {
      icon: ShieldCheck,
      label: "Battery warranty",
      value: warranty.years,
      unit: warranty.short,
    },
  ].filter((s): s is { icon: typeof Gauge; label: string; value: number; unit: string } => Boolean(s));

  return (
    <section className="relative overflow-hidden bg-surface-dark" aria-labelledby="mock-vehicle-name">
      {/* Ambient environment: horizon glow + perspective floor grid. Decorative. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(37,212,74,0.10) 0%, rgba(11,18,16,0) 55%), linear-gradient(180deg, #0b1210 0%, #0d1714 55%, #0b1210 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
        }}
      />

      <Container className="relative z-10 py-7 sm:py-10 lg:py-12">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-10">
          {/* ---------------- Media stage ---------------- */}
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              {MEDIA_TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTab(t.id);
                      setShot(0);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "focus-ring flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors",
                      active
                        ? "bg-primary-bright text-surface-dark"
                        : "border border-white/12 text-white/60 hover:border-white/25 hover:text-white",
                    )}
                  >
                    <t.icon size={13} />
                    {t.label}
                    <span className={cn("text-[10px] font-semibold", active ? "text-surface-dark/60" : "text-white/35")}>
                      {t.count}
                    </span>
                  </button>
                );
              })}
              <span className="ml-auto hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.8px] text-white/35 sm:flex">
                <Sparkles size={12} className="text-primary-bright" />
                Illustration, not a photograph
              </span>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-white/10 bg-[#0e1a16] sm:aspect-[16/9]">
              <LightPool className="bottom-[6%] left-1/2 h-[46%] w-[86%] -translate-x-1/2" />

              {hasArtwork && illustration ? (
                <>
                  <div className="absolute inset-x-[6%] bottom-[26%] top-[10%]">
                    <IkImage
                      src={illustration.path}
                      alt={`${vehicle.brand} ${vehicle.name} — generic electric SUV illustration, not a photograph of this vehicle`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                  {/* Floor reflection — the same transparent cutout, mirrored and faded. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[6%] bottom-[4%] h-[22%] opacity-25"
                    style={{
                      maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 78%)",
                      WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 78%)",
                    }}
                  >
                    <div className="relative h-full w-full scale-y-[-1]">
                      <IkImage
                        src={illustration.path}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-contain object-top blur-[1px]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/45">
                    {tab === "360" ? <RotateCcw size={18} /> : <ImageOff size={18} />}
                  </span>
                  <p className="text-[13px] font-bold text-white/80">
                    {tab === "360" ? "360 spin coming soon" : `${activeTabLabel} photography coming soon`}
                  </p>
                  <p className="max-w-xs text-[11px] text-white/40">
                    Slots stay empty until licensed photography is sourced.
                  </p>
                </div>
              )}

              <div className="absolute left-4 top-4 flex items-center gap-1.5">
                <Pill tone="dark" accent>
                  <span
                    className="hero-dot h-[5px] w-[5px] animate-pulse-dot rounded-full bg-primary-bright"
                    aria-hidden="true"
                  />
                  Best seller
                </Pill>
              </div>

              <div className="absolute right-4 top-4 flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Save to shortlist"
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/25 text-white/70 backdrop-blur-sm transition-colors hover:text-primary-bright"
                >
                  <Heart size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Share this vehicle"
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/25 text-white/70 backdrop-blur-sm transition-colors hover:text-primary-bright"
                >
                  <Share2 size={15} />
                </button>
              </div>

              <button
                type="button"
                aria-label="Previous shot"
                onClick={() => setShot((s) => (s - 1 + SHOTS.length) % SHOTS.length)}
                className="focus-ring absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:border-primary-bright/50 hover:text-primary-bright"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                aria-label="Next shot"
                onClick={() => setShot((s) => (s + 1) % SHOTS.length)}
                className="focus-ring absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:border-primary-bright/50 hover:text-primary-bright"
              >
                <ChevronRight size={17} />
              </button>

              <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white/70 backdrop-blur-sm">
                {shot + 1} / {SHOTS.length}
              </div>
            </div>

            {/* Thumbnail rail */}
            <div className="scroll-row mt-3 flex gap-2 overflow-x-auto">
              {SHOTS.map((i) => {
                const active = shot === i;
                const primary = tab === "exterior" && i === 0 && Boolean(illustration);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`View shot ${i + 1}${primary ? "" : " (photo coming soon)"}`}
                    aria-current={active}
                    className={cn(
                      "relative h-14 w-[92px] shrink-0 overflow-hidden rounded-xl border transition-colors sm:h-16 sm:w-[112px]",
                      active ? "border-primary-bright" : "border-white/10 hover:border-white/25",
                    )}
                  >
                    {primary && illustration ? (
                      <>
                        <span className="absolute inset-0 bg-[#0e1a16]" />
                        <IkImage src={illustration.path} alt="" fill sizes="112px" className="object-contain p-1.5" />
                      </>
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                        <ImageOff size={14} className="text-white/25" />
                      </span>
                    )}
                  </button>
                );
              })}
              <div className="flex h-14 w-[92px] shrink-0 items-center justify-center rounded-xl border border-dashed border-white/12 text-[11px] font-bold text-white/40 sm:h-16 sm:w-[112px]">
                +16
              </div>
            </div>
          </div>

          {/* ---------------- Info panel ---------------- */}
          <div className="min-w-0">
            <GlassPanel className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Kicker tone="dark" className="mb-1.5">
                    {vehicle.brand}
                  </Kicker>
                  <h1
                    id="mock-vehicle-name"
                    className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[38px]"
                  >
                    {vehicle.name}
                  </h1>
                </div>
                <Pill tone="dark" accent className="mt-1 shrink-0">
                  Available
                </Pill>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[12px]">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Star size={13} className="fill-primary-bright text-primary-bright" />
                  {demoRatingSummary.average}
                </span>
                <span className="text-white/45">{demoRatingSummary.count} reviews</span>
                <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                <span className="text-white/60">{vehicle.bodySpecs.bodyType}</span>
                <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                <span className="text-white/60">{vehicle.variants.length} variants</span>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <Kicker tone="dark" className="mb-1.5">
                  Ex-showroom {pricing.cityName}
                </Kicker>
                <p className="text-[30px] font-extrabold leading-none tracking-[-0.03em] text-primary-bright sm:text-[36px]">
                  {formatPriceRangeLakh(pricing.exShowroomRangeLakh[0], pricing.exShowroomRangeLakh[1], " – ")}
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-white/45">
                  <MapPin size={12} className="shrink-0" />
                  Varies by city · On-road from
                  <span className="font-bold text-white/70">
                    ₹{(pricing.breakdown.low.onRoad / 100000).toFixed(2)}L
                  </span>
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-bright text-[13px] font-bold text-surface-dark transition-colors hover:bg-primary"
                >
                  Get On-Road Price
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 text-[13px] font-bold text-white transition-colors hover:border-primary-bright/60 hover:text-primary-bright"
                >
                  <GitCompareArrows size={15} />
                  Add to Compare
                </button>
              </div>

              <p className="mt-3.5 flex items-center gap-1.5 text-[10px] text-white/40">
                <ShieldCheck size={12} className="shrink-0 text-primary-bright/70" />
                EMI from ₹{Math.round(pricing.emiFromPerMonth).toLocaleString("en-IN")}/mo · no dealer spam
              </p>
            </GlassPanel>
          </div>
        </div>

        {/* ---------------- Key specs strip ---------------- */}
        <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:mt-9 lg:grid-cols-5">
          {heroSpecs.map(({ icon: Icon, label, value, unit }) => (
            <div key={label} className="flex flex-col gap-2 bg-surface-dark px-4 py-4 sm:px-5 sm:py-5">
              <span className="flex items-center gap-1.5 text-primary-bright">
                <Icon size={14} className="shrink-0" />
                <Kicker tone="dark" className="truncate">
                  {label}
                </Kicker>
              </span>
              <Metric value={value} unit={unit} size="md" tone="dark" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
