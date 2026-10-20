"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_COMPARE } from "@/lib/compare/slug";

/** Writes the sort to the address bar without a navigation; the default sort is left out of the URL. */
function writeSortToAddressBar(sort: string, defaultSort: string) {
  const params = new URLSearchParams(window.location.search);
  if (sort === defaultSort) params.delete("sort");
  else params.set("sort", sort);
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(null, "", url);
}

/**
 * The interactive state every brand page shares, whatever the brand sells:
 * the sort (kept in `?sort=`), compare picks (up to `MAX_COMPARE`), the
 * visit-only shortlist, and the toast that reports on them. Same messages and
 * limits as the Electric Cars and Scooters & Bikes listings.
 */
export function useBrandPageState<K extends string>(sortConfig: { defaultSort: K; parse: (value: string | null) => K }) {
  const { defaultSort, parse } = sortConfig;
  const [sort, setSortState] = useState<K>(defaultSort);
  const [picks, setPicks] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<{ text: string; id: number } | null>(null);
  const toastId = useRef(0);

  // Brand pages are pre-rendered with the default sort, so a `?sort=` in a
  // shared link (or restored by Back/Forward) is applied once hydrated.
  useEffect(() => {
    const fromUrl = parse(new URLSearchParams(window.location.search).get("sort"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- adopts the address bar's sort after the static render
    if (fromUrl !== defaultSort) setSortState(fromUrl);
  }, [parse, defaultSort]);

  // Written from the change handler rather than an effect, so the first render can't strip a `?sort=` before it is read.
  const setSort = useCallback(
    (next: K) => {
      setSortState(next);
      writeSortToAddressBar(next, defaultSort);
    },
    [defaultSort],
  );

  const toast = useCallback((text: string) => {
    toastId.current += 1;
    setToastMsg({ text, id: toastId.current });
  }, []);

  const togglePick = useCallback(
    (slug: string) => {
      if (picks.includes(slug)) {
        setPicks(picks.filter((s) => s !== slug));
        return;
      }
      if (picks.length >= MAX_COMPARE) {
        toast(`You can compare up to ${MAX_COMPARE} models — remove one from the tray first.`);
        return;
      }
      setPicks([...picks, slug]);
      if (picks.length === 0) toast("Added. Pick at least one more to compare.");
    },
    [picks, toast],
  );

  const toggleSaved = useCallback(
    (slug: string, name: string) => {
      const on = !saved.includes(slug);
      setSaved(on ? [...saved, slug] : saved.filter((s) => s !== slug));
      toast(on ? `${name} saved to your shortlist.` : `${name} removed from your shortlist.`);
    },
    [saved, toast],
  );

  return { sort, setSort, picks, togglePick, clearPicks: () => setPicks([]), saved, toggleSaved, toast, toastMsg };
}
