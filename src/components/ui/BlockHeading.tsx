import type { ReactNode } from "react";
import Link from "next/link";

export function BlockHeading({
  title,
  viewAllLabel,
  viewAllHref,
  action,
}: {
  title: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-[13px] flex items-center justify-between">
      <h2 className="text-[15px] font-bold text-ink">{title}</h2>
      {action ??
        (viewAllLabel && viewAllHref ? (
          <Link href={viewAllHref} className="focus-ring text-[11px] font-semibold text-primary">
            {viewAllLabel} ›
          </Link>
        ) : null)}
    </div>
  );
}
