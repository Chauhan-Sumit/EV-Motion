"use client";

import { useId, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { validateField } from "@/lib/leads/validation";
import type { LeadOutcome, LeadSubmission } from "@/lib/leads/types";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { btn, DISPLAY, Reveal } from "./ui";

const FIELD = "h-[52px] rounded-[14px] border border-white/10 bg-white/5 px-3.5 text-[15px] text-white outline-none placeholder:text-slate-500 focus:border-primary-bright";
const LABEL = "flex flex-col gap-1.5 text-[12.5px] text-slate-400";

/**
 * Inline "best price" form. Posts to the site's one lead endpoint with the
 * same validation the lead dialog uses, and tells the truth about the
 * outcome — including when no backend is configured (CLAUDE.md #24).
 */
export function OffersSection() {
  const { vehicles, city } = useShowroom();
  const pathname = usePathname();
  const ids = useId();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [interest, setInterest] = useState("all");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "submitting" | "stored" | "not-configured">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    const invalid = validateField("required", "Full name", name) ?? validateField("mobile", "Mobile number", mobile);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setState("submitting");
    const vehicleSlug = interest === "all" ? undefined : interest;
    const submission: LeadSubmission = {
      kind: "best-price",
      fields: {
        name,
        mobile,
        message: interest === "all" ? `Offers on: ${vehicles.map((v) => `${v.detail.brand} ${v.detail.name}`).join(", ")}` : undefined,
      },
      context: { vehicleSlug, city: city.name, path: pathname ?? undefined },
      website: honeypot,
    };
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submission) });
      const result = (await res.json()) as LeadOutcome;
      if (result.status === "stored") {
        setState("stored");
        track("lead_submitted", { kind: "best-price", vehicleSlug: vehicleSlug ?? null });
        return;
      }
      if (result.status === "not-configured") {
        setState("not-configured");
        return;
      }
      setState("idle");
      if (result.status === "rate-limited") setError(`Too many requests. Please try again in ${result.retryAfterSeconds} seconds.`);
      else if (result.status === "invalid") setError(Object.values(result.errors)[0] ?? "Please check your details and try again.");
      else setError("We couldn't submit this right now. Please try again.");
    } catch {
      setState("idle");
      setError("Network error — please check your connection and try again.");
    }
  }

  const done = state === "stored" || state === "not-configured";

  return (
    <Reveal
      as="section"
      id="offers"
      aria-labelledby="leadH"
      className="relative mt-[72px] grid scroll-mt-[150px] grid-cols-1 items-center gap-6 overflow-hidden rounded-4xl bg-surface-dark p-[26px] text-slate-200 md:mt-24 md:p-12 min-[68.75rem]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] min-[68.75rem]:gap-11"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -left-[120px] -top-[120px] size-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(37,212,74,.18),transparent)]" />
      <div className="relative">
        <h2 id="leadH" className={cn(DISPLAY, "text-[clamp(30px,3.6vw,46px)] font-[850] leading-none font-stretch-[80%]")}>
          Get the best price in {city.name}.
        </h2>
        <p className="mt-3.5 text-slate-400">Verified dealers send their best offer for each vehicle you’re comparing. Compare quotes side by side — no obligation.</p>
        <ul className="m-0 mt-5 flex list-none flex-col gap-2 p-0 text-[14.5px] text-slate-300">
          {["Quotes from dealers near you", "Test drives booked for you", "Your number is shared only with the dealers you choose"].map((t) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="grid size-5 flex-none place-items-center rounded-full bg-primary-bright/15">
                <Check className="size-[11px] text-primary-bright" strokeWidth={3.2} aria-hidden="true" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={submit} noValidate className="relative grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className={LABEL}>
          Full name
          <input type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} disabled={done} className={FIELD} />
        </label>
        <label className={LABEL}>
          Mobile number
          <input
            type="tel"
            inputMode="numeric"
            placeholder="10 digits"
            autoComplete="tel"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            disabled={done}
            className={FIELD}
          />
        </label>
        <label className={cn(LABEL, "md:col-span-2")}>
          Interested in
          <select value={interest} onChange={(e) => setInterest(e.target.value)} disabled={done} className={FIELD}>
            <option value="all">All {vehicles.length}</option>
            {vehicles.map((v) => (
              <option key={v.detail.slug} value={v.detail.slug}>
                {v.detail.brand} {v.detail.name}
              </option>
            ))}
          </select>
        </label>
        {/* Honeypot — hidden from people, so anything typed here is a bot. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" id={`${ids}-website`} />
        <button type="submit" disabled={done || state === "submitting"} className={cn(btn.lg, btn.brand, "md:col-span-2")}>
          {state === "stored" ? "Request received ✓" : state === "submitting" ? "Sending…" : "Get dealer offers"}
        </button>
        <p role="status" aria-live="polite" className={cn("text-[13px] md:col-span-2", error ? "text-[#FCA5A5]" : "text-slate-400")}>
          {error ??
            (state === "stored"
              ? "Dealers will call you shortly with their best offers."
              : state === "not-configured"
                ? "Demo form — no storage backend is configured, so nothing was sent or saved."
                : "By continuing you agree to be contacted by EV Motion and partner dealers.")}
        </p>
      </form>
    </Reveal>
  );
}
