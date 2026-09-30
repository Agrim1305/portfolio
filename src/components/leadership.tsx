"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { awardPhoto, mergerStory, openStory, type Photo } from "@/lib/stories";

const outcomes = [
  { value: "2 → 1", label: "clubs merged" },
  { value: "$7,000+", label: "grants secured" },
  { value: "10 → 100+", label: "active members" },
  { value: "Winner", label: "Club of the Year 2025" },
];

// The first photo leads as a print; any more sit in a row beneath it.
const photos: Photo[] = [awardPhoto];

// "What I did" is long, so the page shows its first three sentences, word for
// word, and the full story holds the rest.
const trimmed = (text: string) => text.split(/(?<=\.)\s+/).slice(0, 3).join(" ");

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

const print =
  "relative overflow-hidden rounded-[18px] border-[5px] border-ink shadow-[0_30px_60px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-[0.5deg] hover:scale-[1.02] motion-reduce:transition-none";

export function Leadership() {
  const [lead, ...rest] = photos;
  return (
    <section id="leadership" tabIndex={-1} className="outline-none wrap py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-start lg:gap-14">
        <div>
          <h2 className="rise font-display text-[clamp(3rem,1.2rem+3.8vw,4.75rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-ink">
            Leadership
          </h2>
          <p className="rise mt-4 text-[15px] text-ink-muted lg:text-lg" style={rise(0.04)}>
            Adelaide University Tennis Club · President, Jul 2024 to Mar 2026
          </p>
          <h3
            className="rise mt-6 font-display text-[clamp(2.75rem,1.5rem+3.8vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink"
            style={rise(0.08)}
          >
            A dormant club to{" "}
            <span className="font-serif font-medium italic tracking-normal text-accent">Club of the Year</span> in
            eighteen months.
          </h3>
          <p className="rise mt-6 max-w-[620px] text-base leading-relaxed text-ink-soft lg:text-[17px]" style={rise(0.12)}>
            I took over a club that had gone quiet and rebuilt it from scratch. I
            led the merger of two university tennis clubs during the Adelaide and
            UniSA consolidation, co-authored the new constitution, brought
            together an eight-member committee, and won grants for facility
            upgrades. The real challenge was getting two groups who didn&apos;t
            know each other to trust the process and work as one.
          </p>
        </div>

        <div className="rise mx-auto w-full max-w-[460px] lg:max-w-none" style={rise(0.16)}>
          <figure>
            <div className={`${print} aspect-[480/330] rotate-[2deg]`}>
              <Image src={lead.src} alt={lead.alt} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
            </div>
            <figcaption className="mt-5 font-mono text-xs text-ink-muted">{lead.caption}</figcaption>
          </figure>
          {rest.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              {rest.map((p) => (
                <figure key={p.src}>
                  <div className={`${print} aspect-[4/3] -rotate-[1.5deg]`}>
                    <Image src={p.src} alt={p.alt} fill sizes="240px" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 font-mono text-xs text-ink-muted">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>

      <dl className="rise mt-12 grid grid-cols-2 border-y border-hairline lg:mt-16 lg:grid-cols-4" style={rise(0.24)}>
        {outcomes.map((o) => (
          <div key={o.label} className="flex flex-col py-6 lg:py-[26px]">
            <dt className="order-last mt-2 text-sm text-ink-muted lg:text-[15px]">{o.label}</dt>
            <dd className="whitespace-nowrap font-display text-[clamp(2rem,1.2rem+2.4vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em] text-ink">
              {o.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* The merger, told in three beats read straight down the page. */}
      <ol className="rise relative mt-12 grid gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-10" style={rise(0.32)}>
        <span
          aria-hidden
          className="absolute left-0 right-0 top-[14px] hidden h-0.5 bg-[linear-gradient(90deg,var(--accent),rgb(255_91_46/0.1))] lg:block"
        />
        {mergerStory.map((beat, i) => {
          const long = beat.label === "What I did";
          return (
            <li key={beat.label} className="relative">
              <span
                aria-hidden
                className="flex size-[30px] items-center justify-center rounded-full bg-accent font-mono text-xs font-bold text-paper"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-ink">{beat.label}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-muted">
                {long ? trimmed(beat.text) : beat.text}
              </p>
              {long && (
                <button
                  type="button"
                  data-expand
                  onClick={(e) => openStory("president", e.currentTarget.closest("ol"))}
                  className="mt-5 flex h-12 items-center gap-2.5 rounded-full border border-accent bg-accent/10 px-5 text-[15px] font-semibold text-accent-soft transition-[background-color,color,transform] duration-250 hover:translate-x-[3px] hover:bg-accent hover:text-paper motion-reduce:hover:translate-x-0"
                >
                  Read the whole story
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
