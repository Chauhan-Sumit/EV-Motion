import { Vehicle, VehicleCategory } from "@/types/vehicle";
import { cars } from "./cars";
import { twoWheelers } from "./two-wheelers";

export { cars } from "./cars";
export { twoWheelers } from "./two-wheelers";
export { oems, getOemBySlug } from "./oems";

export function getAllVehicles(): Vehicle[] {
  return [...cars, ...twoWheelers];
}

export function getVehiclesByCategory(category: VehicleCategory): Vehicle[] {
  return category === "car" ? cars : twoWheelers;
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return getAllVehicles().find((vehicle) => vehicle.slug === slug);
}

export function getVehiclesByOem(oemKey: string): Vehicle[] {
  return getAllVehicles().filter((vehicle) => vehicle.oem === oemKey);
}

export function getRelatedVehicles(vehicle: Vehicle, limit = 4): Vehicle[] {
  return getVehiclesByCategory(vehicle.category)
    .filter((v) => v.oem === vehicle.oem && v.id !== vehicle.id)
    .slice(0, limit);
}
