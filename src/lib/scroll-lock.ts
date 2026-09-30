import type Lenis from "lenis";

let lenis: Lenis | null = null;
const scrollListeners = new Set<() => void>();
const notify = () => scrollListeners.forEach((listener) => listener());

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (!instance) return;
  instance.on("scroll", notify);
  // The page may have moved before Lenis started (a scroll during hydration,
  // a restored position), so everything catches up once now.
  notify();
}

/* Calls `listener` every time Lenis moves the page. Lenis emits inside its own
   animation frame, right after it sets the scroll position, so anything
   written here (a transform, a CSS variable) lands in the same frame as the
   scroll and never trails it. Without Lenis (reduced motion) nothing scroll
   linked runs, so there is nothing to call. */
export function onLenisScroll(listener: () => void) {
  scrollListeners.add(listener);
  return () => {
    scrollListeners.delete(listener);
  };
}

type Gesture = { deltaY: number; event: WheelEvent | TouchEvent };
const gestureTakers = new Set<(gesture: Gesture) => boolean>();

/* Lets a part of the page take a wheel or touch gesture before Lenis scrolls
   with it (a pinned section stepping one slide at a time). A taker returns
   true when it has used the event, and then prevents its default itself. */
export function onGesture(taker: (gesture: Gesture) => boolean) {
  gestureTakers.add(taker);
  return () => {
    gestureTakers.delete(taker);
  };
}

/* Lenis's virtualScroll option: false keeps Lenis out of a taken gesture. */
export const leaveGesture = (gesture: Gesture) => ![...gestureTakers].some((take) => take(gesture));

/* Whether Lenis is easing the page somewhere right now: the tail of a wheel
   or trackpad flick, or a glide it was asked for. */
export const pageIsMoving = () => lenis?.isScrolling === "smooth";

/* An open sheet locks page scroll. Lenis drives scrolling itself, so the CSS
   overflow lock alone would not stop it. No-ops under reduced motion, where
   Lenis never registers. */
export function setPageScrollLocked(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}

/* For links clicked inside a sheet: the page is still locked during the click,
   so the sheet closes first and the scroll runs a frame later. */
export function scrollToSection(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView();
}

// The site's --ease-out, as a function of time for Lenis.
const easeOut = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/* Scrolls the window to a position, through Lenis when it is running so the
   two never fight: a glide on the site's ease-out, 0.7s unless `duration`
   says otherwise. An immediate jump goes through even while a sheet has the
   page locked, so the page behind can follow what the sheet shows. */
export function scrollToY(y: number, { immediate = false, duration = 0.7 } = {}) {
  if (lenis) lenis.scrollTo(y, immediate ? { immediate, force: true } : { duration, easing: easeOut });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}
