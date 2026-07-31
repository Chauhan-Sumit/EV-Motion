import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { Container } from "@/components/ui/Container";
import { getOemBySlug, getVehiclesByOem, oems } from "@/lib/data";

export function generateStaticParams() {
  return oems.map((oem) => ({ oem: oem.slug }));
}

export async function generateMetadata(props: PageProps<"/brands/[oem]">): Promise<Metadata> {
  const { oem: oemSlug } = await props.params;
  const oem = getOemBySlug(oemSlug);
  if (!oem) return { title: "Brand not found" };

  return {
    title: `${oem.name} Electric Vehicles in India`,
    description: oem.description,
    alternates: { canonical: `/brands/${oem.slug}` },
  };
}

export default async function BrandPage(props: PageProps<"/brands/[oem]">) {
  const { oem: oemSlug } = await props.params;
  const oem = getOemBySlug(oemSlug);

  if (!oem) notFound();

  const vehicles = getVehiclesByOem(oem.key);
  const cars = vehicles.filter((v) => v.category === "car");
  const twoWheelers = vehicles.filter((v) => v.category === "2-wheeler");

  return (
    <Container className="py-6 sm:py-8">
      <div className="flex items-center gap-4">
        <BrandLogo oem={oem} size={64} />
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{oem.name}</h1>
          <p className="text-[12.5px] text-ink-secondary">{oem.country}</p>
        </div>
      </div>

      <p className="mt-3.5 max-w-2xl text-[13px] text-ink-secondary">{oem.description}</p>

      {cars.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.5px] text-ink-muted">
            {oem.name} EV Cars
          </h2>
          <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}

      {twoWheelers.length > 0 && (
        <section className="mt-8">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.5px] text-ink-muted">
            {oem.name} Electric 2-Wheelers
          </h2>
          <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {twoWheelers.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
