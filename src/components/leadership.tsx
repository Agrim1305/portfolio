"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MergerBeats } from "@/components/merger-beats";
import { awardPhoto, mergerStory, openStory } from "@/lib/stories";

const outcomes = [
  { value: "2 → 1", label: "clubs merged" },
  { value: "$7,000+", label: "grants secured" },
  { value: "10 → 100+", label: "active members" },
  { value: "Winner", label: "Club of the Year 2025" },
];

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

const print =
  "relative overflow-hidden rounded-[18px] border-[5px] border-ink shadow-[0_30px_60px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-[0.5deg] hover:scale-[1.02] motion-reduce:transition-none";

export function Leadership() {
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
              <Image src={awardPhoto.src} alt={awardPhoto.alt} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
            </div>
            <figcaption className="mt-5 font-mono text-xs text-ink-muted">{awardPhoto.caption}</figcaption>
          </figure>
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

      {/* The merger in three beats, each held to a few lines here; the
          whole story grows out of them. */}
      <div className="rise mt-12 lg:mt-14" style={rise(0.32)}>
        <MergerBeats beats={mergerStory} clamp />
        <button
          type="button"
          data-expand
          onClick={(e) => openStory("president", e.currentTarget.parentElement)}
          className="mt-6 flex h-12 items-center gap-2.5 rounded-full border border-accent bg-accent/10 px-5 text-[15px] font-semibold text-accent-soft transition-[background-color,color,transform] duration-250 hover:translate-x-[3px] hover:bg-accent hover:text-paper motion-reduce:hover:translate-x-0"
        >
          Read the whole story
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
