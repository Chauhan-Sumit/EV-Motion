import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SectionCopy } from "@/lib/vehicle-detail/types";

/**
 * Shared chrome for the Vehicle Detail Page prototype.
 *
 * A separate shell from the production `vehicle-detail/VehicleSection.tsx`,
 * which renders every section as the same 15px-heading white card. This design
 * proposes a larger display scale and an eyebrow above each title, so it needs
 * its own section chrome — but every colour, radius and shadow below still
 * resolves to an existing EV Motion token (`--ink`, `--ink-secondary`,
 * `--ink-muted`, `--surface`, `--border`, `--radius`, `--shadow-card`).
 *
 * `scroll-mt` clears the two stacked sticky bars: the production Navbar (h-16,
 * 64px) plus this page's own section tabs.
 */

/** Small uppercase kicker. Used for section eyebrows and field labels alike. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section heading block — eyebrow, display title, optional lead paragraph. */
export function SectionHeading({ copy }: { copy: SectionCopy }) {
  return (
    <div className="mb-5 flex flex-col gap-1.5">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h2 className="text-[1.5rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[1.75rem]">
        {copy.title}
      </h2>
      {copy.lead ? (
        <p className="max-w-[66ch] text-[13px] leading-relaxed text-ink-secondary">{copy.lead}</p>
      ) : null}
    </div>
  );
}

export function PrototypeSection({
  copy,
  children,
  className,
}: {
  copy: SectionCopy;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={copy.id} className={cn("scroll-mt-[128px] py-7", className)}>
      <SectionHeading copy={copy} />
      {children}
    </section>
  );
}

/**
 * Card surface. Wraps the same recipe as `@/components/ui/Block` but with
 * optional padding, because several sections in this design need a card whose
 * children run edge to edge (the variant list, the readout strip).
 */
export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface shadow-card",
        padded && "p-[18px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Label-over-value block, the page's workhorse for a single figure. */
export function Stat({
  label,
  value,
  sub,
  muted,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  /** Renders the value in muted ink — for figures the maker has not published. */
  muted?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <Eyebrow>{label}</Eyebrow>
      <span
        className={cn(
          "text-[1.125rem] font-bold tabular-nums tracking-[-0.01em]",
          muted ? "text-[13px] font-medium normal-case text-ink-muted" : "text-ink",
        )}
      >
        {value}
      </span>
      {sub ? <span className="text-[11px] text-ink-muted">{sub}</span> : null}
    </div>
  );
}

/** A labelled key/value line, as used in the sidebar and battery cards. */
export function DataRow({
  label,
  value,
  muted,
}: {
  label: ReactNode;
  value: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-b-0">
      <span className="text-[12px] text-ink-secondary">{label}</span>
      <span
        className={cn(
          "text-right text-[13px] tabular-nums",
          muted ? "font-normal text-ink-muted" : "font-semibold text-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}
