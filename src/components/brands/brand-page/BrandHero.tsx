import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import type { BrandIdentity } from "@/lib/brand-page/types";
import { btn, WRAP } from "@/components/vehicles/cars-listing/ui";
import { cn } from "@/lib/utils";

/**
 * The brand's introduction: name, what it sells, the catalogue's description
 * of the brand, and the line-up studio beside it.
 */
export function BrandHero({ brand, heroLine, stage }: { brand: BrandIdentity; heroLine: string; stage: ReactNode }) {
  return (
    <section
      aria-labelledby="brand-h1"
      className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#fff_0%,#F7F8FA_100%)] py-7 max-[760px]:pb-[22px] max-[760px]:pt-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[30%] right-[-10%] h-[130%] w-[70%] bg-[radial-gradient(closest-side,rgba(22,163,74,.08),transparent)]"
      />
      <div className={cn(WRAP, "relative")}>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] items-center gap-10 max-[1240px]:grid-cols-2 max-[1240px]:gap-7 max-[980px]:grid-cols-1 max-[760px]:gap-5">
          <div>
            <h1 id="brand-h1" className="text-[clamp(34px,4.2vw,56px)] font-extrabold leading-[1.02] tracking-[-.045em]">
              {brand.name} <span className="block font-bold text-ink-muted">{heroLine}</span>
            </h1>
            <p className="mt-3.5 max-w-[540px] text-[17px] leading-[1.55] text-ink-secondary max-[760px]:text-[15px]">{brand.description}</p>

            <div className="mt-[22px] flex flex-wrap gap-2.5 max-[760px]:mt-[18px]">
              <a href="#models" className={cn(btn.brand, "max-[760px]:flex-1")}>
                Explore models
                <ArrowDown className="size-4" strokeWidth={2.2} aria-hidden="true" />
              </a>
            </div>
          </div>

          {stage}
        </div>
      </div>
    </section>
  );
}
