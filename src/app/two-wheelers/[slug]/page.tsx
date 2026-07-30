import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleDetailTemplate } from "@/components/vehicle-detail";
import { toVehicleDetail } from "@/lib/data/ev-motion/toVehicleDetail";
import { twoWheelers } from "@/lib/data/two-wheelers";

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
  };
}

export default async function TwoWheelerDetailPage(props: PageProps<"/two-wheelers/[slug]">) {
  const { slug } = await props.params;
  const vehicle = twoWheelers.find((tw) => tw.slug === slug);

  if (!vehicle) notFound();

  return <VehicleDetailTemplate vehicle={toVehicleDetail(vehicle)} />;
}
