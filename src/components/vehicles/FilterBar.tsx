"use client";

import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LAUNCH_STATUS_LABEL } from "@/lib/vehicle-labels";
import { LaunchStatus, Oem } from "@/types/vehicle";
import {
  CHARGING_OPTIONS,
  SORT_OPTIONS,
  type ChargingBucket,
  type SubTypeOption,
} from "@/lib/vehicle-filter-options";

export type { ChargingBucket, SubTypeOption };

function labelFor(options: SubTypeOption[], value: unknown): string {
  return options.find((opt) => opt.value === value)?.label ?? String(value ?? "");
}

interface FilterBarProps {
  oemOptions: Oem[];
  selectedOems: string[];
  onOemsChange: (oems: string[]) => void;
  priceRange: [number, number];
  priceBounds: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onPriceCommit: (range: [number, number]) => void;
  subType: string;
  subTypeLabel: string;
  subTypeOptions: SubTypeOption[];
  onSubTypeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  minRange: number;
  rangeBounds: [number, number];
  onMinRangeChange: (value: number) => void;
  onMinRangeCommit: (value: number) => void;
  minBattery: number;
  batteryBounds: [number, number];
  onMinBatteryChange: (value: number) => void;
  onMinBatteryCommit: (value: number) => void;
  charging: ChargingBucket;
  onChargingChange: (value: ChargingBucket) => void;
  seatOptions: number[];
  selectedSeats: number[];
  onSeatsChange: (seats: number[]) => void;
  availabilityOptions: LaunchStatus[];
  selectedAvailability: LaunchStatus[];
  onAvailabilityChange: (statuses: LaunchStatus[]) => void;
  activeFilterCount: number;
  onClearAll: () => void;
}

export function FilterBar({
  oemOptions,
  selectedOems,
  onOemsChange,
  priceRange,
  priceBounds,
  onPriceChange,
  onPriceCommit,
  subType,
  subTypeLabel,
  subTypeOptions,
  onSubTypeChange,
  sort,
  onSortChange,
  minRange,
  rangeBounds,
  onMinRangeChange,
  onMinRangeCommit,
  minBattery,
  batteryBounds,
  onMinBatteryChange,
  onMinBatteryCommit,
  charging,
  onChargingChange,
  seatOptions,
  selectedSeats,
  onSeatsChange,
  availabilityOptions,
  selectedAvailability,
  onAvailabilityChange,
  activeFilterCount,
  onClearAll,
}: FilterBarProps) {
  function toggleOem(key: string, checked: boolean) {
    if (checked) onOemsChange([...selectedOems, key]);
    else onOemsChange(selectedOems.filter((o) => o !== key));
  }

  function toggleSeat(seat: number, checked: boolean) {
    if (checked) onSeatsChange([...selectedSeats, seat]);
    else onSeatsChange(selectedSeats.filter((s) => s !== seat));
  }

  function toggleAvailability(status: LaunchStatus, checked: boolean) {
    if (checked) onAvailabilityChange([...selectedAvailability, status]);
    else onAvailabilityChange(selectedAvailability.filter((s) => s !== status));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-ink">Filters</span>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={onClearAll}
            className="focus-ring flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary-tint"
          >
            <X size={12} />
            Clear all ({activeFilterCount})
          </button>
        ) : null}
      </div>

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">{subTypeLabel}</Label>
        <Select value={subType} onValueChange={(v) => onSubTypeChange(v ?? "all")}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue>{(value: string) => labelFor(subTypeOptions, value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {subTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">Sort By</Label>
        <Select value={sort} onValueChange={(v) => onSortChange(v ?? "price-asc")}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue>{(value: string) => labelFor(SORT_OPTIONS, value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]} Lakh
        </Label>
        <Slider
          className="mt-4"
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={priceBounds[1] > 10 ? 1 : 0.1}
          value={priceRange}
          onValueChange={(v) => onPriceChange(v as [number, number])}
          onValueCommitted={(v) => onPriceCommit(v as [number, number])}
        />
      </div>

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Minimum Range: {minRange} km{minRange === rangeBounds[1] ? "+" : ""}
        </Label>
        <Slider
          className="mt-4"
          min={rangeBounds[0]}
          max={rangeBounds[1]}
          step={10}
          value={[minRange]}
          onValueChange={(v) => onMinRangeChange((v as number[])[0])}
          onValueCommitted={(v) => onMinRangeCommit((v as number[])[0])}
        />
      </div>

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
          Minimum Battery: {minBattery} kWh{minBattery === batteryBounds[1] ? "+" : ""}
        </Label>
        <Slider
          className="mt-4"
          min={batteryBounds[0]}
          max={batteryBounds[1]}
          step={batteryBounds[1] > 10 ? 5 : 0.5}
          value={[minBattery]}
          onValueChange={(v) => onMinBatteryChange((v as number[])[0])}
          onValueCommitted={(v) => onMinBatteryCommit((v as number[])[0])}
        />
      </div>

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">Charging Speed</Label>
        <Select value={charging} onValueChange={(v) => onChargingChange((v as ChargingBucket) ?? "any")}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue>{(value: string) => labelFor(CHARGING_OPTIONS, value)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CHARGING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {seatOptions.length > 0 ? (
        <div>
          <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">Seats</Label>
          <div className="mt-2 flex flex-col gap-2">
            {seatOptions.map((seat) => (
              <label key={seat} className="flex items-center gap-2 text-[12.5px] text-ink-secondary">
                <Checkbox
                  checked={selectedSeats.includes(seat)}
                  onCheckedChange={(checked) => toggleSeat(seat, checked === true)}
                />
                {seat} Seater
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">Availability</Label>
        <div className="mt-2 flex flex-col gap-2">
          {availabilityOptions.map((status) => (
            <label key={status} className="flex items-center gap-2 text-[12.5px] text-ink-secondary">
              <Checkbox
                checked={selectedAvailability.includes(status)}
                onCheckedChange={(checked) => toggleAvailability(status, checked === true)}
              />
              {LAUNCH_STATUS_LABEL[status]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">Brand</Label>
        <div className="mt-2 flex flex-col gap-2">
          {oemOptions.map((oem) => (
            <label
              key={oem.key}
              className="flex items-center gap-2 text-[12.5px] text-ink-secondary"
            >
              <Checkbox
                checked={selectedOems.includes(oem.key)}
                onCheckedChange={(checked) => toggleOem(oem.key, checked === true)}
              />
              {oem.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
