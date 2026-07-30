"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <Button
            variant="outline"
            className="w-full justify-between sm:w-72"
          />
        }
      >
        {placeholder}
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
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
