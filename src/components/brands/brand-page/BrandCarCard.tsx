"use client";

import { cardSubline } from "@/lib/cars-listing/copy";
import { paintForColors } from "@/lib/cars-listing/paint";
import type { PricedCar } from "@/lib/cars-listing/types";
import { useCarsListing } from "@/components/vehicles/cars-listing/ListingContext";
import { ListingCarArt } from "@/components/vehicles/cars-listing/ListingCarArt";
import { BrandTile } from "./BrandTile";

/** A car on a brand page: the Electric Cars listing's figures (range, DC 10–80%, battery) in the compact tile. */
export function BrandCarCard({ car }: { car: PricedCar }) {
  const { picks, togglePick, saved, toggleSaved, badges } = useCarsListing();
  return (
    <BrandTile
      slug={car.slug}
      name={car.name}
      href={`/cars/${car.slug}`}
      price={car.price}
      subline={cardSubline(car)}
      status={car.status}
      launchDate={car.launchDate}
      badge={badges.get(car.slug)}
      colors={car.colors}
      art={<ListingCarArt dims={car.art} body={car.body} paint={paintForColors(car.colors)} frame={{ lengthMm: 4400, heightMm: 1900 }} reflect alt={`${car.name} illustration`} className="max-w-[300px]" />}
      specs={[
        { value: String(car.rangeKm), unit: "km", label: "Range" },
        { value: car.dcMin !== null ? String(car.dcMin) : null, unit: "min", label: "DC 10–80%" },
        { value: String(Math.round(car.batteryKwh * 10) / 10), unit: "kWh", label: "Battery" },
      ]}
      picked={picks.includes(car.slug)}
      onTogglePick={() => togglePick(car.slug)}
      saved={saved.includes(car.slug)}
      onToggleSaved={() => toggleSaved(car.slug, car.name)}
    />
  );
}
