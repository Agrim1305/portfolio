"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll-lock";

// Matches `scroll-padding-top`, so anchor links clear the sticky header.
const HEADER_OFFSET = -88;

/* Weighted smooth scrolling. Lenis drives the real scroll position rather than
   transforming a wrapper, so the nav scroll-spy listener and the
   IntersectionObserver reveals keep working against `window.scrollY` unchanged.
   Under reduced motion it never initialises and the CSS `scroll-behavior`
   fallback handles anchor jumps. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 0.8,
      anchors: { offset: HEADER_OFFSET },
    });
    document.documentElement.classList.add("smooth-scroll");
    registerLenis(lenis);

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
  }, []);

  return null;
}
