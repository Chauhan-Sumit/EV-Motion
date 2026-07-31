import Link from "next/link";
import { Star, Scale } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { Container } from "@/components/ui/Container";
import { VehicleGallery } from "./VehicleGallery";
import { GetBestPriceDialog } from "./GetBestPriceDialog";

export function VehicleHero({ vehicle }: { vehicle: VehicleDetail }) {
  const compareHref = `/compare?ids=${vehicle.slug}`;

  return (
    <Container className="py-3.5 sm:py-5">
      <div className="grid min-w-0 gap-3.5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
        <VehicleGallery vehicle={vehicle} />

        <div className="flex min-w-0 flex-col justify-center rounded-xl border border-border bg-surface p-4 sm:p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.7px] text-ink-muted">{vehicle.brand}</p>
          <h1 className="mt-0.5 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{vehicle.name}</h1>

          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-ink-secondary">
            <Star size={14} className="fill-primary text-primary" />
            <span className="font-semibold text-ink">{vehicle.sourceVehicle.launchStatus === "available" ? "Available" : "New"}</span>
            <span className="text-ink-muted">· Not yet rated</span>
          </div>

          <div className="mt-3.5 border-t border-border pt-3.5">
            <p className="text-[10px] text-ink-muted">Ex-showroom price</p>
            <p className="mt-0.5 text-2xl font-extrabold text-primary">
              {vehicle.priceLabel}
              <span className="ml-1.5 text-[11px] font-normal text-ink-muted">onwards</span>
            </p>
            <p className="mt-0.5 text-[11px] text-ink-muted">{vehicle.emiLabel} est.</p>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-2">
            <GetBestPriceDialog vehicleName={vehicle.name} />
            <Link
              href={compareHref}
              className="focus-ring flex items-center gap-1.5 rounded-md border border-primary bg-transparent px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary-tint"
            >
              <Scale size={14} />
              Add to Compare
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
