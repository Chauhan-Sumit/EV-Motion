/**
 * Per-slot identity colours for the showroom Compare page.
 *
 * The EV Motion palette has one brand colour, and a comparison needs up to
 * four colours that can sit side by side in a bar, a legend dot and an
 * outline without one reading as "the winner". These are those four, taken
 * from the approved Compare design. They identify a *slot*, never a brand —
 * the first car is always blue, whatever it is — so they are page-local
 * rather than additions to the global `@theme` tokens. Winning is still
 * signalled with the brand green (`--primary`), never with a slot colour.
 */
export interface SlotColor {
  /** Solid colour: dots, bars, outlines. */
  base: string;
  /** Darker shade for text and dimension lines on white. */
  deep: string;
  /** Lighter shade for text on the dark showroom surface. */
  glow: string;
  /** Soft radial glow behind a car on the dark surface. */
  halo: string;
  /** Darker segment of a stacked bar (5-year charging cost). */
  shade: string;
  /** Body paint for the car drawing: highlight, mid, shadow. */
  paint: readonly [string, string, string];
}

export const SLOT_COLORS: readonly SlotColor[] = [
  { base: "#3D6BFF", deep: "#2748C9", glow: "#86A2FF", halo: "rgba(61,107,255,.42)", shade: "#2338A0", paint: ["#9DB3FF", "#4468F0", "#1B2C8C"] },
  { base: "#F26B1D", deep: "#A8420A", glow: "#FFA06A", halo: "rgba(242,107,29,.38)", shade: "#9A3D08", paint: ["#FFC49E", "#F27024", "#8A3406"] },
  { base: "#8B5CF6", deep: "#6D3FD6", glow: "#B79BFF", halo: "rgba(139,92,246,.42)", shade: "#4C2A9E", paint: ["#D3BDFF", "#8B5CF6", "#3F1D96"] },
  { base: "#13A4B8", deep: "#0B7383", glow: "#5FD8E8", halo: "rgba(19,164,184,.40)", shade: "#0A5E6B", paint: ["#9FE8F2", "#18AFC4", "#0B5664"] },
];

export function slotColor(index: number): SlotColor {
  return SLOT_COLORS[index % SLOT_COLORS.length];
}

/** Neutral paint for thumbnails that are not yet in the comparison. */
export const NEUTRAL_PAINT = ["#D9DDE3", "#8E959F", "#3B4048"] as const;
