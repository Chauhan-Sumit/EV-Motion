import type { CarBodyType, CommercialType, TwoWheelerType, VehicleCategory } from "@/types/vehicle";
import type { BodyShape } from "@/lib/vehicle-detail/types";

export interface ShapeSubject {
  category: VehicleCategory;
  bodyType?: CarBodyType;
  twoWheelerType?: TwoWheelerType;
  commercialType?: CommercialType;
}

/**
 * Catalogue body type → the generic `CarIllustration` silhouette.
 *
 * Mirrors the Vehicle Detail Page's private `shapeFor()` in
 * `lib/vehicle-detail/buildVdpViewModel.ts`, which is not exported and which
 * this branch deliberately does not edit. When the showroom page is
 * integrated, export that one and delete this.
 */
export function bodyShapeFor(v: ShapeSubject): BodyShape {
  if (v.twoWheelerType === "scooter") return "scooter";
  if (v.twoWheelerType === "motorcycle") return "motorcycle";
  switch (v.commercialType) {
    case "three-wheeler-cargo":
    case "three-wheeler-passenger":
      return "three-wheeler";
    case "small-truck":
    case "van":
    case "bus":
      return "van";
  }
  switch (v.bodyType) {
    case "hatchback":
      return "hatch";
    case "sedan":
      return "coupe";
    case "muv":
    case "suv":
      return "suv";
  }
  return v.category === "2-wheeler" ? "scooter" : "suv";
}
