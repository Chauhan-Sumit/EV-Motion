import Image from "next/image";
import type { Oem } from "@/types/vehicle";
import { cn } from "@/lib/utils";

/**
 * Renders a brand's real logo asset when one exists; falls back to an
 * initial-letter avatar in the brand's color when it doesn't (currently only
 * Ampere). Single source of truth for both the /brands index and /brands/[oem]
 * detail page, so the fallback logic can't drift between the two.
 */
export function BrandLogo({ oem, size = 48, className }: { oem: Oem; size?: number; className?: string }) {
  if (oem.logoUrl) {
    return (
      <span
        className={cn("relative shrink-0 overflow-hidden rounded-full border border-border bg-white", className)}
        style={{ width: size, height: size }}
      >
        <Image src={oem.logoUrl} alt={oem.name} fill sizes={`${size}px`} className="object-contain p-1.5" />
      </span>
    );
  }

  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-full font-heading font-semibold", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: `${oem.color}22`,
        color: oem.color,
        fontSize: size * 0.375,
      }}
    >
      {oem.name.charAt(0)}
    </span>
  );
}
