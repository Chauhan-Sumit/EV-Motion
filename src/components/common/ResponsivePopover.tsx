"use client";

import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ResponsivePopoverProps {
  trigger: ReactNode;
  triggerClassName?: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  contentClassName?: string;
}

/**
 * Anchored Popover on desktop, bottom Sheet on mobile — one shared wrapper so
 * every filter picker behaves identically instead of each reimplementing the
 * responsive switch.
 */
export function ResponsivePopover({
  trigger,
  triggerClassName,
  title,
  open,
  onOpenChange,
  children,
  contentClassName,
}: ResponsivePopoverProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger render={<button type="button" className={triggerClassName} />}>{trigger}</PopoverTrigger>
        <PopoverContent className={cn("w-80", contentClassName)}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.5px] text-ink-muted">{title}</p>
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger render={<button type="button" className={triggerClassName} />}>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className={cn("max-h-[80vh] overflow-y-auto", contentClassName)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
