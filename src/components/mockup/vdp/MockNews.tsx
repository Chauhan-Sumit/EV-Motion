import { ArrowUpRight, Clock } from "lucide-react";
import { Band, Container, Kicker, Pill, SectionHead } from "./Shell";
import { demoNews } from "./demo-content";

/**
 * MOCKUP latest EV news.
 *
 * Headlines are placeholder demo content. Production's `LatestEVNewsSection`
 * deliberately renders an honest empty state instead of fabricated headlines,
 * and would keep doing so until a real news source exists — this section shows
 * the layout that source would eventually fill.
 */
export function MockNews() {
  const [lead, ...rest] = demoNews;

  return (
    <Band id="news" tone="light">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Reading"
          title="Latest EV news"
          lead="Placeholder headlines in this prototype — the live site shows an empty state until a real news source is wired up."
          action={
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary">
              All stories
              <ArrowUpRight size={14} />
            </span>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
          {/* Lead story */}
          <article className="group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-surface-dark p-6 sm:p-8 lg:min-h-[280px]">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(100% 80% at 15% 100%, rgba(37,212,74,0.22) 0%, rgba(11,18,16,0) 62%), linear-gradient(160deg, #0e1a16 0%, #0b1210 100%)",
              }}
            />
            <div className="relative">
              <Pill tone="dark" accent className="mb-4">
                {lead.category}
              </Pill>
              <h3 className="max-w-md text-[20px] font-extrabold leading-snug tracking-[-0.02em] text-white sm:text-[26px]">
                {lead.headline}
              </h3>
              <p className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
                <Clock size={12} />
                {lead.readTime} read
              </p>
            </div>
          </article>

          {/* Rest */}
          <div className="flex flex-col gap-3">
            {rest.map((item) => (
              <article
                key={item.id}
                className="group flex flex-1 flex-col justify-center rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 sm:p-6"
              >
                <div className="mb-2.5 flex items-center gap-2.5">
                  <Kicker className="text-primary">{item.category}</Kicker>
                  <span className="h-3 w-px bg-border" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-ink-muted">{item.readTime} read</span>
                </div>
                <h3 className="text-[14.5px] font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-primary">
                  {item.headline}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Band>
  );
}
