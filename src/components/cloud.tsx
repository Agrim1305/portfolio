"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/* The cloud avatar. Its eyes are two CSS pills on their own layer, not part of
   the image, so they can blink and follow the cursor. Sizes and positions are
   percentages of the cloud's box (397 x 342): each eye is 8.6% of the width
   wide and 19.6% of the width tall, centred at (36%, 57.5%) and (62%, 57.5%).
   `live` adds the float, the blink and the cursor follow; the chat header uses
   it still. Purely decorative, so it is hidden from assistive tech. */
export function Cloud({ live = false, className = "" }: { live?: boolean; className?: string }) {
  const eyes = useRef<HTMLSpanElement>(null);

  // The eyes follow the pointer together, eased by a CSS transition and
  // clamped to a few pixels. Fine pointers only, never under reduced motion.
  useEffect(() => {
    const el = eyes.current;
    if (!live || !el) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const clamp = (n: number, max: number) => Math.max(-max, Math.min(max, n));
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--eye-x", `${clamp((x - (r.left + r.width / 2)) / 30, 6)}px`);
        el.style.setProperty("--eye-y", `${clamp((y - (r.top + r.height * 0.575)) / 30, 4)}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [live]);

  const eye = `absolute top-[46.1%] h-[22.75%] w-[8.6%] rounded-full bg-[#0E0E0E] ${live ? "cloud-blink" : ""}`;

  return (
    <span aria-hidden className={`relative block aspect-[397/342] ${live ? "cloud-float" : ""} ${className}`}>
      <Image
        src="/images/cloud.webp"
        alt=""
        fill
        sizes={live ? "(min-width: 1024px) 360px, 240px" : "48px"}
        priority={live}
        className={live ? "drop-shadow-[0_30px_50px_rgb(240_140_60/0.28)]" : ""}
      />
      <span ref={eyes} className={`absolute inset-0 ${live ? "cloud-eyes" : ""}`}>
        <span className={`${eye} left-[31.7%]`} />
        <span className={`${eye} left-[57.7%]`} />
      </span>
    </span>
  );
}
