"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { X } from "lucide-react";
import { Cloud, type Mood } from "@/components/cloud";
import { usePinned } from "@/lib/pinned-track";
import { onLenisScroll } from "@/lib/scroll-lock";
import { useSectionQuestion } from "@/lib/section-questions";

// The cloud reaches its dock once the page has scrolled this share of the
// hero's height. The Ask card has folded into it by this share of the way,
// and under reduced motion the two swap a quarter of the way.
const DOCKED_AT = 0.8;
const CARD_GONE_AT = 0.75;
const SWAP_AT = 0.25;

// Where the cloud and the card swap by fading instead of travelling.
const STILL_QUERY = "(min-width: 48rem) and (prefers-reduced-motion: reduce)";

// How long a one-beat face lasts, and how long without input before the
// cloud gets sleepy.
const BEAT_MS = 1400;
const SLEEP_MS = 60_000;

/* Whether the cloud has winked at a hover this visit. */
function firstWink() {
  try {
    if (sessionStorage.getItem("winked")) return false;
    sessionStorage.setItem("winked", "1");
  } catch {}
  return true;
}

/* The cloud in the bottom-right corner is the chat's button. From md up with
   motion allowed, the page's cloud starts in the hero: this button takes the
   hero cloud's place (the hero's copy hides) and, as the hero scrolls away,
   shrinks and glides down a gentle curve into the corner, and back up again
   on the way up. It moves with transforms only, from Lenis's scroll event, so
   it keeps pace with the page, and the hero's Ask card folds into it on the
   way: smaller, fainter and rounder, until only the cloud is left. Under
   reduced motion nothing travels: from md up the card fades out and the
   button fades in once the page is a little way down. On phones and on pages
   without a hero, the button fades in once the hero is out of view, or from
   the start. */
