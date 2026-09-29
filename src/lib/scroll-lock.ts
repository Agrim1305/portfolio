import type Lenis from "lenis";

let lenis: Lenis | null = null;
const scrollListeners = new Set<() => void>();
const notify = () => scrollListeners.forEach((listener) => listener());

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  instance?.on("scroll", notify);
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
   two never fight. `settle` is the slower glide a pinned section uses to come
   to rest on a slide. */
export function scrollToY(y: number, { immediate = false, settle = false } = {}) {
  if (lenis) lenis.scrollTo(y, settle ? { duration: 0.6, easing: easeOut } : { immediate });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}
