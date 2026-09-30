"use client";

import { useEffect } from "react";
import { scrollToY } from "@/lib/scroll-lock";

// How long the page must be still, and how close a section's top must be to
// the top of the screen, as a share of its height, before it is set in place.
const SNAP_AFTER_MS = 150;
const ZONE = 0.25;

/* Section tops settle into place. Once the page has been still for a moment,
   a section whose top is within a quarter of a screen of the top glides into
   place over 0.6s, in the direction the page was going: scrolling down, a
   top just below comes up; scrolling up, a top just above comes down. So
   either way the page comes to rest neatly on a section, and it never pulls
   back against the reader, which would undo the first stretch of scrolling
   into every tall section. Deep inside a section no top is that close, so
   nothing moves. Pinned sections step through their own cards
   (lib/pinned-track.ts); their tops snap like any other. From md up only:
   phones keep their native scroll. Under reduced motion the page jumps
   instead of gliding. Never while a finger or the mouse is down, a sheet is
   open, or the move would take keyboard focus off the screen. */
export function SectionSnap() {
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 48rem)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let held = false;
    let idle = 0;
    let lastY = window.scrollY;
    let heading = 0;

    const settle = () => {
      if (held || !wide.matches || document.querySelector("dialog[open]")) return;
      const nearest = [...document.querySelectorAll("main section[id]")]
        .map((section) => section.getBoundingClientRect().top)
        .reduce((best, top) => (Math.abs(top) < Math.abs(best) ? top : best), Infinity);
      if (Math.abs(nearest) < 1 || Math.abs(nearest) > window.innerHeight * ZONE) return;
      if (Math.sign(nearest) !== heading) return;
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && focused.matches(":focus-visible")) {
        const r = focused.getBoundingClientRect();
        if (r.top - nearest < 0 || r.bottom - nearest > window.innerHeight) return;
      }
      scrollToY(window.scrollY + nearest, reduce.matches ? { immediate: true } : { duration: 0.6 });
    };
    const waitForStill = () => {
      const y = window.scrollY;
      if (y !== lastY) heading = Math.sign(y - lastY);
      lastY = y;
      clearTimeout(idle);
      idle = window.setTimeout(settle, SNAP_AFTER_MS);
    };
    const hold = (down: boolean) => () => {
      held = down;
      if (!down) waitForStill();
    };
    const events = [
      ["scroll", waitForStill],
      ["touchstart", hold(true)],
      ["touchend", hold(false)],
      ["touchcancel", hold(false)],
      ["mousedown", hold(true)],
      ["mouseup", hold(false)],
    ] as const;
    for (const [type, listener] of events) window.addEventListener(type, listener, { passive: true });
    return () => {
      for (const [type, listener] of events) window.removeEventListener(type, listener);
      clearTimeout(idle);
    };
  }, []);

  return null;
}
