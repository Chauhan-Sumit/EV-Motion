"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Bottom-centre status message; a new `id` re-shows it. */
export function Toast({ message }: { message: { text: string; id: number } | null }) {
  const [visibleId, setVisibleId] = useState<number | null>(null);

  useEffect(() => {
    if (!message) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shows the toast for the message that just arrived, then schedules its hide
    setVisibleId(message.id);
    const t = setTimeout(() => setVisibleId(null), 2600);
    return () => clearTimeout(t);
  }, [message]);

  const on = message !== null && visibleId === message.id;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed bottom-[90px] left-1/2 z-[90] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-xl bg-ink px-[18px] py-3 text-sm text-white transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)] md:bottom-24",
        on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      {message?.text}
    </div>
  );
}
