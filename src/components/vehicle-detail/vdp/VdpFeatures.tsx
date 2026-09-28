import type { Feature, SectionCopy } from "@/lib/vehicle-detail/types";
import { Eyebrow, PrototypeSection } from "./Section";

/** Top features — a short, scannable set rather than an exhaustive checklist. */
export function VdpFeatures({ copy, features }: { copy: SectionCopy; features: Feature[] }) {
  return (
    <PrototypeSection copy={copy}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <li
            key={`${feature.category}-${feature.label}`}
            className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4 shadow-card"
          >
            <Eyebrow>{feature.category}</Eyebrow>
            <p className="text-[13px] font-semibold leading-snug text-ink">{feature.label}</p>
          </li>
        ))}
      </ul>
    </PrototypeSection>
  );
}
