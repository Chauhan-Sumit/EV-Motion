import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** ₹ price threshold, in lakh, above which display switches to crore notation. */
const CRORE_THRESHOLD_LAKH = 100;

/** Single-value ₹ price, in lakh — switches to crore notation at/above ₹100L (e.g. "₹9.50Cr" instead of "₹950.00L"). */
export function formatPriceLakh(lakh: number): string {
  if (lakh >= CRORE_THRESHOLD_LAKH) return `₹${(lakh / 100).toFixed(2)}Cr`;
  return `₹${lakh.toFixed(2)}L`;
}

/** ₹ price range, in lakh — switches both bounds to crore notation together if either bound is at/above ₹100L, so a range never mixes units. */
export function formatPriceRangeLakh(lowLakh: number, highLakh: number, separator = " - "): string {
  if (lowLakh >= CRORE_THRESHOLD_LAKH || highLakh >= CRORE_THRESHOLD_LAKH) {
    return `₹${(lowLakh / 100).toFixed(2)}${separator}${(highLakh / 100).toFixed(2)}Cr`;
  }
  return `₹${lowLakh.toFixed(2)}${separator}${highLakh.toFixed(2)}L`;
}
