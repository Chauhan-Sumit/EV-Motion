"use client";

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
import { Oem } from "@/types/vehicle";

export interface SubTypeOption {
  value: string;
  label: string;
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
}: FilterBarProps) {
  function toggleOem(key: string, checked: boolean) {
    if (checked) onOemsChange([...selectedOems, key]);
    else onOemsChange(selectedOems.filter((o) => o !== key));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="text-sm font-semibold">{subTypeLabel}</Label>
        <Select value={subType} onValueChange={(v) => onSubTypeChange(v ?? "all")}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue />
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
        <Label className="text-sm font-semibold">Sort By</Label>
        <Select value={sort} onValueChange={(v) => onSortChange(v ?? "price-asc")}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="range-desc">Range: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold">
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
        <Label className="text-sm font-semibold">Brand</Label>
        <div className="mt-2 flex flex-col gap-2">
          {oemOptions.map((oem) => (
            <label
              key={oem.key}
              className="flex items-center gap-2 text-sm text-foreground"
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
