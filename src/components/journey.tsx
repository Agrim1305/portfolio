"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { Sheet } from "@/components/sheet";
import { chapters, columnsOf, type JourneyMedia } from "@/lib/journey";
import { useRow } from "@/lib/row";

// Media heights by breakpoint, for next/image's sizes. Keep in step with
// .journey-track in globals.css.
const HEIGHTS = { lg: { tall: 430, half: 187 }, md: { tall: 340, half: 142 }, phone: 260 };

// The columns, chapter by chapter, and every medium in reading order, which
// is also the lightbox's order.
const layout = chapters.map((chapter) => ({ chapter, columns: columnsOf(chapter.media) }));
const media = layout.flatMap(({ columns }) => columns.flatMap((c) => c.media));

/* Quiet: reduced motion or Save-Data. No autoplay, no fades, no lift, a
   still glow. Taken as quiet until the browser says otherwise. */
const QUIET_QUERY = "(prefers-reduced-motion: reduce)";
const saveData = () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
function subscribeQuiet(onChange: () => void) {
  const mq = window.matchMedia(QUIET_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const useQuiet = () => useSyncExternalStore(subscribeQuiet, () => window.matchMedia(QUIET_QUERY).matches || saveData(), () => true);

/* "A glimpse of my journey": a sideways row of chapter cards, photos and
   clips, school to university. Tall media fill a column; wide ones stack in
   pairs; nothing is cropped. Buttons and the arrow keys move a column, a
   trackpad, a finger or a mouse drag scrolls it, and the vertical wheel is
   the page's (see lib/row.ts). As it moves, columns well ahead fade back
   and the glow behind it takes the colour of the column in front. While a
   quarter of the strip is on screen every clip loops, muted, never when
   quiet. Any medium opens in the lightbox, where a clip plays in full. */
export function Journey({ colours }: { colours: Record<string, string> }) {
  const quiet = useQuiet();
  const root = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const snapped = useRef(-1);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [near, setNear] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  // Set by the effect below; plays every clip or none.
  const sync = useRef(() => {});

  const { ref: track, ends, step } = useRow({
    onMove: (at, stops) => {
      const row = track.current!;
      // Columns more than three ahead sit back at 55%, coming forward as
      // they approach.
      stops.forEach((stop, i) => {
        stop.style.opacity = quiet ? "" : String(1 - 0.45 * Math.min(1, Math.max(0, i - at - 3)));
      });
      const bar = thumb.current;
      if (bar) {
        // A scrollbar's thumb: the share of the row in view, where it is.
        const width = bar.parentElement!.clientWidth;
        bar.style.width = `${(row.clientWidth / row.scrollWidth) * width}px`;
        bar.style.transform = `translateX(${(row.scrollLeft / row.scrollWidth) * width}px)`;
      }
      const now = Math.round(at);
      if (now === snapped.current || !stops[now] || quiet) return;
      snapped.current = now;
      // A chapter card takes the colour of the column after it.
      const stop = stops[now];
      const src = (stop.querySelector<HTMLElement>("[data-src]") ?? stop.nextElementSibling?.querySelector<HTMLElement>("[data-src]"))?.dataset.src;
      if (src && colours[src] && glow.current) glow.current.style.backgroundColor = colours[src];
    },
  });

  // Clips and their posters load only once the strip is close.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let inView = false;
    sync.current = () => {
      const play = inView && !quiet && openRef.current === null;
      for (const v of el.querySelectorAll<HTMLVideoElement>(".journey-track video")) {
        if (!play) v.pause();
        else if (v.paused && v.src) v.play().catch(() => {});
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.intersectionRatio >= 0.25;
        sync.current();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      for (const v of el.querySelectorAll<HTMLVideoElement>(".journey-track video")) v.pause();
    };
  }, [quiet]);

  // The clips start once they have a source, pause while the lightbox is
  // open and start again when it closes.
  useEffect(() => {
    sync.current();
  }, [open, near]);

  function close() {
    const last = open;
    setOpen(null);
    requestAnimationFrame(() => last !== null && buttons.current[last]?.focus());
  }

  const arrow =
    "flex size-12 items-center justify-center rounded-full transition-[opacity,background-color,color,border-color] duration-300 disabled:pointer-events-none disabled:opacity-30";
  let index = 0;

  return (
    <div ref={root} className="journey overflow-x-clip" data-quiet={quiet || undefined}>
      <div className="wrap flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink lg:text-[3.25rem]">
            A glimpse of my{" "}
            <span className="font-serif font-medium italic tracking-normal text-accent">journey.</span>
          </h2>
          <p className="mt-2 text-[15px] text-ink-muted lg:text-[17px]">From a school court in India to university tennis in Adelaide.</p>
        </div>
        <div className="hidden shrink-0 gap-3 pb-1 md:flex">
          <button type="button" aria-label="Previous" disabled={ends.start} onClick={() => step(-1)} className={`${arrow} border border-ink/25 text-ink hover:border-ink`}>
            <ArrowLeft className="size-[18px]" aria-hidden />
          </button>
          <button type="button" aria-label="Next" disabled={ends.end} onClick={() => step(1)} className={`${arrow} bg-ink text-paper hover:bg-accent`}>
            <ArrowRight className="size-[18px]" aria-hidden />
          </button>
        </div>
      </div>

      <div className="relative mt-8">
        <div
          ref={glow}
          aria-hidden
          className="journey-glow"
          style={{ backgroundColor: colours[chapters[0].media[0].src] }}
        />
        {/* The region takes focus and the arrow keys; it doesn't scroll, so
            they have nothing of their own to do here. */}
        <div
          role="region"
          aria-label="A glimpse of my journey"
          tabIndex={0}
          className="wrap relative"
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <div ref={track} data-lenis-prevent-horizontal className="journey-track">
            {layout.map(({ chapter, columns }) => (
              <div key={chapter.label} className="contents">
                <div data-stop className="journey-card">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent">{chapter.label}</p>
                  <div>
                    {/* As large as the longest single word ("Recognition.") allows
                        inside the card. */}
                    <h3 className="font-display text-[1.875rem] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink md:text-[2rem] lg:text-[2.3rem]">
                      {chapter.heading}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted lg:text-[15px]">{chapter.line}</p>
                  </div>
                </div>
                {columns.map((column) => {
                  const half = column.media.length === 2;
                  const items = column.media.map((m) => {
                    const i = index++;
                    return (
                      <Medium
                        key={m.src}
                        medium={m}
                        half={half}
                        load={near}
                        buttonRef={(el) => {
                          buttons.current[i] = el;
                        }}
                        onOpen={() => setOpen(i)}
                      />
                    );
                  });
                  return half ? (
                    <div key={column.media[0].src} data-stop className="journey-pair">
                      {items}
                    </div>
                  ) : (
                    items
                  );
                })}
              </div>
            ))}
          </div>
          <div aria-hidden className="mt-6 h-0.5 overflow-hidden rounded-full bg-ink/12">
            <div ref={thumb} className="h-full rounded-full bg-accent" />
          </div>
        </div>
      </div>

      <Lightbox open={open} quiet={quiet} onStep={(by) => setOpen((i) => (i === null ? i : (i + by + media.length) % media.length))} onClose={close} />
    </div>
  );
}

/* One photo or clip with its caption. A clip shows its poster until it
   plays, with a pill on top saying which it is doing. */
function Medium({
  medium: m,
  half,
  load,
  buttonRef,
  onOpen,
}: {
  medium: JourneyMedia;
  /** Half height, one of a pair. */
  half: boolean;
  /** Load a clip's poster: the track is close. */
  load: boolean;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onOpen: () => void;
}) {
  const ratio = m.width / m.height;
  const [playing, setPlaying] = useState(false);
  const sizes = `(min-width: 1024px) ${Math.ceil(ratio * HEIGHTS.lg[half ? "half" : "tall"])}px, (min-width: 768px) ${Math.ceil(
    ratio * HEIGHTS.md[half ? "half" : "tall"],
  )}px, ${Math.ceil(ratio * HEIGHTS.phone)}px`;
  return (
    <figure data-stop className="journey-item">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={m.kind === "video" ? `${m.alt}, video` : undefined}
        onClick={onOpen}
        data-src={m.src}
        className={`journey-media ${half ? "journey-half" : "journey-tall"}`}
        style={{ aspectRatio: `${m.width} / ${m.height}` }}
      >
        {m.kind === "photo" ? (
          <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes={sizes} draggable={false} className="block size-full" />
        ) : (
          <>
            <video
              muted
              playsInline
              loop
              preload="none"
              poster={load ? m.poster : undefined}
              src={load ? m.src : undefined}
              width={m.width}
              height={m.height}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="block size-full"
            />
            <span
              aria-hidden
              className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-ink backdrop-blur-md"
            >
              {playing ? (
                <span className="size-1.5 rounded-full bg-accent" />
              ) : (
                <Play className="size-2.5 fill-accent text-accent" />
              )}
              {playing ? "Playing" : "Video"}
            </span>
          </>
        )}
      </button>
      <figcaption className="h-10 w-0 min-w-full pt-1.5">
        <p className="truncate text-[15px] font-semibold leading-5 text-ink">{m.title}</p>
        {/* A step brighter than muted: it can sit over the brightest glow. */}
        <p className="truncate font-mono text-xs leading-4 text-ink-soft">{m.detail}</p>
      </figcaption>
    </figure>
  );
}

/* The whole photo, or the full clip with controls, fitted to the screen,
   with its caption. The clip starts muted, and its sound comes on only when
   the visitor unmutes it; when quiet it waits for play, and plays with
   sound. Arrows and the arrow keys step through every medium, round the
   ends (a focused clip keeps its own arrow keys); Escape closes. The full
   clip loads only here. */
function Lightbox({
  open,
  quiet,
  onStep,
  onClose,
}: {
  open: number | null;
  quiet: boolean;
  onStep: (by: number) => void;
  onClose: () => void;
}) {
  const m = open === null ? null : media[open];
  const arrow = "glass flex size-12 shrink-0 items-center justify-center rounded-full text-ink";
  return (
    <Sheet
      open={m !== null}
      onClose={onClose}
      label={m?.title}
      className="inset-0 m-auto h-dvh w-full bg-paper/95 md:h-[92vh] md:w-[min(1200px,calc(100vw-4rem))] md:rounded-[28px] md:border md:border-white/12 md:bg-sheet"
    >
      {m && open !== null && (
        <div
          className="flex h-full flex-col p-4 md:p-6"
          onKeyDown={(e) => {
            if (e.target instanceof HTMLVideoElement) return;
            if (e.key === "ArrowRight") onStep(1);
            if (e.key === "ArrowLeft") onStep(-1);
          }}
        >
          <div className="flex items-center justify-between">
            <span aria-hidden className="font-mono text-sm text-ink-faint">
              {open + 1} / {media.length}
            </span>
            <button type="button" onClick={onClose} aria-label="Close" className={arrow}>
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center gap-3 py-4">
            <button type="button" aria-label="Previous" onClick={() => onStep(-1)} className={arrow}>
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            {/* A size container, so the medium can fit its width and height
                at its own ratio, whatever has loaded. */}
            <figure className="flex h-full min-w-0 flex-1 flex-col items-center justify-center [container-type:size]">
              {m.kind === "photo" ? (
                <Image
                  key={m.src}
                  src={m.src}
                  alt={m.alt}
                  width={m.width}
                  height={m.height}
                  loading="eager"
                  sizes="(min-width: 1280px) 1100px, 100vw"
                  className="journey-fit rounded-[14px]"
                  style={{ "--ar": m.width / m.height } as React.CSSProperties}
                />
              ) : (
                <video
                  key={m.src}
                  src={m.full}
                  poster={m.poster}
                  controls
                  autoPlay={!quiet}
                  muted={!quiet}
                  playsInline
                  aria-label={`${m.alt}, video`}
                  className="journey-fit rounded-[14px] bg-black"
                  style={{ "--ar": m.width / m.height } as React.CSSProperties}
                />
              )}
              <figcaption className="mt-3 text-center">
                <p className="text-[15px] font-semibold text-ink">{m.title}</p>
                <p className="font-mono text-xs text-ink-muted">{m.detail}</p>
              </figcaption>
            </figure>
            <button type="button" aria-label="Next" onClick={() => onStep(1)} className={arrow}>
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
