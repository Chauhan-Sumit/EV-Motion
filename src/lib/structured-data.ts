import type { Vehicle } from "@/types/vehicle";
import { SITE_URL } from "@/lib/site";

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/** Product + Offer schema for a single vehicle's detail page. */
export function vehicleProductJsonLd(vehicle: Vehicle, path: string) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${vehicle.oemName} ${vehicle.modelName}`,
    brand: { "@type": "Brand", name: vehicle.oemName },
    description: vehicle.description,
    ...(vehicle.images.photoUrl ? { image: [absoluteUrl(vehicle.images.photoUrl)] } : {}),
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: Math.round(vehicle.priceRangeLakh[0] * 100000),
      availability:
        vehicle.launchStatus === "upcoming" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      url,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Range", value: `${vehicle.rangeKm} km` },
      { "@type": "PropertyValue", name: "Battery Capacity", value: `${vehicle.batteryCapacityKwh} kWh` },
    ],
  };
}

/** BreadcrumbList schema — `items` in display order, home first. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
