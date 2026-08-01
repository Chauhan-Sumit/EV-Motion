import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailTemplate } from "@/components/vehicle-detail";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { commercial } from "@/lib/data/commercial";
import { breadcrumbJsonLd, vehicleProductJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return commercial.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata(props: PageProps<"/commercial/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const vehicle = commercial.find((v) => v.slug === slug);
  if (!vehicle) return { title: "Vehicle not found" };

  return {
    title: `${vehicle.oemName} ${vehicle.modelName} — Price, Range & Specs`,
    description: vehicle.description,
    alternates: { canonical: `/commercial/${vehicle.slug}` },
  };
}

export default async function CommercialDetailPage(props: PageProps<"/commercial/[slug]">) {
  const { slug } = await props.params;
  const vehicle = commercial.find((v) => v.slug === slug);

  if (!vehicle) notFound();

  const path = `/commercial/${vehicle.slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleProductJsonLd(vehicle, path)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Commercial EVs", path: "/commercial" },
              { name: `${vehicle.oemName} ${vehicle.modelName}`, path },
            ]),
          ),
        }}
      />
      <VehicleDetailTemplate vehicle={toVehicleDetail(vehicle)} />
    </>
  );
}
