"use client";

import { useEffect, useRef } from "react";

/* The signature drafting field: a fixed, very faint grid, plus a second grid
   layer masked to a soft circle that follows the cursor, light raking across
   drafting film. Pointer-only and reduced-motion-safe: on touch or reduced
   motion the reveal layer never activates and the base grid sits still. */
export function DraftGrid() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glow.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!fine || reduced) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.classList.add("active");
        raf = 0;
      });
    };
    const onLeave = () => el.classList.remove("active");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="draft-grid" aria-hidden />
      <div ref={glow} className="draft-grid-glow" aria-hidden />
    </>
  );
}
