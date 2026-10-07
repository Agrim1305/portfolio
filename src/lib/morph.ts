/* A card grows into its sheet, and shrinks back into it on close, through the
   View Transitions API on wide screens. Anywhere that can't, or under reduced
   motion, or when the card is out of view, the update simply happens. The
   open sheet carries the `morph` name in CSS; the card borrows it here. */
function canMorph(card: HTMLElement | null | undefined): card is HTMLElement {
  if (!card || !("startViewTransition" in document)) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 64rem)").matches) return false;
  const r = card.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}

export function morphOpen(card: HTMLElement | null | undefined, update: () => void) {
  if (!canMorph(card)) return update();
  card.style.viewTransitionName = "morph";
  document.startViewTransition(() => {
    card.style.viewTransitionName = "";
    update();
  });
}

export function morphClose(card: HTMLElement | null | undefined, update: () => void) {
  if (!canMorph(card)) return update();
  const t = document.startViewTransition(() => {
    update();
    card.style.viewTransitionName = "morph";
  });
  t.finished.finally(() => {
    card.style.viewTransitionName = "";
  });
}

let latestSwitch: ViewTransition | null = null;

/* Moves an open panel to the next or previous project or role: the body
   slides out one way and the new one slides in, the hero picture crossfades
   in place, and the frame holds still. `update` should leave the body
   scrolled to the top. Under reduced motion both simply
   fade; without view transitions the content just changes. */
export function morphSwitch(direction: 1 | -1, body: HTMLElement | null, update: () => void) {
  if (!("startViewTransition" in document)) return update();
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.dataset.switch = reduced ? "fade" : direction > 0 ? "next" : "prev";
  // The picture only holds its place if it is on screen; scrolled away, it
  // leaves with the rest of the body.
  if ((body?.scrollTop ?? 0) < 40) root.dataset.switchHero = "";
  const transition = document.startViewTransition(update);
  latestSwitch = transition;
  // A quick second switch cuts this one short; only the latest cleans up,
  // or the one still running would lose its names halfway.
  transition.finished.finally(() => {
    if (latestSwitch !== transition) return;
    delete root.dataset.switch;
    delete root.dataset.switchHero;
  });
}

