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
