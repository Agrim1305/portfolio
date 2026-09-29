"use client";

import { ArrowRight } from "lucide-react";
import { openStory } from "@/lib/stories";

/* The teaser for the merger story, which opens as the President role's full
   story. */
export function LeadershipStory() {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-hairline bg-surface p-6 sm:flex-row sm:items-center sm:justify-between lg:rounded-[28px] lg:px-9 lg:py-7">
      <p>
        <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">
          The challenge
        </span>
        <span
          id="story-teaser"
          className="mt-1.5 block font-display text-xl font-bold leading-snug text-ink lg:text-2xl"
        >
          Running our side of a two-university club merger
        </span>
      </p>
      <button
        type="button"
        data-expand
        aria-describedby="story-teaser"
        onClick={(e) => openStory("president", e.currentTarget.parentElement)}
        className="flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full border border-accent bg-accent/10 px-5 text-[15px] font-semibold text-accent-soft transition-[background-color,color,transform] duration-250 hover:translate-x-[3px] hover:bg-accent hover:text-paper motion-reduce:hover:translate-x-0"
      >
        Read it
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}
