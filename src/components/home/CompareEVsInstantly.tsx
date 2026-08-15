import Link from "next/link";
import { Car, FileText, IndianRupee, Scale } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { buildCompareSlug } from "@/lib/compare/slug";
import { carComparisons, oemColorOf } from "@/lib/data/ev-motion/derive";

const points = [
  { icon: Car, label: "Up to 3 Vehicles" },
  { icon: FileText, label: "Detailed Specs" },
  { icon: IndianRupee, label: "Real, City-Aware Pricing" },
  { icon: FileText, label: "Export PDF" },
];

export function CompareEVsInstantly() {
  const pair = carComparisons[0];
  if (!pair) return null;
  const compareHref = `/compare/${buildCompareSlug([pair.vehicleA.vehicle, pair.vehicleB.vehicle])}`;

  return (
    <div className="overflow-hidden rounded-xl bg-primary-tint p-5 sm:p-6">
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-xl font-extrabold text-ink sm:text-2xl">Compare EVs Instantly</h2>
          <p className="mt-1.5 max-w-md text-[13px] text-ink-secondary">
            Side-by-side comparison of price, range, battery, features, safety, running cost and more.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] font-medium text-ink-secondary">
            {points.map((p) => (
              <span key={p.label} className="flex items-center gap-1.5">
                <p.icon size={13} className="text-primary" /> {p.label}
              </span>
            ))}
          </div>
          <Link
            href={compareHref}
            className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <Scale size={15} />
            Start Comparing Now
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-xs items-center justify-center gap-2 lg:w-72">
          <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-white">
            <VehicleImage vehicle={pair.vehicleA.vehicle} color={pair.vehicleA.oemColor} sizes="128px" className="h-full w-full p-2" />
          </div>
          <span className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary-tint bg-surface-dark text-[11px] font-bold text-primary-bright shadow-md">
            VS
          </span>
          <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-white">
            <VehicleImage vehicle={pair.vehicleB.vehicle} color={oemColorOf(pair.vehicleB.vehicle)} sizes="128px" className="h-full w-full p-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
