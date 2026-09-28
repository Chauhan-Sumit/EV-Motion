import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

/**
 * MOCKUP-ONLY shared shell + primitives for the /model-page-mockup prototype.
 *
 * This is deliberately a *separate* shell from the production
 * `vehicle-detail/VehicleSection.tsx`, which renders every section as the same
 * 15px-heading white card. The whole point of this prototype is editorial
 * rhythm — alternating light and dark acts, full-bleed panels, and a much
 * larger display type scale — so it needs its own section chrome.
 *
 * Everything still resolves to existing EV Motion tokens: --surface,
 * --surface-secondary, --surface-dark, --primary, --primary-bright,
 * --primary-tint, --ink*, --border, and the 0.75rem radius scale.
 */

export type Tone = "light" | "tinted" | "dark";

const TONE_BG: Record<Tone, string> = {
  light: "bg-surface",
  tinted: "bg-surface-secondary",
  dark: "bg-surface-dark",
};

/** Full-bleed band. Sections alternate tone to create the page's rhythm. */
export function Band({
  id,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-[112px] overflow-hidden py-14 sm:py-20",
        TONE_BG[tone],
        tone === "dark" && "text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Section header. `align="split"` puts the lead text beside the title on wide
 * screens — used to break up the page so not every section is a centered or
 * left-stacked heading.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  tone = "light",
  align = "stack",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  tone?: Tone;
  align?: "stack" | "split";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "mb-8 sm:mb-11",
        align === "split" && "lg:flex lg:items-end lg:justify-between lg:gap-12",
        className,
      )}
    >
      <div className={cn("min-w-0", align === "split" && "lg:max-w-xl")}>
        {eyebrow ? (
          <p
            className={cn(
              "mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.4px]",
              dark ? "text-primary-bright" : "text-primary",
            )}
          >
            <span
              className={cn("h-px w-6", dark ? "bg-primary-bright/60" : "bg-primary/40")}
              aria-hidden="true"
            />
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[32px] lg:text-[38px]",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>

      {lead || action ? (
        <div
          className={cn(
            "mt-3.5 min-w-0",
            align === "split" && "lg:mt-0 lg:max-w-md lg:shrink-0 lg:text-right",
          )}
        >
          {lead ? (
            <p
              className={cn(
                "max-w-2xl text-[13px] leading-relaxed sm:text-sm",
                dark ? "text-white/60" : "text-ink-secondary",
              )}
            >
              {lead}
            </p>
          ) : null}
          {action ? <div className={cn(lead && "mt-3.5")}>{action}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

/** Small uppercase label used above numbers throughout the prototype. */
export function Kicker({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[9px] font-bold uppercase tracking-[1.1px]",
        tone === "dark" ? "text-white/45" : "text-ink-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * The prototype's display numeral: a large value with its unit set small and
 * muted beside it, so a spec reads as one typographic object rather than as a
 * string. `tabular-nums` keeps columns of these aligned.
 */
export function Metric({
  value,
  unit,
  size = "md",
  tone = "light",
  className,
}: {
  value: string | number;
  unit?: string;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: Tone;
  className?: string;
}) {
  const sizes = {
    sm: "text-[20px] sm:text-[22px]",
    md: "text-[28px] sm:text-[32px]",
    lg: "text-[36px] sm:text-[44px]",
    xl: "text-[44px] sm:text-[60px] lg:text-[68px]",
  } as const;
  const unitSizes = {
    sm: "text-[10px]",
    md: "text-[11px]",
    lg: "text-[12px]",
    xl: "text-[14px]",
  } as const;

  return (
    <p
      className={cn(
        "flex items-baseline gap-1 font-extrabold leading-none tracking-[-0.03em] tabular-nums",
        sizes[size],
        tone === "dark" ? "text-white" : "text-ink",
        className,
      )}
    >
      {value}
      {unit ? (
        <span
          className={cn(
            "font-bold tracking-normal",
            unitSizes[size],
            tone === "dark" ? "text-white/50" : "text-ink-muted",
          )}
        >
          {unit}
        </span>
      ) : null}
    </p>
  );
}

/** Frosted panel used on dark bands — the hero info panel, dark stat tiles. */
export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Pill used for statuses, tags and category chips. */
export function Pill({
  children,
  tone = "light",
  accent = false,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.6px]",
        tone === "dark"
          ? accent
            ? "bg-primary-bright/15 text-primary-bright ring-1 ring-inset ring-primary-bright/25"
            : "bg-white/10 text-white/70"
          : accent
            ? "bg-primary-tint text-primary-hover"
            : "bg-surface-secondary text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Ambient green light-pool used behind vehicle imagery on dark bands, matching
 * the homepage hero's generated environment plate (which carries exactly this
 * effect baked in). Purely decorative.
 */
export function LightPool({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(37,212,74,0.28) 0%, rgba(37,212,74,0.10) 38%, rgba(37,212,74,0) 70%)",
      }}
    />
  );
}

/** Re-export so section files import one module. */
export { Container };
