import { useEffect, useRef, useState } from "react";

// How far a mouse must move with the button down before it is a drag, not a
// click, and how far a drag must go to carry on to the next stop rather
// than settle back.
const DRAG_PX = 5;
const FLICK_PX = 40;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Where the row can rest: every `[data-stop]` that CSS gives a snap start
   (the journey's change by width), as the scrollLeft that brings each one
   to the row's start, never past the end. */
function stopsOf(row: HTMLElement) {
  const max = row.scrollWidth - row.clientWidth;
  const pad = parseFloat(getComputedStyle(row).scrollPaddingLeft) || 0;
  const origin = row.getBoundingClientRect().left - row.scrollLeft + pad;
  return [...row.querySelectorAll<HTMLElement>("[data-stop]")]
    .filter((el) => getComputedStyle(el).scrollSnapAlign.includes("start"))
    .map((el) => ({ el, left: Math.min(max, Math.max(0, el.getBoundingClientRect().left - origin)) }));
}

/* A native sideways scroller. The page keeps every vertical wheel; a
   trackpad's sideways swipe, shift and the wheel, or a finger scroll the row
   itself, and CSS snaps it. `step` and `go` glide it one stop or to a stop,
   with quick presses queued; a mouse drags it. A passive scroll listener,
   once a frame, keeps `active` (the stop nearest the start), `ends` and
   whatever `onMove` draws in step, and React only hears when they change. */
export function useRow({ onMove }: { onMove?: (at: number, stops: HTMLElement[]) => void } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ends, setEnds] = useState({ start: true, end: false });
  // The stop a press sent the row to, until it comes to rest, so a second
  // press counts from there rather than from mid-glide.
  const pending = useRef<number | null>(null);
  const moved = useRef(onMove);
  const redraw = useRef(() => {});
  useEffect(() => {
    moved.current = onMove;
    redraw.current();
  }, [onMove]);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    let frame = 0;
    let idle = 0;
    let last = -1;
    // Measured when the row is laid out, so a scroll frame only reads
    // scrollLeft.
    let stops = stopsOf(row);

    const update = () => {
      frame = 0;
      const x = row.scrollLeft;
      const max = row.scrollWidth - row.clientWidth;
      // Where the row is, in stops, fractionally.
      let at = 0;
      for (let i = 0; i < stops.length - 1; i++) {
        const { left: a } = stops[i];
        const { left: b } = stops[i + 1];
        if (x >= b && b > a) continue;
        at = b > a ? i + Math.max(0, (x - a) / (b - a)) : i;
        break;
      }
      const now = nearest(stops, x);
      if (now !== last) setActive((last = now));
      setEnds((e) => (e.start === x <= 1 && e.end === x >= max - 1 ? e : { start: x <= 1, end: x >= max - 1 }));
      moved.current?.(at, stops.map((s) => s.el));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
      clearTimeout(idle);
      idle = window.setTimeout(() => (pending.current = null), 150);
    };

    // A mouse drag scrolls the row, free of snapping, then comes to rest on
    // the nearest stop, or at least one stop on in the drag's direction;
    // the click that ends a drag opens nothing.
    let drag: { x: number; left: number; moved: boolean } | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) drag = { x: e.clientX, left: row.scrollLeft, moved: false };
    };
    const move = (e: PointerEvent) => {
      // Released outside the row: no drag.
      if (drag && !(e.buttons & 1)) drag = null;
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < DRAG_PX) return;
        drag.moved = true;
        row.setPointerCapture(e.pointerId);
        row.style.scrollSnapType = "none";
        row.style.userSelect = "none";
        window.getSelection()?.removeAllRanges();
      }
      row.scrollLeft = drag.left - dx;
    };
    const up = () => {
      if (!drag?.moved) {
        drag = null;
        return;
      }
      const from = nearest(stops, drag.left);
      const by = Math.sign(row.scrollLeft - drag.left);
      let to = nearest(stops, row.scrollLeft);
      if (to === from && Math.abs(row.scrollLeft - drag.left) > FLICK_PX) to = Math.max(0, Math.min(stops.length - 1, from + by));
      row.style.userSelect = "";
      if (stops[to]) row.scrollTo({ left: stops[to].left, behavior: reduced() ? "instant" : "smooth" });
      // Snapping comes back once the glide is over, so it doesn't cut it short.
      window.setTimeout(() => (row.style.scrollSnapType = ""), reduced() ? 0 : 500);
      // The click that follows a drag still sees it.
      window.setTimeout(() => (drag = null));
    };
    const click = (e: MouseEvent) => {
      if (!drag?.moved) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();

    redraw.current = update;
    update();
    const ro = new ResizeObserver(() => {
      stops = stopsOf(row);
      update();
    });
    ro.observe(row);
    row.addEventListener("scroll", onScroll, { passive: true });
    row.addEventListener("pointerdown", down);
    row.addEventListener("pointermove", move);
    row.addEventListener("pointerup", up);
    row.addEventListener("pointercancel", up);
    row.addEventListener("click", click, true);
    row.addEventListener("dragstart", noNativeDrag);
    return () => {
      redraw.current = () => {};
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      ro.disconnect();
      row.removeEventListener("scroll", onScroll);
      row.removeEventListener("pointerdown", down);
      row.removeEventListener("pointermove", move);
      row.removeEventListener("pointerup", up);
      row.removeEventListener("pointercancel", up);
      row.removeEventListener("click", click, true);
      row.removeEventListener("dragstart", noNativeDrag);
    };
  }, []);

  function go(i: number, instant = false) {
    const row = ref.current;
    if (!row) return;
    const stops = stopsOf(row);
    const to = Math.max(0, Math.min(stops.length - 1, i));
    pending.current = to;
    row.scrollTo({ left: stops[to].left, behavior: instant || reduced() ? "instant" : "smooth" });
  }

  // One stop on from wherever the row is heading. Stops that rest at the
  // same place (the last few, which can't reach the start) count as one.
  function step(by: number) {
    const row = ref.current;
    if (!row) return;
    const stops = stopsOf(row);
    const from = pending.current ?? nearest(stops, row.scrollLeft);
    let to = from + by;
    while (stops[to] && Math.abs(stops[to].left - stops[from].left) < 1) to += by;
    if (stops[to]) go(to);
  }

  return { ref, active, ends, go, step };
}

// The first of the stops nearest `x`.
function nearest(stops: { left: number }[], x: number) {
  return stops.reduce((best, s, i) => (Math.abs(s.left - x) < Math.abs(stops[best].left - x) ? i : best), 0);
}
