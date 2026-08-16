import type { VehicleDetail } from "@/types/vehicle-detail";

export function SidebarRealWorldRange({ vehicle }: { vehicle: VehicleDetail }) {
  const r = vehicle.realWorldRange;
  const max = r.araiKm;
  const pct = (factor: number) => `${Math.round(factor * 100)}%`;
  // Only "Claimed Range" is a manufacturer figure. The other three are it
  // multiplied by a published rule of thumb, and are labeled as such — the
  // widget states the multiplier it used rather than presenting a modeled
  // number as if someone had driven the vehicle and measured it.
  const rows = [
    { label: "Claimed Range", value: r.araiKm, color: "bg-primary", note: "Manufacturer claim" },
    { label: "City", value: r.cityKm, color: "bg-info", note: `Est. ${pct(r.factors.city)} of claim` },
    { label: "Highway", value: r.highwayKm, color: "bg-hot", note: `Est. ${pct(r.factors.highway)} of claim` },
    { label: "Mixed", value: r.mixedKm, color: "bg-primary", note: `Est. ${pct(r.factors.mixed)} of claim` },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">Estimated Real World Range</h3>
        <p className="mt-0.5 text-[10px] text-ink-muted">
          Modeled from the claimed range — not measured. Actual range varies with load, terrain, weather and driving style.
        </p>
      </div>
      <div className="p-3.5">
        <ul className="space-y-2.5">
          {rows.map((row) => {
            const pct = Math.max(8, Math.round((row.value / max) * 100));
            return (
              <li key={row.label}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-[10px] text-ink-muted" title={row.note}>
                    {row.label}
                  </span>
                  <span className="shrink-0 text-[11px] font-bold text-ink">{row.value} km</span>
                </div>
                <p className="mb-1 text-[9px] text-ink-muted">{row.note}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <a href="#battery" className="focus-ring mt-3 inline-block text-[10px] font-semibold text-primary">
          Learn how ranges are calculated ›
        </a>
      </div>
    </div>
  );
}
