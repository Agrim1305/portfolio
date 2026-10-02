"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/* What the cloud's face shows. Thinking and answering follow the chat
   stream; the rest are set by the dock (see dock.tsx). */
export type Mood = "idle" | "thinking" | "answering" | "happy" | "surprised" | "sleepy" | "wink";

// The eyes, in the cloud's own 395 x 340 box: each is 34 wide and 77 tall,
// centred 57.5% of the way down, at 36% and 62% across.
const EYES = [142.2, 244.9];
const EYE_Y = 195.5;

/* The cloud avatar: a vector body with an SVG layer of eyes drawn in the
   cloud's own coordinates, so it looks the same at any size. Each eye is a
   pill, a round eye and a closed arc; a mood shows one or another by scale
   and opacity (see globals.css), so the face blends from one shape to the
   next. `live` adds the blink, the cursor follow, and a quick squash and
   stretch of the body when the mood changes; the chat header uses it still.
   Decorative, so it is hidden from assistive tech; whatever holds it carries
   the name. */
export function Cloud({
  live = false,
  mood = "idle",
  className = "",
}: {
  live?: boolean;
  mood?: Mood;
  className?: string;
}) {
  const eyes = useRef<HTMLSpanElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const shown = useRef(mood);

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

  // A change of mood lands with a small squash and stretch from the base.
  useEffect(() => {
    if (mood === shown.current) return;
    shown.current = mood;
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    body.current?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.06, 0.94)" },
        { transform: "scale(0.98, 1.03)" },
        { transform: "scale(1)" },
      ],
      { duration: 380, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }, [mood, live]);

  return (
    <span aria-hidden data-mood={mood} className={`cloud relative block aspect-[395/340] ${className}`}>
      <span ref={body} className="absolute inset-0 origin-bottom">
        <Image
          src="/images/cloud.svg"
          alt=""
          fill
          loading={live ? "eager" : "lazy"}
          className={live ? "drop-shadow-[0_30px_50px_rgb(240_140_60/0.28)]" : ""}
        />
        <span ref={eyes} className={`absolute inset-0 ${live ? "cloud-eyes" : ""}`}>
          <svg viewBox="0 0 395 340" className="size-full overflow-visible">
            {EYES.map((cx, i) => (
              <g key={cx} className={`cloud-eye ${i ? "cloud-eye-right" : ""} ${live ? "cloud-blink" : ""}`}>
                <rect className="eye-pill" x={cx - 17} y={EYE_Y - 38.7} width={34} height={77.4} rx={17} />
                <circle className="eye-round" cx={cx} cy={EYE_Y} r={26} />
                <path className="eye-arc" d={`M${cx - 27} ${EYE_Y + 12} Q${cx} ${EYE_Y - 28} ${cx + 27} ${EYE_Y + 12}`} />
              </g>
            ))}
          </svg>
        </span>
      </span>
    </span>
  );
}
