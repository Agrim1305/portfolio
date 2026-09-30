"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { leaveGesture, registerLenis } from "@/lib/scroll-lock";

function start() {
  // Lenis reads `scroll-padding-top` itself, so anchors clear the sticky
  // header without an extra offset. A pinned section can take a gesture
  // before Lenis scrolls with it.
  const lenis = new Lenis({ duration: 0.8, anchors: true, virtualScroll: leaveGesture });
  document.documentElement.classList.add("smooth-scroll");
  registerLenis(lenis);

  // The page's one scroll loop: Lenis moves the page here, and everything
  // scroll-linked runs from its scroll event inside this same frame.
  let frame = requestAnimationFrame(function loop(time) {
    lenis.raf(time);
    frame = requestAnimationFrame(loop);
  });

  return () => {
    cancelAnimationFrame(frame);
    registerLenis(null);
    document.documentElement.classList.remove("smooth-scroll");
    lenis.destroy();
  };
}

/* Weighted smooth scrolling. Lenis drives the real scroll position rather than
   transforming a wrapper, so the nav scroll-spy listener and the
   IntersectionObserver reveals keep working against `window.scrollY` unchanged.
   It stops and starts with reduced motion, which also switches the pinned
   sections between travel and swipe; without it the CSS `scroll-behavior`
   fallback handles anchor jumps. */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop: (() => void) | undefined;
    const sync = () => {
      stop?.();
      stop = reduce.matches ? undefined : start();
    };
    sync();
    reduce.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return null;
}
