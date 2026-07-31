"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChargingBucket, FilterBar, SubTypeOption } from "@/components/vehicles/FilterBar";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { Container } from "@/components/ui/Container";
import { oems } from "@/lib/data";
import { buildListingSearchParams, type ListingFilterState } from "@/lib/listing-params";
import { LaunchStatus, Vehicle, VehicleCategory } from "@/types/vehicle";

const ALL_AVAILABILITY: LaunchStatus[] = ["available", "just-launched", "upcoming"];

interface VehicleListingProps {
  category: VehicleCategory;
  vehicles: Vehicle[];
  priceBounds: [number, number];
  rangeBounds: [number, number];
  batteryBounds: [number, number];
  subTypeLabel: string;
  subTypeOptions: SubTypeOption[];
  initial: {
    oems: string[];
    price: [number, number];
    subType: string;
    sort: string;
    minRange: number;
    minBattery: number;
    charging: ChargingBucket;
    seats: number[];
    availability: LaunchStatus[];
  };
}

function matchesSubType(vehicle: Vehicle, category: VehicleCategory, subType: string) {
  if (subType === "all") return true;
  if (category === "car") return vehicle.bodyType === subType;
  return vehicle.twoWheelerType === subType;
}

function matchesCharging(vehicle: Vehicle, bucket: ChargingBucket) {
  if (bucket === "any") return true;
  if (vehicle.chargingTimeFastMin == null) return false;
  if (bucket === "under30") return vehicle.chargingTimeFastMin <= 30;
  return vehicle.chargingTimeFastMin <= 60;
}

export function VehicleListing({
  category,
  vehicles,
  priceBounds,
  rangeBounds,
  batteryBounds,
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
  const [minRange, setMinRange] = useState(initial.minRange);
  const [minBattery, setMinBattery] = useState(initial.minBattery);
  const [charging, setCharging] = useState<ChargingBucket>(initial.charging);
  const [selectedSeats, setSelectedSeats] = useState<number[]>(initial.seats);
  const [selectedAvailability, setSelectedAvailability] = useState<LaunchStatus[]>(initial.availability);

  const oemOptions = oems.filter((oem) => oem.categories.includes(category));
  const seatOptions = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.seatingCapacity).filter((s): s is number => s != null))).sort(
        (a, b) => a - b,
      ),
    [vehicles],
  );

  function updateUrl(next: Partial<ListingFilterState>) {
    const state: ListingFilterState = {
      oems: next.oems ?? selectedOems,
      price: next.price ?? priceRange,
      subType: next.subType ?? subType,
      sort: next.sort ?? sort,
      minRange: next.minRange ?? minRange,
      minBattery: next.minBattery ?? minBattery,
      charging: next.charging ?? charging,
      seats: next.seats ?? selectedSeats,
      availability: next.availability ?? selectedAvailability,
    };
    const params = buildListingSearchParams(state, priceBounds, rangeBounds, batteryBounds);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      const oemMatch = selectedOems.length === 0 || selectedOems.includes(v.oem);
      const priceMatch =
        v.priceRangeLakh[0] <= priceRange[1] && v.priceRangeLakh[1] >= priceRange[0];
      const subTypeMatch = matchesSubType(v, category, subType);
      const rangeMatch = v.rangeKm >= minRange;
      const batteryMatch = v.batteryCapacityKwh >= minBattery;
      const chargingMatch = matchesCharging(v, charging);
      const seatsMatch = selectedSeats.length === 0 || (v.seatingCapacity != null && selectedSeats.includes(v.seatingCapacity));
      const availabilityMatch = selectedAvailability.length === 0 || selectedAvailability.includes(v.launchStatus);
      return (
        oemMatch && priceMatch && subTypeMatch && rangeMatch && batteryMatch && chargingMatch && seatsMatch && availabilityMatch
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-desc") return b.priceRangeLakh[0] - a.priceRangeLakh[0];
      if (sort === "range-desc") return b.rangeKm - a.rangeKm;
      return a.priceRangeLakh[0] - b.priceRangeLakh[0];
    });

    return list;
  }, [vehicles, selectedOems, priceRange, subType, sort, category, minRange, minBattery, charging, selectedSeats, selectedAvailability]);

  const activeFilterCount =
    selectedOems.length +
    (priceRange[0] !== priceBounds[0] || priceRange[1] !== priceBounds[1] ? 1 : 0) +
    (subType !== "all" ? 1 : 0) +
    (minRange !== rangeBounds[0] ? 1 : 0) +
    (minBattery !== batteryBounds[0] ? 1 : 0) +
    (charging !== "any" ? 1 : 0) +
    selectedSeats.length +
    selectedAvailability.length;

  function clearAll() {
    setSelectedOems([]);
    setPriceRange(priceBounds);
    setSubType("all");
    setMinRange(rangeBounds[0]);
    setMinBattery(batteryBounds[0]);
    setCharging("any");
    setSelectedSeats([]);
    setSelectedAvailability([]);
    router.replace(pathname, { scroll: false });
  }

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
    minRange,
    rangeBounds,
    onMinRangeChange: setMinRange,
    onMinRangeCommit: (next: number) => {
      setMinRange(next);
      updateUrl({ minRange: next });
    },
    minBattery,
    batteryBounds,
    onMinBatteryChange: setMinBattery,
    onMinBatteryCommit: (next: number) => {
      setMinBattery(next);
      updateUrl({ minBattery: next });
    },
    charging,
    onChargingChange: (next: ChargingBucket) => {
      setCharging(next);
      updateUrl({ charging: next });
    },
    seatOptions,
    selectedSeats,
    onSeatsChange: (next: number[]) => {
      setSelectedSeats(next);
      updateUrl({ seats: next });
    },
    availabilityOptions: ALL_AVAILABILITY,
    selectedAvailability,
    onAvailabilityChange: (next: LaunchStatus[]) => {
      setSelectedAvailability(next);
      updateUrl({ availability: next });
    },
    activeFilterCount,
    onClearAll: clearAll,
  };

  return (
    <Container className="py-6 sm:py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {category === "car" ? "Electric Cars" : "Electric 2-Wheelers"}
        </h1>
        <Sheet>
          <SheetTrigger
            render={
              <button
                type="button"
                className="focus-ring flex items-center gap-1.5 rounded-md border border-border-strong px-3.5 py-2 text-[12.5px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary lg:hidden"
              />
            }
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
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

      <p className="mt-1 text-[12.5px] text-ink-secondary">
        {filtered.length} vehicle{filtered.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden rounded-xl border border-border bg-surface p-4 lg:block">
          <FilterBar {...filterBarProps} />
        </aside>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-border-strong bg-surface-secondary py-12 text-center text-[13px] text-ink-secondary">
              No vehicles match these filters. Try widening your search.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
