"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_CITY, DEFAULT_CITY_ID, getCityById, nearestCity, type City } from "@/lib/data/cities";

const CITY_STORAGE_KEY = "ev-motion:city";
const RECENT_STORAGE_KEY = "ev-motion:recent-cities";
const MAX_RECENT = 5;

export type DetectLocationResult =
  | { status: "success"; city: City }
  | { status: "denied" }
  | { status: "unsupported" }
  | { status: "error"; message: string };

interface LocationContextValue {
  city: City;
  recentCities: City[];
  setCity: (id: string) => void;
  detectLocation: () => Promise<DetectLocationResult>;
  detecting: boolean;
}

const LocationContext = createContext<LocationContextValue | null>(null);

/**
 * Global selected-city state. Defaults to Delhi on the server (and on first
 * client render) to avoid a hydration mismatch, then corrects from
 * localStorage right after mount — same pattern the Navbar's dark-mode
 * toggle already uses for client-only preferences.
 */
export function LocationProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityId] = useState(DEFAULT_CITY_ID);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       One-time hydration from localStorage after mount: the server has no
       localStorage (so this can't be a lazy `useState` initializer without
       crashing SSR), and there's nothing to subscribe to (no cross-tab sync
       requirement here) — so `useSyncExternalStore` doesn't fit either. */
    try {
      const storedCity = localStorage.getItem(CITY_STORAGE_KEY);
      if (storedCity && getCityById(storedCity)) setCityId(storedCity);

      const storedRecent = localStorage.getItem(RECENT_STORAGE_KEY);
      if (storedRecent) {
        const parsed: unknown = JSON.parse(storedRecent);
        if (Array.isArray(parsed)) {
          setRecentIds(parsed.filter((id): id is string => typeof id === "string" && !!getCityById(id)));
        }
      }
    } catch {
      // localStorage unavailable (private mode, disabled storage, etc.) — silently keep defaults.
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setCity = useCallback((id: string) => {
    if (!getCityById(id)) return;
    setCityId(id);
    try {
      localStorage.setItem(CITY_STORAGE_KEY, id);
    } catch {
      // ignore
    }
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((existing) => existing !== id)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const detectLocation = useCallback((): Promise<DetectLocationResult> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return Promise.resolve({ status: "unsupported" });
    }
    setDetecting(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const match = nearestCity(position.coords.latitude, position.coords.longitude);
          setCity(match.id);
          setDetecting(false);
          resolve({ status: "success", city: match });
        },
        (error) => {
          setDetecting(false);
          if (error.code === error.PERMISSION_DENIED) resolve({ status: "denied" });
          else resolve({ status: "error", message: error.message || "Could not determine your location." });
        },
        { timeout: 10000, maximumAge: 5 * 60 * 1000 },
      );
    });
  }, [setCity]);

  const value = useMemo<LocationContextValue>(() => {
    const city = getCityById(cityId) ?? DEFAULT_CITY;
    const recentCities = recentIds.map((id) => getCityById(id)).filter((c): c is City => !!c);
    return { city, recentCities, setCity, detectLocation, detecting };
  }, [cityId, recentIds, setCity, detectLocation, detecting]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within a LocationProvider");
  return ctx;
}
