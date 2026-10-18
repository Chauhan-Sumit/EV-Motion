"use client";

import { consFor } from "@/lib/compare/showroom/verdicts";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { DISPLAY, Dot, Reveal, SECTION, SectionHeader } from "./ui";

/** Pros are each model's curated highlights; cons are worked out against this group. */
export function ProsConsSection() {
  const { vehicles, settings } = useShowroom();
  return (
    <section id="pros" aria-labelledby="pH" className={SECTION}>
      <SectionHeader
        id="pH"
        eyebrow="Pros & cons"
        title="What you gain. What you give up."
        lede="Pros are each model’s own highlights; cons are worked out against the others in this comparison."
      />
      <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {vehicles.map((v) => (
          <div key={v.detail.slug} className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-5 md:p-7">
            <h3 className={cn(DISPLAY, "flex items-center gap-2.5 truncate text-[21px] font-bold font-stretch-[95%]")}>
              <Dot color={v.color} />
              <span className="truncate">
                {v.detail.brand} {v.detail.name}
              </span>
            </h3>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px]">
              {v.detail.sourceVehicle.highlights.slice(0, 3).map((p) => (
                <li key={p} className="flex items-start gap-3 leading-[1.45]">
                  <i aria-hidden="true" className="grid size-[22px] flex-none place-items-center rounded-full bg-primary-tint text-[13px] font-bold not-italic text-primary-hover">+</i>
                  <span className="sr-only">Pro: </span>
                  {p}
                </li>
              ))}
              <li aria-hidden="true" className="my-1 border-t border-border/60" />
              {consFor(v, vehicles, settings).map((c) => (
                <li key={c} className="flex items-start gap-3 leading-[1.45]">
                  <i aria-hidden="true" className="grid size-[22px] flex-none place-items-center rounded-full bg-error/10 text-[13px] font-bold not-italic text-[#B42318]">−</i>
                  <span className="sr-only">Con: </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
