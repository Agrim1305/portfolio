"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { awardPhoto, openStory } from "@/lib/stories";

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

export function Leadership() {
  return (
    <section id="leadership" tabIndex={-1} className="outline-none wrap py-20 lg:py-28">
      <SectionHeader
        label="Leadership"
        headline="I took over a dormant club and handed it on as Club of the Year."
        numbers={[
          { value: "10 to 100+", label: "active members in 18 months" },
          { value: "2 to 1", label: "clubs merged" },
          { value: "$7,000+", label: "in grants" },
          { value: "2025", label: "Club of the Year" },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-start lg:gap-14">
        <div>
          <p className="rise text-[15px] text-ink-muted lg:text-lg" style={rise(0.04)}>
            Adelaide University Tennis Club · President, Jul 2024 to Mar 2026
          </p>
          <p className="rise mt-6 max-w-[620px] text-base leading-relaxed text-ink-soft lg:text-[17px]" style={rise(0.12)}>
            I led the merger of two university tennis clubs during the Adelaide
            and UniSA consolidation, co-authored the new constitution, brought
            together an eight-member committee, and won grants for facility
            upgrades. The real challenge was getting two groups who didn&apos;t
            know each other to trust the process and work as one.
          </p>
          <div className="rise mt-8" style={rise(0.2)}>
            <button
              type="button"
              data-expand
              onClick={(e) => openStory("president", e.currentTarget.parentElement)}
              className="flex h-12 items-center gap-2.5 rounded-full border border-accent bg-accent/10 px-5 text-[15px] font-semibold text-accent-soft transition-[background-color,color,transform] duration-250 hover:translate-x-[3px] hover:bg-accent hover:text-paper motion-reduce:hover:translate-x-0"
            >
              Read the whole story
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <figure className="rise mx-auto w-full max-w-[460px] lg:max-w-none" style={rise(0.16)}>
          <div className="relative aspect-[480/330] overflow-hidden rounded-[18px] shadow-[0_30px_60px_rgb(0_0_0/0.5)]">
            <Image src={awardPhoto.src} alt={awardPhoto.alt} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
          </div>
          <figcaption className="mt-5 font-mono text-xs text-ink-muted">{awardPhoto.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
