"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SkipLink } from "@/components/skip-link";
import { usePinnedTrack } from "@/lib/pinned-track";
import {
  COACHING_PHOTO_CONSENT,
  clubOfTheYearPhoto,
  coachingPhoto,
  mergerMeetingPhoto,
  type Photo,
} from "@/lib/stories";

type Stop = {
  /** Short name under the timeline dot. */
  dot: string;
  big: string;
  title?: string;
  meta?: string;
  line: string;
  /** Fills the stop's left half, cropped at its position to keep faces in
      frame. Without one, the stop's number fills it in outline. */
  photo?: Photo;
};

const court = (file: string, width: number, height: number, alt: string, caption: string, position?: string): Photo => ({
  src: `/images/court/${file}.webp`,
  alt,
  caption,
  width,
  height,
  position,
});

// Wording taken as-is from knowledge-base.md, experience.tsx and leadership.tsx.
const stops: Stop[] = [
  {
    dot: "Top 90",
    big: "Top 90",
    title: "AITA U18 National Ranking",
    line: "All India Tennis Association, 2022.",
    photo: court("06-nationals-punjab", 1125, 2000, "Agrim holding a trophy and medal", "State team, Punjab: 3rd at the nationals", "50% 20%"),
  },
  {
    dot: "Rafa Nadal Academy",
    big: "Rafa Nadal Academy",
    line: "Trained at the Rafa Nadal Academy in Spain",
    photo: court("05-tony-nadal", 768, 1024, "Agrim as a junior with Toni Nadal", "With Toni Nadal at the Rafa Nadal Academy", "50% 25%"),
  },
  {
    dot: "ITF",
    big: "ITF",
    line: "competed in junior ITF tournaments across India and Nepal",
  },
  {
    dot: "Assistant Head Coach",
    big: "50+",
    title: "Assistant Head Coach",
    meta: "Mar 2024 to Present",
    line: "I coach 10+ sessions a week at Tea Tree Gully Tennis Club for more than fifty clients, from juniors to adults, one-on-one and in groups.",
    photo: COACHING_PHOTO_CONSENT ? coachingPhoto : undefined,
  },
  {
    dot: "President",
    big: "10 → 100+",
    title: "President",
    meta: "Jul 2024 to Mar 2026",
    line: "A dormant club to Club of the Year in eighteen months.",
    photo: mergerMeetingPhoto,
  },
  {
    dot: "Club of the Year",
    big: "Winner",
    title: "Club of the Year 2025",
    line: "Awarded for rebuilding Adelaide University Tennis Club from dormant status to 100+ active members, securing $7,000+ in facility upgrades, and leading the merger with UniSA's tennis club.",
    photo: clubOfTheYearPhoto,
  },
  {
    dot: "UniSport Nationals",
    big: "UniSport Nationals",
    title: "Intervarsity Certificate of Merit",
    meta: "UniSport Australia, 2025",
    line: "Recognition for representing Adelaide University at UniSport Nationals.",
    photo: court("02-utl-playing", 1080, 720, "Agrim hitting a forehand", "Match play, UTL", "50% 25%"),
  },
  {
    dot: "Premier League",
    big: "Premier League",
    line: "the top grade in Tennis South Australia",
    photo: court("01-utl-team", 1600, 1200, "Adelaide University tennis team at the net", "UTL team, Adelaide University", "50% 35%"),
  },
];

// Under the stops, in this order.
const photos: Photo[] = [
  court("04-sa-challenge-win", 1125, 2000, "Agrim with a winner's certificate and shield on court", "SA Challenge Intervarsity 2024, 1st place, men's tennis"),
  court("03-blues-certificate-of-merit", 1334, 2000, "Agrim holding his certificate of merit at the Blues awards", "Intervarsity Certificate of Merit, tennis, 2024"),
  court("14-vc-certificate-of-merit", 800, 533, "Agrim receiving a certificate on stage", "Certificate of merit from the Vice-Chancellor, first year"),
];

const TILTS = ["-rotate-[2deg]", "rotate-[1.5deg]", "-rotate-1", "rotate-[2deg]"];

const pad = (n: number) => String(n).padStart(2, "0");

/* One stop per 80svh of scroll, sliding sideways, with a timeline
   underneath (see lib/pinned-track.ts; phones and reduced motion swipe
   instead). Arrows, the timeline dots and the arrow keys scroll to a stop.
   Stops that are out of view are inert, so a screen reader doesn't land on
   them; the live region says which stop is showing. Under the stops a short
   strip of photos, each whole, on a rail with a dot per photo, scrolls
   sideways where it doesn't fit. */
