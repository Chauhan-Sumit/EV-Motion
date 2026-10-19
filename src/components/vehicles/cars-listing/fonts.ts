import { Geist } from "next/font/google";

/**
 * The Electric Cars listing's typography — Geist, as in the approved design.
 * Applied as a variable on the page's root element only, so the site-wide
 * Inter system in `layout.tsx` / `globals.css` is untouched and no other
 * route downloads the file.
 */
export const listingText = Geist({
  subsets: ["latin"],
  variable: "--font-cars-listing",
  display: "swap",
});
