import { Bell, CalendarClock } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";
import type { UpcomingItemData } from "@/types/ev-motion";

export function UpcomingCard({ item }: { item: UpcomingItemData }) {
  return (
    <article
      data-carousel-item
      className="relative flex h-full flex-col overflow-hidden rounded-xl bg-surface-dark transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] shrink-0">
        <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-primary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
          Coming Soon
        </span>
        <VehicleImage vehicle={item.vehicle} color={item.oemColor} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw" className="h-full w-full p-4 opacity-95" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-dark to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-[10px] text-white/60">{item.brand}</p>
          <p className="text-[13px] font-bold text-white">{item.name}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="flex items-center gap-1 text-[10.5px] text-white/60">
          <CalendarClock size={11} className="text-primary-bright" />
          {item.launchLabel}
        </p>
        <p className="text-[13px] font-extrabold text-primary-bright">{item.expectedPriceLabel}</p>
        <div className="mt-auto pt-1">
          <LeadCaptureDialog
            triggerIcon={<Bell size={12} />}
            triggerLabel="Notify Me"
            triggerClassName="focus-ring flex w-full items-center justify-center gap-1.5 rounded-md bg-white/10 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-primary-bright hover:text-surface-dark"
            dialogTitle="Get notified at launch"
            dialogDescription={`We'll email you the moment the ${item.name} launches.`}
            fields={[
              { key: "email", label: "Email address", type: "email", placeholder: "you@example.com", validation: "email" },
            ]}
            submitLabel="Notify Me"
            successTitle="You're on the list"
            successDescription={`We'll email you as soon as the ${item.name} launches.`}
          />
        </div>
      </div>
    </article>
  );
}
