"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Vehicle } from "@/types/vehicle";

interface VehiclePickerProps {
  vehicles: Vehicle[];
  onSelect: (slug: string) => void;
  placeholder?: string;
}

export function VehiclePicker({
  vehicles,
  onSelect,
  placeholder = "Add a vehicle to compare",
}: VehiclePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="focus-ring flex w-full items-center justify-between rounded-md border border-border-strong bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-ink-secondary transition-colors hover:border-primary hover:text-primary sm:w-72"
          />
        }
      >
        {placeholder}
        <ChevronsUpDown size={15} className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search vehicles..." />
          <CommandList>
            <CommandEmpty>No vehicle found.</CommandEmpty>
            <CommandGroup>
              {vehicles.map((vehicle) => (
                <CommandItem
                  key={vehicle.slug}
                  value={`${vehicle.oemName} ${vehicle.modelName}`}
                  onSelect={() => {
                    onSelect(vehicle.slug);
                    setOpen(false);
                  }}
                >
                  {vehicle.oemName} {vehicle.modelName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
