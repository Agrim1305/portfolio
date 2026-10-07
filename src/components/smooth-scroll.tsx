"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* Lenis smooths the mouse wheel and the trackpad, vertically only: no snap,
   no pinning, no stepping. Only for a fine pointer with motion allowed.
   Touch stays the browser's own, and Lenis's touch listeners (never
   passive) would make every touch scroll wait for the main thread, so phones
   and tablets don't run it at all. Sideways rows take their own sideways
   input (data-lenis-prevent-horizontal), and anything that scrolls itself
   (a sheet, the chat) carries data-lenis-prevent. */
const QUERY = "(prefers-reduced-motion: no-preference) and (pointer: fine)";

let lenis: Lenis | null = null;
const listeners = new Set<(y: number) => void>();
const notify = (y: number) => listeners.forEach((listener) => listener(y));

// Without Lenis, the page's own scroll, once a frame.
let frame = 0;
const onNativeScroll = () => {
  if (lenis || frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    notify(window.scrollY);
  });
};

/* Calls `listener` with the page's scroll position every frame the page
   moves. With Lenis it is the smoothed position, from inside Lenis's own
   frame, so whatever follows the page lands in the same frame as the
   scroll; without it, the native position. */
export function onPageScroll(listener: (y: number) => void) {
  if (!listeners.size) window.addEventListener("scroll", onNativeScroll, { passive: true });
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("scroll", onNativeScroll);
  };
}

/* Through Lenis when it runs, so the two never fight. */
export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView();
}

function start() {
  const instance = new Lenis({
    smoothWheel: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    gestureOrientation: "vertical",
    syncTouch: false,
    // Anchors land at their section's scroll-margin-top, the nav's height.
    anchors: true,
    autoRaf: true,
    // Shift and the wheel scroll a row sideways, natively.
    virtualScroll: ({ event }) => !event.shiftKey,
  });
  instance.on("scroll", (l: Lenis) => notify(l.scroll));
  lenis = instance;
  return () => {
    instance.destroy();
    lenis = null;
  };
}

export function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let stop: (() => void) | undefined;
    const sync = () => {
      stop?.();
      stop = mq.matches ? start() : undefined;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return null;
}
