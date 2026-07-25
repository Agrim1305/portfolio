import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/* The chat panel locks page scroll while it is open. Lenis drives scrolling
   itself, so the CSS overflow lock alone would not stop it. No-ops under
   reduced motion, where Lenis never registers. */
export function setPageScrollLocked(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
}
