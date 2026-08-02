"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { getSimilarVehicleDetails } from "@/lib/data/ev-motion/toVehicleDetail";
import { VehicleSection } from "./VehicleSection";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { useLocation } from "@/context/LocationContext";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { buildCompareSlug } from "@/lib/compare/slug";

function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function kwToBhp(kw: number): number {
  return Math.round(kw * 1.341);
}

function firstSafetyFeature(vehicle: VehicleDetail): string {
  return vehicle.features.find((f) => f.category === "Safety")?.label ?? "Not specified";
}

export function SectionCompareSimilar({ vehicle }: { vehicle: VehicleDetail }) {
  const { city } = useLocation();
  const similar = getSimilarVehicleDetails(vehicle).slice(0, 2);
  const columns = [vehicle, ...similar];

  if (similar.length === 0) return null;

  const rows: { label: string; render: (v: VehicleDetail) => ReactNode }[] = [
    {
      label: "Image",
      render: (v) => (
        <div className="relative mx-auto h-16 w-24 overflow-hidden rounded-md bg-white">
          <VehicleImage vehicle={v.sourceVehicle} color={v.oemColor} sizes="96px" className="h-full w-full" />
        </div>
      ),
    },
    {
      label: `On-Road Price, ${city.name}`,
      render: (v) => {
        const onRoad = getVehiclePricingSnapshot({
          vehicleId: v.id,
          vehicleName: v.name,
          exShowroomRangeLakh: v.priceRangeLakh,
          city,
        }).breakdown.low.onRoad;
        return <span className="font-bold text-primary">{formatINR(onRoad)}</span>;
      },
    },
    { label: "User Rating", render: () => <span className="text-ink-muted">Not yet rated</span> },
    { label: "Mileage / Range", render: (v) => `${v.quickSpecs.rangeKm} km` },
    { label: "Engine / Battery", render: (v) => `${v.quickSpecs.batteryKwh} kWh` },
    { label: "Transmission", render: () => "Automatic" },
    { label: "Safety", render: (v) => firstSafetyFeature(v) },
    { label: "Power (bhp)", render: (v) => `${kwToBhp(v.quickSpecs.powerKw)} bhp` },
  ];

  return (
    <VehicleSection
      id="compare-similar"
      title={`Compare ${vehicle.name} with Similar Cars`}
      description="Side-by-side specs to help you decide."
    >
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="sr-only">
            Comparison of {vehicle.name} against {similar.map((s) => s.name).join(" and ")}
          </caption>
          <thead>
            <tr className="border-b border-border bg-surface-secondary">
              <th scope="col" className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
                Specification
              </th>
              {columns.map((v) => (
                <th key={v.slug} scope="col" className="px-3.5 py-2.5 text-center text-[11px] font-bold text-ink">
                  {v.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-3.5 py-3 text-[11px] font-semibold text-ink-secondary">
                  {row.label}
                </th>
                {columns.map((v) => (
                  <td key={v.slug} className="px-3.5 py-3 text-center text-[12px] text-ink">
                    {row.render(v)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="px-3.5 py-3 text-[11px] font-semibold text-ink-secondary">
                Compare
              </th>
              {columns.map((v) => (
                <td key={v.slug} className="px-3.5 py-3 text-center">
                  <Link
                    href={`/compare/${buildCompareSlug(columns.map((c) => c.sourceVehicle))}`}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-primary px-3 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    <Scale size={12} />
                    Compare
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </VehicleSection>
  );
}
