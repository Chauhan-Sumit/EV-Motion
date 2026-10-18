"use client";

import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";

/**
 * "Report an error" — a real report, sent through the site's one lead path
 * (`POST /api/leads`, kind `enquiry`), so it lands where every other enquiry
 * does and says honestly when no backend is configured.
 */
export function ReportErrorButton({ className, label = "Report an error" }: { className: string; label?: string }) {
  return (
    <LeadCaptureDialog
      kind="enquiry"
      triggerLabel={label}
      triggerClassName={className}
      dialogTitle="Report a wrong number"
      dialogDescription="Tell us which figure looks wrong and where you saw the right one. Our data desk re-checks it against the manufacturer."
      fields={[
        { key: "message", label: "What looks wrong?", type: "text", placeholder: "e.g. Nexon EV boot space is 350 L, not …", validation: "required" },
        { key: "email", label: "Email (optional)", type: "email", placeholder: "So we can tell you when it's fixed", validation: "optional" },
      ]}
      submitLabel="Send report"
      successTitle="Thanks — report received"
      successDescription="Our data desk will re-check this comparison."
    />
  );
}
