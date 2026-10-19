import { cn } from "@/lib/utils";

/**
 * Shared class strings for the Electric Cars listing.
 *
 * Colours are the EV Motion tokens wherever one exists — `primary` (brand
 * green), `primary-hover` (the darker green the design uses for text and
 * filled buttons), `primary-tint`, `ink`, `ink-secondary`, `ink-muted`,
 * `border`, `surface`, `surface-secondary`. The few greys with no token (the
 * slider track, unchecked control borders) are the approved design's own.
 */

export const TEXT = "font-[family-name:var(--font-cars-listing)]";
export const WRAP = "mx-auto w-full max-w-[1320px] px-4 min-[761px]:px-8";

/** Deepest brand green — hover state of filled brand buttons and selected-state text. */
export const BRAND_DEEP = "#0B6629";
/** Slider tracks and empty histogram bars. */
export const TRACK = "#E9ECF0";

const BTN =
  "inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-[18px] text-[14.5px] font-semibold transition-[background-color,transform,border-color,box-shadow,color] duration-200 hover:no-underline active:scale-[.98] focus-ring";

export const btn = {
  brand: cn(BTN, "bg-primary-hover text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_6px_14px_-6px_rgba(21,122,44,.55)] hover:bg-[#0B6629]"),
  line: cn(BTN, "border-[1.5px] border-primary-hover bg-surface text-primary-hover hover:bg-primary-tint"),
  ghost: cn(BTN, "border border-border bg-surface text-ink hover:border-[#C3C8CF]"),
  sm: "h-[38px] rounded-[10px] px-3.5 text-[13.5px]",
};

/** Pill toggle — price presets and seat counts. Pair with `aria-pressed`. */
export const PILL =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-[13px] text-ink-secondary transition-colors hover:border-[#B9BFC7] hover:text-ink aria-pressed:border-primary aria-pressed:bg-primary-tint aria-pressed:font-semibold aria-pressed:text-[#0B6629] focus-ring";

/** Range-input thumb, shared by the dual price slider and the range slider. */
export const THUMB =
  "[&::-webkit-slider-thumb]:size-[22px] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(16,24,40,.3)] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-[0_1px_4px_rgba(16,24,40,.3)]";

export const SHADOW_1 = "shadow-[0_1px_2px_rgba(16,24,40,.04),0_1px_3px_rgba(16,24,40,.06)]";
export const SHADOW_2 = "shadow-[0_12px_32px_-8px_rgba(16,24,40,.12),0_4px_10px_-4px_rgba(16,24,40,.06)]";
export const SHADOW_3 = "shadow-[0_24px_60px_-16px_rgba(16,24,40,.22)]";
