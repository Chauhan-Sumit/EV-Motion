import { Play } from "lucide-react";
import { Band, Container, Kicker, Pill, SectionHead } from "./Shell";
import { demoVideos } from "./demo-content";
import { cn } from "@/lib/utils";

/**
 * MOCKUP videos.
 *
 * Layout study only — one hero slot plus a stacked rail. The titles and
 * durations are placeholder demo content (see `demo-content.ts`); no video is
 * embedded and none exists. In production this section would render nothing
 * at all until a real video source is wired up, the same way the news section
 * does today.
 */
export function MockVideos() {
  const [feature, ...rest] = demoVideos;

  return (
    <Band id="videos" tone="light">
      <Container>
        <SectionHead
          align="split"
          eyebrow="Watch"
          title="Video reviews"
          lead="Layout only — these are placeholder entries in the prototype, not real videos."
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* ---- Feature slot ---- */}
          <div className="group relative aspect-video overflow-hidden rounded-2xl bg-surface-dark">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 70% at 50% 100%, rgba(37,212,74,0.20) 0%, rgba(11,18,16,0) 65%), linear-gradient(180deg, #0e1a16 0%, #0b1210 100%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-bright text-surface-dark transition-transform group-hover:scale-105">
                <Play size={22} className="ml-0.5 fill-current" />
              </span>
              <Pill tone="dark" accent className="mb-3 w-fit">
                {feature.kind}
              </Pill>
              <p className="max-w-lg text-[18px] font-extrabold leading-snug tracking-[-0.02em] text-white sm:text-[24px]">
                {feature.title}
              </p>
              <p className="mt-2 text-[11px] font-bold tabular-nums text-white/45">{feature.duration}</p>
            </div>
          </div>

          {/* ---- Rail ---- */}
          <div className="flex flex-col gap-3">
            {rest.map((video) => (
              <div
                key={video.id}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 transition-colors hover:border-primary/40"
              >
                <div className="relative h-[72px] w-[124px] shrink-0 overflow-hidden rounded-xl bg-surface-dark">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(80% 70% at 50% 110%, rgba(37,212,74,0.22) 0%, rgba(11,18,16,0) 70%)",
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors group-hover:bg-primary-bright group-hover:text-surface-dark">
                      <Play size={13} className="ml-0.5 fill-current" />
                    </span>
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <Kicker className="mb-1.5">{video.kind}</Kicker>
                  <p className="line-clamp-2 text-[12.5px] font-bold leading-snug text-ink">{video.title}</p>
                  <p className={cn("mt-1.5 text-[10px] font-bold tabular-nums text-ink-muted")}>
                    {video.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Band>
  );
}
