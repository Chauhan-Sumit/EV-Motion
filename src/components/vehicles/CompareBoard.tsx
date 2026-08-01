"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehiclePicker } from "@/components/vehicles/VehiclePicker";
import { CompareTable } from "@/components/vehicles/CompareTable";
import { Container } from "@/components/ui/Container";
import { getAllVehicles, getVehicleBySlug } from "@/lib/data";
import { CATEGORIES } from "@/lib/data/categories";
import { VehicleCategory } from "@/types/vehicle";

const MAX_COMPARE = 4;

export function CompareBoard({ initialSlugs }: { initialSlugs: string[] }) {
  const router = useRouter();
  const pathname = usePathname();

  const initialVehicles = initialSlugs
    .map((slug) => getVehicleBySlug(slug))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const lockedCategory: VehicleCategory | null = initialVehicles[0]?.category ?? null;

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    lockedCategory
      ? Array.from(new Set(initialVehicles.filter((v) => v.category === lockedCategory).map((v) => v.slug))).slice(
          0,
          MAX_COMPARE,
        )
      : []
  );
  const [category, setCategory] = useState<VehicleCategory>(lockedCategory ?? "car");

  const allVehicles = useMemo(() => getAllVehicles(), []);
  const selectedVehicles = selectedSlugs
    .map((slug) => allVehicles.find((v) => v.slug === slug))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  function syncUrl(slugs: string[]) {
    const qs = slugs.length ? `?ids=${slugs.join(",")}` : "";
    router.replace(`${pathname}${qs}`, { scroll: false });
  }

  function handleAdd(slug: string) {
    if (selectedSlugs.includes(slug)) return;
    const next = [...selectedSlugs, slug].slice(0, MAX_COMPARE);
    setSelectedSlugs(next);
    syncUrl(next);
  }

  function handleRemove(slug: string) {
    const next = selectedSlugs.filter((s) => s !== slug);
    setSelectedSlugs(next);
    syncUrl(next);
  }

  function handleCategoryChange(next: VehicleCategory) {
    setCategory(next);
    if (selectedSlugs.length === 0) return;
    setSelectedSlugs([]);
    syncUrl([]);
  }

  const eligibleVehicles = allVehicles.filter(
    (v) => v.category === category && !selectedSlugs.includes(v.slug)
  );

  return (
    <Container className="py-6 sm:py-8">
      <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Compare Vehicles</h1>
      <p className="mt-1 text-[12.5px] text-ink-secondary">
        Compare up to {MAX_COMPARE} vehicles of the same category side by side. Mixing
        categories isn&apos;t supported.
      </p>

      <div className="mt-4">
        <Tabs
          value={category}
          onValueChange={(value) => handleCategoryChange(value as VehicleCategory)}
        >
          <TabsList>
            {CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.key} value={cat.key}>
                {cat.shortLabel}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4">
        {selectedSlugs.length < MAX_COMPARE ? (
          <VehiclePicker vehicles={eligibleVehicles} onSelect={handleAdd} />
        ) : (
          <p className="text-[12.5px] text-ink-secondary">
            Maximum of {MAX_COMPARE} vehicles reached. Remove one to add another.
          </p>
        )}
      </div>

      <div className="mt-8">
        {selectedVehicles.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-strong bg-surface-secondary p-10 text-center text-[13px] text-ink-secondary">
            No vehicles selected yet. Use the picker above to start comparing.
          </p>
        ) : (
          <CompareTable vehicles={selectedVehicles} onRemove={handleRemove} />
        )}
      </div>
    </Container>
  );
}
