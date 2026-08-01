"use client";

import { Award, BatteryCharging, Crown, Gauge, IndianRupee, Trophy, Users, Waypoints, type LucideIcon } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { estimateMonthlyChargingCost } from "@/lib/pricing";
import { computeQuickVerdict } from "@/lib/compare/quickVerdict";

const ICONS: Record<string, LucideIcon> = {
  value: IndianRupee,
  range: Waypoints,
  charging: BatteryCharging,
  runningCost: IndianRupee,
  family: Users,
  performance: Gauge,
  editorsPick: Award,
};

interface QuickVerdictCardProps {
  vehicles: VehicleDetail[];
  /** Compact: tight vertical list for the sidebar. Full: tile grid below the hero. */
  variant?: "full" | "compact";
}

/** The user's instant takeaway, computed live from real per-metric winners — never an editorial assertion. Shown both below the hero (full) and in the sidebar (compact). */
export function QuickVerdictCard({ vehicles, variant = "full" }: QuickVerdictCardProps) {
  const annualRunningCost = vehicles.map((v) => estimateMonthlyChargingCost(v.sourceVehicle, 8) * 12);
  const items = computeQuickVerdict(vehicles, annualRunningCost);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-4 text-center text-[12px] text-ink-muted shadow-card">
        Too close to call — quick verdict needs at least two vehicles with comparable data.
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-card">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
          <Trophy size={13} className="text-primary" />
          Quick Verdict
        </p>
        <ul className="mt-2.5 space-y-2 border-t border-border pt-2.5">
          {items.map((item) => {
            const Icon = ICONS[item.key] ?? Trophy;
            return (
              <li key={item.key} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <Icon size={12} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9.5px] font-semibold uppercase tracking-wide text-ink-muted">{item.label}</span>
                  <span className="block truncate text-[11.5px] font-bold text-ink">{item.vehicleName}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-secondary p-4 shadow-card sm:p-5">
      <p className="flex items-center gap-2 text-[13px] font-extrabold text-ink sm:text-[15px]">
        <Trophy size={17} className="text-primary" />
        Quick Verdict
      </p>
      <p className="mt-0.5 text-[11.5px] text-ink-secondary">Your instant takeaway, before the detailed comparison below.</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.key] ?? Trophy;
          const isEditorsPick = item.key === "editorsPick";
          return (
            <div
              key={item.key}
              className={`rounded-xl border p-3 transition-shadow hover:shadow-card-hover ${
                isEditorsPick ? "border-primary/40 bg-primary-tint" : "border-border bg-surface"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isEditorsPick ? "bg-primary text-white" : "bg-primary-tint text-primary"
                }`}
              >
                {isEditorsPick ? <Crown size={15} /> : <Icon size={15} />}
              </span>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{item.label}</p>
              <p className="mt-0.5 truncate text-[12.5px] font-extrabold text-ink" title={item.vehicleName}>
                {item.vehicleName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
