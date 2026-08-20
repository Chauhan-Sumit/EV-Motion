import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { Container } from "@/components/ui/Container";
import { getOemBySlug, getVehiclesByOem, oems } from "@/lib/data";
import { CATEGORIES } from "@/lib/data/categories";
import { isCurrentlySold } from "@/lib/vehicle-availability";

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

  // A brand page is a listing of what the brand sells, so discontinued
  // records are filtered out here too — their own detail pages still work.
  // See src/lib/vehicle-availability.ts.
  const vehicles = getVehiclesByOem(oem.key).filter(isCurrentlySold);

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

      {CATEGORIES.map((cat) => {
        const categoryVehicles = vehicles.filter((v) => v.category === cat.key);
        if (categoryVehicles.length === 0) return null;

        return (
          <section key={cat.key} className="mt-8">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.5px] text-ink-muted">
              {oem.name} {cat.label}
            </h2>
            <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoryVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
