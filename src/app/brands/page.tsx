import type { Metadata } from "next";
import Link from "next/link";
import { oems } from "@/lib/data";
import { CATEGORIES } from "@/lib/data/categories";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "All Electric Vehicle Brands in India",
  description: `Browse all ${oems.length} EV brands available in India across cars, two-wheelers and commercial vehicles.`,
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return (
    <Container className="py-6 sm:py-8">
      <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">All Brands</h1>

      {CATEGORIES.map((cat) => {
        const categoryOems = oems.filter((o) => o.categories.includes(cat.key));
        if (categoryOems.length === 0) return null;

        return (
          <section key={cat.key} className="mt-7">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.5px] text-ink-muted">{cat.label} OEMs</h2>
            <div className="mt-3.5 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categoryOems.map((oem) => (
                <Link
                  key={oem.key}
                  href={`/brands/${oem.slug}`}
                  className="focus-ring flex flex-col items-center gap-2 rounded-[10px] border border-border bg-surface p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
                >
                  <BrandLogo oem={oem} size={48} />
                  <span className="text-[12.5px] font-semibold text-ink">{oem.name}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
