"use client";

import { useState } from "react";
import { ListFilter } from "lucide-react";
import { Reveal } from "@/components/compare/showroom/ui";
import { SectionHeader } from "@/components/vehicles/cars-listing/SectionHeader";
import { btn } from "@/components/vehicles/cars-listing/ui";
import { bikeFaqs, bikeSeoText } from "@/lib/two-wheelers-listing/copy";
import { cn } from "@/lib/utils";
import { useBikesListing } from "./ListingContext";

/** FAQ generated from the live listing, a buying-guide card that opens the filters, and the SEO paragraph. */
export function BikeFaqSection() {
  const { bikes, setFiltersOpen } = useBikesListing();
  const [seoOpen, setSeoOpen] = useState(false);
  const faqs = bikeFaqs(bikes);
  const [seo1, seo2] = bikeSeoText(bikes);

  function openFilters() {
    if (window.matchMedia("(max-width: 980px)").matches) setFiltersOpen(true);
    else document.getElementById("filters")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section aria-labelledby="bike-faq-h" className="pt-[72px] max-[760px]:pt-14">
      <SectionHeader id="bike-faq-h" title="Scooters & bikes — quick answers" lede="Updated from the live listing data above." />
      <Reveal className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-7 max-[980px]:grid-cols-1">
        <div className="rounded-[18px] border border-border bg-surface px-6 py-1 max-[760px]:px-4 max-[760px]:py-0.5">
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0} className="group border-b border-[#EEF0F3] last:border-b-0">
              <summary className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold max-[760px]:text-[15px] focus-ring [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="relative size-3 flex-none transition-transform duration-[250ms] group-open:rotate-45">
                  <span className="absolute left-0 top-[5px] h-0.5 w-3 bg-ink-secondary" />
                  <span className="absolute left-[5px] top-0 h-3 w-0.5 bg-ink-secondary" />
                </span>
              </summary>
              <p className="mb-[18px] text-[14.5px] text-ink-secondary">{f.a}</p>
            </details>
          ))}
        </div>
        <aside className="relative isolate overflow-hidden rounded-[18px] bg-[linear-gradient(160deg,#0F2A1B,#0B1A12)] p-[26px] text-[#E8F2EB] min-[981px]:sticky min-[981px]:top-[90px]">
          <div aria-hidden="true" className="absolute -right-[60px] -top-[60px] -z-10 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,.35),transparent_70%)]" />
          <small className="text-[11px] font-bold tracking-[.14em] text-[#86EFAC]">EV BUYING GUIDE</small>
          <h3 className="mt-2 text-[22px] font-[750] leading-[1.15] tracking-[-.025em] text-white">Not sure which two-wheeler fits your commute?</h3>
          <p className="mt-2 text-sm text-[#B9CDBF]">Set your budget, the range you need each day and how long you can charge at home — the list narrows to the models that fit.</p>
          <button type="button" onClick={openFilters} className={cn(btn.ghost, "mt-[18px] border-0 bg-white text-[#0B3A1F] hover:bg-[#E9F7EE]")}>
            <ListFilter className="size-4" strokeWidth={2.2} aria-hidden="true" />
            Open filters
          </button>
        </aside>
      </Reveal>
      <div className="mt-7 max-w-[920px] text-sm text-ink-muted">
        <div className={cn("relative overflow-hidden", !seoOpen && "max-h-[4.6em]")}>
          <p>{seo1}</p>
          <p className="mt-2.5">{seo2}</p>
          <p className="mt-2.5">Illustrations are generic drawings of a scooter or a motorcycle in the model’s first listed colour — not photographs of the model.</p>
          {!seoOpen ? <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2em] bg-[linear-gradient(rgba(246,247,249,0),var(--surface-secondary))]" /> : null}
        </div>
        <button type="button" onClick={() => setSeoOpen(!seoOpen)} aria-expanded={seoOpen} className="mt-1.5 text-sm font-semibold text-primary-hover">
          {seoOpen ? "Read less" : "Read more"}
        </button>
      </div>
    </section>
  );
}
