"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { getOemBySlug } from "@/lib/data";
import { Vehicle } from "@/types/vehicle";

const statusLabel: Record<Vehicle["launchStatus"], string> = {
  available: "Available",
  "just-launched": "Just Launched",
  upcoming: "Upcoming",
};

const statusVariant: Record<Vehicle["launchStatus"], "default" | "secondary" | "outline"> = {
  available: "default",
  "just-launched": "secondary",
  upcoming: "outline",
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const oem = getOemBySlug(vehicle.oem);
  const color = oem?.color ?? "#0891B2";
  const basePath = vehicle.category === "car" ? "/cars" : "/two-wheelers";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full gap-0 py-0 overflow-hidden">
        <Link href={`${basePath}/${vehicle.slug}`} className="block">
          <div className="aspect-[4/3]">
            <VehicleImage vehicle={vehicle} color={color} className="h-full w-full" />
          </div>
        </Link>
        <CardContent className="flex flex-1 flex-col gap-2 pt-4 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{vehicle.oemName}</p>
              <Link href={`${basePath}/${vehicle.slug}`}>
                <h3 className="font-heading text-base font-semibold leading-snug hover:text-primary">
                  {vehicle.modelName}
                </h3>
              </Link>
            </div>
            <Badge variant={statusVariant[vehicle.launchStatus]}>
              {statusLabel[vehicle.launchStatus]}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-1">
            {vehicle.tagline}
          </p>

          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="font-heading font-semibold text-foreground">
              ₹{vehicle.priceRangeLakh[0].toFixed(2)} - {vehicle.priceRangeLakh[1].toFixed(2)} L
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-success" />
              {vehicle.rangeKm} km
            </span>
          </div>

          <Link
            href={`/compare?ids=${vehicle.slug}`}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <Scale className="h-3.5 w-3.5" />
            Add to Compare
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
