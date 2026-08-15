import { Megaphone } from "lucide-react";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";

export function SidebarAdSlot() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-dark p-4 text-white">
      <span className="text-[9px] font-medium uppercase tracking-wide text-white/50">Advertisement</span>
      <div className="mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
        <Megaphone size={26} className="text-primary-bright" />
      </div>
      <h4 className="mt-3 text-[15px] font-bold text-white">Your Brand Here</h4>
      <p className="mt-1 text-[11px] text-white/60">Drive results with EV enthusiasts</p>
      <LeadCaptureDialog
        triggerLabel="Advertise Now"
        triggerClassName="focus-ring mt-3.5 w-full rounded-lg bg-primary-bright px-3.5 py-2 text-[11.5px] font-semibold text-surface-dark transition-colors hover:brightness-95"
        dialogTitle="Advertise on EV Motion"
        dialogDescription="Tell us where to send pricing, audience data, and creative specs for advertising on EV Motion."
        fields={[
          { key: "name", label: "Your name", type: "text", placeholder: "Full name", validation: "required" },
          { key: "company", label: "Company", type: "text", placeholder: "Dealership or brand name", validation: "required" },
          { key: "email", label: "Work email", type: "email", placeholder: "you@company.com", validation: "email" },
        ]}
        submitLabel="Send Me the Kit"
        successTitle="Kit on its way"
        successDescription="Our advertising team will email the media kit and pricing shortly."
      />
    </div>
  );
}
