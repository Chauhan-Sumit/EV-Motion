import type { CSSProperties } from "react";
import { Image } from "@imagekit/next";
import { cn } from "@/lib/utils";
import { illustrationFor, subTypeLabelFor } from "@/lib/vehicle-illustrations";
import { CarBodyType, CommercialType, TwoWheelerType, VehicleCategory } from "@/types/vehicle";

interface PlaceholderImageProps {
  oemName: string;
  modelName: string;
  color: string;
  category: VehicleCategory;
  /**
   * Sub-type, when the caller has it. Selects a generic AI-generated
   * illustration of that *vehicle type* (see `@/lib/vehicle-illustrations` for
   * why it is per-type and never per-model); absent, or with no illustration
   * generated yet, the hand-drawn category icon below is used instead. A
   * lightweight search-index entry carries no sub-type and so keeps the icon,
   * which is the right call at a 44px thumbnail anyway.
   */
  bodyType?: CarBodyType;
  twoWheelerType?: TwoWheelerType;
  commercialType?: CommercialType;
  /** Forwarded to the illustration's <Image>. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /**
   * Renders the vehicle name as visible text inside the placeholder graphic.
   * Off by default: every card/section that uses this placeholder already
   * shows the vehicle name as its own adjacent title, so the in-graphic
   * label was pure duplication (and outright overlapped the icon at small
   * thumbnail sizes). Only opt in where the placeholder is the sole visual
   * with no nearby name text at all. The accessible name (role="img" +
   * aria-label) is unaffected either way.
   */
  showLabel?: boolean;
}

function CarIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <path
        d="M8 38l4.5-13a6 6 0 0 1 5.7-4.1h27.6a6 6 0 0 1 5.7 4.1L56 38v12a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-2H17v2a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V38z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="42" r="4" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="46" cy="42" r="4" stroke="currentColor" strokeWidth="2.5" />
      <path d="M13 28h38" stroke="currentColor" strokeWidth="2.5" />
      <path d="M27 8l-4 9h9l-5 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScooterIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <circle cx="14" cy="46" r="6" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="48" cy="46" r="6" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M14 46h6l6-18h14l4 10h4a4 4 0 0 1 4 4v4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M34 28h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M25 14l-3 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 8l-2 8h8l-4 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CommercialIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} style={style}>
      <path
        d="M6 42V20a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M36 28h9l7 8v6a2 2 0 0 1-2 2h-3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 42h3M20 42h13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="17" cy="46" r="5" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="46" cy="46" r="5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 26h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function PlaceholderImage({
  oemName,
  modelName,
  color,
  category,
  bodyType,
  twoWheelerType,
  commercialType,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
  className,
  showLabel = false,
}: PlaceholderImageProps) {
  const Icon = category === "car" ? CarIcon : category === "2-wheeler" ? ScooterIcon : CommercialIcon;

  const subject = { category, bodyType, twoWheelerType, commercialType };
  const illustration = illustrationFor(subject);
  const subTypeLabel = subTypeLabelFor(subject);

  // Says out loud that this is a generic drawing, so a screen-reader user is
  // never told a picture of *this* vehicle exists when none does. The icon path
  // needs no such caveat — nobody mistakes a line icon for a photograph.
  const accessibleName = illustration
    ? `${oemName} ${modelName} — generic ${subTypeLabel ?? "vehicle"} illustration, not a photograph of this vehicle`
    : `${oemName} ${modelName}`;

  return (
    <div
      role="img"
      aria-label={accessibleName}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-[inherit]",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${color}1a, ${color}40)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${color}33, transparent 60%)`,
        }}
      />
      {illustration ? (
        // Transparent PNG cutout, so the brand-tinted gradient above still
        // shows through and cards keep their per-OEM variety. `alt=""` because
        // the wrapper's role="img" + aria-label already name this region;
        // labelling both would read the vehicle out twice.
        <Image
          src={illustration.path}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="relative z-10 object-contain p-[6%]"
        />
      ) : (
        <Icon className="relative z-10 h-1/3 w-1/3 min-h-8 min-w-8" style={{ color }} />
      )}
      {showLabel ? (
        <span
          className="relative z-10 mt-2 px-2 text-center text-sm font-heading font-medium"
          style={{ color }}
        >
          {oemName} {modelName}
        </span>
      ) : null}
    </div>
  );
}
