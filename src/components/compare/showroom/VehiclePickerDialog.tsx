"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { NEUTRAL_PAINT } from "@/lib/compare/showroom/palette";
import { SHOWROOM_MAX_COMPARE } from "@/lib/compare/slug";
import { cityAdjustedExShowroomRange } from "@/lib/vehicle-pricing";
import { useLocation } from "@/context/LocationContext";
import type { PickerCandidate } from "@/lib/compare/showroom/page-data";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { cn, formatPriceRangeLakh } from "@/lib/utils";
import { showroomDisplay, showroomText } from "./fonts";
import { DISPLAY, TEXT } from "./ui";
import { ShowroomCar } from "./ShowroomCar";

/** Add or replace a vehicle — searchable list of current, same-category vehicles. */
export function VehiclePickerDialog({
  open,
  onOpenChange,
  replacing,
  count,
  candidates,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replacing: VehicleDetail | null;
  count: number;
  candidates: PickerCandidate[];
  onPick: (c: PickerCandidate) => void;
}) {
  const { city } = useLocation();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = useMemo(() => candidates.filter((c) => !q || `${c.oemName} ${c.name}`.toLowerCase().includes(q)), [candidates, q]);
  const left = SHOWROOM_MAX_COMPARE - count;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent className={cn(showroomDisplay.variable, showroomText.variable, TEXT, "flex max-h-[calc(100dvh-32px)] w-[min(560px,calc(100%-28px))] flex-col gap-3.5 rounded-3xl p-[22px] sm:max-w-[560px]")}>
        <DialogTitle className={cn(DISPLAY, "text-[19px] font-bold")}>{replacing ? `Replace ${replacing.name}` : "Add a vehicle"}</DialogTitle>
        <label className="flex h-[46px] items-center gap-2.5 rounded-full border border-border bg-surface px-4 focus-within:border-ink">
          <Search className="size-4 text-ink-muted" aria-hidden="true" />
          <span className="sr-only">Search vehicles</span>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand or model"
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent text-[15px] outline-none"
          />
        </label>
        <DialogDescription className="text-[13px] text-ink-muted">
          {replacing ? "Pick the vehicle to compare instead" : `Comparing ${count} of ${SHOWROOM_MAX_COMPARE} · ${left} slot${left === 1 ? "" : "s"} left`}
        </DialogDescription>
        <ul className="m-0 -mx-1 min-h-0 flex-1 list-none overflow-auto p-0">
          {list.length ? (
            list.map((c) => (
              <li key={c.slug}>
                <button type="button" onClick={() => onPick(c)} className="flex w-full items-center gap-3.5 rounded-[14px] p-2.5 text-left transition-colors hover:bg-surface-secondary focus-ring">
                  <span className="grid h-12 w-[88px] flex-none place-items-center rounded-[10px] bg-surface-dark px-1.5">
                    <ShowroomCar vehicle={c} paint={NEUTRAL_PAINT} alt="" detail={false} />
                  </span>
                  <span className="min-w-0">
                    <b className="block truncate text-[15px]">
                      {c.oemName} {c.name}
                    </b>
                    <span className="text-[13px] text-ink-muted">
                      {formatPriceRangeLakh(...cityAdjustedExShowroomRange(c.priceRangeLakh, city), "–")} · {c.rangeKm} km · {c.batteryKwh} kWh
                    </span>
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="p-2.5 text-[13px] text-ink-muted">No more matches — try another brand.</li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
