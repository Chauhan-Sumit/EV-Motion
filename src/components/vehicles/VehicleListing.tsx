"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterBar, SubTypeOption } from "@/components/vehicles/FilterBar";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { oems } from "@/lib/data";
import { Vehicle, VehicleCategory } from "@/types/vehicle";

interface VehicleListingProps {
  category: VehicleCategory;
  vehicles: Vehicle[];
  priceBounds: [number, number];
  subTypeLabel: string;
  subTypeOptions: SubTypeOption[];
  initial: {
    oems: string[];
    price: [number, number];
    subType: string;
    sort: string;
  };
}

function matchesSubType(vehicle: Vehicle, category: VehicleCategory, subType: string) {
  if (subType === "all") return true;
  if (category === "car") return vehicle.bodyType === subType;
  return vehicle.twoWheelerType === subType;
}

export function VehicleListing({
  category,
  vehicles,
  priceBounds,
  subTypeLabel,
  subTypeOptions,
  initial,
}: VehicleListingProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedOems, setSelectedOems] = useState<string[]>(initial.oems);
  const [priceRange, setPriceRange] = useState<[number, number]>(initial.price);
  const [subType, setSubType] = useState(initial.subType);
  const [sort, setSort] = useState(initial.sort);

  const oemOptions = oems.filter((oem) => oem.categories.includes(category));

  function updateUrl(next: {
    oems?: string[];
    price?: [number, number];
    subType?: string;
    sort?: string;
  }) {
    const params = new URLSearchParams();
    const oemsVal = next.oems ?? selectedOems;
    const priceVal = next.price ?? priceRange;
    const subTypeVal = next.subType ?? subType;
    const sortVal = next.sort ?? sort;

    if (oemsVal.length) params.set("oems", oemsVal.join(","));
    if (priceVal[0] !== priceBounds[0] || priceVal[1] !== priceBounds[1]) {
      params.set("budget", `${priceVal[0]}-${priceVal[1]}`);
    }
    if (subTypeVal !== "all") params.set("type", subTypeVal);
    if (sortVal !== "price-asc") params.set("sort", sortVal);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      const oemMatch = selectedOems.length === 0 || selectedOems.includes(v.oem);
      const priceMatch =
        v.priceRangeLakh[0] <= priceRange[1] && v.priceRangeLakh[1] >= priceRange[0];
      const subTypeMatch = matchesSubType(v, category, subType);
      return oemMatch && priceMatch && subTypeMatch;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-desc") return b.priceRangeLakh[0] - a.priceRangeLakh[0];
      if (sort === "range-desc") return b.rangeKm - a.rangeKm;
      return a.priceRangeLakh[0] - b.priceRangeLakh[0];
    });

    return list;
  }, [vehicles, selectedOems, priceRange, subType, sort, category]);

  const filterBarProps = {
    oemOptions,
    selectedOems,
    onOemsChange: (next: string[]) => {
      setSelectedOems(next);
      updateUrl({ oems: next });
    },
    priceRange,
    priceBounds,
    onPriceChange: setPriceRange,
    onPriceCommit: (next: [number, number]) => {
      setPriceRange(next);
      updateUrl({ price: next });
    },
    subType,
    subTypeLabel,
    subTypeOptions,
    onSubTypeChange: (next: string) => {
      setSubType(next);
      updateUrl({ subType: next });
    },
    sort,
    onSortChange: (next: string) => {
      setSort(next);
      updateUrl({ sort: next });
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">
          {category === "car" ? "Electric Cars" : "Electric 2-Wheelers"}
        </h1>
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm" className="lg:hidden" />
            }
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4">
              <FilterBar {...filterBarProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        {filtered.length} vehicle{filtered.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterBar {...filterBarProps} />
        </aside>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              No vehicles match these filters. Try widening your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
