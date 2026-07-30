import { Zap } from "lucide-react";
import { cars } from "@/lib/data/cars";
import { getOemBySlug } from "@/lib/data";
import { estimateEmi } from "@/lib/data/ev-motion/derive";

const featured = cars.find((v) => v.slug === "tata-nexon-ev") ?? cars[0];
const oem = getOemBySlug(featured.oem);

export function SponsoredBanner() {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/20 bg-primary-tint">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <span className="mb-2.5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <Zap size={11} className="fill-white" />
            Featured Brand — Sponsored
          </span>
          <h3 className="text-lg font-extrabold leading-snug text-ink">
            {oem?.name} {featured.modelName} — Drive the Future
          </h3>
          <p className="mt-1 max-w-lg text-[13px] text-ink-secondary">{featured.tagline}</p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {[`${featured.rangeKm} km range`, `Fast charge ${featured.chargingTimeFastMin ?? "—"} min`, `${featured.batteryCapacityKwh} kWh battery`].map(
              (spec) => (
                <span key={spec} className="inline-flex items-center gap-1.5 text-[12px] text-primary">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {spec}
                </span>
              ),
            )}
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            <button
              type="button"
              className="focus-ring rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Explore All Variants
            </button>
            <button
              type="button"
              className="focus-ring rounded-md border border-primary bg-transparent px-3.5 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              Download Brochure
            </button>
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-border bg-surface p-3.5 text-center sm:w-56">
          <p className="text-[11px] text-ink-muted">Starting from</p>
          <p className="text-2xl font-extrabold text-primary">₹{featured.priceRangeLakh[0].toFixed(2)}L</p>
          <p className="mb-2.5 text-[11px] text-ink-muted">*ex-showroom Delhi</p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              className="focus-ring rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Get Best Quote
            </button>
            <button
              type="button"
              className="focus-ring rounded-md border border-border-strong bg-transparent px-3.5 py-2 text-[12px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
            >
              Book Test Drive
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-primary/20 px-5 py-2 text-[11px] text-ink-secondary">
        <span>Pan India delivery</span>
        <strong className="text-primary">EMI from ₹{Math.round(estimateEmi(featured)).toLocaleString("en-IN")}/mo</strong>
      </div>
    </div>
  );
}
