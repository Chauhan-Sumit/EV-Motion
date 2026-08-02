"use client";

import { useState } from "react";
import { Download, Printer, RefreshCw, Share2 } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { useLocation } from "@/context/LocationContext";
import { AdSlot } from "@/components/common/AdSlot";
import { buildComparePdfInput } from "@/lib/pdf/buildComparePdfInput";
import { generateComparePdf } from "@/lib/pdf/generateComparePdf";
import { QuickVerdictCard } from "./QuickVerdictCard";

const ACTION_BUTTON =
  "focus-ring flex items-center justify-center gap-1.5 rounded-lg border border-border-strong px-3 py-2.5 text-[11.5px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary";

/**
 * The sidebar's full content, deliberately minimal per spec: Quick Verdict,
 * one sticky 300x250 ad, and four actions — nothing else. Reused three times
 * in ComparePageContent for three different responsive placements (desktop
 * sticky column, tablet below-content block, mobile below-hero block) rather
 * than three different components, so all three stay in sync automatically.
 */
export function CompareSidebar({ vehicles, sticky = false }: { vehicles: VehicleDetail[]; sticky?: boolean }) {
  const { city } = useLocation();
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  function handleDownloadPdf() {
    const input = buildComparePdfInput(vehicles, city, `${city.name}, ${city.state}`);
    generateComparePdf(input);
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      // clipboard unavailable — silently no-op
    }
  }

  function handlePrint() {
    if (typeof window !== "undefined") window.print();
  }

  function handleChangeVehicles() {
    document.getElementById("compare-hero")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={`flex flex-col gap-3.5 ${sticky ? "sticky top-32" : ""}`}>
      <QuickVerdictCard vehicles={vehicles} variant="compact" />

      <div className="flex justify-center">
        <AdSlot size="rectangle" />
      </div>

      <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-surface p-3.5 shadow-card">
        <button type="button" onClick={handleShare} className={ACTION_BUTTON}>
          <Share2 size={13} />
          {shareStatus === "copied" ? "Link copied!" : "Share Comparison"}
        </button>
        <button type="button" onClick={handleDownloadPdf} className={`${ACTION_BUTTON} border-primary/40 bg-primary text-white hover:border-primary hover:bg-primary-hover hover:text-white`}>
          <Download size={13} />
          Download PDF
        </button>
        <button type="button" onClick={handlePrint} className={ACTION_BUTTON}>
          <Printer size={13} />
          Print
        </button>
        <button type="button" onClick={handleChangeVehicles} className={ACTION_BUTTON}>
          <RefreshCw size={13} />
          Change Compared Vehicles
        </button>
      </div>
    </div>
  );
}
