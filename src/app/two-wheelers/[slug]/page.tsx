import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailTemplate } from "@/components/vehicle-detail";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { twoWheelers } from "@/lib/data/two-wheelers";
import { breadcrumbJsonLd, vehicleProductJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return twoWheelers.map((tw) => ({ slug: tw.slug }));
}

export async function generateMetadata(props: PageProps<"/two-wheelers/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const vehicle = twoWheelers.find((tw) => tw.slug === slug);
  if (!vehicle) return { title: "Vehicle not found" };

  return {
    title: `${vehicle.oemName} ${vehicle.modelName} — Price, Range & Specs`,
    description: vehicle.description,
    alternates: { canonical: `/two-wheelers/${vehicle.slug}` },
  };
}

export default async function TwoWheelerDetailPage(props: PageProps<"/two-wheelers/[slug]">) {
  const { slug } = await props.params;
  const vehicle = twoWheelers.find((tw) => tw.slug === slug);

  if (!vehicle) notFound();

  const path = `/two-wheelers/${vehicle.slug}`;

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
              { name: "Electric Scooters & Bikes", path: "/two-wheelers" },
              { name: `${vehicle.oemName} ${vehicle.modelName}`, path },
            ]),
          ),
        }}
      />
      <VehicleDetailTemplate vehicle={toVehicleDetail(vehicle)} />
    </>
  );
}
