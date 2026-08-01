import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * Compare-page-only premium section wrapper — deliberately a separate
 * component from `vehicle-detail/VehicleSection` (which this replaced on
 * every Compare section) rather than a shared edit, because that file is
 * also used by 12 VDP section components; restyling it there would have
 * silently changed VDP pages nobody asked to touch. Same prop shape as
 * VehicleSection plus an optional section `icon`, so swapping a section
 * over is a one-line import change.
 */
export function CompareSectionCard({
  id,
  title,
  description,
  aside,
  headingAction,
  tinted,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  aside?: ReactNode;
  headingAction?: ReactNode;
  tinted?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-32 py-6 ${tinted ? "bg-surface-secondary" : ""}`}>
      <Container>
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
                <h2 className="flex items-center gap-2.5 text-[14.5px] font-bold text-ink sm:text-[16.5px]">
                  {Icon ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
                      <Icon size={16} />
                    </span>
                  ) : null}
                  {title}
                </h2>
                {headingAction}
              </div>
              {description ? <p className="-mt-1.5 mb-3.5 max-w-2xl text-[12px] text-ink-secondary">{description}</p> : null}
              {children}
            </div>
            {aside ? <div className="shrink-0">{aside}</div> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
