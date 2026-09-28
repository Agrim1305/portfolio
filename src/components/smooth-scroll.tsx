"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll-lock";

/* Weighted smooth scrolling. Lenis drives the real scroll position rather than
   transforming a wrapper, so the nav scroll-spy listener and the
   IntersectionObserver reveals keep working against `window.scrollY` unchanged.
   Under reduced motion it never initialises and the CSS `scroll-behavior`
   fallback handles anchor jumps. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis reads `scroll-padding-top` itself, so anchors clear the sticky
    // header without an extra offset.
    const lenis = new Lenis({ duration: 0.8, anchors: true });
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
