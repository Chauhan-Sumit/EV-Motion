import { Image } from "@imagekit/next";
import { PlaceholderImage } from "@/components/common/PlaceholderImage";
import { IMAGEKIT_CONFIGURED } from "@/lib/imagekit";
import { CarBodyType, CommercialType, TwoWheelerType, VehicleCategory } from "@/types/vehicle";

/**
 * The fields this component actually reads, rather than a whole `Vehicle`. A
 * full `Vehicle` is structurally assignable to this, so every existing caller
 * is unaffected — but it also lets a lightweight `VehicleIndexEntry` render
 * here without the search box having to load the entire catalog just to draw a
 * 44px thumbnail.
 *
 * The three sub-type fields are optional for exactly that reason: a `Vehicle`
 * has one of them and gets a vehicle-type illustration in the placeholder; an
 * index entry has none and falls back to the category icon, keeping the search
 * index lean (CLAUDE.md point 23).
 */
export interface VehicleImageSubject {
  oemName: string;
  modelName: string;
  category: VehicleCategory;
  bodyType?: CarBodyType;
  twoWheelerType?: TwoWheelerType;
  commercialType?: CommercialType;
  images: { photoUrl?: string };
}

interface VehicleImageProps {
  vehicle: VehicleImageSubject;
  color: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Forwarded to PlaceholderImage — see its doc comment. Off by default. */
  showLabel?: boolean;
}

export function VehicleImage({
  vehicle,
  color,
  className,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  showLabel = false,
}: VehicleImageProps) {
  // A real photo is an ImageKit path, so it needs a configured endpoint to
  // resolve. Without one, fall through to the placeholder rather than render a
  // broken <img> — see IMAGEKIT_CONFIGURED in src/lib/imagekit.ts.
  if (vehicle.images.photoUrl && IMAGEKIT_CONFIGURED) {
    return (
      <div className={`relative ${className ?? ""}`}>
        <Image
          src={vehicle.images.photoUrl}
          alt={`${vehicle.oemName} ${vehicle.modelName}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <PlaceholderImage
      oemName={vehicle.oemName}
      modelName={vehicle.modelName}
      color={color}
      category={vehicle.category}
      bodyType={vehicle.bodyType}
      twoWheelerType={vehicle.twoWheelerType}
      commercialType={vehicle.commercialType}
      sizes={sizes}
      priority={priority}
      className={className}
      showLabel={showLabel}
    />
  );
}
