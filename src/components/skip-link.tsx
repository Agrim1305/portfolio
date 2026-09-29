"use client";

import { scrollToY } from "@/lib/scroll-lock";

/* Jumps a keyboard user past a pinned section, which is several screens of
   scrolling, and moves focus to the section after it. The target comes from
   the real scroll position: Lenis's own anchor handling can still hold the
   position from before the focus scroll that brought this link into view,
   and would land short. */
export function SkipLink({ to }: { to: string }) {
  return (
    <a
      href={`#${to}`}
      onClick={(e) => {
        const target = document.getElementById(to);
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        scrollToY(target.getBoundingClientRect().top + window.scrollY - offset);
        target.focus({ preventScroll: true });
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-[calc(var(--nav-height)+0.5rem)] focus:z-20 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-paper sm:focus:left-8"
    >
      Skip to next section
    </a>
  );
}
