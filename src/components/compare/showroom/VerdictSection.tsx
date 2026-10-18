"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { DEFAULT_QUIZ_ANSWERS, QUIZ, quizResult, verdictCards } from "@/lib/compare/showroom/verdicts";
import { cn } from "@/lib/utils";
import { useShowroom } from "./ShowroomContext";
import { BestCheck, btn, DISPLAY, Dot, Reveal, SECTION, SectionHeader } from "./ui";

function Dots({ colors }: { colors: { base: string }[] }) {
  return (
    <span className="inline-flex">
      {colors.map((c, i) => (
        <Dot key={i} color={c.base} className="-mr-[3px] shadow-[0_0_0_2px_#fff]" />
      ))}
    </span>
  );
}

/** Who wins what, and where it's a tie — then the three-question chooser. */
export function VerdictSection() {
  const { vehicles, settings } = useShowroom();
  const cards = useMemo(() => verdictCards(vehicles, settings), [vehicles, settings]);
  const tally = vehicles.map((v) => cards.filter((c) => c.kind === "winner" && c.vehicle.index === v.index).length);
  const ties = cards.filter((c) => c.kind !== "winner").length;

  return (
    <section id="verdict" aria-labelledby="vH" className={SECTION}>
      <SectionHeader
        id="vH"
        eyebrow="Verdict by category"
        title="Who wins what — and where it’s a tie."
        lede="Decided only from published figures. When the data doesn’t separate them, we say so."
        aside={
          <div className="flex flex-wrap gap-[18px] text-[13.5px] text-ink-muted">
            {vehicles.map((v, i) => (
              <span key={v.detail.slug} className="inline-flex items-center gap-2">
                <Dot color={v.color} />
                {v.detail.name} <b className="text-ink">{tally[i]}</b>
              </span>
            ))}
            {ties ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-3 flex-none rounded-full" style={{ background: `linear-gradient(90deg, ${vehicles[0].color.base} 50%, ${vehicles[1].color.base} 50%)` }} />
                Tie / no winner <b className="text-ink">{ties}</b>
              </span>
            ) : null}
          </div>
        }
      />
      <Reveal className="grid grid-cols-1 gap-3.5 md:grid-cols-2 min-[68.75rem]:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.category}
            className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface p-[22px] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_10px_30px_rgba(0,0,0,.05)]"
          >
            <span className="text-xs font-semibold uppercase tracking-[.1em] text-ink-muted">{c.category}</span>
            <h3 className={cn(DISPLAY, "flex items-center gap-2.5 text-2xl font-extrabold font-stretch-[88%]", c.kind !== "winner" && "text-ink-secondary")}>
              {c.kind === "winner" ? (
                <>
                  <Dot color={c.vehicle.color} />
                  {c.vehicle.detail.name}
                </>
              ) : c.kind === "tie" ? (
                <>
                  <Dots colors={c.vehicles.map((v) => v.color)} />
                  {c.vehicles.map((v) => v.detail.name).join(" & ")}
                </>
              ) : (
                <>
                  <Dots colors={vehicles.map((v) => v.color)} />
                  No clear winner
                </>
              )}
            </h3>
            <p className="text-sm leading-normal text-ink-secondary">{c.text}</p>
          </div>
        ))}
      </Reveal>
      <HelpMeChoose />
    </section>
  );
}

function HelpMeChoose() {
  const { vehicles, settings } = useShowroom();
  const [answers, setAnswers] = useState<number[]>(DEFAULT_QUIZ_ANSWERS);
  const r = useMemo(() => quizResult(answers, vehicles, settings), [answers, vehicles, settings]);
  const pct = (x: number) => Math.round(x * 100);

  return (
    <Reveal className="mt-[18px] grid grid-cols-1 items-start gap-8 rounded-4xl border border-[#DDEBE1] bg-[linear-gradient(135deg,#F2FBF4,#F4F6FF)] p-[22px] md:p-8 min-[68.75rem]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div>
        <h3 className={cn(DISPLAY, "flex items-center gap-2.5 text-[28px] font-extrabold font-stretch-[88%]")}>
          <Sparkles className="size-6 text-primary-hover" aria-hidden="true" />
          Help me choose
        </h3>
        <p className="mt-1.5 text-[14.5px] text-ink-muted">Three quick questions. Your answer updates instantly.</p>
        <div className="mt-5 flex flex-col gap-[18px]">
          {QUIZ.map((q, qi) => (
            <fieldset key={q.q} className="m-0 min-w-0 border-0 p-0">
              <legend className="mb-2.5 p-0 text-[14.5px] font-semibold">
                {qi + 1}. {q.q}
              </legend>
              <div className="flex flex-wrap gap-2">
                {q.options.map((o, oi) => (
                  <button
                    key={o.label}
                    type="button"
                    aria-pressed={answers[qi] === oi}
                    onClick={() => setAnswers((a) => a.map((x, i) => (i === qi ? oi : x)))}
                    className={cn(
                      "h-[42px] whitespace-nowrap rounded-full border border-[#CFD6D1] bg-surface px-4 text-sm transition-colors hover:border-ink focus-ring",
                      answers[qi] === oi && "border-ink bg-ink text-white",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>
      <div aria-live="polite" className="flex flex-col gap-3.5 rounded-3xl bg-surface p-[26px] shadow-[0_1px_2px_rgba(0,0,0,.04),0_12px_34px_rgba(0,0,0,.07)] min-[68.75rem]:sticky min-[68.75rem]:top-[180px]">
        <span className="text-xs font-semibold uppercase tracking-[.12em] text-ink-muted">Our suggestion for you</span>
        <h4 className={cn(DISPLAY, "text-4xl font-[850] uppercase leading-[.95] font-stretch-[76%]")} style={{ color: r.tie ? "var(--ink)" : r.first.color.deep }}>
          {r.tie ? `${r.first.detail.name} or ${r.second.detail.name}` : r.first.detail.name}
        </h4>
        <div>
          <div
            role="img"
            aria-label={`Match share: ${vehicles.map((v, i) => `${v.detail.name} ${pct(r.shares[i])}%`).join(", ")}`}
            className="flex h-2.5 overflow-hidden rounded-[5px] bg-border"
          >
            {vehicles.map((v, i) => (
              <i key={v.detail.slug} className="block h-full transition-[width] duration-500" style={{ width: `${r.shares[i] * 100}%`, background: v.color.base }} />
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[12.5px] text-ink-muted">
            {vehicles.map((v, i) => (
              <span key={v.detail.slug} className="inline-flex items-center gap-1.5">
                <Dot color={v.color} />
                {v.detail.name} {pct(r.shares[i])}%
              </span>
            ))}
          </div>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[14.5px] text-ink-secondary">
          {r.reasons.map((t) => (
            <li key={t} className="flex gap-2.5">
              <BestCheck />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <a href="#offers" className={cn(btn.lg, btn.dark)}>
          {r.tie ? "Test-drive both" : `Get ${r.first.detail.name} offers`}
        </a>
      </div>
    </Reveal>
  );
}
