import { Bell } from "lucide-react";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";

export function UpcomingNotifyBanner() {
  return (
    <div className="mt-3.5 flex flex-col items-center justify-between gap-3 rounded-xl bg-primary-tint px-5 py-4 text-center sm:flex-row sm:text-left">
      <div>
        <p className="text-[13.5px] font-bold text-ink">Never miss a launch</p>
        <p className="text-[11.5px] text-ink-secondary">Get notified the moment a new EV launches in India.</p>
      </div>
      <LeadCaptureDialog
        triggerIcon={<Bell size={13} />}
        triggerLabel="Notify Me About New Launches"
        triggerClassName="focus-ring flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-hover"
        dialogTitle="Get notified about new launches"
        dialogDescription="We'll email you whenever a new electric car, scooter or bike launches in India."
        fields={[
          { key: "email", label: "Email address", type: "email", placeholder: "you@example.com", validation: "email" },
        ]}
        submitLabel="Notify Me"
        successTitle="You're on the list"
        successDescription="We'll email you the moment a new EV launches."
      />
    </div>
  );
}
