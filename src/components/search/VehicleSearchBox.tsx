"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchVehicles, type LinkSuggestion, type SearchScope, type VehicleSuggestion } from "@/lib/search";
import { loadSearchIndex } from "@/lib/search-index-client";
import { POPULAR_SEARCHES_BY_SCOPE } from "@/lib/popular-searches";
import { categoryConfig } from "@/lib/data/categories";
import { loadRecentSearches, saveRecentSearch } from "@/lib/search-history";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { HighlightedText } from "./HighlightedText";
import type { SearchIndex } from "@/types/search-index";

type FlatItem =
  | { kind: "vehicle"; key: string; suggestion: VehicleSuggestion }
  | { kind: "link"; key: string; suggestion: LinkSuggestion };

interface VehicleSearchBoxProps {
  ariaLabel: string;
  placeholder?: string;
  size?: "sm" | "lg";
  autoFocus?: boolean;
  className?: string;
  /** Restricts matching to one vehicle category — passed by the homepage's Car/Bike toggle. Omit for a global (all-category) search box. */
  categoryScope?: SearchScope;
}

const DEBOUNCE_MS = 180;
const RECENT_SEARCH_KEY = "ev-motion:recent-searches";
const MAX_RECENT_SEARCHES = 5;



export function VehicleSearchBox({
  ariaLabel,
  placeholder = "Search EVs...",
  size = "sm",
  autoFocus,
  className,
  categoryScope = "all",
}: VehicleSearchBoxProps) {
  const router = useRouter();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  // The catalog is fetched, not bundled — see `@/lib/search-index-client`.
  // Null until it arrives, which is why the results panel distinguishes
  // "still loading" from "genuinely no matches".
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [indexError, setIndexError] = useState(false);

  /**
   * Pull the index in on first interaction rather than on mount, so it stays
   * off the critical path of every page load. Focus is early enough that it
   * is almost always resolved before the first debounced keystroke lands.
   */
  function ensureSearchIndex() {
    if (searchIndex) return;
    loadSearchIndex().then(
      (index) => {
        setSearchIndex(index);
        setIndexError(false);
      },
      () => setIndexError(true),
    );
  }

  useEffect(() => {
    // One-time hydration from localStorage after mount — same rationale as
    // LocationContext's mount effect (no localStorage on the server, nothing
    // to subscribe to).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentSearches(loadRecentSearches(RECENT_SEARCH_KEY));
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setActiveIndex(-1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [value]);

  const outcome = useMemo(
    () => searchVehicles(searchIndex, debouncedValue, 8, categoryScope),
    [searchIndex, debouncedValue, categoryScope],
  );

  const items: FlatItem[] = useMemo(() => {
    const flat: FlatItem[] = outcome.vehicles.map((suggestion) => ({
      kind: "vehicle",
      key: suggestion.entry.id,
      suggestion,
    }));
    if (outcome.brandMatch) flat.push({ kind: "link", key: outcome.brandMatch.id, suggestion: outcome.brandMatch });
    if (outcome.categoryMatch) flat.push({ kind: "link", key: outcome.categoryMatch.id, suggestion: outcome.categoryMatch });
    return flat;
  }, [outcome]);

  const popularSearches = POPULAR_SEARCHES_BY_SCOPE[categoryScope];

  // One flat, keyboard-navigable list combining Recent + Popular — recent
  // terms win on duplicates so the same term isn't offered twice.
  const suggestionItems = useMemo(() => {
    const seen = new Set(recentSearches.map((t) => t.toLowerCase()));
    return [
      ...recentSearches.map((term) => ({ source: "recent" as const, term })),
      ...popularSearches.filter((term) => !seen.has(term.toLowerCase())).map((term) => ({ source: "popular" as const, term })),
    ];
  }, [recentSearches, popularSearches]);

  const hasQuery = debouncedValue.trim().length > 0;
  const showResultsPanel = open && hasQuery;
  const showSuggestionsPanel = open && !hasQuery && suggestionItems.length > 0;
  const panelVisible = showResultsPanel || showSuggestionsPanel;
  const activeList = showResultsPanel ? items.length : suggestionItems.length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function go(href: string, termToSave?: string) {
    setOpen(false);
    const term = termToSave ?? value;
    if (term.trim()) setRecentSearches(saveRecentSearch(RECENT_SEARCH_KEY, term, recentSearches, MAX_RECENT_SEARCHES));
    router.push(href);
  }

  function runQuery(term: string) {
    setValue(term);
    setDebouncedValue(term);
    setActiveIndex(-1);
    setOpen(true);
  }

  /**
   * Resolve a Recent/Popular term straight to a page. `categoryMatch` goes
   * first even though `vehicles` is checked first for typed-query Enter
   * presses elsewhere — it only ever fires on an exact, deliberate keyword
   * ("suv", "scooter", ...), so it's a stronger signal than a vehicle whose
   * name merely happens to contain that word as a substring (e.g. "SUV"
   * matching "Mercedes-Benz Maybach EQS SUV" ahead of the SUV listing page).
   */
  async function selectSuggestion(term: string) {
    // Awaits the index rather than reading component state: a suggestion can
    // be clicked before the fetch settles, and resolving against a null index
    // would silently downgrade a direct hit into a blank query panel.
    let index = searchIndex;
    if (!index) {
      try {
        index = await loadSearchIndex();
        setSearchIndex(index);
      } catch {
        setIndexError(true);
        runQuery(term);
        return;
      }
    }
    const resolved = searchVehicles(index, term, 1, categoryScope);
    const target = resolved.categoryMatch ?? resolved.vehicles[0] ?? resolved.brandMatch;
    if (target) {
      setValue(term);
      go(target.href, term);
    } else {
      runQuery(term);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!panelVisible) setOpen(true);
      setActiveIndex((i) => (activeList === 0 ? -1 : (i + 1) % activeList));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (activeList === 0 ? -1 : (i - 1 + activeList) % activeList));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showResultsPanel) {
        const target = activeIndex >= 0 ? items[activeIndex] : items[0];
        if (target) go(target.suggestion.href);
      } else if (showSuggestionsPanel) {
        const target = activeIndex >= 0 ? suggestionItems[activeIndex] : suggestionItems[0];
        if (target) selectSuggestion(target.term);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const activeId =
    activeIndex < 0
      ? undefined
      : showResultsPanel && items[activeIndex]
        ? `${listboxId}-${items[activeIndex].key}`
        : showSuggestionsPanel && suggestionItems[activeIndex]
          ? `${listboxId}-${suggestionItems[activeIndex].source}-${suggestionItems[activeIndex].term}`
          : undefined;

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
          aria-expanded={panelVisible}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            ensureSearchIndex();
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            ensureSearchIndex();
            setOpen(true);
            setActiveIndex(-1);
          }}
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

      {showSuggestionsPanel ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={`${ariaLabel} suggestions`}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[360px] overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-popover animate-fade-in"
        >
          {recentSearches.length > 0 ? (
            <div className="mb-1">
              <p className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
                <Clock size={11} />
                Recent Searches
              </p>
              {suggestionItems
                .map((item, index) => ({ item, index }))
                .filter(({ item }) => item.source === "recent")
                .map(({ item, index }) => (
                  <button
                    key={`recent-${item.term}`}
                    id={`${listboxId}-recent-${item.term}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectSuggestion(item.term)}
                    className={cn(
                      "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                      index === activeIndex ? "bg-primary-tint text-ink" : "text-ink-secondary hover:bg-surface-secondary hover:text-ink",
                    )}
                  >
                    {item.term}
                  </button>
                ))}
            </div>
          ) : null}
          <div>
            <p className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted">
              <TrendingUp size={11} />
              Popular Searches
            </p>
            {suggestionItems
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => item.source === "popular")
              .map(({ item, index }) => (
                <button
                  key={`popular-${item.term}`}
                  id={`${listboxId}-popular-${item.term}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectSuggestion(item.term)}
                  className={cn(
                    "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                    index === activeIndex ? "bg-primary-tint text-ink" : "text-ink-secondary hover:bg-surface-secondary hover:text-ink",
                  )}
                >
                  {item.term}
                </button>
              ))}
          </div>
        </div>
      ) : null}

      {showResultsPanel ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={`${ariaLabel} suggestions`}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[360px] overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-popover animate-fade-in"
        >
          {items.length === 0 ? (
            <p className="px-3 py-3 text-center text-[12px] text-ink-muted" aria-live="polite">
              {indexError
                ? "Search is unavailable right now. Please try again."
                : searchIndex === null
                  ? "Searching…"
                  : `No matches for “${debouncedValue}”`}
            </p>
          ) : (
            items.map((item, index) => {
              const active = index === activeIndex;
              if (item.kind === "vehicle") {
                const { entry, href, label } = item.suggestion;
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
                      <VehicleImage vehicle={entry} color={entry.oemColor} sizes="44px" className="h-full w-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold text-ink">
                        <HighlightedText text={label} query={debouncedValue} />
                      </span>
                      <span className="block text-[10.5px] text-ink-muted">{categoryConfig(entry.category).label}</span>
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
