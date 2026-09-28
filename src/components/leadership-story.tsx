"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Sheet } from "@/components/sheet";

const story = [
  {
    label: "Setup",
    text: "Adelaide and UniSA were merging, so every affiliated club had to merge too. I was president of the club that was ahead on membership and results, so I ran our side of it. That meant recruiting and bringing the right people across, aligning two committees that each ran their own social and competitive tennis, leading the merged constitution, and keeping every stakeholder comfortable, the University most of all, with as few conflicts as possible.",
  },
  {
    label: "What I did",
    text: "I started by working through what each committee actually wanted and where the two overlapped, then led the merged constitution until both sides were happy to sign it. The hardest piece was the coaches. They were two independent businesses, each loyal to a different club, and any shared model had to close the gaps where money could quietly leak out of the club. We talked through several models over a lot of meetings and settled on a three-month trial with both coaches running sessions together, so the real problems would surface early and we could fix them before locking anything in. Alongside that I ran member feedback to keep people bought into the change, and took on the practical handover myself: the facilities, the nets and fencing, the spare rackets, and the full asset register.",
  },
  {
    label: "Result",
    text: "One merged club running smoothly, both coaches retained on a model that actually worked, the members kept happy through the transition, and Club of the Year in the same year.",
  },
];

const OPEN_EVENT = "story:open";

/* Opens the merger story from anywhere (Leadership, and the President entry
   in Experience). */
export function openStory() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/* The "tell me about a conflict" story: a button that opens it in a sheet,
   one card per beat. */
export function LeadershipStory() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  return (
    <>
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
          onClick={() => setOpen(true)}
          className="flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full border border-accent bg-accent/10 px-5 text-[15px] font-semibold text-accent-soft transition-[background-color,color,transform] duration-250 hover:translate-x-[3px] hover:bg-accent hover:text-paper motion-reduce:hover:translate-x-0"
        >
          Read it
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="story-title"
        className="inset-x-0 bottom-0 top-auto h-[calc(100dvh-3rem)] w-full overflow-hidden rounded-t-[26px] border-t border-white/12 bg-sheet lg:inset-x-[max(2rem,calc(50vw-600px))] lg:top-6 lg:bottom-6 lg:h-auto lg:w-auto lg:rounded-[28px] lg:border"
      >
        <div className="thin-scroll h-full overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-hairline bg-sheet/90 py-2.5 pl-5 pr-3 backdrop-blur-md lg:h-[72px] lg:py-0 lg:pl-11 lg:pr-7">
            <span aria-hidden className="absolute left-1/2 top-2 h-[5px] w-10 -translate-x-1/2 rounded-full bg-ink/25 lg:hidden" />
            <p className="mt-2 min-w-0 flex-1 font-mono text-[11px] leading-relaxed text-accent-soft lg:mt-0 lg:text-xs">
              Adelaide University Tennis Club · President, Jul 2024 to Mar 2026
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="mt-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-surface-raised text-ink lg:mt-0"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="px-5 pb-12 pt-7 lg:px-16 lg:pb-[72px] lg:pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">
              The challenge
            </p>
            <h2
              id="story-title"
              className="mt-3 max-w-[820px] font-display text-[clamp(2.25rem,1.4rem+3vw,3.75rem)] font-extrabold leading-none tracking-[-0.03em] text-ink"
            >
              Running our side of a two-university club merger
            </h2>

            <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-[1fr_1.45fr_1fr] lg:items-start">
              {story.map((beat) => (
                <section
                  key={beat.label}
                  className="relative overflow-hidden rounded-[22px] border border-hairline bg-[#1A1A1F] px-[22px] pb-7 pt-6 transition-[transform,border-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-accent/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  {/* The beat's initial, outlined, as a watermark. */}
                  <span
                    aria-hidden
                    className="absolute -right-1.5 -top-6 font-display text-[150px] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_91_46/0.35)]"
                  >
                    {beat.label[0]}
                  </span>
                  <h3 className="relative font-mono text-xs uppercase tracking-[0.15em] text-accent-soft">
                    {beat.label}
                  </h3>
                  <p className="relative mt-16 text-base leading-relaxed text-[#D6D3CD]">
                    {beat.text}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </>
  );
}
