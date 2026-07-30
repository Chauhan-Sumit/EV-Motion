import type { VehicleDetail } from "@/types/vehicle-detail";

export function SidebarRealWorldRange({ vehicle }: { vehicle: VehicleDetail }) {
  const r = vehicle.realWorldRange;
  const max = r.araiKm;
  const rows = [
    { label: "Claimed Range", value: r.araiKm, color: "bg-primary" },
    { label: "City", value: r.cityKm, color: "bg-info" },
    { label: "Highway", value: r.highwayKm, color: "bg-hot" },
    { label: "Mixed", value: r.mixedKm, color: "bg-primary" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">Real World Range</h3>
        <p className="mt-0.5 text-[10px] text-ink-muted">This could vary from actual figures.</p>
      </div>
      <div className="p-3.5">
        <ul className="space-y-2.5">
          {rows.map((row) => {
            const pct = Math.max(8, Math.round((row.value / max) * 100));
            return (
              <li key={row.label}>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-[10px] text-ink-muted">{row.label}</span>
                  <span className="text-[11px] font-bold text-ink">{row.value} km</span>
                </div>
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
