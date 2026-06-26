"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right";

// Distance the element travels before settling. Larger = more visible slide.
const offsets: Record<Direction, string> = {
  up: "translate-y-12",
  down: "-translate-y-12",
  left: "translate-x-12",
  right: "-translate-x-12",
};

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect users who prefer reduced motion — show content immediately.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        // Custom easing: decelerates into place with a slight settle, so the
        // slide reads as deliberate movement rather than a plain fade.
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDuration: "900ms",
      }}
      className={`transition-all will-change-[transform,opacity] motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${offsets[direction]}`
      }`}
    >
      {children}
    </div>
  );
}