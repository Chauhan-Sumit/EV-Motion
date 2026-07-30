import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";

export function VehicleSection({
  id,
  title,
  description,
  aside,
  headingAction,
  tinted,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  aside?: ReactNode;
  headingAction?: ReactNode;
  tinted?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-32 py-8 ${tinted ? "bg-surface-secondary" : ""}`}>
      <Container>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <BlockHeading title={title} action={headingAction} />
            {description ? <p className="-mt-2.5 mb-3.5 max-w-2xl text-[12px] text-ink-secondary">{description}</p> : null}
            {children}
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
