import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";

function formatINR(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function SectionVariants({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <VehicleSection id="variants" title="Variants" description={`${vehicle.name} is available in ${vehicle.variants.length} variant${vehicle.variants.length === 1 ? "" : "s"}.`}>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="sr-only">{vehicle.name} variants with battery, range and price</caption>
          <thead>
            <tr className="border-b border-border bg-surface-secondary">
              <th scope="col" className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">Variant</th>
              <th scope="col" className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">Battery</th>
              <th scope="col" className="px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">Range</th>
              <th scope="col" className="px-3.5 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-ink-muted">Price</th>
            </tr>
          </thead>
          <tbody>
            {vehicle.variants.map((variant) => (
              <tr key={variant.id} className={`border-b border-border last:border-b-0 ${variant.isRecommended ? "bg-primary-tint" : ""}`}>
                <th scope="row" className="px-3.5 py-3 text-[12px] font-semibold text-ink">
                  <span className="flex items-center gap-2">
                    {variant.name}
                    {variant.isRecommended ? (
                      <span className="rounded-[3px] bg-primary px-[7px] py-0.5 text-[9px] font-bold uppercase text-white">Recommended</span>
                    ) : null}
                  </span>
                </th>
                <td className="px-3.5 py-3 text-[12px] text-ink-secondary">{variant.batteryKwh} kWh</td>
                <td className="px-3.5 py-3 text-[12px] text-ink-secondary">{variant.rangeKm} km</td>
                <td className="px-3.5 py-3 text-right text-[12px] font-bold text-primary">{formatINR(variant.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VehicleSection>
  );
}
