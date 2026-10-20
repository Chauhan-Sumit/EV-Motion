"use client";

import type { BrandPageData } from "@/lib/brand-page/types";
import { CarBrandPage } from "./CarBrandPage";
import { BikeBrandPage } from "./BikeBrandPage";

/**
 * A brand page — the approved design on the site's stack and data: a compact
 * hero with the brand's line-up drawn in a studio, then every model the brand
 * sells as a compact tile, with sorting and compare. One template for every
 * brand; what differs is what the brand sells, which picks the listing whose
 * data, figures, drawings and compare tray the page uses.
 */
export function BrandPage({ data }: { data: BrandPageData }) {
  return data.kind === "car" ? <CarBrandPage brand={data.brand} market={data.market} /> : <BikeBrandPage brand={data.brand} market={data.market} />;
}
