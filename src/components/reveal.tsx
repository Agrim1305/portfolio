"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect on the client, useEffect on the server, so we can decide
// visibility before first paint without the SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Wraps a section so its `.draw-line` and `.rise` descendants animate in as it
   enters view. Content is fully visible without JS (the hidden state only
   applies once the root is "armed"), and anything already on screen at load is
   shown immediately without a flash. */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    setArmed(true);

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    if (inView) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-armed={armed ? "" : undefined}
      data-visible={visible ? "" : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
