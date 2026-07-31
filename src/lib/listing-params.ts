import type { ChargingBucket } from "@/components/vehicles/FilterBar";
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
