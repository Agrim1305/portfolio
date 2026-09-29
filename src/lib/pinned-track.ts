import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { addSnapPoint, scrollToY } from "@/lib/scroll-lock";

/* Where the track pins. Everywhere else it is a native sideways scroller with
   scroll-snap. Keep in step with the media query in globals.css. */
const PIN_QUERY = "(min-width: 48rem) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PIN_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/* Scroll-pinned sideways travel. The section is one viewport tall per slide
   and its stage sticks to the top; scrolling through it maps progress to a
   translateX on the track, one slide per viewport. Unpinned, the track scrolls
   sideways itself. Either way `active` is the slide in view and `go` moves to
   one: pinned, by scrolling the window to that slide's position. */
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

    const unsnap = [...section.querySelectorAll<HTMLElement>(".pin-marker")].map(addSnapPoint);
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));
      const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0;
      const at = progress * (count - 1);
      track.style.transform = `translate3d(${-at * step}px, 0, 0)`;
      setActive(Math.round(at));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      unsnap.forEach((remove) => remove());
      track.style.transform = "";
    };
  }, [pinned, count]);

  function go(i: number, immediate = false) {
    const to = Math.max(0, Math.min(count - 1, i));
    const section = sectionRef.current;
    if (!section) return;
    if (pinned) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const travel = section.offsetHeight - window.innerHeight;
      scrollToY(top + (count > 1 ? (to / (count - 1)) * travel : 0), immediate);
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
