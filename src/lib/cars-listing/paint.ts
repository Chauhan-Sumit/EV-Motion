/**
 * Paint colours for the listing's side-view car drawings and colour swatches,
 * ported from the approved Electric Cars design.
 *
 * The catalogue records colour *names* ("Intensi-Teal", "Daytona Grey"), not
 * colour values. These rules map a name to a representative swatch by its
 * keyword, so a card can hint at the palette on offer. They are illustration,
 * not a paint specification: two different "blue"s render the same blue, and
 * an unrecognised name falls back to neutral grey. Data-free, client-safe.
 */

const NAME_RULES: readonly [RegExp, string][] = [
  [/teal/, "#1C7C82"],
  [/mint/, "#6FB9A5"],
  [/olive|forest|sage|green/, "#2F6B4F"],
  [/yellow|solar/, "#E0B422"],
  [/orange|copper|fireglow|oxide|rapids/, "#C8642A"],
  [/gold|beige|sand|dune|crayon/, "#B49A6A"],
  [/plum|purple|tanzanite|nocturne/, "#4A3A6E"],
  [/blue|ocean|tarini|fjord|yacht|aqua|sodalite|portimao|neptune|phytonic|surf|nebula|island|imperial|arctic blue/, "#2F5FB3"],
  [/red|rouge|carmine|flame|crimson|runway|pulse|glaze|chilli|parkour/, "#B3262E"],
  [/black|obsidian|sapphire|abyss|onyx|midnight|carbon|cosmos|jet|stellar|starry/, "#1F2227"],
  [/white|blanc|ivory|pearl|snow|alpine|crystal|glacier|nanuq|lustre|opalite|clouds/, "#E6E8EB"],
  [/grey|gray|silver|graphite|pewter|slate|concrete|frozen|andes|boulder|kaimu|boreal|sophisto|dawn|vapor|tempest|jubilee|harbour|shark|atlantis|zenith|stealth|daytona|mist|manhattan|skyscraper|brooklyn|matt/, "#8A9099"],
];

const NEUTRAL = "#8A9099";
/** Swatches that read as "no colour" — they get a neutral glow instead of a tinted one. */
const NEUTRALS = new Set(["#1F2227", "#E6E8EB", NEUTRAL]);

export type Paint = readonly [highlight: string, mid: string, shadow: string];

export function swatchFor(colorName: string | undefined): string {
  const n = (colorName ?? "").toLowerCase();
  for (const [re, hex] of NAME_RULES) if (re.test(n)) return hex;
  return NEUTRAL;
}

function mix(hex: string, to: string, t: number): string {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const r = Math.round((a >> 16) * (1 - t) + (b >> 16) * t);
  const g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
  const bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

export function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** Body paint gradient (highlight, mid, shadow) from one swatch. */
export function paintFrom(hex: string): Paint {
  return [mix(hex, "#FFFFFF", 0.38), hex, mix(hex, "#000000", 0.55)];
}

/** Paint for a car drawn in its first listed colour. */
export function paintForColors(colors: readonly string[]): Paint {
  return paintFrom(swatchFor(colors[0]));
}

/** Soft floor glow behind a car on a card, tinted by its first colour. */
export function tintForColors(colors: readonly string[]): string {
  const hex = swatchFor(colors[0]);
  return NEUTRALS.has(hex) ? "rgba(120,130,145,.10)" : rgba(hex, 0.16);
}

/** The hero's showroom-white Nexon. */
export const HERO_PAINT: Paint = ["#FFFFFF", "#E9EBEE", "#7C8088"];
