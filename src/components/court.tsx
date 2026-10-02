"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Journey } from "@/components/journey";
import { SkipLink } from "@/components/skip-link";
import { useRow } from "@/lib/row";

type Stop = {
  /** Short name under the timeline dot. */
  dot: string;
  big: string;
  title?: string;
  meta?: string;
  line: string;
};

// Wording taken as-is from knowledge-base.md, experience.tsx and leadership.tsx.
const stops: Stop[] = [
  {
    dot: "Top 90",
    big: "Top 90",
    title: "AITA U18 National Ranking",
    line: "All India Tennis Association, 2022.",
  },
  {
    dot: "Rafa Nadal Academy",
    big: "Rafa Nadal Academy",
    line: "Trained at the Rafa Nadal Academy in Spain",
  },
  {
    dot: "ITF",
    big: "ITF",
    line: "competed in junior ITF tournaments across India and Nepal",
  },
  {
    dot: "Assistant Head Coach",
    big: "50+",
    title: "Assistant Head Coach",
    meta: "Mar 2024 to Present",
    line: "I coach 10+ sessions a week at Tea Tree Gully Tennis Club for more than fifty clients, from juniors to adults, one-on-one and in groups.",
  },
  {
    dot: "President",
    big: "10 → 100+",
    title: "President",
    meta: "Jul 2024 to Mar 2026",
    line: "A dormant club to Club of the Year in eighteen months.",
  },
  {
    dot: "Club of the Year",
    big: "Winner",
    title: "Club of the Year 2025",
    line: "Awarded for rebuilding Adelaide University Tennis Club from dormant status to 100+ active members, securing $7,000+ in facility upgrades, and leading the merger with UniSA's tennis club.",
  },
  {
    dot: "UniSport Nationals",
    big: "UniSport Nationals",
    title: "Intervarsity Certificate of Merit",
    meta: "UniSport Australia, 2025",
    line: "Recognition for representing Adelaide University at UniSport Nationals.",
  },
  {
    dot: "Premier League",
    big: "Premier League",
    line: "the top grade in Tennis South Australia",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/* The stops in a sideways row, one at a time, with a timeline underneath
   (see lib/row.ts). Arrows and the timeline dots scroll to a stop; with the
   row focused, the arrow keys are the browser's own, which a mandatory snap
   turns into one stop a press. The live region says which stop is showing.
   Under the stops, the journey strip (see Journey), with the glow colours
   worked out at build. */
export function Court({ colours }: { colours: Record<string, string> }) {
  const last = stops.length - 1;
  const { ref: trackRef, active: current, go, step } = useRow();

  const arrow =
    "flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-[opacity,background-color,color,border-color] duration-300 hover:border-accent hover:bg-accent hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <section id="court">
      <div className="wrap relative pt-20 lg:pt-28">
        <SkipLink to="about" />
        <div className="flex items-end justify-between gap-6">
          <h2 className="rise font-display text-[3.75rem] font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-ink md:text-[clamp(3rem,1.2rem+3.8vw,4.75rem)]">
            <span className="block md:inline">Built on</span>{" "}
            <span className="block pb-1 font-serif text-[1.18em] font-medium normal-case italic leading-none tracking-normal text-accent md:inline">
              court.
            </span>
          </h2>
          <div className="hidden items-center gap-3.5 pb-2 lg:flex">
            <span aria-hidden className="min-w-16 text-right text-[15px] text-ink-faint">
              <span className="font-semibold text-ink">{pad(current + 1)}</span> / {pad(stops.length)}
            </span>
            <button type="button" aria-label="Previous stop" disabled={current === 0} onClick={() => step(-1)} className={arrow}>
              <ArrowLeft className="size-[18px]" aria-hidden />
            </button>
            <button type="button" aria-label="Next stop" disabled={current === last} onClick={() => step(1)} className={arrow}>
              <ArrowRight className="size-[18px]" aria-hidden />
            </button>
          </div>
        </div>

        {/* Nothing in a stop takes focus, so the row itself does. */}
        <div className="rise relative mt-10 overflow-hidden rounded-[18px] bg-surface shadow-[inset_0_0_0_1px_rgb(241_239_234/0.08)] lg:rounded-[20px]">
          <p aria-live="polite" className="sr-only">
            {current + 1} of {stops.length}: {stops[current].dot}
          </p>
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Built on court"
            tabIndex={0}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] lg:gap-10 [&::-webkit-scrollbar]:hidden"
          >
            {stops.map((s, i) => (
              <article
                key={s.dot}
                data-stop
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${stops.length}`}
                // Less a peek of the next stop.
                className="flex w-[calc(100%-2rem)] shrink-0 snap-start flex-col lg:h-[min(560px,calc(100svh-27rem))] lg:min-h-[360px] lg:w-[calc(100%-5rem)] lg:flex-row"
              >
                <div className="relative h-[220px] shrink-0 overflow-hidden bg-[#1B1B20] lg:h-full lg:w-[55%]">
                  <span
                    aria-hidden
                    className="absolute -bottom-6 left-5 font-display text-[11rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_91_46/0.4)] lg:-bottom-10 lg:left-10 lg:text-[22rem]"
                  >
                    {pad(i + 1)}
                  </span>
                </div>
                <div className="flex flex-col justify-center px-[22px] py-6 lg:w-[45%] lg:px-14 lg:py-0">
                  <p className="text-[13px] text-ink-faint lg:text-[15px]">
                    {pad(i + 1)} · {s.dot}
                  </p>
                  <p className="mt-3 font-display text-[clamp(2.25rem,1.6rem+2.2vw,4.25rem)] font-bold leading-none tracking-[-0.035em] text-ink lg:mt-[18px]">
                    {s.big}
                  </p>
                  {s.title && (
                    <h3 className="mt-3 text-[17px] font-semibold text-[#D9D6D0] lg:mt-[18px] lg:text-[22px]">
                      {s.title}
                    </h3>
                  )}
                  {s.meta && <p className="mt-1 font-mono text-xs text-ink-muted lg:text-[13px]">{s.meta}</p>}
                  <p className="mt-2 text-[15px] leading-[1.55] text-ink-muted first-letter:uppercase lg:mt-3.5 lg:text-lg lg:leading-relaxed">
                    {s.line}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Timeline: a rail that fills up to the current stop, one dot per stop. */}
        <div className="rise mt-6 flex items-center gap-3 lg:mb-4 lg:mt-6 lg:block lg:px-[60px]">
          <button type="button" aria-label="Previous stop" disabled={current === 0} onClick={() => step(-1)} className={`${arrow} shrink-0 lg:hidden`}>
            <ArrowLeft className="size-[18px]" aria-hidden />
          </button>
          <div className="flex flex-1 flex-col items-center gap-2.5">
            <div className="relative h-11 w-full max-w-[220px] lg:max-w-none">
              <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/18" />
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-accent transition-[width] duration-800 ease-[cubic-bezier(0.65,0,0.2,1)] motion-reduce:transition-none"
                style={{ width: `${(current / last) * 100}%` }}
              />
              {stops.map((s, i) => (
                <button
                  key={s.dot}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to ${s.dot}`}
                  aria-current={i === current ? "step" : undefined}
                  className="group absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  style={{ left: `${(i / last) * 100}%` }}
                >
                  <span
                    className={`size-2.5 rounded-full border-2 transition-colors duration-500 lg:size-3.5 ${
                      i <= current ? "border-accent bg-accent" : "border-ink/35 bg-paper group-hover:border-ink"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`absolute top-[38px] hidden w-[130px] text-center text-sm transition-colors duration-500 lg:block ${
                      i === current ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    {s.dot}
                  </span>
                </button>
              ))}
            </div>
            <p aria-hidden className="text-[13px] text-ink-muted lg:hidden">
              <span className="font-semibold text-ink">{pad(current + 1)}</span> / {pad(stops.length)} · {stops[current].dot}
            </p>
          </div>
          <button type="button" aria-label="Next stop" disabled={current === last} onClick={() => step(1)} className={`${arrow} shrink-0 border-0 bg-accent text-paper lg:hidden`}>
            <ArrowRight className="size-[18px]" aria-hidden />
          </button>
        </div>
      </div>

      <div className="pb-20 pt-14 lg:pb-28 lg:pt-16">
        <Journey colours={colours} />
      </div>
    </section>
  );
}
