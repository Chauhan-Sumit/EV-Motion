import type { ChargingBucket } from "@/lib/vehicle-filter-options";
import type { LaunchStatus } from "@/types/vehicle";

export interface ListingSearchParams {
  [key: string]: string | string[] | undefined;
}

const VALID_STATUSES: LaunchStatus[] = ["available", "just-launched", "upcoming"];

/** Single parser for /cars and /two-wheelers' URL-synced filter state, so the two pages can't drift on how a param is read. */
export function parseListingParams(
  params: ListingSearchParams,
  priceBounds: [number, number],
  rangeBounds: [number, number],
  batteryBounds: [number, number],
) {
  const oemsParam = typeof params.oems === "string" ? params.oems : "";
  const oems = oemsParam ? oemsParam.split(",") : [];

  const budgetParam = typeof params.budget === "string" ? params.budget : "";
  const [minStr, maxStr] = budgetParam.split("-");
  const min = Number(minStr);
  const max = Number(maxStr);
  const price: [number, number] =
    budgetParam && !Number.isNaN(min) && !Number.isNaN(max)
      ? [Math.max(priceBounds[0], min), Math.min(max, priceBounds[1])]
      : priceBounds;

  const subType = typeof params.type === "string" ? params.type : "all";
  const sort = typeof params.sort === "string" ? params.sort : "price-asc";

  const rangeParam = typeof params.range === "string" ? Number(params.range) : NaN;
  const minRange = !Number.isNaN(rangeParam)
    ? Math.max(rangeBounds[0], Math.min(rangeParam, rangeBounds[1]))
    : rangeBounds[0];

  const batteryParam = typeof params.battery === "string" ? Number(params.battery) : NaN;
  const minBattery = !Number.isNaN(batteryParam)
    ? Math.max(batteryBounds[0], Math.min(batteryParam, batteryBounds[1]))
    : batteryBounds[0];

  const chargingParam = typeof params.charging === "string" ? params.charging : "any";
  const charging: ChargingBucket =
    chargingParam === "under30" || chargingParam === "under60" ? chargingParam : "any";

  const seatsParam = typeof params.seats === "string" ? params.seats : "";
  const seats = seatsParam
    ? seatsParam
        .split(",")
        .map(Number)
        .filter((n) => !Number.isNaN(n))
    : [];

  const availabilityParam = typeof params.availability === "string" ? params.availability : "";
  const availability = availabilityParam
    ? availabilityParam
        .split(",")
        .filter((s): s is LaunchStatus => VALID_STATUSES.includes(s as LaunchStatus))
    : [];

  return { oems, price, subType, sort, minRange, minBattery, charging, seats, availability };
}

export interface ListingFilterState {
  oems: string[];
  price: [number, number];
  subType: string;
  sort: string;
  minRange: number;
  minBattery: number;
  charging: ChargingBucket;
  seats: number[];
  availability: LaunchStatus[];
}

/**
 * Inverse of `parseListingParams` — the single place that builds a listing
 * page's query string, so `VehicleListing`'s filter sidebar and the
 * homepage's filter pickers can't encode the same state two different ways.
 */
export function buildListingSearchParams(
  state: ListingFilterState,
  priceBounds: [number, number],
  rangeBounds: [number, number],
  batteryBounds: [number, number],
): URLSearchParams {
  const params = new URLSearchParams();

  if (state.oems.length) params.set("oems", state.oems.join(","));
  if (state.price[0] !== priceBounds[0] || state.price[1] !== priceBounds[1]) {
    params.set("budget", `${state.price[0]}-${state.price[1]}`);
  }
  if (state.subType !== "all") params.set("type", state.subType);
  if (state.sort !== "price-asc") params.set("sort", state.sort);
  if (state.minRange !== rangeBounds[0]) params.set("range", `${state.minRange}`);
  if (state.minBattery !== batteryBounds[0]) params.set("battery", `${state.minBattery}`);
  if (state.charging !== "any") params.set("charging", state.charging);
  if (state.seats.length) params.set("seats", state.seats.join(","));
  if (state.availability.length) params.set("availability", state.availability.join(","));

  return params;
}
