import { notFound } from "next/navigation";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { getOemBySlug, getVehiclesByOem, oems } from "@/lib/data";

export function generateStaticParams() {
  return oems.map((oem) => ({ oem: oem.slug }));
}

export default async function BrandPage(props: PageProps<"/brands/[oem]">) {
  const { oem: oemSlug } = await props.params;
  const oem = getOemBySlug(oemSlug);

  if (!oem) notFound();

  const vehicles = getVehiclesByOem(oem.key);
  const cars = vehicles.filter((v) => v.category === "car");
  const twoWheelers = vehicles.filter((v) => v.category === "2-wheeler");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-heading font-semibold"
          style={{ backgroundColor: `${oem.color}22`, color: oem.color }}
        >
          {oem.name.charAt(0)}
        </span>
        <div>
          <h1 className="font-heading text-2xl font-semibold">{oem.name}</h1>
          <p className="text-sm text-muted-foreground">{oem.country}</p>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-muted-foreground">{oem.description}</p>

      {cars.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-lg font-semibold">
            {oem.name} EV Cars
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}

      {twoWheelers.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-lg font-semibold">
            {oem.name} Electric 2-Wheelers
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {twoWheelers.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
