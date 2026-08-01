"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLocation } from "@/context/LocationContext";
import { CITIES, POPULAR_CITIES, type City } from "@/lib/data/cities";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface LocationSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * CarWale-style city picker: search, real browser-geolocation "Detect My
 * Location" (nearest-match against the known city list — no reverse-geocoding
 * backend exists), recently selected cities, popular cities, and the full
 * list. Controlled so both the Navbar's desktop button and its mobile menu
 * row can open the same instance.
 */
export function LocationSelector({ open, onOpenChange }: LocationSelectorProps) {
  const { city, recentCities, setCity, detectLocation, detecting } = useLocation();
  const [query, setQuery] = useState("");
  const [detectMessage, setDetectMessage] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        (c.district?.toLowerCase().includes(q) ?? false),
    );
  }, [query]);

  function handleSelect(id: string) {
    setCity(id);
    setQuery("");
    setDetectMessage(null);
    onOpenChange(false);
  }

  async function handleDetect() {
    setDetectMessage(null);
    const result = await detectLocation();
    if (result.status === "success") {
      setQuery("");
      onOpenChange(false);
    } else if (result.status === "denied") {
      setDetectMessage("Location permission denied. Pick a city manually below.");
    } else if (result.status === "unsupported") {
      setDetectMessage("Location detection isn't supported on this device.");
    } else {
      setDetectMessage(result.message);
    }
  }

  function CityButton({ c }: { c: City }) {
    const active = c.id === city.id;
    return (
      <button
        type="button"
        onClick={() => handleSelect(c.id)}
        className={cn(
          "focus-ring flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-[13px] transition-colors",
          active
            ? "bg-primary-tint font-semibold text-primary"
            : "text-ink-secondary hover:bg-surface-secondary hover:text-ink",
        )}
      >
        <span>
          {c.name}
          <span className="ml-1.5 text-[11px] text-ink-muted">{c.state}</span>
        </span>
        {active ? <Check size={14} className="shrink-0 text-primary" /> : null}
      </button>
    );
  }

  function CityChip({ c }: { c: City }) {
    const active = c.id === city.id;
    return (
      <button
        type="button"
        onClick={() => handleSelect(c.id)}
        className={cn(
          "focus-ring rounded-full border-[1.5px] px-3.5 py-1.5 text-[12px] font-semibold transition-colors",
          active
            ? "border-primary bg-primary-tint text-primary"
            : "border-border-strong text-ink-secondary hover:border-primary hover:text-primary",
        )}
      >
        {c.name}
      </button>
    );
  }

  const body = (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-lg border-[1.5px] border-border-strong bg-white px-3 focus-within:border-primary">
        <Search size={15} className="shrink-0 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your city"
          aria-label="Search for your city"
          className="h-11 w-full border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted"
        />
      </div>

      {results ? (
        <div className="flex flex-col">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
            {results.length} {results.length === 1 ? "match" : "matches"}
          </p>
          {results.length === 0 ? (
            <p className="py-6 text-center text-[12.5px] text-ink-muted">No cities match &ldquo;{query}&rdquo;</p>
          ) : (
            <div className="flex max-h-72 flex-col overflow-y-auto">
              {results.map((c) => (
                <CityButton key={c.id} c={c} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div>
            <button
              type="button"
              onClick={handleDetect}
              disabled={detecting}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-primary px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary-tint disabled:cursor-not-allowed disabled:opacity-60"
            >
              {detecting ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />}
              {detecting ? "Detecting your location…" : "Detect My Location"}
            </button>
            {detectMessage ? <p className="mt-1.5 text-[11.5px] text-ink-secondary">{detectMessage}</p> : null}
          </div>

          {recentCities.length > 0 ? (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                Recently Selected
              </p>
              <div className="flex flex-col">
                {recentCities.map((c) => (
                  <CityButton key={c.id} c={c} />
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
              Popular Cities
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((c) => (
                <CityChip key={c.id} c={c} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">All Cities</p>
            <div className="flex max-h-56 flex-col overflow-y-auto">
              {CITIES.map((c) => (
                <CityButton key={c.id} c={c} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border border-border bg-surface text-ink sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 font-sans text-base font-bold text-ink">
              <MapPin size={16} className="text-primary" />
              Choose your city
            </DialogTitle>
            <DialogDescription className="text-[12.5px] text-ink-secondary">
              We use this to show relevant pricing, dealers and delivery estimates.
            </DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1.5">
            <MapPin size={16} className="text-primary" />
            Choose your city
          </SheetTitle>
          <SheetDescription>We use this to show relevant pricing, dealers and delivery estimates.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">{body}</div>
      </SheetContent>
    </Sheet>
  );
}
