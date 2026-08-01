import type { VehicleDetail } from "@/types/vehicle-detail";
import { SidebarPriceSummary } from "./SidebarPriceSummary";
import { SidebarEmiCalculator } from "./SidebarEmiCalculator";
import { SidebarRealWorldRange } from "./SidebarRealWorldRange";
import { AdSlot } from "@/components/common/AdSlot";

/**
 * Scrolls normally with the page (not sticky/pinned) — the first ad slot
 * used to sit beside the Overview section as an "aside" but was moved in so
 * Overview could stretch to full width.
 */
export function VehicleSidebar({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <aside aria-label="Price and financing" className="flex flex-col gap-3.5">
      <AdSlot size="rectangle" />
      <SidebarPriceSummary vehicle={vehicle} />
      <SidebarEmiCalculator vehicle={vehicle} />
      <AdSlot size="rectangle" />
      <SidebarRealWorldRange vehicle={vehicle} />
      <AdSlot size="sticky" className="hidden lg:flex" />
    </aside>
  );
}
