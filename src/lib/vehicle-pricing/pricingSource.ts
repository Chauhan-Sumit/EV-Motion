/**
 * The single seam between the VDP pricing UI (`useVehiclePricing`) and where
 * pricing data actually comes from. Every consumer imports from this file —
 * never from `localPricingSource.ts` directly — so swapping the backing
 * source later is a one-file change with zero UI/component edits.
 *
 * Today: local structured placeholder data (`localPricingSource.ts`), reading
 * `src/lib/data/state-charges.ts`'s state-indexed rate table.
 *
 * Future: once a real pricing backend exists, this file's two exports would
 * be re-pointed at an API-backed implementation instead, e.g.:
 *
 *   async function getVehiclePricingSnapshot(input) {
 *     const res = await fetch(`/api/pricing/${input.vehicleId}/${input.city.id}`);
 *     return res.json() as Promise<VehiclePricingSnapshot>;
 *   }
 *
 * matching the planned `GET /api/pricing/{vehicle}/{city}` endpoint. Nothing
 * in `useVehiclePricing` or any component would need to change beyond
 * awaiting the (already-async-shaped) call — see HANDOFF.md's pricing
 * architecture section for the full migration note.
 */
export { getVehiclePricingSnapshot, PRICING_DATA_LAST_UPDATED } from "./localPricingSource";
export type { VehiclePricingInput } from "./localPricingSource";
