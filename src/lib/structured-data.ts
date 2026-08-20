import { buildSrc } from "@imagekit/next";
import type { Vehicle } from "@/types/vehicle";
import { SITE_URL } from "@/lib/site";
import { IMAGEKIT_CONFIGURED, IMAGEKIT_URL_ENDPOINT } from "@/lib/imagekit";
import { routeSegmentFor } from "@/lib/data/categories";
import { schemaAvailabilityFor } from "@/lib/vehicle-availability";

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/** vehicle.images.photoUrl/gallery are ImageKit-relative paths, not site paths —
 *  build their real CDN URL instead of prefixing with SITE_URL like absoluteUrl(). */
function imageKitUrl(path: string): string {
  return path.startsWith("http") ? path : buildSrc({ urlEndpoint: IMAGEKIT_URL_ENDPOINT, src: path });
}

/**
 * Only emit image URLs we can actually build. With no ImageKit endpoint
 * configured, `buildSrc` returns a path with no host in front of it — a
 * broken URL published into structured data, which is worse than no `image`
 * property at all. See IMAGEKIT_CONFIGURED in src/lib/imagekit.ts.
 */
function imageUrlsFor(vehicle: Vehicle): string[] {
  if (!IMAGEKIT_CONFIGURED || !vehicle.images.photoUrl) return [];
  return [imageKitUrl(vehicle.images.photoUrl), ...vehicle.images.gallery.map(imageKitUrl)];
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
    ...(imageUrlsFor(vehicle).length ? { image: imageUrlsFor(vehicle) } : {}),
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: Math.round(vehicle.priceRangeLakh[0] * 100000),
      availability: schemaAvailabilityFor(vehicle),
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
          availability: schemaAvailabilityFor(v),
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
