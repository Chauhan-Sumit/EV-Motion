import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailTemplate } from "@/components/vehicle-detail";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { cars } from "@/lib/data/cars";
import { breadcrumbJsonLd, vehicleProductJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata(props: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const vehicle = cars.find((car) => car.slug === slug);
  if (!vehicle) return { title: "Vehicle not found" };

  return {
    title: `${vehicle.oemName} ${vehicle.modelName} — Price, Range & Specs`,
    description: vehicle.description,
    alternates: { canonical: `/cars/${vehicle.slug}` },
  };
}

export default async function CarDetailPage(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const vehicle = cars.find((car) => car.slug === slug);

  if (!vehicle) notFound();

  const path = `/cars/${vehicle.slug}`;

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
              { name: "Electric Cars", path: "/cars" },
              { name: `${vehicle.oemName} ${vehicle.modelName}`, path },
            ]),
          ),
        }}
      />
      <VehicleDetailTemplate vehicle={toVehicleDetail(vehicle)} />
    </>
  );
}
