"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/context/LocationContext";
import { LocationSelector } from "@/components/layout/LocationSelector";
import { getVehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { buildCompareSlug, MAX_COMPARE } from "@/lib/compare/slug";
import { slotColor } from "@/lib/compare/showroom/palette";
import { defaultOwnershipSettings, type OwnershipSettings } from "@/lib/compare/showroom/ownership";
import type { ShowroomVehicle } from "@/lib/compare/showroom/metrics";
import type { PickerCandidate, PopularComparison } from "@/lib/compare/showroom/page-data";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { cn } from "@/lib/utils";
import { showroomDisplay, showroomText } from "./fonts";
import { ShowroomProvider, type ShowroomState } from "./ShowroomContext";
import { TEXT, WRAP } from "./ui";
import { ShowroomHero } from "./ShowroomHero";
import { StickyDock } from "./StickyDock";
import { KeyDifferences } from "./KeyDifferences";
import { AtAGlance } from "./AtAGlance";
import { VerdictSection } from "./VerdictSection";
import { OwnershipInsights } from "./OwnershipInsights";
import { CostSection } from "./CostSection";
import { SizeSection } from "./SizeSection";
import { SpecsSection } from "./SpecsSection";
import { ProsConsSection } from "./ProsConsSection";
import { GoDeeperSection } from "./GoDeeperSection";
import { OffersSection } from "./OffersSection";
import { PopularSection } from "./PopularSection";
import { FaqSection } from "./FaqSection";
import { CompareTray } from "./CompareTray";
import { VehiclePickerDialog } from "./VehiclePickerDialog";
import { Toast } from "./Toast";
import { AdSlot } from "@/components/common/AdSlot";

const NOUN: Record<VehicleDetail["category"], string> = {
  car: "electric cars",
  "2-wheeler": "electric two-wheelers",
  commercial: "commercial EVs",
};

export interface CompareShowroomProps {
  vehicles: VehicleDetail[];
  candidates: PickerCandidate[];
  popular: PopularComparison[];
}

/**
 * The showroom Compare page — the approved Compare design, on the site's
 * stack and data. Server-rendered from the slug; changing, adding or removing
 * a vehicle navigates to that comparison's canonical URL, so every state of
 * the page is a shareable, indexable address.
 */
export function CompareShowroom({ vehicles, candidates, popular }: CompareShowroomProps) {
  const router = useRouter();
  const { city } = useLocation();
  const category = vehicles[0].category;

  const [settings, setSettingsState] = useState<OwnershipSettings>(() => defaultOwnershipSettings(category));
  const [picker, setPicker] = useState<{ open: boolean; slot: number | null }>({ open: false, slot: null });
  const [cityOpen, setCityOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; id: number } | null>(null);
  const toastId = useRef(0);

  const pricing = useMemo(
    () =>
      vehicles.map((v) =>
        getVehiclePricingSnapshot({ vehicleId: v.id, vehicleName: v.name, exShowroomRangeLakh: v.priceRangeLakh, city }),
      ),
    [vehicles, city],
  );

  const showroomVehicles = useMemo<ShowroomVehicle[]>(
    () => vehicles.map((detail, index) => ({ detail, index, color: slotColor(index), onRoad: pricing[index].breakdown.low.onRoad })),
    [vehicles, pricing],
  );

  const toast = useCallback((text: string) => {
    toastId.current += 1;
    setToastMsg({ text, id: toastId.current });
  }, []);

  const go = useCallback(
    (slugs: string[]) => {
      router.push(`/compare/${buildCompareSlug(slugs.map((slug) => ({ slug })))}`, { scroll: false });
    },
    [router],
  );

  const openPicker = useCallback(
    (slot?: number) => {
      if (slot === undefined && vehicles.length >= MAX_COMPARE) {
        toast(`You can compare up to ${MAX_COMPARE} — remove one first.`);
        return;
      }
      setPicker({ open: true, slot: slot ?? null });
    },
    [vehicles.length, toast],
  );

  const removeVehicle = useCallback(
    (slot: number) => {
      if (vehicles.length <= 2) return;
      toast(`${vehicles[slot].name} removed from the comparison.`);
      go(vehicles.filter((_, i) => i !== slot).map((v) => v.slug));
    },
    [vehicles, go, toast],
  );

  const pick = useCallback(
    (candidate: PickerCandidate) => {
      const slugs = vehicles.map((v) => v.slug);
      if (picker.slot !== null) slugs[picker.slot] = candidate.slug;
      else slugs.push(candidate.slug);
      setPicker({ open: false, slot: null });
      toast(picker.slot !== null ? `${candidate.name} swapped in.` : `${candidate.name} added — comparing ${slugs.length}.`);
      go(slugs);
    },
    [vehicles, picker.slot, go, toast],
  );

  const state: ShowroomState = {
    vehicles: showroomVehicles,
    pricing,
    category,
    city,
    settings,
    setSettings: (next) => setSettingsState((prev) => ({ ...prev, ...next })),
    openPicker,
    removeVehicle,
    openCityPicker: () => setCityOpen(true),
    toast,
    cityLabel: city.state && city.state !== city.name ? `${city.name}, ${city.state}` : city.name,
    noun: NOUN[category],
  };

  return (
    <ShowroomProvider value={state}>
      <div
        className={cn(
          showroomDisplay.variable,
          showroomText.variable,
          TEXT,
          "bg-surface text-base leading-normal text-ink antialiased",
        )}
      >
        <ShowroomHero />
        <StickyDock />
        <div className={WRAP}>
          <KeyDifferences />
          <AtAGlance />
          <VerdictSection />
          <OwnershipInsights />
          <CostSection />
          <div className="mt-[72px] flex justify-center md:mt-[88px]">
            <AdSlot size="leaderboard" className="hidden md:flex" />
            <AdSlot size="rectangle" className="md:hidden" />
          </div>
          <SizeSection />
          <SpecsSection />
          <ProsConsSection />
          <GoDeeperSection />
          <OffersSection />
          <PopularSection popular={popular} />
          <FaqSection />
        </div>
        <div className="h-28" aria-hidden="true" />
        <CompareTray />
        <VehiclePickerDialog
          open={picker.open}
          onOpenChange={(open) => setPicker((p) => ({ ...p, open }))}
          replacing={picker.slot !== null ? vehicles[picker.slot] : null}
          count={vehicles.length}
          candidates={candidates.filter((c) => !vehicles.some((v) => v.slug === c.slug))}
          onPick={pick}
        />
        <LocationSelector open={cityOpen} onOpenChange={setCityOpen} />
        <Toast message={toastMsg} />
      </div>
    </ShowroomProvider>
  );
}
