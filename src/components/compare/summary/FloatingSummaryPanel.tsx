"use client";

import { useState } from "react";
import { Download, MapPin, Share2, Trophy } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { useLocation } from "@/context/LocationContext";
import { chargesForState } from "@/lib/data/state-charges";
import { estimateMonthlyChargingCost } from "@/lib/pricing";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { WINNER_METRICS } from "@/lib/compare/metrics";
import { formatPriceLakh } from "@/lib/utils";
import { LocationSelector } from "@/components/layout/LocationSelector";
import { COMPARE_SECTIONS } from "../CompareStickyNav";
import { buildComparePdfInput } from "@/lib/pdf/buildComparePdfInput";
import { generateComparePdf } from "@/lib/pdf/generateComparePdf";

function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Desktop-only sticky sidebar summarizing the comparison — winner, categories won, price/running-cost spread, quick actions. */
export function FloatingSummaryPanel({ vehicles }: { vehicles: VehicleDetail[] }) {
  const { city } = useLocation();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  const { categoriesWon } = computeWinners(vehicles, WINNER_METRICS);
  const maxWon = Math.max(...categoriesWon);
  const leaderIndices = categoriesWon.map((n, i) => (n === maxWon ? i : -1)).filter((i) => i !== -1);
  const leader = maxWon > 0 && leaderIndices.length === 1 ? vehicles[leaderIndices[0]] : null;

  const prices = vehicles.map((v) => v.startingPrice);
  const priceDiff = Math.max(...prices) - Math.min(...prices);

  const runningCosts = vehicles.map((v) => estimateMonthlyChargingCost(v.sourceVehicle) * 12);
  const runningCostDiff = Math.max(...runningCosts) - Math.min(...runningCosts);

  function handleDownloadPdf() {
    const charges = chargesForState(city.state);
    const input = buildComparePdfInput(vehicles, charges, `${city.name}, ${city.state}`);
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

  return (
    <div className="hidden lg:block">
      <div className="sticky top-32 rounded-xl border border-border bg-surface p-3.5 shadow-card">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">Comparison Summary</p>

        <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-primary-tint p-2.5">
          <Trophy size={15} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-[10px] text-ink-muted">Current Winner</p>
            <p className="text-[12px] font-bold text-primary">{leader ? leader.name : "Too close to call"}</p>
            {maxWon > 0 ? <p className="text-[10.5px] text-ink-secondary">Wins {maxWon} of {WINNER_METRICS.length} categories</p> : null}
          </div>
        </div>

        <dl className="mt-3 space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <dt className="text-[11px] text-ink-muted">Price Difference</dt>
            <dd className="text-[11.5px] font-bold text-ink">{formatPriceLakh(priceDiff / 100000)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[11px] text-ink-muted">Running Cost Diff / yr</dt>
            <dd className="text-[11.5px] font-bold text-ink">{formatINR(runningCostDiff)}</dd>
          </div>
        </dl>

        <div className="mt-3.5 border-t border-border pt-3">
          <label htmlFor="jump-to-section" className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Jump to Section
          </label>
          <select
            id="jump-to-section"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) document.getElementById(e.target.value)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="focus-ring w-full rounded-md border border-border-strong bg-white px-2.5 py-1.5 text-[11.5px] text-ink"
          >
            <option value="" disabled>
              Choose a section…
            </option>
            {COMPARE_SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setCityPickerOpen(true)}
            className="focus-ring flex items-center justify-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-[11.5px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <MapPin size={13} />
            Change City ({city.name})
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="focus-ring flex items-center justify-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-[11.5px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <Share2 size={13} />
            {shareStatus === "copied" ? "Link copied!" : "Share"}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="focus-ring flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[11.5px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Download size={13} />
            Download PDF
          </button>
        </div>
      </div>

      <LocationSelector open={cityPickerOpen} onOpenChange={setCityPickerOpen} />
    </div>
  );
}
