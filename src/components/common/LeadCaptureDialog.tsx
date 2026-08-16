"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from "@/context/LocationContext";
import { validateField, type FieldValidation } from "@/lib/leads/validation";
import { track } from "@/lib/analytics/track";
import type { LeadFieldKey, LeadKind, LeadOutcome, LeadSubmission } from "@/lib/leads/types";

export type LeadCaptureValidation = FieldValidation;

export interface LeadCaptureField {
  key: LeadFieldKey;
  label: string;
  type: "text" | "tel" | "email";
  placeholder: string;
  /**
   * A serializable validation *kind*, not a function. Several of this
   * dialog's callers (AdvertiseSection, UpcomingCard, SidebarAdSlot) are
   * Server Components — functions can't cross the server/client boundary as
   * props, so callers just name which rule they want. The rule itself lives
   * in `@/lib/leads/validation`, shared with the API route so the browser
   * and the server can't disagree about what's valid.
   */
  validation: LeadCaptureValidation;
}

interface LeadCaptureDialogProps {
  /** Which CTA this is — stored with the lead so enquiries can be routed. */
  kind: LeadKind;
  triggerLabel: string;
  triggerIcon?: ReactNode;
  triggerClassName: string;
  dialogTitle: string;
  dialogDescription: string;
  fields: LeadCaptureField[];
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  /** Vehicle this enquiry is about, when raised from a vehicle surface. */
  vehicleSlug?: string;
  footerNote?: string;
}

const DEMO_NOTE = "Demo form — no storage backend is configured, so nothing is sent or saved.";

/**
 * Shared engine behind every lead-capture CTA on the site (Get Best Price,
 * Book Test Drive, Notify Me, Advertiser Kit, ...).
 *
 * Submits to `POST /api/leads`, which validates independently and stores the
 * lead when a backend is configured. When one isn't, the endpoint says so and
 * this dialog says so too — it shows the demo note and never renders a
 * confirmation it can't back up. Someone handing over their phone number is
 * owed an accurate answer about where it went.
 */
export function LeadCaptureDialog({
  kind,
  triggerLabel,
  triggerIcon,
  triggerClassName,
  dialogTitle,
  dialogDescription,
  fields,
  submitLabel,
  successTitle,
  successDescription,
  vehicleSlug,
  footerNote,
}: LeadCaptureDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<"stored" | "not-configured" | null>(null);
  const [backendConfigured, setBackendConfigured] = useState<boolean | null>(null);
  const idPrefix = useId();
  const pathname = usePathname();
  const { city } = useLocation();

  useEffect(() => {
    // Asked once the dialog is first opened, so the footer can tell the truth
    // about whether this form goes anywhere before anything is typed.
    if (!open || backendConfigured !== null) return;
    let cancelled = false;
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => {
        if (!cancelled) setBackendConfigured(Boolean(data.configured));
      })
      .catch(() => {
        if (!cancelled) setBackendConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, backendConfigured]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setValues({});
      setHoneypot("");
      setError(null);
      setSubmitting(false);
      setOutcome(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    for (const field of fields) {
      const message = validateField(field.validation, field.label, values[field.key] ?? "");
      if (message) {
        setError(message);
        return;
      }
    }

    setError(null);
    setSubmitting(true);

    const submission: LeadSubmission = {
      kind,
      fields: Object.fromEntries(fields.map((f) => [f.key, values[f.key] ?? ""])) as LeadSubmission["fields"],
      context: { vehicleSlug, city: city.name, path: pathname ?? undefined },
      website: honeypot,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const result = (await response.json()) as LeadOutcome;

      if (result.status === "stored") {
        setOutcome("stored");
        // Which CTA converted and for which vehicle — never the contact
        // details the person just typed. Those live only in public.leads.
        track("lead_submitted", { kind, vehicleSlug: vehicleSlug ?? null });
      } else if (result.status === "not-configured") {
        setOutcome("not-configured");
      } else if (result.status === "rate-limited") {
        setError(`Too many requests. Please try again in ${result.retryAfterSeconds} seconds.`);
      } else if (result.status === "invalid") {
        setError(Object.values(result.errors)[0] ?? "Please check your details and try again.");
      } else {
        setError("We couldn't submit this right now. Please try again.");
      }
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const note = footerNote ?? (backendConfigured === false ? DEMO_NOTE : undefined);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<button type="button" className={triggerClassName} />}>
        {triggerIcon}
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="border border-border bg-surface text-ink sm:max-w-md">
        {outcome ? (
          <div className="flex flex-col items-center gap-2.5 py-4 text-center">
            <CheckCircle2 size={32} className={outcome === "stored" ? "text-primary" : "text-ink-muted"} />
            <p className="text-sm font-bold text-ink">{outcome === "stored" ? successTitle : "Details validated"}</p>
            <p className="text-[12.5px] text-ink-secondary">
              {outcome === "stored" ? successDescription : DEMO_NOTE}
            </p>
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
                      name={field.key}
                      type={field.type}
                      inputMode={field.type === "tel" ? "numeric" : undefined}
                      autoComplete={
                        field.key === "name" ? "name" : field.key === "email" ? "email" : field.key === "mobile" ? "tel" : "off"
                      }
                      disabled={submitting}
                      value={values[field.key] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="focus-ring w-full rounded-md border border-border-strong bg-white px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-muted disabled:opacity-60"
                    />
                  </div>
                );
              })}

              {/* Honeypot: hidden from people, irresistible to bots. A filled
                  value means the submission is discarded server-side. */}
              <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${idPrefix}-website`}>Website</label>
                <input
                  id={`${idPrefix}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {error ? (
                <p role="alert" className="text-[11.5px] font-semibold text-error">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="focus-ring mt-1 flex items-center justify-center gap-1.5 rounded-md bg-primary py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                {submitting ? "Submitting…" : submitLabel}
              </button>

              {note ? <p className="text-center text-[10.5px] text-ink-muted">{note}</p> : null}
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
