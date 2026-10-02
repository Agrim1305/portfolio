"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

// Only tools a project in projects.ts actually uses.
const STACK = [
  ["TypeScript", "typescript"],
  ["React", "react"],
  ["Next.js", "nextjs"],
  ["Node.js", "nodejs"],
  ["Python", "python"],
  ["Java", "java"],
  ["Spring Boot", "spring-boot"],
  ["PostgreSQL", "postgresql"],
  ["Claude API", "claude"],
  ["Tailwind", "tailwind"],
  ["Vue.js", "vue"],
];

/* A slow logo marquee under the hero. The list is doubled so the loop is
   seamless; the copy is hidden from assistive tech. Moving content needs a
   way to stop it, hence the pause button. Under reduced motion it sits still
   and wraps onto more lines instead. */
export function TechStrip() {
  const [paused, setPaused] = useState(false);
  const items = STACK.map(([name, file]) => (
    <li key={name} className="flex shrink-0 items-center gap-2 px-5 lg:gap-3 lg:px-[34px]">
      <Image
        src={`/images/logos/${file}.svg`}
        alt=""
        width={26}
        height={26}
        className="size-5 opacity-65 lg:size-[26px]"
      />
      <span className="whitespace-nowrap text-sm font-medium text-ink-soft lg:text-[17px]">
        {name}
      </span>
    </li>
  ));

  return (
    <div className="relative border-y border-hairline">
      <div className="marquee-wrap overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] motion-reduce:[mask-image:none]">
        <div className="marquee flex w-max motion-reduce:w-full" data-paused={paused}>
          <ul
            aria-label="Stack"
            className="flex h-16 items-center lg:h-24 motion-reduce:h-auto motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:py-5"
          >
            {items}
          </ul>
          <ul aria-hidden className="flex h-16 items-center lg:h-24 motion-reduce:hidden">
            {items}
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play the stack strip" : "Pause the stack strip"}
        className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink-muted shadow-[0_0_24px_12px_var(--paper)] transition-colors hover:text-ink motion-reduce:hidden lg:right-4"
      >
        {paused ? (
          <Play className="size-4" aria-hidden />
        ) : (
          <Pause className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
