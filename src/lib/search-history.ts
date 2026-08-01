/** Shared recent-search-term persistence — used by VehicleSearchBox (Navbar/homepage) and ChangeVehicleModal (Compare page). */

const DEFAULT_MAX_RECENT = 5;

export function loadRecentSearches(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((q): q is string => typeof q === "string") : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(
  storageKey: string,
  term: string,
  current: string[],
  max = DEFAULT_MAX_RECENT,
): string[] {
  const trimmed = term.trim();
  if (!trimmed) return current;
  const next = [trimmed, ...current.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, max);
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // ignore — localStorage unavailable (private mode, disabled storage, etc.)
  }
  return next;
}
