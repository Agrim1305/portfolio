"use client";

import { useLayoutEffect, useRef } from "react";
import type { mergerStory } from "@/lib/stories";

/* The merger's beats as equal boxes, one border and padding each, the
   beat's initial outlined in the top-right corner beside the label, never
   over the text. `clamp` is for the page: three equal columns from lg up
   (one height), each beat held to six lines (seven from md up) and fading
   out over its last line when cut short. The full story stacks them at the
   panel's width, whole, the text at a reading measure. */
export function MergerBeats({ beats, clamp = false }: { beats: typeof mergerStory; clamp?: boolean }) {
  const list = useRef<HTMLOListElement>(null);

  // Only a beat that is actually cut short fades.
  useLayoutEffect(() => {
    const el = list.current;
    if (!clamp || !el) return;
    const texts = [...el.querySelectorAll<HTMLElement>("p")];
    const mark = () => texts.forEach((t) => t.toggleAttribute("data-clamped", t.scrollHeight > t.clientHeight + 1));
    mark();
    const ro = new ResizeObserver(mark);
    ro.observe(el);
    return () => ro.disconnect();
  }, [clamp]);

  return (
    <ol ref={list} className={clamp ? "grid gap-4 lg:grid-cols-3" : "flex flex-col gap-8"}>
      {beats.map((beat) => (
        <li key={beat.label} className="rounded-[22px] border border-hairline bg-[#1A1A1F] p-6">
          <div className="flex items-start justify-between gap-4">
            <h4 className="pt-1 font-mono text-xs uppercase tracking-[0.15em] text-accent-soft">{beat.label}</h4>
            <span
              aria-hidden
              className="font-display text-[120px] font-extrabold leading-[0.75] text-transparent [-webkit-text-stroke:1.5px_rgb(255_91_46/0.35)]"
            >
              {beat.label[0]}
            </span>
          </div>
          <p
            className={`mt-4 text-base leading-relaxed text-[#D6D3CD] ${
              clamp
                ? "line-clamp-6 md:line-clamp-7 data-clamped:[mask-image:linear-gradient(180deg,#000_calc(100%-1lh),transparent)]"
                : "max-w-[70ch]"
            }`}
          >
            {beat.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
