import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Block({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-[18px]", className)}>
      {children}
    </div>
  );
}
