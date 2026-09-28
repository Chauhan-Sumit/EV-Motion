import type { VehicleDetail } from "@/types/vehicle-detail";
import { getSimilarVehicleDetails } from "@/lib/data/ev-motion/toVehicleDetail";
import { buildVdpViewModel } from "@/lib/vehicle-detail/buildVdpViewModel";
import { TrackPageView } from "@/components/common/TrackPageView";
import { VdpLayout } from "./vdp/VdpLayout";

/**
 * The single reusable Vehicle Detail Page template — cars, scooters,
 * motorcycles and commercial EVs all render through this one tree. Nothing
 * below is specific to a category or a model: the whole page is driven by the
 * view model that `buildVdpViewModel()` produces, so a different vehicle is a
 * different argument, never a different component.
 *
 * This is a Server Component on purpose. It resolves the similar-vehicle set
 * through `@/lib/data` — which must never be reachable from a client component
 * (CLAUDE.md #23, ~110-130 KB of catalogue per page) — and hands `VdpLayout`
 * a plain serializable object. `VdpLayout` owns all the interactive state.
 *
 * Navbar and Footer come from the root layout, not from here.
 *
 * Section order (mirrored 1:1 by the sticky nav, see `chrome.ts`):
 *   Images (hero) → Overview → Variants → Battery & Charging →
 *   Real World Range → Ownership Tools → Specifications → Compare →
 *   Features → Videos → Reviews → FAQs → Similar → Latest News
 */
export function VehicleDetailTemplate({ vehicle }: { vehicle: VehicleDetail }) {
  const similar = getSimilarVehicleDetails(vehicle);
  const viewModel = buildVdpViewModel(vehicle, similar);

  return (
    <>
      <TrackPageView event="vehicle_view" slug={vehicle.slug} category={vehicle.category} />
      <VdpLayout vehicle={viewModel} />
    </>
  );
}
