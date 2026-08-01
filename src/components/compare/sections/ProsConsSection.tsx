import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { computeProsAndCons } from "@/lib/compare/prosAndCons";

export function ProsConsSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const results = computeProsAndCons(vehicles);

  return (
    <VehicleSection id="pros-cons" title="Pros & Cons" description="Pros are each model's own highlights; cons are computed, factual losses against the other compared vehicles.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v, i) => {
          const { pros, cons } = results[i];
          return (
            <div key={v.slug} className="rounded-xl border border-border bg-surface p-3.5">
              <p className="text-[12.5px] font-bold text-ink">{v.name}</p>

              <div className="mt-3">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  <ThumbsUp size={12} /> Pros
                </p>
                {pros.length > 0 ? (
                  <ul className="mt-1.5 space-y-1.5">
                    {pros.map((p) => (
                      <li key={p} className="rounded-md bg-primary-tint px-2.5 py-1.5 text-[11.5px] text-ink">
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-[11px] text-ink-muted">Not officially specified</p>
                )}
              </div>

              <div className="mt-3">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-error">
                  <ThumbsDown size={12} /> Cons
                </p>
                {cons.length > 0 ? (
                  <ul className="mt-1.5 space-y-1.5">
                    {cons.map((c) => (
                      <li key={c} className="rounded-md bg-error/10 px-2.5 py-1.5 text-[11.5px] text-ink">
                        {c}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-[11px] text-ink-muted">No significant losses on the compared categories.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </VehicleSection>
  );
}
