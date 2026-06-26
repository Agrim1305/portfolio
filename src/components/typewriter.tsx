"use client";

import { useEffect, useState } from "react";

/**
 * Cycles through a list of phrases, typing each out character by character,
 * pausing, then deleting and moving to the next. Pure setTimeout loop — no
 * dependencies. Respects reduced-motion by showing the first phrase statically.
 */
export function Typewriter({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseMs = 1600,
  className = "",
}: {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(phrases[0]);
      return;
    }

    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      // Finished typing — hold, then start deleting.
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      // Finished deleting — advance to next phrase.
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    } else {
      // Type or delete one character.
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      timeout = setTimeout(next === text ? () => {} : () => setText(next),
        deleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseMs, reduced]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[2px] h-[1em] translate-y-[2px] bg-accent-gold ml-1 animate-pulse" />
    </span>
  );
}