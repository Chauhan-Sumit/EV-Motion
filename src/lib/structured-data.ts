import type { Vehicle } from "@/types/vehicle";
import { SITE_URL } from "@/lib/site";
import { routeSegmentFor } from "@/lib/data/categories";

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

/** ItemList of Product entities for the Compare page — one entry per compared vehicle. */
export function comparisonItemListJsonLd(vehicles: Vehicle[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Compare ${vehicles.map((v) => `${v.oemName} ${v.modelName}`).join(" vs ")}`,
    url: absoluteUrl(path),
    itemListElement: vehicles.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${v.oemName} ${v.modelName}`,
        brand: { "@type": "Brand", name: v.oemName },
        url: absoluteUrl(`/${routeSegmentFor(v.category)}/${v.slug}`),
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: Math.round(v.priceRangeLakh[0] * 100000),
          availability: v.launchStatus === "upcoming" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
        },
      },
    })),
  };
}

/** FAQPage schema — reused by the Compare page's FAQs section. */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
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
