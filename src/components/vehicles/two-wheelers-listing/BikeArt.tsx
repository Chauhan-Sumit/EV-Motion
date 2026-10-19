"use client";

import { CarIllustration } from "@/components/vehicle-detail/vdp/CarIllustration";
import type { TwoWheelerType } from "@/types/vehicle";
import { cn } from "@/lib/utils";

/**
 * The listing's two-wheeler drawing: the site's generic scooter or motorcycle
 * silhouette (`CarIllustration`, the same one the detail pages and Compare
 * use), painted in the model's first listed colour, with the floor reflection
 * the Electric Cars listing gives its cars. Illustration only — not a likeness
 * of the model and not a photograph (CLAUDE.md #26).
 */
export function BikeArt({
  type,
  color,
  reflect = false,
  detail = true,
  alt,
  className,
}: {
  type: TwoWheelerType;
  /** Body colour — any CSS colour. */
  color: string;
  reflect?: boolean;
  /** False drops wheel spokes, for small thumbnails. */
  detail?: boolean;
  /** Empty marks the drawing decorative. */
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <CarIllustration shape={type} bodyColor={color} alt={alt} detail={detail} className="relative block" />
      {reflect ? (
        // The drawing's viewBox is 420×182; this strip shows its bottom 44 units mirrored, fading out.
        <div aria-hidden="true" className="pointer-events-none -mt-[2%] aspect-[420/44] overflow-hidden opacity-[.16] [mask-image:linear-gradient(180deg,#000,transparent)]">
          <CarIllustration shape={type} bodyColor={color} alt="" detail={false} className="block -scale-y-100" />
        </div>
      ) : null}
    </div>
  );
}
