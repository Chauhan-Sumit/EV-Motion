"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type LeadCaptureValidation = "required" | "mobile" | "email";

export interface LeadCaptureField {
  key: string;
  label: string;
  type: "text" | "tel" | "email";
  placeholder: string;
  /**
   * A serializable validation *kind*, not a function. Several of this
   * dialog's callers (AdvertiseSection, UpcomingCard, SponsoredBanner) are
   * Server Components — functions can't cross the server/client boundary as
   * props, so the actual validator logic lives here, inside the client
   * module, and callers just name which rule they want.
   */
  validation: LeadCaptureValidation;
}

const VALIDATORS: Record<LeadCaptureValidation, (field: LeadCaptureField, value: string) => string | null> = {
  required: (field, value) => (value.trim() ? null : `Please enter your ${field.label.toLowerCase()}.`),
  mobile: (_field, value) => (/^[6-9]\d{9}$/.test(value.trim()) ? null : "Please enter a valid 10-digit mobile number."),
  email: (_field, value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : "Please enter a valid email address.",
};

interface LeadCaptureDialogProps {
  triggerLabel: string;
  triggerIcon?: ReactNode;
  triggerClassName: string;
  dialogTitle: string;
  dialogDescription: string;
  fields: LeadCaptureField[];
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  footerNote?: string;
}

/**
 * Shared engine behind every lead-capture CTA on the site (Get Best Price,
 * Book Test Drive, Notify Me, Advertiser Kit, ...). This app has no backend,
 * so every instance is honestly labeled as a demo capture rather than
 * pretending to submit somewhere real — but the interaction itself (field
 * validation, success state) is genuine, not a decorative dead button.
 */
export function LeadCaptureDialog({
  triggerLabel,
  triggerIcon,
  triggerClassName,
  dialogTitle,
  dialogDescription,
  fields,
  submitLabel,
  successTitle,
  successDescription,
  footerNote = "Demo form — no data is sent anywhere; this is a labeled placeholder for a real integration.",
}: LeadCaptureDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const idPrefix = useId();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setValues({});
      setError(null);
      setSubmitted(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    for (const field of fields) {
      const message = VALIDATORS[field.validation](field, values[field.key] ?? "");
      if (message) {
        setError(message);
        return;
      }
    }
    setError(null);
    setSubmitted(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<button type="button" className={triggerClassName} />}>
        {triggerIcon}
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="border border-border bg-surface text-ink sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center gap-2.5 py-4 text-center">
            <CheckCircle2 size={32} className="text-primary" />
            <p className="text-sm font-bold text-ink">{successTitle}</p>
            <p className="text-[12.5px] text-ink-secondary">{successDescription}</p>
            <DialogClose
              render={
                <button
                  type="button"
                  className="focus-ring mt-1.5 rounded-md border border-border-strong px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                />
              }
            >
              Done
            </DialogClose>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-sans text-base font-bold text-ink">{dialogTitle}</DialogTitle>
              <DialogDescription className="text-[12.5px] text-ink-secondary">{dialogDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
              {fields.map((field) => {
                const inputId = `${idPrefix}-${field.key}`;
                return (
                  <div key={field.key}>
                    <label
                      htmlFor={inputId}
                      className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.5px] text-ink-muted"
                    >
                      {field.label}
                    </label>
                    <input
                      id={inputId}
                      type={field.type}
                      inputMode={field.type === "tel" ? "numeric" : undefined}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="focus-ring w-full rounded-md border border-border-strong bg-white px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-muted"
                    />
                  </div>
                );
              })}
              {error ? <p className="text-[11.5px] font-semibold text-error">{error}</p> : null}
              <button
                type="submit"
                className="focus-ring mt-1 rounded-md bg-primary py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                {submitLabel}
              </button>
              <p className="text-center text-[10.5px] text-ink-muted">{footerNote}</p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
