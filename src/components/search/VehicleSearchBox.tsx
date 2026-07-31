"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchVehicles, type LinkSuggestion, type VehicleSuggestion } from "@/lib/search";
import { oemColorOf } from "@/lib/data/ev-motion/derive";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { HighlightedText } from "./HighlightedText";

type FlatItem =
  | { kind: "vehicle"; key: string; suggestion: VehicleSuggestion }
  | { kind: "link"; key: string; suggestion: LinkSuggestion };

interface VehicleSearchBoxProps {
  ariaLabel: string;
  placeholder?: string;
  size?: "sm" | "lg";
  autoFocus?: boolean;
  className?: string;
}

const DEBOUNCE_MS = 180;

export function VehicleSearchBox({
  ariaLabel,
  placeholder = "Search EVs...",
  size = "sm",
  autoFocus,
  className,
}: VehicleSearchBoxProps) {
  const router = useRouter();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setActiveIndex(-1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [value]);

  const outcome = useMemo(() => searchVehicles(debouncedValue), [debouncedValue]);

  const items: FlatItem[] = useMemo(() => {
    const flat: FlatItem[] = outcome.vehicles.map((suggestion) => ({
      kind: "vehicle",
      key: suggestion.vehicle.id,
      suggestion,
    }));
    if (outcome.brandMatch) flat.push({ kind: "link", key: outcome.brandMatch.id, suggestion: outcome.brandMatch });
    if (outcome.categoryMatch) flat.push({ kind: "link", key: outcome.categoryMatch.id, suggestion: outcome.categoryMatch });
    return flat;
  }, [outcome]);

  const hasQuery = debouncedValue.trim().length > 0;
  const showPanel = open && hasQuery;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showPanel) setOpen(true);
      setActiveIndex((i) => (items.length === 0 ? -1 : (i + 1) % items.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (items.length === 0 ? -1 : (i - 1 + items.length) % items.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIndex >= 0 ? items[activeIndex] : items[0];
      if (target) go(target.suggestion.href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const activeId = activeIndex >= 0 && items[activeIndex] ? `${listboxId}-${items[activeIndex].key}` : undefined;

  const inputSizeClasses =
    size === "lg"
      ? "h-11 text-[13px]"
      : "h-full text-xs";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center overflow-hidden rounded-lg border-[1.5px] border-border-strong bg-white focus-within:border-primary",
          size === "lg" ? "px-3.5" : "h-9",
        )}
      >
        <input
          type="text"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full flex-1 border-none bg-transparent px-2.5 text-ink outline-none placeholder:text-ink-muted",
            inputSizeClasses,
          )}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              setDebouncedValue("");
              setOpen(false);
            }}
            className="flex h-full shrink-0 items-center justify-center px-2 text-ink-muted hover:text-ink"
          >
            <X size={13} />
          </button>
        ) : null}
        <span
          className={cn(
            "flex shrink-0 items-center justify-center text-ink-muted",
            size === "lg" ? "h-11 w-11" : "h-full w-9 border-l border-border",
          )}
          aria-hidden="true"
        >
          <Search size={size === "lg" ? 16 : 13} strokeWidth={2.5} />
        </span>
      </div>

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={`${ariaLabel} suggestions`}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[360px] overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-popover animate-fade-in"
        >
          {items.length === 0 ? (
            <p className="px-3 py-3 text-center text-[12px] text-ink-muted">
              No matches for &ldquo;{debouncedValue}&rdquo;
            </p>
          ) : (
            items.map((item, index) => {
              const active = index === activeIndex;
              if (item.kind === "vehicle") {
                const { vehicle, href, label } = item.suggestion;
                return (
                  <button
                    key={item.key}
                    id={`${listboxId}-${item.key}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(href)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors",
                      active ? "bg-primary-tint" : "hover:bg-surface-secondary",
                    )}
                  >
                    <span className="relative h-9 w-11 shrink-0 overflow-hidden rounded-md bg-white">
                      <VehicleImage vehicle={vehicle} color={oemColorOf(vehicle)} sizes="44px" className="h-full w-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold text-ink">
                        <HighlightedText text={label} query={debouncedValue} />
                      </span>
                      <span className="block text-[10.5px] text-ink-muted">
                        {vehicle.category === "car" ? "Electric Car" : "Electric 2-Wheeler"}
                      </span>
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.key}
                  id={`${listboxId}-${item.key}`}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(item.suggestion.href)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12px] font-semibold text-primary transition-colors",
                    active ? "bg-primary-tint" : "hover:bg-surface-secondary",
                  )}
                >
                  {item.suggestion.label}
                  <span aria-hidden="true">&rsaquo;</span>
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
