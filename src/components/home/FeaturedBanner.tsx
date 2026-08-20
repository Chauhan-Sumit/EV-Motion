"use client";

import Link from "next/link";
import { Star, Gauge, BatteryCharging, Timer, ShieldCheck } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { getOemBySlug } from "@/lib/data/oems";
import { vehicleHref } from "@/lib/search";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";
import { useVehiclePricing } from "@/hooks/useVehiclePricing";
import { vehiclePricingSubject } from "@/lib/vehicle-pricing";
import { formatPriceLakh } from "@/lib/utils";
import { ncapResultFor } from "@/lib/vehicle-safety";
import type { Vehicle } from "@/types/vehicle";

/**
 * `featured` arrives as a prop from `MainLayout` (a Server Component). This
 * component used to pick it itself with `cars.find(...)` at module scope,
 * which put all 54 car records in the homepage's client bundle to select
 * one. `@/lib/data/oems` is safe to import directly — it carries no vehicle
 * data — but the `@/lib/data` barrel and `ev-motion/derive` are not.
 */
export function FeaturedBanner({ featured }: { featured: Vehicle }) {
  const oem = getOemBySlug(featured.oem);
  const featuredName = `${oem?.name ?? ""} ${featured.modelName}`.trim();
  // A row of gold stars is the strongest "this car is safe, today" claim on
  // the homepage and has no room for a caveat, so a LAPSED rating is dropped
  // here rather than shown with an expiry note — the Compare page's Safety
  // row is where the historical result stays visible in full.
  const ncap = ncapResultFor(featured.specs?.safety);
  const pricing = useVehiclePricing(vehiclePricingSubject(featured));

  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-dark p-5 text-white sm:p-6">
      <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-primary-bright/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="lg:w-[52%]">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-bright/15 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide text-primary-bright">
            <Star size={11} className="fill-primary-bright" />
            Featured EV of the Week — Sponsored
          </span>
          <h2 className="text-xl font-extrabold leading-snug sm:text-2xl">{featuredName}</h2>
          <p className="mt-1.5 max-w-sm text-[13px] text-white/65">{featured.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5 text-[11.5px]">
            <Spec icon={Gauge} label="Range" value={`${featured.rangeKm} km`} />
            <Spec icon={BatteryCharging} label="Battery" value={`${featured.batteryCapacityKwh} kWh`} />
            <Spec icon={Timer} label="Fast Charging" value={featured.chargingTimeFastMin ? `${featured.chargingTimeFastMin} min` : "—"} />
            {ncap && !ncap.expired ? (
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary-bright" />
                <div>
                  <div className="text-white/50">
                    {ncap.agency}
                    {ncap.year !== undefined ? ` ${ncap.year}` : ""}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: ncap.rating }).map((_, i) => (
                      <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <Link
            href={vehicleHref(featured)}
            className="focus-ring mt-4 inline-block text-[12px] font-semibold text-primary-bright hover:underline"
          >
            View full details →
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-lg bg-white/5">
            <VehicleImage vehicle={featured} color={oem?.color ?? "#1FA83C"} sizes="400px" className="h-full w-full" />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 border-t border-white/10 pt-4 lg:w-48 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div>
            <div className="text-[11px] text-white/50">Ex-showroom Price</div>
            <div className="text-2xl font-extrabold text-white">{formatPriceLakh(pricing.exShowroomRangeLakh[0])}</div>
            <div className="text-[11px] text-white/50">Onwards · {pricing.cityName}</div>
          </div>
          <LeadCaptureDialog
            kind="best-price"
            vehicleSlug={featured.slug}
            triggerLabel="Get Best Quote"
            triggerClassName="focus-ring w-full rounded-lg bg-white px-4 py-2.5 text-[12.5px] font-semibold text-surface-dark transition-colors hover:bg-white/90"
            dialogTitle="Get the best quote"
            dialogDescription={`Share your details and a verified ${featuredName} dealer will get in touch with a quote.`}
            fields={[
              { key: "name", label: "Your name", type: "text", placeholder: "Full name", validation: "required" },
              { key: "mobile", label: "Mobile number", type: "tel", placeholder: "10-digit mobile number", validation: "mobile" },
            ]}
            submitLabel="Request Best Quote"
            successTitle="Request received"
            successDescription={`A verified dealer will contact you about the ${featuredName} shortly.`}
          />
          <Link
            href={`/compare?ids=${featured.slug}`}
            className="focus-ring w-full rounded-lg border border-white/20 px-4 py-2.5 text-center text-[12.5px] font-semibold text-white transition-colors hover:bg-white/5"
          >
            Compare Now
          </Link>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/60">
        <span>Pan India delivery</span>
        <strong className="text-primary-bright">EMI from ₹{Math.round(pricing.emiFromPerMonth).toLocaleString("en-IN")}/mo</strong>
      </div>
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} className="text-primary-bright" />
      <div>
        <div className="text-white/50">{label}</div>
        <div className="font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}
