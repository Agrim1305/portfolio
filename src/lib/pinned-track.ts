import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { onLenisScroll, scrollToY } from "@/lib/scroll-lock";

/* Where the track pins. Everywhere else it is a native sideways scroller with
   scroll-snap. Keep in step with the pin variant and .pin-* in globals.css. */
const PIN_QUERY = "(min-width: 48rem) and (prefers-reduced-motion: no-preference)";

// How long the page must sit still before a pinned section comes to rest on
// its nearest slide: long enough that a trackpad's momentum has run out.
const SETTLE_AFTER_MS = 150;

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PIN_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/* Scroll-pinned sideways travel. The section's stage sticks to the top for
   80svh of scroll per slide, and every frame Lenis moves the page, the track
   is translated by the same share of its width, so the slides glide rather
   than step. Once scrolling stops inside the section, the page settles on the
   nearest slide. Unpinned, the track scrolls sideways itself. Either way
   `active` is the slide nearest the middle and `go` moves to one: pinned, by
   scrolling the window to that slide's position. */
export function usePinnedTrack(count: number) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = useSyncExternalStore(subscribe, () => window.matchMedia(PIN_QUERY).matches, () => false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const slides = track.querySelectorAll<HTMLElement>("[data-index]");

    if (!pinned) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
          }
        },
        { root: track, threshold: 0.6 },
      );
      slides.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }

    const gaps = Math.max(1, count - 1);
    let travel = 1;
    let step = 0;
    const measure = () => {
      travel = Math.max(1, section.offsetHeight - window.innerHeight);
      step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0;
    };
    const progress = () => Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));

    // A still page inside the section glides to the nearest slide. Not while
    // a finger or the mouse is down, which is a drag that has only paused.
    let held = false;
    let idle = 0;
    const settle = () => {
      const p = progress();
      if (held || p <= 0 || p >= 1) return;
      const y = section.getBoundingClientRect().top + window.scrollY + (Math.round(p * gaps) / gaps) * travel;
      if (Math.abs(y - window.scrollY) > 1) scrollToY(y, { settle: true });
    };
    const waitForStill = () => {
      clearTimeout(idle);
      idle = window.setTimeout(settle, SETTLE_AFTER_MS);
    };

    let x = NaN;
    let travelling = false;
    const update = () => {
      const p = progress();
      const at = p * gaps;
      if (-at * step !== x) {
        x = -at * step;
        track.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      // Only a track that is moving gets its own compositor layer.
      if (travelling !== (p > 0 && p < 1)) {
        travelling = !travelling;
        track.style.willChange = travelling ? "transform" : "";
      }
      setActive(Math.round(at));
      waitForStill();
    };
    const onResize = () => {
      measure();
      update();
    };
    const hold = (down: boolean) => () => {
      held = down;
      if (!down) waitForStill();
    };
    const holdEvents = [
      ["touchstart", hold(true)],
      ["touchend", hold(false)],
      ["touchcancel", hold(false)],
      ["mousedown", hold(true)],
      ["mouseup", hold(false)],
    ] as const;

    measure();
    update();
    const offScroll = onLenisScroll(update);
    window.addEventListener("resize", onResize, { passive: true });
    for (const [type, listener] of holdEvents) window.addEventListener(type, listener, { passive: true });
    return () => {
      offScroll();
      window.removeEventListener("resize", onResize);
      for (const [type, listener] of holdEvents) window.removeEventListener(type, listener);
      clearTimeout(idle);
      track.style.transform = "";
      track.style.willChange = "";
    };
  }, [pinned, count]);

  function go(i: number, immediate = false) {
    const to = Math.max(0, Math.min(count - 1, i));
    const section = sectionRef.current;
    if (!section) return;
    if (pinned) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = section.offsetHeight - window.innerHeight;
      scrollToY(top + (count > 1 ? (to / (count - 1)) * travel : 0), { immediate });
      return;
    }
    trackRef.current?.querySelector(`[data-index="${to}"]`)?.scrollIntoView({
      inline: "start",
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  // Keyboard focus landing on a slide that is off to the side brings it into
  // view. Pointer clicks don't, so a click never nudges the page.
  function onFocus(e: React.FocusEvent) {
    if (!pinned || !(e.target as Element).matches(":focus-visible")) return;
    const slide = (e.target as Element).closest<HTMLElement>("[data-index]");
    if (slide) go(Number(slide.dataset.index), true);
  }

  return { sectionRef, trackRef, pinned, active, go, onFocus };
}
