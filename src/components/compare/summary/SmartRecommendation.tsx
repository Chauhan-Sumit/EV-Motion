import { Sparkles } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Container } from "@/components/ui/Container";
import { computeSmartTags } from "@/lib/compare/recommendation";

/** "Which one should you buy?" — badges computed from real per-metric bests, only shown when the underlying data exists. */
export function SmartRecommendation({ vehicles }: { vehicles: VehicleDetail[] }) {
  const tags = computeSmartTags(vehicles);

  return (
    <section id="smart-recommendation" className="border-t border-border bg-surface-secondary py-8">
      <Container>
        <div className="text-center">
          <h2 className="flex items-center justify-center gap-2 text-lg font-extrabold text-ink">
            <Sparkles size={17} className="text-primary" />
            Which one should you buy?
          </h2>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v, i) => {
            const vehicleTags = tags.filter((t) => t.vehicleIndex === i);
            return (
              <div key={v.slug} className="rounded-xl border border-border bg-surface p-3.5">
                <p className="text-[12.5px] font-bold text-ink">{v.name}</p>
                {vehicleTags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {vehicleTags.map((t) => (
                      <span key={t.label} className="rounded-full bg-primary-tint px-2.5 py-1 text-[10.5px] font-bold text-primary">
                        {t.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-ink-muted">A solid all-round choice among those compared.</p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
