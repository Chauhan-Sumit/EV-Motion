"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { routeSegmentFor } from "@/lib/data/categories";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { DISPLAY, pill, Reveal, SECTION, SectionHeader } from "./ui";

const CARD = "flex min-h-[220px] flex-col gap-3 rounded-3xl bg-surface-secondary p-[26px]";
const H3 = cn(DISPLAY, "text-xl font-bold font-stretch-[95%]");

/**
 * Reviews, model pages and video. Each card does what it says today: reviews
 * live on each model page, there is no brochure library yet so that card links
 * to the model pages, and the video card collects interest through the real
 * lead path.
 */
export function GoDeeperSection() {
  const { vehicles, category } = useShowroom();
  const href = (slug: string) => `/${routeSegmentFor(category)}/${slug}`;

  return (
    <section id="more" aria-labelledby="mH" className={SECTION}>
      <SectionHeader id="mH" eyebrow="Go deeper" title="Reviews, model pages and video." />
      <Reveal className="grid grid-cols-1 gap-4 min-[68.75rem]:grid-cols-3">
        <div className={CARD}>
          <h3 className={H3}>Owner reviews</h3>
          <p className="text-[14.5px] text-ink-muted">Owners who share their real-world range help the next buyer decide. Read or write one on each model’s page.</p>
          <div className="mt-auto flex flex-wrap gap-2.5">
            {vehicles.map((v) => (
              <Link key={v.detail.slug} href={`${href(v.detail.slug)}#reviews`} className={pill}>
                {v.detail.name} reviews
              </Link>
            ))}
          </div>
        </div>
        <div className={CARD}>
          <h3 className={H3}>Full model pages</h3>
          <p className="text-[14.5px] text-ink-muted">Every variant, colour and feature for each car, on its own page.</p>
          <div className="mt-auto flex flex-wrap gap-2.5">
            {vehicles.map((v) => (
              <Link key={v.detail.slug} href={href(v.detail.slug)} className={pill}>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                {v.detail.name}
              </Link>
            ))}
          </div>
        </div>
        <div className={CARD}>
          <h3 className={H3}>Expert video comparison</h3>
          <p className="text-[14.5px] text-ink-muted">City, highway and a charging stop, driven back to back by our road-test team.</p>
          <div className="mt-auto flex flex-wrap gap-2.5">
            <LeadCaptureDialog
              kind="enquiry"
              triggerLabel="Notify me when it’s live"
              triggerClassName={pill}
              dialogTitle="Get the video when it’s live"
              dialogDescription={`We’ll email you once the ${vehicles.map((v) => v.detail.name).join(" vs ")} video comparison is published.`}
              fields={[{ key: "email", label: "Email", type: "email", placeholder: "you@example.com", validation: "email" }]}
              submitLabel="Notify me"
              successTitle="You’re on the list"
              successDescription="We’ll email you when the video goes live."
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
