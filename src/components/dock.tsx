"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { Cloud } from "@/components/cloud";
import { usePinned } from "@/lib/pinned-track";
import { onLenisScroll } from "@/lib/scroll-lock";

// The cloud reaches its dock once the page has scrolled this share of the
// hero's height.
const DOCKED_AT = 0.8;

/* The cloud in the bottom-right corner is the chat's button. From md up with
   motion allowed, the page's cloud starts in the hero: this button takes the
   hero cloud's place (the hero's copy hides) and, as the hero scrolls away,
   shrinks and glides down a gentle curve into the corner, and back up again
   on the way up. It moves with transforms only, from Lenis's scroll event, so
   it keeps pace with the page. On phones, under reduced motion and on pages
   without a hero, nothing travels: the button fades in once the hero is out
   of view, or from the start. */
export function Dock({
  heroId,
  open,
  onClick,
  buttonRef,
}: {
  heroId?: string;
  open: boolean;
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const travels = usePinned() && Boolean(heroId);
  const [heroGone, setHeroGone] = useState(!heroId);

  useEffect(() => {
    const hero = heroId && document.getElementById(heroId);
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroGone(!entry.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  // Before paint, so the corner never shows the button untransformed and the
  // swap with the hero's copy is invisible.
  useLayoutEffect(() => {
    const button = buttonRef.current;
    const hero = heroId ? document.getElementById(heroId) : null;
    const slot = hero?.querySelector<HTMLElement>("#hero-cloud");
    const heroCloud = slot?.querySelector<HTMLElement>(".cloud");
    if (!travels || !button || !hero || !slot || !heroCloud) return;

    // The button's own centre and width at rest in the corner. Layout
    // offsets, so neither this transform nor the reveal's nudge counts.
    let dock = { x: 0, y: 0, width: 1 };
    const measure = () => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = button;
      dock = { x: offsetLeft + offsetWidth / 2, y: offsetTop + offsetHeight / 2, width: offsetWidth };
    };
    const place = () => {
      const s = slot.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * DOCKED_AT)));
      // Eased out, so the cloud heads for the corner as soon as the page moves
      // rather than riding up with the hero first.
      const t = 1 - (1 - p) ** 2;
      const from = { x: s.left + s.width / 2, y: s.top + s.height / 2 };
      // The curve's pull: mostly down first, then across into the corner.
      const via = { x: from.x + (dock.x - from.x) * 0.2, y: from.y + (dock.y - from.y) * 0.8 };
      const along = (a: number, b: number, c: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c;
      // Scaled in even steps from the hero's size down to the dock's.
      const scale = (s.width / dock.width) ** (1 - t);
      button.style.transform = `translate(${along(from.x, via.x, dock.x) - dock.x}px, ${along(from.y, via.y, dock.y) - dock.y}px) scale(${scale})`;
      button.style.setProperty("--scale", String(scale));
    };
    const onResize = () => {
      measure();
      place();
    };

    heroCloud.style.visibility = "hidden";
    measure();
    place();
    const offScroll = onLenisScroll(place);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      offScroll();
      window.removeEventListener("resize", onResize);
      button.style.transform = "";
      button.style.removeProperty("--scale");
      heroCloud.style.visibility = "";
    };
  }, [travels, heroId, buttonRef]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label="Ask AI about Agrim"
      aria-keyshortcuts="Meta+K Control+K"
      aria-expanded={open}
      aria-controls="ask-agrim"
      // Travelling, it swaps in for the hero's copy at once. Otherwise it
      // rises in; visibility only waits out the fade when hiding, so focus can
      // return to the button the moment the chat closes.
      // No transition at all while travelling: the transform follows the
      // scroll exactly, frame by frame.
      className={`dock fixed bottom-4 right-4 z-30 block w-[76px] rounded-full md:bottom-6 md:right-6 md:w-[92px] ${
        travels
          ? "visible"
          : `duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              heroGone
                ? "visible opacity-100 transition-[opacity,translate]"
                : "invisible translate-y-3 opacity-0 transition-[opacity,translate,visibility]"
            }`
      }`}
    >
      <span className="hero-fade block">
        <Cloud live />
      </span>
    </button>
  );
}
