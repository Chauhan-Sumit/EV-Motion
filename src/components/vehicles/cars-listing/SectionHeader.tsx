import type { ReactNode } from "react";
import { Reveal } from "@/components/compare/showroom/ui";

/** Heading row for the sections below the list: title, one-line lede, optional link on the right. */
export function SectionHeader({ id, title, lede, aside }: { id: string; title: string; lede: string; aside?: ReactNode }) {
  return (
    <Reveal className="mb-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
      <div>
        <h2 id={id} className="leading-[1.15] text-[clamp(22px,2.4vw,28px)] font-[750] tracking-[-.035em]">
          {title}
        </h2>
        <p className="mt-1 text-[14.5px] text-ink-muted">{lede}</p>
      </div>
      {aside}
    </Reveal>
  );
}
