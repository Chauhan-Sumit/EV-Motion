"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";
import type { AnalyticsEventName } from "@/lib/analytics/types";

/**
 * Fires one analytics event when a page mounts.
 *
 * A tiny client leaf taking plain serializable props, following the same
 * pattern as `VehiclePriceText` — so a Server Component page can record a
 * view without becoming a Client Component itself, and without any of its
 * data crossing the RSC boundary.
 *
 * The dependency array is the primitive props rather than an object, so a
 * client-side navigation between two vehicles re-fires (new slug) while a
 * re-render of the same page does not.
 */
export function TrackPageView({
  event,
  slug,
  category,
}: {
  event: Extract<AnalyticsEventName, "vehicle_view" | "compare_view">;
  slug: string;
  category?: string;
}) {
  useEffect(() => {
    track(event, { slug, category: category ?? null });
  }, [event, slug, category]);

  return null;
}
