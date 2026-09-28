/**
 * Normalises what `@base-ui/react`'s Slider hands back to a single number.
 *
 * **The bug this exists to prevent.** The installed Base UI (`^1.6.0`) emits
 * `onValueChange` with a **scalar** when the user presses the slider TRACK,
 * but with an **array** when they drag the thumb or use the arrow keys. The
 * obvious idiom for a single-thumb slider — `(v as number[])[0]` — therefore
 * returns `undefined` on the track-press path, which propagates into state and
 * renders as a blank number or `NaN`.
 *
 * It is invisible to `tsc`: `components/ui/slider.tsx` types its props as
 * `SliderPrimitive.Root.Props`, which widens Base UI's `Value` generic, so the
 * cast type-checks. It is invisible to the keyboard, which is the path anyone
 * testing by hand tends to reach for. It was found by clicking the track of
 * `/cars`'s "Minimum Range" filter, which moved the slider to 450 while the
 * label rendered "Minimum Range:  km".
 *
 * Handling both shapes keeps this correct whichever way a future Base UI
 * version settles on.
 *
 * Two-thumb range sliders are unaffected — they genuinely do receive an array,
 * and `v as [number, number]` is right for them.
 */
export function singleSliderValue(value: unknown, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : fallback;
}
