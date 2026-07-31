"use client";

import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";

export function GetBestPriceDialog({ vehicleName }: { vehicleName: string }) {
  return (
    <LeadCaptureDialog
      triggerLabel="Get Best Price"
      triggerClassName="focus-ring rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
      dialogTitle="Get the best price"
      dialogDescription={`Share your details and a verified ${vehicleName} dealer will get in touch with a quote.`}
      fields={[
        { key: "name", label: "Your name", type: "text", placeholder: "Full name", validation: "required" },
        { key: "mobile", label: "Mobile number", type: "tel", placeholder: "10-digit mobile number", validation: "mobile" },
      ]}
      submitLabel="Request Best Price"
      successTitle="Request received"
      successDescription={`A verified dealer will contact you about the ${vehicleName} shortly.`}
    />
  );
}
