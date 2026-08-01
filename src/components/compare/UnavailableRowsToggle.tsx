"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Just the interactive expand/collapse shell — deliberately the only client
 * boundary in the SpecTable tree. `children` is already-rendered JSX from
 * the server (the collapsed rows' table), not a function, so it crosses the
 * RSC boundary fine; the SpecRow objects themselves (which carry `render`/
 * `barValue` functions) never do, because SpecTable stays a Server Component.
 */
export function UnavailableRowsToggle({ count, children, bare = false }: { count: number; children: ReactNode; bare?: boolean }) {
  const [show, setShow] = useState(false);

  return (
    <div className={bare ? "" : "border-t border-border"}>
      <button
        type="button"
        onClick={() => setShow((o) => !o)}
        aria-expanded={show}
        className="focus-ring flex w-full items-center justify-center gap-1.5 bg-surface-secondary/60 px-3.5 py-2.5 text-[11px] font-semibold text-ink-muted transition-colors hover:text-ink-secondary"
      >
        <ChevronDown size={13} className={`transition-transform ${show ? "rotate-180" : ""}`} />
        {show ? "Hide" : "Show"} {count} unavailable specification{count > 1 ? "s" : ""}
        {bare && !show ? <span className="ml-1 font-normal normal-case text-ink-muted/80">— not officially published by any compared vehicle</span> : null}
      </button>
      {show ? <div className="overflow-x-auto border-t border-border">{children}</div> : null}
    </div>
  );
}
