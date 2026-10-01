"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Sheet } from "@/components/sheet";
import type { Photo } from "@/lib/stories";

// Keep in step with .photo-grid in globals.css: the gap, and the row heights
// from md and from lg up.
const GAP = 12;
const ROW_MD = 180;
const ROW_LG = 260;

const ratio = (p: Photo) => p.width / p.height;

type Row = { photos: Photo[]; full: boolean };

/* Justified rows for a grid `width` wide aiming at `target` tall. A row
   takes photos until it would be no taller than the target, then keeps the
   last photo only if that lands closer to the target than leaving it for the
   next row. The rows that fill the width come out one height each; the last
   row, which can't fill it, keeps the target height. */
function justify(photos: Photo[], width: number, target: number): Row[] {
  const rows: Row[] = [];
  let row: Photo[] = [];
  const height = (r: Photo[]) => (width - GAP * (r.length - 1)) / r.reduce((sum, p) => sum + ratio(p), 0);
  for (const photo of photos) {
    row.push(photo);
    if (height(row) > target) continue;
    const without = row.slice(0, -1);
    if (without.length && Math.abs(height(without) - target) < Math.abs(height(row) - target)) {
      rows.push({ photos: without, full: true });
      row = [photo];
      if (height(row) > target) continue;
    }
    rows.push({ photos: row, full: true });
    row = [];
  }
  if (row.length) rows.push({ photos: row, full: false });
  return rows;
}

/* Photos whole, at their own shapes: two masonry columns on phones, and from
   md up justified rows, laid out for the grid's width (see justify and
   .photo-grid in globals.css). The server lays them out for the widest
   grid, 1200px, so a desktop never sees them move. Every box has the
   photo's aspect ratio before it loads, so lazy loading never shifts the
   page. A photo opens in a lightbox with its caption; arrows and the arrow
   keys step through, Escape closes, and focus goes back to the photo that
   was showing. */
export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const grid = useRef<HTMLDivElement>(null);
  const [space, setSpace] = useState({ width: 1200, target: ROW_LG });
  const rows = justify(photos, space.width, space.target);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const lg = window.matchMedia("(min-width: 64rem)");
    const measure = () => setSpace({ width: el.clientWidth, target: lg.matches ? ROW_LG : ROW_MD });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const photo = open === null ? null : photos[open];

  function close() {
    const last = open;
    setOpen(null);
    // After the dialog's own focus return, which goes to the photo it opened on.
    requestAnimationFrame(() => last !== null && buttons.current[last]?.focus());
  }
  // Round the ends, so an arrow never disables itself under the keyboard.
  const step = (by: number) => setOpen((i) => (i === null ? i : (i + by + photos.length) % photos.length));

  const arrow =
    "glass flex size-12 shrink-0 items-center justify-center rounded-full text-ink";

  return (
    <>
      <div ref={grid} className="photo-grid">
        {rows.map((row) => (
          <div key={row.photos[0].src} className="photo-row" data-last={row.full ? undefined : ""}>
            {row.photos.map((p) => {
              const i = photos.indexOf(p);
              return (
                <figure key={p.src} style={{ "--ar": ratio(p) } as React.CSSProperties}>
                  <button
                    ref={(el) => {
                      buttons.current[i] = el;
                    }}
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setOpen(i)}
                    className="block w-full overflow-hidden rounded-[14px] bg-surface transition-opacity duration-250 hover:opacity-90"
                    style={{ aspectRatio: `${p.width} / ${p.height}` }}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      sizes="(min-width: 1024px) 480px, (min-width: 768px) 360px, 50vw"
                      className="block size-full"
                    />
                  </button>
                  <figcaption className="mt-2 font-mono text-xs leading-relaxed text-ink-muted">{p.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        ))}
      </div>

      <Sheet
        open={photo !== null}
        onClose={close}
        label={photo?.caption}
        className="inset-0 m-auto h-dvh w-full bg-paper/95 md:h-[92vh] md:w-[min(1200px,calc(100vw-4rem))] md:rounded-[28px] md:border md:border-white/12 md:bg-sheet"
      >
        {photo && open !== null && (
          <div
            className="flex h-full flex-col p-4 md:p-6"
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              step(e.key === "ArrowLeft" ? -1 : 1);
            }}
          >
            <div className="flex items-center justify-between">
              <span aria-hidden className="font-mono text-sm text-ink-faint">
                {open + 1} / {photos.length}
              </span>
              <button type="button" onClick={close} aria-label="Close" className={arrow}>
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center gap-3 py-4">
              <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={arrow}>
                <ArrowLeft className="size-5" aria-hidden />
              </button>
              <figure className="flex h-full min-w-0 flex-1 flex-col items-center justify-center">
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="eager"
                  sizes="(min-width: 1280px) 1100px, 100vw"
                  className="block h-auto max-h-[calc(100%-2.5rem)] w-auto max-w-full rounded-[14px]"
                />
                <figcaption className="mt-3 text-center font-mono text-xs leading-relaxed text-ink-muted lg:text-sm">
                  {photo.caption}
                </figcaption>
              </figure>
              <button type="button" aria-label="Next photo" onClick={() => step(1)} className={arrow}>
                <ArrowRight className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
