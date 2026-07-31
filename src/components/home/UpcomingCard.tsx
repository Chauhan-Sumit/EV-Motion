import { Bell, CalendarClock } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";
import type { UpcomingItemData } from "@/types/ev-motion";

export function UpcomingCard({ item }: { item: UpcomingItemData }) {
  return (
    <article className="overflow-hidden rounded-[10px] border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover">
      <div className="relative h-40 border-b border-border bg-white">
        <span className="absolute left-2 top-2 z-10 rounded-[3px] bg-ink px-[7px] py-0.5 text-[9px] font-bold uppercase text-white">
          Coming Soon
        </span>
        <VehicleImage vehicle={item.vehicle} color={item.oemColor} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw" className="h-full w-full" />
      </div>
      <div className="p-[11px]">
        <p className="mb-px text-[9px] font-semibold uppercase tracking-[0.7px] text-ink-muted">{item.brand}</p>
        <p className="mb-[5px] text-[13px] font-bold text-ink">{item.name}</p>
        <p className="mb-1.5 flex items-center gap-1 text-[10px] text-ink-muted">
          <CalendarClock size={11} className="text-primary" />
          {item.launchLabel}
        </p>
        <p className="mb-2.5 text-sm font-extrabold text-primary">{item.expectedPriceLabel}</p>
        <LeadCaptureDialog
          triggerIcon={<Bell size={12} />}
          triggerLabel="Notify Me"
          triggerClassName="focus-ring flex w-full items-center justify-center gap-1.5 rounded-md border-[1.5px] border-primary py-2 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
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
    </article>
  );
}
