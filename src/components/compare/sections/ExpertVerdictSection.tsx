import { FileText } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { computeExpertVerdicts } from "@/lib/compare/verdict";

export function ExpertVerdictSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const verdicts = computeExpertVerdicts(vehicles);

  return (
    <VehicleSection
      id="expert-verdict"
      title="Expert Verdict"
      description="A neutral summary generated from the categories each vehicle actually leads on above — not editorial opinion."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v, i) => (
          <div key={v.slug} className="rounded-xl border border-border bg-surface p-3.5">
            <p className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink">
              <FileText size={14} className="text-primary" />
              {v.name}
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-secondary">{verdicts[i]}</p>
          </div>
        ))}
      </div>
    </VehicleSection>
  );
}
