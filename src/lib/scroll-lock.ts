import type Lenis from "lenis";
import Snap from "lenis/snap";

let lenis: Lenis | null = null;
let snap: Snap | null = null;
const snapPoints = new Map<HTMLElement, (() => void) | undefined>();

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  snap?.destroy();
  // CSS scroll-snap fights Lenis's own smoothing (the page jitters back and
  // forth), so snap points go through Lenis's snap instead. Proximity only:
  // stopping between two points is allowed, as is scrolling past the last.
  snap = instance ? new Snap(instance, { type: "proximity", distanceThreshold: "30%" }) : null;
  for (const el of snapPoints.keys()) snapPoints.set(el, snap?.addElement(el, { align: ["start"] }));
}

/* Snaps the window to an element's top when a scroll ends near it. Without
   Lenis (reduced motion) there is nothing to snap for, so it does nothing. */
export function addSnapPoint(el: HTMLElement) {
  snapPoints.set(el, snap?.addElement(el, { align: ["start"] }));
  return () => {
    snapPoints.get(el)?.();
    snapPoints.delete(el);
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

/* Scrolls the window to a position, through Lenis when it is running so the
   two never fight. */
export function scrollToY(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate });
  else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}
