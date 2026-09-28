import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
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
