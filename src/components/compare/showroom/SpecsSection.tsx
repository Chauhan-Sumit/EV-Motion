"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Search } from "lucide-react";
import {
  BATTERY_SPEC_ROWS,
  CHARGING_SPEC_ROWS,
  DIMENSIONS_SPEC_ROWS,
  FEATURES_SPEC_ROWS,
  NOT_SPECIFIED,
  OVERVIEW_SPEC_ROWS,
  PERFORMANCE_SPEC_ROWS,
  SAFETY_SPEC_ROWS,
  WARRANTY_SPEC_ROWS,
  WINNER_METRICS,
  type SpecRow,
} from "@/lib/compare/metrics";
import { computeWinners } from "@/lib/compare/winnerEngine";
import { formatPricingDate, PRICING_DATA_LAST_UPDATED } from "@/lib/vehicle-pricing";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { BestCheck, DISPLAY, Dot, Legend, NotPublished, Reveal, SECTION, SectionHeader } from "./ui";
import { ReportErrorButton } from "./ReportErrorButton";

/**
 * The approved design's six groups, filled from the site's one spec-row
 * registry (`lib/compare/metrics.ts`) — so every row, its "not published"
 * handling and its gross/usable and torque labelling are the same ones the
 * rest of the site uses.
 */
const GROUPS: { title: string; rows: SpecRow[] }[] = [
  { title: "Battery & range", rows: [...BATTERY_SPEC_ROWS, ...OVERVIEW_SPEC_ROWS.filter((r) => r.key === "efficiency")] },
  { title: "Charging", rows: CHARGING_SPEC_ROWS },
  { title: "Performance", rows: PERFORMANCE_SPEC_ROWS },
  { title: "Dimensions & space", rows: DIMENSIONS_SPEC_ROWS },
  { title: "Safety", rows: SAFETY_SPEC_ROWS },
  { title: "Tech & warranty", rows: [...FEATURES_SPEC_ROWS, ...WARRANTY_SPEC_ROWS] },
];

/** Spec-row keys whose winner-metric key differs. */
const METRIC_FOR_ROW: Record<string, string> = { ncap: "safetyRating", batteryWarrantyRow: "batteryWarranty" };

const TIP: Record<string, string> = {
  efficiency: "Battery ÷ claimed range. Lower means cheaper running. Ranked only when every battery figure is stated the same way (gross or usable).",
  range: "Manufacturer-certified figure. Expect roughly 70–80% of it in everyday driving.",
  fastCharge: "Time on a public DC fast charger under ideal conditions. Charging slows above 80%.",
  battery: "Gross is the whole pack; usable is what the manufacturer lets you draw. We label which one each brand publishes.",
  ncap: "Crash-test result with its year. A rating past its programme’s validity window is shown but not ranked.",
};

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Tip({ text }: { text: string }) {
  return (
    <span
      tabIndex={0}
      role="note"
      aria-label={text}
      className="group relative inline-grid size-[18px] flex-none place-items-center rounded-full border border-border-strong text-[11px] font-semibold text-ink-muted focus-ring"
    >
      i
      <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[5] hidden w-60 -translate-x-1/2 rounded-[10px] bg-ink px-3 py-2.5 text-left text-[12.5px] font-normal leading-[1.45] text-white shadow-[0_8px_24px_rgba(0,0,0,.2)] group-hover:block group-focus:block">
        {text}
      </span>
    </span>
  );
}