export function Dock({
  heroId,
  open,
  mood,
  onClick,
  onAsk,
  buttonRef,
}: {
  heroId?: string;
  open: boolean;
  mood: Mood;
  onClick: () => void;
  onAsk: (question: string) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const travels = usePinned() && Boolean(heroId);
  const [heroGone, setHeroGone] = useState(!heroId);
  const [swapped, setSwapped] = useState(false);
  const cornerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [peek, setPeek] = useState(false);
  // Escape put the tooltip away; focus alone won't bring it back until the
  // pointer or focus leaves the corner.
  const quiet = useRef(false);
  // Section questions start once the hero is gone, and wait while the chat
  // is open.
  const { question, fits, see, done } = useSectionQuestion(heroGone && !open, bubbleRef, cornerRef);

  // The face. The chat's own moods come first; then a one-beat face: happy
  // as the chat opens, surprised as a new section's question appears, a
  // wink at the first hover of a visit; then sleepy after a minute without
  // input, until the pointer moves; otherwise idle.
  const [beat, setBeat] = useState<Mood | null>(null);
  const [sleepy, setSleepy] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setBeat("happy");
  }
  const [lastAsked, setLastAsked] = useState<string | null>(null);
  if (question && question.id !== lastAsked) {
    setLastAsked(question.id);
    setBeat("surprised");
  }
  useEffect(() => {
    if (!beat) return;
    const t = setTimeout(() => setBeat(null), BEAT_MS);
    return () => clearTimeout(t);
  }, [beat]);
  useEffect(() => {
    let timer = 0;
    const rest = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => setSleepy(true), SLEEP_MS);
    };
    const wake = () => {
      setSleepy(false);
      rest();
    };
    const inputs = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    rest();
    for (const type of inputs) window.addEventListener(type, wake, { passive: true });
    return () => {
      clearTimeout(timer);
      for (const type of inputs) window.removeEventListener(type, wake);
    };
  }, []);
  const face: Mood = mood !== "idle" ? mood : (beat ?? (sleepy ? "sleepy" : "idle"));

  useEffect(() => {
    const hero = heroId && document.getElementById(heroId);
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroGone(!entry.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  useEffect(() => {
    const hero = heroId ? document.getElementById(heroId) : null;
    const card = hero?.querySelector<HTMLElement>("#ask-card");
    if (!hero || !card) return;
    const still = window.matchMedia(STILL_QUERY);
    let was = false;
    const check = () => {
      const now = still.matches && window.scrollY > hero.offsetHeight * DOCKED_AT * SWAP_AT;
      if (now === was) return;
      was = now;
      setSwapped(now);
      card.style.opacity = now ? "0" : "";
      card.style.visibility = now ? "hidden" : "";
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    still.addEventListener("change", check);
    return () => {
      window.removeEventListener("scroll", check);
      still.removeEventListener("change", check);
      card.style.opacity = "";
      card.style.visibility = "";
    };
  }, [heroId]);

  // Before paint, so the corner never shows the button untransformed and the
  // swap with the hero's copy is invisible.
  useLayoutEffect(() => {
    const button = buttonRef.current;
    const corner = cornerRef.current;
    const hero = heroId ? document.getElementById(heroId) : null;
    const slot = hero?.querySelector<HTMLElement>("#hero-cloud");
    const heroCloud = slot?.querySelector<HTMLElement>(".cloud");
    const card = hero?.querySelector<HTMLElement>("#ask-card");
    const cardFace = card?.firstElementChild as HTMLElement | null | undefined;
    if (!travels || !button || !corner || !hero || !slot || !heroCloud || !card || !cardFace) return;

    // The cloud's centre and width at rest in the corner, from the corner's
    // layout box, which the cloud's transform never moves.
    let dock = { x: 0, y: 0, width: 1 };
    const radius = parseFloat(getComputedStyle(cardFace).borderTopLeftRadius);
    let round = radius;
    const measure = () => {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = corner;
      dock = { x: offsetLeft + offsetWidth / 2, y: offsetTop + offsetHeight / 2, width: offsetWidth };
      // The card folds towards the hero cloud's centre, and ends as round as
      // its height allows.
      card.style.transformOrigin = `${slot.offsetLeft + slot.offsetWidth / 2 - card.offsetLeft}px ${
        slot.offsetTop + slot.offsetHeight / 2 - card.offsetTop
      }px`;
      round = cardFace.offsetHeight / 2;
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
      const x = along(from.x, via.x, dock.x);
      const y = along(from.y, via.y, dock.y);
      button.style.transform = `translate(${x - dock.x}px, ${y - dock.y}px) scale(${scale})`;
      button.style.setProperty("--scale", String(scale));

      // The card follows the cloud, shrinking, fading and rounding off. The
      // radius is the one property here that repaints; nothing reflows.
      const fold = Math.min(1, t / CARD_GONE_AT);
      card.style.transform = fold ? `translate(${x - from.x}px, ${y - from.y}px) scale(${1 - 0.85 * fold})` : "";
      card.style.opacity = fold ? String(1 - fold) : "";
      card.style.visibility = fold === 1 ? "hidden" : "";
      card.style.pointerEvents = fold > 0.5 ? "none" : "";
      cardFace.style.borderRadius = fold ? `${radius + (round - radius) * fold}px` : "";
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
      for (const prop of ["transform", "transform-origin", "opacity", "visibility", "pointer-events"]) {
        card.style.removeProperty(prop);
      }
      cardFace.style.borderRadius = "";
    };
  }, [travels, heroId, buttonRef]);

  const tooltip = Boolean(question && !fits);
  const bubbleShown = Boolean(question && (fits || peek));

  return (
    <div
      ref={cornerRef}
      // The corner holds the cloud and its question. Only they take the
      // pointer, so while the cloud is up in the hero the empty corner
      // doesn't. Travelling, the cloud swaps in for the hero's copy at once;
      // otherwise the corner rises in, and visibility only waits out the fade
      // when hiding, so focus can return to the cloud the moment the chat
      // closes.
      className={`pointer-events-none fixed bottom-4 right-4 z-30 md:bottom-6 md:right-6 ${
        travels
          ? ""
          : `duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              heroGone || swapped
                ? "visible opacity-100 transition-[opacity,translate]"
                : "invisible translate-y-3 opacity-0 transition-[opacity,translate,visibility] motion-reduce:translate-y-0"
            }`
      }`}
      // Hovering or focusing the cloud shows a question that had no room of
      // its own as a tooltip above it, and it stays while the pointer or focus
      // moves onto it. Escape puts it away.
      onPointerEnter={() => {
        quiet.current = false;
        setPeek(true);
        see();
        if (heroGone && firstWink()) setBeat("wink");
      }}
      onPointerLeave={() => setPeek(false)}
      onFocus={() => {
        if (quiet.current) return;
        setPeek(true);
        see();
      }}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        quiet.current = false;
        setPeek(false);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !bubbleShown) return;
        e.stopPropagation();
        quiet.current = true;
        if (tooltip) setPeek(false);
        else done();
        buttonRef.current?.focus();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-label="Ask AI about Agrim"
        aria-keyshortcuts="Meta+K Control+K"
        aria-expanded={open}
        aria-controls="ask-agrim"
        aria-describedby={tooltip ? "dock-question-text" : undefined}
        className="dock pointer-events-auto relative block w-[76px] rounded-full md:w-[92px]"
      >
        <span className="hero-fade block">
          <Cloud live mood={face} />
        </span>
        {/* A question is waiting that had no room to show. */}
        {tooltip && !question?.seen && (
          <span aria-hidden className="absolute right-[10%] top-[8%] size-2 rounded-full bg-accent ring-2 ring-paper" />
        )}
      </button>
      {/* After the cloud, so Tab goes from the cloud to its question. */}
      {question && (
        <div
          ref={bubbleRef}
          id="dock-question"
          // Padding, not a margin, under the bubble, so the pointer can cross
          // from the cloud to the bubble without leaving the corner.
          className={`absolute bottom-full right-0 w-[200px] pb-2.5 transition-[opacity,translate,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            bubbleShown ? "pointer-events-auto visible opacity-100" : "invisible translate-y-1.5 opacity-0"
          }`}
        >
          <div className="relative rounded-2xl rounded-br-md bg-ink text-paper shadow-[0_18px_40px_rgb(0_0_0/0.45)]">
            <button
              id="dock-question-text"
              type="button"
              onClick={() => {
                // The question is about to go, so the chat hands focus back
                // to the cloud when it closes.
                buttonRef.current?.focus();
                done();
                onAsk(question.text);
              }}
              className="block w-full rounded-2xl rounded-br-md py-3 pl-3.5 pr-9 text-left text-[13px] font-medium leading-snug"
            >
              {question.text}
            </button>
            <button
              type="button"
              onClick={() => {
                buttonRef.current?.focus();
                done();
              }}
              aria-label="Dismiss this question"
              className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full text-paper/60 transition-colors hover:text-paper"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
