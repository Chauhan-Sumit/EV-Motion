"use client";

import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";
import { Reveal } from "@/components/compare/showroom/ui";
import { launchLabel, priceText, upcomingCars } from "@/lib/cars-listing/copy";
import { paintForColors, tintForColors } from "@/lib/cars-listing/paint";
import { cn } from "@/lib/utils";
import { useCarsListing } from "./ListingContext";
import { ListingCarArt } from "./ListingCarArt";
import { SectionHeader } from "./SectionHeader";
import { btn } from "./ui";

/** Cars marked `upcoming` in the catalogue, soonest first. Hidden when there are none. */
export function UpcomingCars() {
  const { cars } = useCarsListing();
  const upcoming = upcomingCars(cars);
  if (!upcoming.length) return null;

  return (
    <section aria-labelledby="upcoming-h" className="pt-[72px] max-[760px]:pt-14">
      <SectionHeader id="upcoming-h" title="Upcoming electric cars" lede="Expected launches with tentative dates and prices — get an alert the day bookings open." />
      <Reveal className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-2 max-[760px]:grid-cols-1">
        {upcoming.map((c) => (
          <article key={c.slug} className="flex flex-col overflow-hidden rounded-[18px] border border-border bg-surface transition-shadow duration-300 hover:shadow-[0_12px_32px_-8px_rgba(16,24,40,.12),0_4px_10px_-4px_rgba(16,24,40,.06)]">
            <div className="relative isolate flex aspect-[16/8.4] items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#F2F4F7_0%,#F8F9FB_58%,#ECEFF3_58.2%,#F4F6F8_100%)] px-3 pb-1.5">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10"
                style={{ background: `radial-gradient(55% 45% at 50% 58%,rgba(255,255,255,.95),transparent 70%),radial-gradient(70% 40% at 50% 62%,${tintForColors(c.colors)},transparent 70%)` }}
              />
              <span className="absolute left-2.5 top-2.5 z-[2] inline-flex h-6 items-center rounded-[7px] bg-[#F5B83D] px-[9px] text-[11.5px] font-[650] text-[#3A2604]">
                Expected {launchLabel(c.launchDate)}
              </span>
              <ListingCarArt dims={c.art} body={c.body} paint={paintForColors(c.colors)} frame={{ lengthMm: 5100, heightMm: 1900 }} reflect alt={`${c.name} illustration`} />
            </div>
            <div className="flex flex-col gap-1 px-[18px] pb-[18px] pt-3.5">
              <span className="text-xs font-semibold text-[#B7791F]">{c.oemName} · tentative</span>
              <h3 className="leading-[1.15] text-[19px] font-bold tracking-[-.025em]">{c.model}</h3>
              <p className="text-[13.5px] text-ink-muted">
                {c.tagline} · {c.rangeKm} km claimed
              </p>
              <div className="mt-2.5 flex items-center justify-between gap-2.5">
                <b className="text-[15px]">
                  {priceText(c.price, "–")} <small className="text-xs font-medium text-ink-muted">expected</small>
                </b>
                <LeadCaptureDialog
                  kind="notify-launch"
                  vehicleSlug={c.slug}
                  triggerLabel="Alert me"
                  triggerClassName={cn(btn.line, btn.sm)}
                  dialogTitle={`Get alerted when the ${c.name} launches`}
                  dialogDescription={`We’ll tell you the day ${c.name} bookings open.`}
                  fields={[
                    { key: "name", label: "Your name", type: "text", placeholder: "Full name", validation: "required" },
                    { key: "mobile", label: "Mobile number", type: "tel", placeholder: "10-digit mobile number", validation: "mobile" },
                  ]}
                  submitLabel="Alert me"
                  successTitle="You’re on the list"
                  successDescription={`We’ll let you know when ${c.name} bookings open.`}
                />
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
