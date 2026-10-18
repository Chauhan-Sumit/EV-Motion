import { Archivo, Geist } from "next/font/google";

/**
 * The showroom Compare page's typography — Archivo for display numerals and
 * headlines (its width axis gives the condensed showroom headline), Geist for
 * text. Scoped to this page by applying the variables on its root element
 * only: the site-wide Inter system in `layout.tsx` / `globals.css` is
 * untouched, and no other route downloads these files.
 */
export const showroomDisplay = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-showroom-display",
  display: "swap",
});

export const showroomText = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-showroom-text",
  display: "swap",
});
