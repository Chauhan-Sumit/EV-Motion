"use client";

import { Download, Plus, Share2 } from "lucide-react";
import { MAX_COMPARE } from "@/lib/compare/slug";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { btn, Dot } from "./ui";
import { useScrollCues } from "./usePastHero";

const ICON_BTN = "grid size-10 place-items-center rounded-full text-white transition-colors hover:bg-[#23262D] focus-ring";

/** Floating action bar: who's compared, add, share, PDF, offers. */
export function CompareTray() {
  const { vehicles, city, cityLabel, openPicker, toast } = useShowroom();
  const { pastHero, atOffers } = useScrollCues();
  const on = pastHero && !atOffers;

  async function share() {
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(location.href);
      toast("Link copied — it opens this exact comparison.");
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") toast("Copy the address bar link to share.");
    }
  }

  /** The existing branded PDF export, loaded on demand so jsPDF stays out of the page bundle. */
  async function pdf() {
    const [{ buildComparePdfInput }, { generateComparePdf }] = await Promise.all([
      import("@/lib/pdf/buildComparePdfInput"),
      import("@/lib/pdf/generateComparePdf"),
    ]);
    generateComparePdf(
      buildComparePdfInput(
        vehicles.map((v) => v.detail),
        city,
        cityLabel,
      ),
    );
  }

  return (
    <div
      role="region"
      aria-label="Comparison actions"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[45] flex items-center justify-between gap-3.5 rounded-t-[18px] bg-[rgba(11,12,14,.92)] px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pl-4 pt-2.5 text-white shadow-[0_20px_50px_rgba(0,0,0,.3)] backdrop-blur-[18px] transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)] print:hidden",
        "md:inset-x-auto md:bottom-[22px] md:left-1/2 md:max-w-[calc(100%-24px)] md:justify-start md:rounded-full md:p-2 md:pl-5",
        on ? "translate-y-0 md:-translate-x-1/2" : "pointer-events-none translate-y-[110%] md:-translate-x-1/2 md:translate-y-[140%]",
      )}
    >
      <div className="hidden items-center gap-3.5 whitespace-nowrap text-[13.5px] md:flex">
        {vehicles.map((v) => (
          <span key={v.detail.slug} className="inline-flex items-center gap-[7px]">
            <Dot color={v.color} />
            {v.detail.name}
          </span>
        ))}
      </div>
      <div className="flex flex-col text-xs leading-[1.3] text-slate-400 md:hidden">
        <span>Best offers in {city.name}</span>
        <b className="whitespace-nowrap text-sm text-white">{vehicles.length} compared</b>
      </div>
      <span className="hidden h-[26px] w-px bg-[#343841] md:block" />
      <div className="flex items-center gap-1">
        {vehicles.length < MAX_COMPARE ? (
          <button type="button" onClick={() => openPicker()} aria-label="Add a vehicle" className={cn(ICON_BTN, "hidden md:grid")}>
            <Plus className="size-[18px]" aria-hidden="true" />
          </button>
        ) : null}
        <button type="button" onClick={share} aria-label="Share comparison" className={ICON_BTN}>
          <Share2 className="size-[18px]" aria-hidden="true" />
        </button>
        <button type="button" onClick={pdf} aria-label="Download as PDF" className={cn(ICON_BTN, "hidden md:grid")}>
          <Download className="size-[18px]" aria-hidden="true" />
        </button>
        <a href="#offers" className={cn(btn.base, btn.brand, "h-11 px-3.5 text-sm md:px-[22px] md:text-[15px]")}>
          <span className="hidden md:inline">Get best offers</span>
          <span className="md:hidden">Get offers</span>
        </a>
      </div>
    </div>
  );
}
