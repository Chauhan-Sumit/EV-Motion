import type { LaunchStatus } from "@/types/vehicle";

/** Single source of truth for humanizing the LaunchStatus enum — used by VehicleCard and CompareTable so the two never drift. */
export const LAUNCH_STATUS_LABEL: Record<LaunchStatus, string> = {
  available: "Available",
  "just-launched": "Just Launched",
  upcoming: "Upcoming",
};