export function SpecsSection() {
  const { vehicles } = useShowroom();
  const details = useMemo(() => vehicles.map((v) => v.detail), [vehicles]);
  const [query, setQuery] = useState("");
  const [diffOnly, setDiffOnly] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [activeGroup, setActiveGroup] = useState(slugify(GROUPS[0].title));

  const winners = useMemo(() => {
    const r = computeWinners(details, WINNER_METRICS);
    return new Map(r.metricResults.map((m) => [m.key, m.winnerIndex]));
  }, [details]);

  const q = query.trim().toLowerCase();
  const groups = GROUPS.map((g) => {
    const rows = g.rows.map((row) => ({ row, vals: details.map((d) => row.render(d)) }));
    const differs = (o: (typeof rows)[number]) => o.vals.some((x) => x !== o.vals[0]);
    const shown = rows.filter((o) => (!q || o.row.label.toLowerCase().includes(q) || g.title.toLowerCase().includes(q)) && (!diffOnly || differs(o)));
    return { ...g, id: `sp-${slugify(g.title)}`, rows, shown, differs, diffCount: rows.filter(differs).length };
  });
  const total = groups.reduce((a, g) => a + g.shown.length, 0);
  const cols = vehicles.length;
  const mobileCols = cols === 4 ? 2 : cols;

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveGroup(e.target.id.replace(/^sp-/, ""));
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("[data-spec-group]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [query, diffOnly]);

  const TOGGLE = "inline-flex h-[46px] flex-auto cursor-pointer select-none items-center justify-between gap-2.5 whitespace-nowrap rounded-full border border-border bg-surface px-4 text-sm md:flex-none";
  const SWITCH =
    "relative m-0 h-[22px] w-9 flex-none cursor-pointer appearance-none rounded-full bg-border-strong transition-colors after:absolute after:left-[3px] after:top-[3px] after:size-4 after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(0,0,0,.2)] after:transition-[left] checked:bg-primary-hover checked:after:left-[17px] focus-ring";

  return (
    <section id="specs" aria-labelledby="spH" className={SECTION}>
      <SectionHeader
        id="spH"
        eyebrow="Full specifications"
        title="Every published number."
        aside={
          <div className="flex w-full flex-wrap items-center gap-2.5 md:w-auto">
            <label className="flex h-[46px] min-w-0 flex-[1_1_100%] items-center gap-2.5 rounded-full border border-border bg-surface px-4 focus-within:border-ink md:min-w-[300px] md:flex-none">
              <Search className="size-4 text-ink-muted" aria-hidden="true" />
              <span className="sr-only">Search specifications</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a spec, e.g. airbags"
                autoComplete="off"
                className="min-w-0 flex-1 border-0 bg-transparent text-[15px] outline-none"
              />
            </label>
            <label className={TOGGLE}>
              Differences only
              <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} className={SWITCH} />
            </label>
            <label className={TOGGLE}>
              Highlight differences
              <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} className={SWITCH} />
            </label>
          </div>
        }
      />
      <div className="grid grid-cols-1 items-start gap-10 min-[68.75rem]:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Specification categories" className="sticky top-[200px] hidden flex-col gap-0.5 min-[68.75rem]:flex">
          {groups.map((g) => {
            const on = activeGroup === slugify(g.title);
            return (
              <a
                key={g.id}
                href={`#${g.id}`}
                className={cn("flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-[11px] text-[14.5px] text-ink-secondary transition-colors hover:bg-surface-secondary", on && "bg-ink text-white hover:bg-ink")}
              >
                {g.title}
                <em className={cn("text-xs not-italic", on ? "text-white/70" : "text-ink-muted")}>{g.shown.length}</em>
              </a>
            );
          })}
        </nav>
        <Reveal style={{ "--n": cols, "--mc": mobileCols } as CSSProperties}>
          <div className="mb-2.5 md:hidden">
            <Legend vehicles={vehicles.map((v) => ({ name: v.detail.name, color: v.color }))} />
          </div>
          <div className="hidden grid-cols-[minmax(150px,1.1fr)_repeat(var(--n),minmax(0,1fr))] border-b-[1.5px] border-ink pb-3 text-[12.5px] font-semibold uppercase tracking-[.08em] text-ink-secondary md:grid">
            <span>Specification</span>
            {vehicles.map((v) => (
              <span key={v.detail.slug} className="flex items-center gap-2 truncate">
                <Dot color={v.color} />
                <span className="truncate">{v.detail.name}</span>
              </span>
            ))}
          </div>
          {groups.map((g) =>
            g.shown.length ? (
              <div key={g.id} id={g.id} data-spec-group className="scroll-mt-[150px] pt-[30px]">
                <h3 className={cn(DISPLAY, "flex items-baseline gap-3 pb-2.5 text-[22px] font-bold font-stretch-[92%]")}>
                  {g.title}
                  <em className="text-[13px] font-medium not-italic tracking-normal text-ink-muted [font-family:var(--font-showroom-text)]">
                    {g.rows.length} specs · {g.diffCount} differ
                  </em>
                </h3>
                {g.shown.map((o) => {
                  const winner = winners.get(METRIC_FOR_ROW[o.row.key] ?? o.row.key) ?? null;
                  return (
                    <div
                      key={o.row.key}
                      className={cn(
                        "grid grid-cols-[repeat(var(--mc),minmax(0,1fr))] border-t border-border/60 text-sm transition-colors md:grid-cols-[minmax(150px,1.1fr)_repeat(var(--n),minmax(0,1fr))] md:text-[15px]",
                        highlight && g.differs(o) && "bg-warning/10",
                      )}
                    >
                      <span className="col-span-full flex min-w-0 items-center gap-2 pb-0 pr-2.5 pt-2.5 text-[13px] text-ink-muted md:col-span-1 md:py-3.5 md:pr-3.5 md:text-[15px] md:text-ink-secondary">
                        {o.row.label}
                        {TIP[o.row.key] ? <Tip text={TIP[o.row.key]} /> : null}
                      </span>
                      {o.vals.map((x, i) => {
                        const best = winner === i;
                        return (
                          <span key={i} className={cn("flex min-w-0 items-center gap-2 pb-3 pr-2.5 pt-2.5 tabular-nums md:py-3.5 md:pr-3.5", best && "font-bold text-primary-hover md:text-ink")}>
                            <Dot color={vehicles[i].color} className="size-[7px] md:hidden" />
                            {x === NOT_SPECIFIED ? <NotPublished /> : <span className="min-w-0 break-words">{x}</span>}
                            {best ? (
                              <span className="hidden md:inline-flex">
                                <BestCheck />
                              </span>
                            ) : null}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : null,
          )}
          {total === 0 ? <p className="py-7 text-ink-muted">No specifications match your search.</p> : null}
          <div className="mt-[22px] flex flex-wrap justify-between gap-3 text-[13px] text-ink-muted">
            <span>
              ✓ = best figure in this comparison · “Not published” = no official figure yet · Prices updated {formatPricingDate(PRICING_DATA_LAST_UPDATED)}
            </span>
            <ReportErrorButton label="Spotted a wrong number? Report it" className="font-semibold text-primary-hover hover:underline" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
