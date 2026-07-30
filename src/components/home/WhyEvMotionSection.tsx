import { Block } from "@/components/ui/Block";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { whyFeatures } from "@/lib/data/ev-motion/content";

export function WhyEvMotionSection() {
  return (
    <div className="px-3.5 pb-8 sm:px-9">
      <Block>
        <BlockHeading title="Why EV Motion?" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {whyFeatures.map((feature) => (
            <div
              key={feature.id}
              className="rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-primary"
            >
              <span
                className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-base"
                aria-hidden="true"
              >
                {feature.emoji}
              </span>
              <p className="mb-1 text-[13px] font-bold text-ink">{feature.title}</p>
              <p className="text-[11px] leading-relaxed text-ink-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}
