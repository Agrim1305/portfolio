"use client";


/* Takes a keyboard user past a carousel, a long run of tab stops, and moves
   focus to the section after it. The jump itself is the anchor's own. */
export function SkipLink({ to }: { to: string }) {
  return (
    <a
      href={`#${to}`}
      onClick={() => document.getElementById(to)?.focus({ preventScroll: true })}
      className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-[calc(var(--nav-height)+0.5rem)] focus:z-20 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-paper sm:focus:left-8"
    >
      Skip to next section
    </a>
  );
}
