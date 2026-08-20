import type { LaunchStatus } from "@/types/vehicle";

/** Single source of truth for humanizing the LaunchStatus enum — used by VehicleCard and CompareTable so the two never drift. */
export const LAUNCH_STATUS_LABEL: Record<LaunchStatus, string> = {
  available: "Available",
  "just-launched": "Just Launched",
  upcoming: "Upcoming",
  // Reaches a card only on the surfaces that deliberately still serve a
  // discontinued vehicle (its own detail page, a comparison naming it) — the
  // listings and homepage rails filter it out first. See
  // `src/lib/vehicle-availability.ts`.
  discontinued: "Discontinued",
};
