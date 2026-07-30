import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailTemplate } from "@/components/vehicle-detail";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { cars } from "@/lib/data/cars";

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
  };
}

export default async function CarDetailPage(props: PageProps<"/cars/[slug]">) {
  const { slug } = await props.params;
  const vehicle = cars.find((car) => car.slug === slug);

  if (!vehicle) notFound();

  return <VehicleDetailTemplate vehicle={toVehicleDetail(vehicle)} />;
}
