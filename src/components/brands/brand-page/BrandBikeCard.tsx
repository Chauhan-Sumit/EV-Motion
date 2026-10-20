"use client";

import { cardSubline } from "@/lib/two-wheelers-listing/copy";
import { swatchFor } from "@/lib/cars-listing/paint";
import type { PricedBike } from "@/lib/two-wheelers-listing/types";
import { useBikesListing } from "@/components/vehicles/two-wheelers-listing/ListingContext";
import { BikeArt } from "@/components/vehicles/two-wheelers-listing/BikeArt";
import { BrandTile } from "./BrandTile";

/** A scooter or motorcycle on a brand page: the Scooters & Bikes listing's figures (range, top speed, home charging) in the compact tile. */
export function BrandBikeCard({ bike }: { bike: PricedBike }) {
  const { picks, togglePick, saved, toggleSaved, badges } = useBikesListing();
  return (
    <BrandTile
      slug={bike.slug}
      name={bike.name}
      href={`/two-wheelers/${bike.slug}`}
      price={bike.price}
      subline={cardSubline(bike)}
      status={bike.status}
      launchDate={bike.launchDate}
      badge={badges.get(bike.slug)}
      colors={bike.colors}
      art={<BikeArt type={bike.type} color={swatchFor(bike.colors[0])} reflect alt={`${bike.name} illustration`} className="max-w-[230px]" />}
      specs={[
        { value: String(bike.rangeKm), unit: "km", label: "Range" },
        { value: String(bike.topSpeedKmph), unit: "km/h", label: "Top speed" },
        { value: String(bike.homeChargeHr), unit: "h", label: "Home charging" },
      ]}
      picked={picks.includes(bike.slug)}
      onTogglePick={() => togglePick(bike.slug)}
      saved={saved.includes(bike.slug)}
      onToggleSaved={() => toggleSaved(bike.slug, bike.name)}
    />
  );
}
