"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/* The cloud avatar: a vector body, with the eyes as two CSS pills on their own
   layer so they can blink and follow the cursor. Everything is placed in
   percentages of the cloud's box (395 x 340): each eye is 8.6% of the width
   wide and 22.75% of the height tall, centred at (36%, 57.5%) and
   (62%, 57.5%), and the cursor follow moves them by a share of the box too,
   so the cloud looks the same at any size. `live` adds the blink and the
   follow; the chat header uses it still. Decorative, so it is hidden from
   assistive tech; whatever holds it carries the name. */
export function Cloud({ live = false, className = "" }: { live?: boolean; className?: string }) {
  const eyes = useRef<HTMLSpanElement>(null);

  // The eyes follow the pointer together, eased by a CSS transition and
  // clamped to a couple of percent of the cloud. Fine pointers only, never
  // under reduced motion.
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
        el.style.setProperty("--eye-x", `${clamp((x - (r.left + r.width / 2)) / 60, 2.2)}%`);
        el.style.setProperty("--eye-y", `${clamp((y - (r.top + r.height * 0.575)) / 60, 2)}%`);
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
    <span aria-hidden className={`relative block aspect-[395/340] ${className}`}>
      <Image
        src="/images/cloud.svg"
        alt=""
        fill
        loading={live ? "eager" : "lazy"}
        className={live ? "drop-shadow-[0_30px_50px_rgb(240_140_60/0.28)]" : ""}
      />
      <span ref={eyes} className={`absolute inset-0 ${live ? "cloud-eyes" : ""}`}>
        <span className={`${eye} left-[31.7%]`} />
        <span className={`${eye} left-[57.7%]`} />
      </span>
    </span>
  );
}
