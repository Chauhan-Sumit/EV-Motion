"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Disclosure({
  title,
  subtitle,
  children,
  defaultOpen = false,
  icon,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-border px-[13px] last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="focus-ring flex w-full items-center justify-between gap-3 py-3.5 text-left"
        >
          <span className="flex items-center gap-2.5">
            {icon ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-tint">
                {icon}
              </span>
            ) : null}
            <span>
              <span className="block text-[13px] font-bold text-ink">{title}</span>
              {subtitle ? <span className="mt-0.5 block text-[11px] text-ink-muted">{subtitle}</span> : null}
            </span>
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      {open ? (
        <div id={panelId} className="animate-fade-in pb-3.5">
          {children}
        </div>
      ) : null}
    </div>
  );
}
