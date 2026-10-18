"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UnavailableValue } from "@/components/common/UnavailableValue";
import type { SlotColor } from "@/lib/compare/showroom/palette";

/**
 * Shared building blocks for the showroom Compare page.
 *
 * Colours come from the EV Motion tokens wherever one exists (`ink`,
 * `ink-secondary`, `ink-muted`, `border`, `surface`, `surface-secondary`,
 * `surface-dark`, `primary*`). The dark showroom surfaces use Tailwind's
 * `slate-200` / `slate-400`, which are exactly the site's dark-scheme
 * foreground (#e2e8f0) and muted (#94a3b8) values.
 */

export const DISPLAY = "font-[family-name:var(--font-showroom-display)]";
export const TEXT = "font-[family-name:var(--font-showroom-text)]";
export const WRAP = "mx-auto w-full max-w-[1240px] px-4 md:px-8";
/** A page section: top spacing, and clearance for the sticky navbar + dock when jumped to. */
export const SECTION = "scroll-mt-[130px] pt-[72px] md:scroll-mt-[150px] md:pt-24";

/** Buttons — pill-shaped, per the approved design. */
const BTN = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,transform,border-color] active:scale-[.98] focus-ring disabled:pointer-events-none disabled:opacity-60";
export const btn = {
  base: BTN,
  lg: cn(BTN, "h-11 px-3.5 text-sm md:h-12 md:px-[22px] md:text-[15px]"),
  sm: cn(BTN, "h-[38px] px-4 text-[13.5px]"),
  brand: "bg-primary text-[#04140A] hover:bg-[#27BF48]",
  dark: "bg-ink text-white hover:bg-[#26292F]",
  green: "bg-primary-hover text-white hover:bg-[#0B6629]",
  line: "border border-white/10 text-slate-200 hover:bg-white/5",
};

export const pill =
  "inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm text-ink transition-colors hover:border-ink focus-ring";

export function Dot({ color, className }: { color: SlotColor | string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-2.5 flex-none rounded-full", className)}
      style={{ background: typeof color === "string" ? color : color.base }}
    />
  );
}

export function BestCheck({ dark = false }: { dark?: boolean }) {
  return (
    <span
      title="Best in this comparison"
      className={cn("inline-grid size-5 flex-none place-items-center rounded-full", dark ? "bg-primary-bright/15" : "bg-primary-tint")}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={dark ? "var(--primary-bright)" : "var(--primary-hover)"} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12l5 5L20 7" />
      </svg>
      <span className="sr-only">Best in this comparison</span>
    </span>
  );
}

export function NotPublished() {
  return <UnavailableValue label="Not published" />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-[12.5px] font-semibold uppercase tracking-[.14em] text-primary-hover">{children}</div>;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  lede,
  aside,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Reveal className="mb-[26px] flex flex-wrap items-end justify-between gap-x-10 gap-y-6 md:mb-9">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className={cn(DISPLAY, "mt-2.5 text-[clamp(30px,4.2vw,50px)] font-extrabold leading-[1.02] tracking-[-.025em] font-stretch-[88%]")}>
          {title}
        </h2>
        {lede ? <p className="mt-3 max-w-[640px] text-[17px] text-ink-muted">{lede}</p> : null}
      </div>
      {aside}
    </Reveal>
  );
}

export function Legend({ vehicles }: { vehicles: { name: string; color: SlotColor }[] }) {
  return (
    <div className="flex flex-wrap gap-[18px] text-[13.5px] text-ink-muted">
      {vehicles.map((v) => (
        <span key={v.name} className="inline-flex items-center gap-2">
          <Dot color={v.color} />
          {v.name}
        </span>
      ))}
    </div>
  );
}

/** Wins ring — a conic progress ring around a count. */
export function WinRing({ wins, of, color, size = "md" }: { wins: number; of: number; color: string; size?: "sm" | "md" }) {
  const pct = (wins / Math.max(of, 1)) * 100;
  return (
    <span
      className={cn("grid flex-none place-items-center rounded-full", size === "sm" ? "size-[26px]" : "size-[34px]")}
      style={{ background: `conic-gradient(${color} ${pct}%, rgba(255,255,255,.1) 0)` }}
    >
      <b className={cn(DISPLAY, "grid place-items-center rounded-full bg-[#0C0E12] font-extrabold tabular-nums", size === "sm" ? "size-5 text-[10.5px]" : "size-[26px] text-xs")}>
        {wins}
      </b>
    </span>
  );
}

/**
 * Fade-and-rise on first scroll into view, as in the approved design. Content
 * is visible by default and only hidden once the observer is known to work,
 * so nothing stays invisible without JavaScript, in print, or when the
 * browser never fires the observer; reduced-motion users get no movement.
 */
export function Reveal({ children, className, as: Tag = "div", ...rest }: { children: ReactNode; className?: string; as?: "div" | "section"; id?: string; style?: CSSProperties; "aria-labelledby"?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      {...rest}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] print:translate-y-0 print:opacity-100",
        state === "hidden" && "translate-y-[18px] opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export const inr = (x: number) => `₹${Math.round(x).toLocaleString("en-IN")}`;
