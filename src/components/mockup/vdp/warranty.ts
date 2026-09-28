import type { VehicleDetail } from "@/types/vehicle-detail";

/**
 * MOCKUP-ONLY warranty reader.
 *
 * `VdpQuickSpecs.warrantyYears/warrantyKm` map to `specs.warranty.vehicleYears`
 * / `vehicleKm` — the *whole-vehicle* warranty. The figure an EV page wants to
 * lead with is the *battery* warranty (`batteryYears` / `batteryKm`), which is
 * a separate, usually longer cover, and is the field actually populated for
 * this vehicle: Tata publishes 8 years / 160,000 km on the pack and no
 * vehicle-level figure at all.
 *
 * Reading `quickSpecs` here would therefore have rendered "Not officially
 * specified" for a warranty that is in the catalog, and — worse — would have
 * printed a vehicle warranty under a "battery warranty" label on any vehicle
 * that has both. So the mockup reads the battery fields directly and labels
 * them as such.
 *
 * If this design ships, `VdpQuickSpecs` should grow a battery-warranty field
 * rather than every section reaching into `sourceVehicle.specs` like this.
 */
export interface BatteryWarranty {
  years: number;
  km?: number;
  /** e.g. "8 yr / 160k km" — the compact form used in tiles. */
  short: string;
  /** e.g. "8 years / 160,000 km" — the long form used in prose. */
  long: string;
}

export function batteryWarrantyFor(vehicle: VehicleDetail): BatteryWarranty | undefined {
  const warranty = vehicle.sourceVehicle.specs?.warranty;
  const years = warranty?.batteryYears;
  if (years === undefined) return undefined;

  const km = warranty?.batteryKm;
  return {
    years,
    km,
    short: km !== undefined ? `yr / ${(km / 1000).toFixed(0)}k km` : "yr",
    long:
      km !== undefined
        ? `${years} years / ${km.toLocaleString("en-IN")} km`
        : `${years} years`,
  };
}
