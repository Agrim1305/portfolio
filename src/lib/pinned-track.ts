import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { onGesture, onLenisScroll, pageIsMoving, scrollToY } from "@/lib/scroll-lock";

/* Where the track pins. Everywhere else it is a native sideways scroller with
   scroll-snap. Keep in step with the pin variant and .pin-* in globals.css. */
const PIN_QUERY = "(min-width: 48rem) and (prefers-reduced-motion: no-preference)";

// How long the page must sit still before a pinned section comes to rest on
// its nearest slide: long enough that a trackpad's momentum has run out.
const SETTLE_AFTER_MS = 150;

// Stepping by gesture: how far a wheel or trackpad gesture must go to move a
// slide, how long the glide takes, and how long the input must go quiet
// before the next gesture counts.
const STEP_AFTER_PX = 30;
const GLIDE_MS = 700;
const QUIET_MS = 200;

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PIN_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/* Whether scroll-linked motion is on: md up with motion allowed. The pinned
   sections travel then, and the cloud flies from the hero to its dock. */
export function usePinned() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(PIN_QUERY).matches, () => false);
}

/* Scroll-pinned sideways travel. The section's stage sticks to the top for
   80svh of scroll per slide, and every frame Lenis moves the page, the track
   is translated by the same share of its width, so the slides glide rather
   than jump. Wheel and trackpad gestures and the page keys move it one slide
   at a time (see takeWheel); anything else that scrolls it (a finger, the
   scrollbar) settles on the nearest slide once the page is still. Unpinned,
   the track scrolls sideways itself. Either way `active` is the slide
   nearest the middle and `go` moves to one: pinned, by gliding the window to
   that slide's position. `step` moves one slide on from wherever the track
   is already heading, so quick presses queue up. */
export function usePinnedTrack(count: number) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = usePinned();
  const [active, setActive] = useState(0);
  // The slide a press sent the track to, until it gets there or the visitor
  // takes over.
  const pending = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const slides = track.querySelectorAll<HTMLElement>("[data-index]");

    if (!pinned) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const i = Number((e.target as HTMLElement).dataset.index);
            setActive(i);
            if (i === pending.current) pending.current = null;
          }
        },
        { root: track, threshold: 0.6 },
      );
      slides.forEach((el) => io.observe(el));
      const takeOver = () => (pending.current = null);
      track.addEventListener("pointerdown", takeOver);
      return () => {
        io.disconnect();
        track.removeEventListener("pointerdown", takeOver);
      };
    }

    const gaps = Math.max(1, count - 1);
    let travel = 1;
    let step = 0;
    const measure = () => {
      travel = Math.max(1, section.offsetHeight - window.innerHeight);
      step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0;
    };
    const progress = () => Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));
    const slideY = (i: number) => section.getBoundingClientRect().top + window.scrollY + (i / gaps) * travel;
    // Where the page is in the section, in slides, or null outside it.
    const at = () => {
      const pos = -section.getBoundingClientRect().top;
      return pos < -1 || pos > travel + 1 ? null : (pos / travel) * gaps;
    };
    // Whether a move `dir` from `i` leaves the section: outward from the
    // first or last slide, where the page scrolls on as usual.
    const leaves = (i: number, dir: number) => (dir < 0 && i <= 0.01) || (dir > 0 && i >= gaps - 0.01);

    // One wheel or trackpad gesture moves one slide, whatever its size: past
    // a small threshold the page glides to the next slide, and input is then
    // ignored until the glide is over and the gesture has gone quiet, so a
    // flick's momentum never carries on to a second slide. A flick that
    // carries the page into the section comes to rest on the slide it reached.
    let busyUntil = 0;
    let lastWheel = 0;
    let sum = 0;
    const glideTo = (i: number) => {
      const to = Math.max(0, Math.min(gaps, i));
      pending.current = to;
      busyUntil = performance.now() + GLIDE_MS;
      scrollToY(slideY(to));
    };
    const takeWheel = ({ deltaY, event }: { deltaY: number; event: WheelEvent | TouchEvent }) => {
      const i = at();
      if (event.type !== "wheel" || !deltaY || i === null) return false;
      const now = performance.now();
      const quiet = now - lastWheel;
      lastWheel = now;
      const dir = Math.sign(deltaY);
      if (now < busyUntil || (busyUntil && quiet < QUIET_MS)) {
        event.preventDefault();
        return true;
      }
      busyUntil = 0;
      if (leaves(i, dir)) return false;
      event.preventDefault();
      if (pageIsMoving()) {
        glideTo(dir > 0 ? Math.floor(i + 0.01) : Math.ceil(i - 0.01));
        return true;
      }
      if (quiet > QUIET_MS) sum = 0;
      sum += deltaY;
      if (Math.abs(sum) >= STEP_AFTER_PX) {
        sum = 0;
        glideTo(Math.round(i) + dir);
      }
      return true;
    };
    // The page keys step too while the section is pinned, one slide a press,
    // queued like the arrows. Not from a control or a field, which keep their
    // own keys.
    const takeKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if ((e.target as Element).closest("input, textarea, select, button, a, [contenteditable], [role='dialog']")) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      const i = at();
      if ((!down && !up) || i === null) return;
      const from = pending.current ?? Math.round(i);
      if (leaves(from, down ? 1 : -1)) return;
      e.preventDefault();
      glideTo(from + (down ? 1 : -1));
    };

    // A still page inside the section glides to the nearest slide. Not while
    // a finger or the mouse is down, which is a drag that has only paused.
    let held = false;
    let idle = 0;
    const settle = () => {
      pending.current = null;
      const p = progress();
      if (held || p <= 0 || p >= 1) return;
      const y = section.getBoundingClientRect().top + window.scrollY + (Math.round(p * gaps) / gaps) * travel;
      if (Math.abs(y - window.scrollY) > 1) scrollToY(y, { duration: 0.6 });
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
    const offGesture = onGesture(takeWheel);
    window.addEventListener("keydown", takeKey);
    window.addEventListener("resize", onResize, { passive: true });
    for (const [type, listener] of holdEvents) window.addEventListener(type, listener, { passive: true });
    return () => {
      offScroll();
      offGesture();
      window.removeEventListener("keydown", takeKey);
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
    pending.current = to;
    if (pinned) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = section.offsetHeight - window.innerHeight;
      scrollToY(top + (count > 1 ? (to / (count - 1)) * travel : 0), { immediate });
      return;
    }
    trackRef.current?.querySelector(`[data-index="${to}"]`)?.scrollIntoView({
      inline: "start",
      block: "nearest",
      behavior: immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  const step = (by: number) => go((pending.current ?? active) + by);

  // Keyboard focus landing on a slide that is off to the side brings it into
  // view. Pointer clicks don't, so a click never nudges the page.
  function onFocus(e: React.FocusEvent) {
    if (!pinned || !(e.target as Element).matches(":focus-visible")) return;
    const slide = (e.target as Element).closest<HTMLElement>("[data-index]");
    if (slide) go(Number(slide.dataset.index), true);
  }

  return { sectionRef, trackRef, pinned, active, go, step, onFocus };
}