export function Court() {
  const last = stops.length - 1;
  const { sectionRef, trackRef, active: current, go, step, onFocus } = usePinnedTrack<HTMLDivElement>(stops.length);

  const arrow =
    "flex size-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-[opacity,background-color,color,border-color] duration-300 hover:border-accent hover:bg-accent hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <section id="court">
      {/* The pinned part has a box of its own: its height is the scroll it
          travels over. */}
      <div
        ref={sectionRef}
        className="pin-section pt-20 lg:pt-28"
        style={{ "--slides": stops.length } as React.CSSProperties}
      >
        <div className="pin-stage">
          <div className="wrap relative pin:flex pin:min-h-0 pin:flex-1 pin:flex-col pin:justify-center">
            <SkipLink to="about" />
            <div className="flex items-end justify-between gap-6">
              <h2 className="rise font-display text-[3.75rem] font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-ink md:text-[clamp(3rem,1.2rem+3.8vw,4.75rem)]">
                <span className="block md:inline">Built on</span>{" "}
                <span className="block pb-1 font-serif text-[1.18em] font-medium normal-case italic leading-none tracking-normal text-accent md:inline">
                  court.
                </span>
              </h2>
              <div className="hidden items-center gap-3.5 pb-2 lg:flex">
                <span aria-hidden className="min-w-16 text-right text-[15px] text-ink-faint">
                  <span className="font-semibold text-ink">{pad(current + 1)}</span> / {pad(stops.length)}
                </span>
                <button type="button" aria-label="Previous stop" disabled={current === 0} onClick={() => step(-1)} className={arrow}>
                  <ArrowLeft className="size-[18px]" aria-hidden />
                </button>
                <button type="button" aria-label="Next stop" disabled={current === last} onClick={() => step(1)} className={arrow}>
                  <ArrowRight className="size-[18px]" aria-hidden />
                </button>
              </div>
            </div>

            {/* The track is the scroller on phones, so it carries the region
                and takes focus itself. */}
            <div className="rise relative mt-10 overflow-hidden rounded-[18px] bg-surface shadow-[inset_0_0_0_1px_rgb(241_239_234/0.08)] pin:mt-6 pin:min-h-0 pin:max-h-[35rem] pin:flex-1 lg:rounded-[20px]">
              <p aria-live="polite" className="sr-only">
                {current + 1} of {stops.length}: {stops[current].dot}
              </p>
              <div
                ref={trackRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="Built on court"
                tabIndex={0}
                onFocus={onFocus}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") step(1);
                  else if (e.key === "ArrowLeft") step(-1);
                  else return;
                  e.preventDefault();
                }}
                className="pin-track flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] pin:h-full lg:gap-10 [&::-webkit-scrollbar]:hidden"
              >
                {stops.map((s, i) => (
                  <article
                    key={s.dot}
                    data-index={i}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${stops.length}`}
                    inert={i !== current}
                    // Pinned, the stop takes the height the heading and timeline
                    // leave; on a narrow stage the photo gives way before the text.
                    className="flex w-full shrink-0 snap-start flex-col pin:h-full lg:flex-row lg:motion-reduce:h-[min(560px,calc(100svh-27rem))] lg:motion-reduce:min-h-[360px]"
                  >
                    <div className="relative h-[220px] shrink-0 overflow-hidden bg-[#1B1B20] pin:h-auto pin:min-h-0 pin:flex-1 lg:h-full lg:w-[55%] lg:flex-none">
                      {s.photo ? (
                        <>
                          <Image
                            src={s.photo.src}
                            alt={s.photo.alt}
                            fill
                            sizes="(min-width: 1024px) 660px, 100vw"
                            className="object-cover"
                            style={{ objectPosition: s.photo.position }}
                          />
                          <span
                            aria-hidden
                            className="absolute left-3 top-3 rounded-full bg-paper/80 px-2.5 py-1 font-mono text-xs text-ink backdrop-blur-sm lg:left-5 lg:top-5"
                          >
                            {pad(i + 1)}
                          </span>
                        </>
                      ) : (
                        <span
                          aria-hidden
                          className="absolute -bottom-6 left-5 font-display text-[11rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_91_46/0.4)] lg:-bottom-10 lg:left-10 lg:text-[22rem]"
                        >
                          {pad(i + 1)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center px-[22px] py-6 lg:w-[45%] lg:px-14 lg:py-0">
                      <p className="text-[13px] text-ink-faint lg:text-[15px]">
                        {pad(i + 1)} · {s.dot}
                      </p>
                      <p className="mt-3 font-display text-[clamp(2.25rem,1.6rem+2.2vw,4.25rem)] font-bold leading-none tracking-[-0.035em] text-ink lg:mt-[18px]">
                        {s.big}
                      </p>
                      {s.title && (
                        <h3 className="mt-3 text-[17px] font-semibold text-[#D9D6D0] lg:mt-[18px] lg:text-[22px]">
                          {s.title}
                        </h3>
                      )}
                      {s.meta && <p className="mt-1 font-mono text-xs text-ink-muted lg:text-[13px]">{s.meta}</p>}
                      <p className="mt-2 text-[15px] leading-[1.55] text-ink-muted first-letter:uppercase lg:mt-3.5 lg:text-lg lg:leading-relaxed">
                        {s.line}
                      </p>
                      {s.photo && (
                        <p className="mt-4 font-mono text-xs text-ink-faint">{s.photo.caption}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Timeline: a rail that fills up to the current stop, one dot per stop. */}
            <div className="rise mt-6 flex items-center gap-3 lg:mb-4 lg:mt-6 lg:block lg:px-[60px]">
              <button type="button" aria-label="Previous stop" disabled={current === 0} onClick={() => step(-1)} className={`${arrow} shrink-0 lg:hidden`}>
                <ArrowLeft className="size-[18px]" aria-hidden />
              </button>
              <div className="flex flex-1 flex-col items-center gap-2.5">
                <div className="relative h-11 w-full max-w-[220px] lg:max-w-none">
                  <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/18" />
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-accent transition-[width] duration-800 ease-[cubic-bezier(0.65,0,0.2,1)] motion-reduce:transition-none"
                    style={{ width: `${(current / last) * 100}%` }}
                  />
                  {stops.map((s, i) => (
                    <button
                      key={s.dot}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Go to ${s.dot}`}
                      aria-current={i === current ? "step" : undefined}
                      className="group absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                      style={{ left: `${(i / last) * 100}%` }}
                    >
                      <span
                        className={`size-2.5 rounded-full border-2 transition-colors duration-500 lg:size-3.5 ${
                          i <= current ? "border-accent bg-accent" : "border-ink/35 bg-paper group-hover:border-ink"
                        }`}
                      />
                      <span
                        aria-hidden
                        className={`absolute top-[38px] hidden w-[130px] text-center text-sm transition-colors duration-500 lg:block ${
                          i === current ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {s.dot}
                      </span>
                    </button>
                  ))}
                </div>
                <p aria-hidden className="text-[13px] text-ink-muted lg:hidden">
                  <span className="font-semibold text-ink">{pad(current + 1)}</span> / {pad(stops.length)} · {stops[current].dot}
                </p>
              </div>
              <button type="button" aria-label="Next stop" disabled={current === last} onClick={() => step(1)} className={`${arrow} shrink-0 border-0 bg-accent text-paper lg:hidden`}>
                <ArrowRight className="size-[18px]" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap pb-20 pt-14 lg:pb-28 lg:pt-16">
        <div
          role="region"
          aria-label="Photos"
          tabIndex={0}
          className="thin-scroll -mx-5 overflow-x-auto px-5 pb-5 pt-3 sm:-mx-8 sm:px-8"
        >
          <ol className="flex w-max">
            {photos.map((p, i) => (
              <li key={p.src} className="relative pr-8 lg:pr-12">
                {/* The rail runs under every photo, with a dot at each. */}
                <span aria-hidden className="absolute inset-x-0 top-[228px] h-px bg-ink/18 lg:top-[292px]" />
                <span
                  aria-hidden
                  className="absolute left-0 top-[223px] size-[11px] rounded-full bg-accent ring-4 ring-paper lg:top-[287px]"
                />
                <figure className="min-w-44">
                  <div
                    className={`h-[200px] w-max overflow-hidden rounded-[14px] border-4 border-ink shadow-[0_24px_48px_rgb(0_0_0/0.5)] lg:h-[260px] ${TILTS[i % TILTS.length]}`}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      width={p.width}
                      height={p.height}
                      sizes="(min-width: 1024px) 400px, 300px"
                      className="h-full w-auto"
                    />
                  </div>
                  {/* As wide as the photo, never wider. */}
                  <figcaption className="mt-14 w-0 min-w-full font-mono text-xs leading-relaxed text-ink-muted lg:mt-16">
                    {p.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
