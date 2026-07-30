import Link from "next/link";
import { oems } from "@/lib/data";

export default function BrandsPage() {
  const carOems = oems.filter((o) => o.categories.includes("car"));
  const twoWheelerOems = oems.filter((o) => o.categories.includes("2-wheeler"));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-semibold">All Brands</h1>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-muted-foreground">
          Car OEMs
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {carOems.map((oem) => (
            <Link
              key={oem.key}
              href={`/brands/${oem.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-shadow hover:shadow-md"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-heading font-semibold"
                style={{ backgroundColor: `${oem.color}22`, color: oem.color }}
              >
                {oem.name.charAt(0)}
              </span>
              <span className="text-sm font-medium">{oem.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg font-semibold text-muted-foreground">
          2-Wheeler OEMs
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {twoWheelerOems.map((oem) => (
            <Link
              key={oem.key}
              href={`/brands/${oem.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-shadow hover:shadow-md"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-heading font-semibold"
                style={{ backgroundColor: `${oem.color}22`, color: oem.color }}
              >
                {oem.name.charAt(0)}
              </span>
              <span className="text-sm font-medium">{oem.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
