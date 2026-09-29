import { describe, expect, it } from "vitest";
import { singleSliderValue } from "./slider-value";

/**
 * Guards the Base UI slider bug documented in `slider-value.ts`: the library
 * emits a scalar on track-press and an array on keyboard/drag, and the
 * array-indexing idiom silently produced `undefined` on the first path.
 *
 * Mutation check: replacing the body with `(value as number[])[0]` fails the
 * scalar cases, and dropping the `Number.isFinite` guard fails the NaN case.
 */
describe("singleSliderValue", () => {
  it("reads a scalar, the shape Base UI emits on track-press", () => {
    expect(singleSliderValue(450, 0)).toBe(450);
    expect(singleSliderValue(0, 99)).toBe(0);
  });

  it("reads the first entry of an array, the shape it emits on keyboard and drag", () => {
    expect(singleSliderValue([30], 0)).toBe(30);
    expect(singleSliderValue([0], 99)).toBe(0);
  });

  it("falls back rather than leaking undefined into the arithmetic", () => {
    // The original bug: `(v as number[])[0]` on a scalar yields undefined,
    // which reaches the UI as a blank number and any sum of it as NaN.
    expect(singleSliderValue(undefined, 40)).toBe(40);
    expect(singleSliderValue([], 40)).toBe(40);
    expect(singleSliderValue(null, 40)).toBe(40);
  });

  it("falls back on non-finite values", () => {
    expect(singleSliderValue(Number.NaN, 40)).toBe(40);
    expect(singleSliderValue(Number.POSITIVE_INFINITY, 40)).toBe(40);
  });

  it("falls back on values that are not numbers", () => {
    expect(singleSliderValue("450", 40)).toBe(40);
    expect(singleSliderValue(["450"], 40)).toBe(40);
    expect(singleSliderValue({ value: 450 }, 40)).toBe(40);
  });

  it("keeps negative and fractional values, which are legitimate slider steps", () => {
    expect(singleSliderValue(-10, 0)).toBe(-10);
    expect(singleSliderValue([2.5], 0)).toBe(2.5);
  });
});
