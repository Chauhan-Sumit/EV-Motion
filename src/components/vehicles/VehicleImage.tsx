import { Image } from "@imagekit/next";
import { PlaceholderImage } from "@/components/common/PlaceholderImage";
import { VehicleCategory } from "@/types/vehicle";

/**
 * The four fields this component actually reads, rather than a whole
 * `Vehicle`. A full `Vehicle` is structurally assignable to this, so every
 * existing caller is unaffected — but it also lets a lightweight
 * `VehicleIndexEntry` render here without the search box having to load the
 * entire catalog just to draw a 44px thumbnail.
 */
export interface VehicleImageSubject {
  oemName: string;
  modelName: string;
  category: VehicleCategory;
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
  if (vehicle.images.photoUrl) {
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
      className={className}
      showLabel={showLabel}
    />
  );
}
