"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { CaseStudy, COVER } from "@/components/case-study";
import { Sheet } from "@/components/sheet";
import { projects, type Project } from "@/lib/projects";

const slugFromPath = () => window.location.pathname.match(/^\/projects\/([^/]+)/)?.[1];
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* On wide screens the card grows into the case study (View Transitions API).
   Anywhere that can't, or under reduced motion, the sheet simply opens. */
function morphFrom(card: HTMLElement | null, update: () => void) {
  const canMorph =
    card &&
    "startViewTransition" in document &&
    !prefersReducedMotion() &&
    window.matchMedia("(min-width: 64rem)").matches;
  if (!canMorph) return update();
  card.style.viewTransitionName = "case-study";
  document.startViewTransition(() => {
    card.style.viewTransitionName = "";
    update();
  });
}

function Card({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (card: HTMLElement) => void;
}) {
  const cover = COVER[project.slug];
  const stat = project.metrics?.[0];
  const media = project.media;

  return (
    <article
      data-index={index}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      // The whole card opens the case study for a pointer; the link inside is
      // the keyboard and screen reader route to the same place.
      onClick={(e) => {
        if (!(e.target as Element).closest("a")) onOpen(e.currentTarget);
      }}
      className="group relative flex min-h-[460px] w-[calc(100vw-4.625rem)] max-w-[520px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-3xl lg:aspect-[1110/650] lg:min-h-0 lg:w-[calc(min(1200px,100vw-4rem)-90px)] lg:max-w-none lg:justify-end lg:rounded-[28px]"
      style={{ background: cover.bg }}
    >
      {media ? (
        // In the card's flow on small screens, so a long summary pushes the card
        // taller instead of running over the screenshot.
        <div className="relative mx-5 mt-6 aspect-[276/200] shrink-0 overflow-hidden rounded-xl border border-white/14 shadow-[0_24px_48px_rgb(0_0_0/0.5)] lg:absolute lg:left-[6.3%] lg:top-[9.2%] lg:mx-0 lg:mt-0 lg:aspect-auto lg:h-[64.6%] lg:w-[87.4%] lg:rounded-2xl lg:shadow-[0_40px_80px_rgb(0_0_0/0.5)]">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 970px, 90vw"
            className="object-cover object-left-top transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
      ) : (
        <span
          aria-hidden
          className="absolute left-5 top-4 font-display text-[7.5rem] font-extrabold leading-none tracking-[-0.04em] transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none lg:left-[60px] lg:top-10 lg:text-[min(18.75rem,19vw)]"
          style={{ color: cover.ink }}
        >
          {project.stack[0]}
        </span>
      )}

      <div className="relative mt-auto flex flex-col gap-2 bg-[linear-gradient(180deg,rgb(15_15_17/0),rgb(15_15_17/0.92)_35%)] p-[22px] pt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:px-9 lg:py-8 lg:pt-16">
        <div className="flex max-w-[720px] flex-col gap-2">
          <p className="font-mono text-[11px] text-accent-soft lg:text-xs">{project.status}</p>
          <h3 className="font-display text-[28px] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink lg:text-4xl lg:leading-none">
            {project.title}
          </h3>
          <p className="text-[15px] leading-[1.45] text-ink-soft lg:text-base lg:leading-normal">
            {project.summary}
          </p>
        </div>
        <div className="flex min-h-10 items-center justify-between gap-4 pr-12 lg:block lg:shrink-0 lg:pr-0 lg:text-right">
          {stat && (
            <p className="flex items-baseline gap-2 lg:flex-col lg:items-end lg:gap-1">
              <span className="font-display text-2xl font-extrabold leading-none text-ink lg:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs text-ink-muted lg:text-[13px]">{stat.label}</span>
            </p>
          )}
        </div>
      </div>

      <Link
        href={`/projects/${project.slug}`}
        data-expand
        onClick={(e) => {
          // Let new-tab and new-window clicks through to the real page.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          onOpen(e.currentTarget.closest("article")!);
        }}
        className="absolute bottom-5 right-5 flex size-11 items-center justify-center gap-2 rounded-full bg-accent text-paper lg:glass lg:bottom-auto lg:top-3 lg:right-5 lg:h-[38px] lg:w-auto lg:pl-4 lg:pr-3.5 lg:text-sm lg:font-medium lg:text-ink"
      >
        <span className="max-lg:sr-only">Read the case study</span>
        <span className="sr-only"> for {project.title}</span>
        <Plus className="size-4 lg:size-[18px] lg:text-accent" aria-hidden />
      </Link>
    </article>
  );
}

export function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  // Whether the open case study added a history entry that Back should undo.
  const pushed = useRef(false);

  // The card most in view is the current one.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.6 },
    );
    track.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Back and Forward move between the home page and an open case study.
  useEffect(() => {
    const onPop = () => {
      const i = projects.findIndex((p) => p.slug === slugFromPath());
      pushed.current = i >= 0;
      setOpen(i >= 0 ? i : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function goTo(i: number) {
    const card = trackRef.current?.querySelector(`[data-index="${i}"]`);
    card?.scrollIntoView({
      inline: "start",
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  // The address bar shows the case study's own URL while it is open, so it can
  // be shared, and a reload lands on the full page.
  function openCase(i: number, card: HTMLElement) {
    window.history.pushState(null, "", `/projects/${projects[i].slug}`);
    pushed.current = true;
    morphFrom(card, () => flushSync(() => setOpen(i)));
  }

  function switchCase(i: number) {
    window.history.replaceState(null, "", `/projects/${projects[i].slug}`);
    setOpen(i);
    bodyRef.current?.scrollTo({ top: 0 });
  }

  function closeCase() {
    if (pushed.current) {
      pushed.current = false;
      window.history.back(); // the popstate handler closes the sheet
    } else {
      setOpen(null);
    }
  }

  const total = projects.length;
  const current = open === null ? null : projects[open];
  const prev = open !== null && open > 0 ? open - 1 : null;
  const next = open !== null && open < total - 1 ? open + 1 : null;

  return (
    <section id="projects" className="py-20 lg:py-28">
      <div className="wrap flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-[clamp(3.75rem,2rem+5.5vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-ink">
            <span className="block">Selected</span>{" "}
            {/* The reference ghosts this word almost into the page; this is the
                faintest grey that still clears 3:1 for large text. */}
            <span className="block text-[#636167]">work</span>
          </h2>
          <p className="mt-4 text-[15px] text-ink-muted lg:text-base">
            Problem, approach, and impact. The stack comes second.
          </p>
        </div>
        <div className="hidden items-center gap-5 pb-1.5 lg:flex">
          <div aria-hidden className="h-[3px] w-[220px] overflow-hidden rounded-full bg-ink/12">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${((active + 1) / total) * 100}%` }}
            />
          </div>
          <span aria-hidden className="min-w-14 font-mono text-sm text-ink-faint">
            {active + 1} / {total}
          </span>
          {[
            { label: "Previous project", to: active - 1, Icon: ArrowLeft },
            { label: "Next project", to: active + 1, Icon: ArrowRight },
          ].map(({ label, to, Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={to < 0 || to >= total}
              onClick={() => goTo(to)}
              className="flex size-14 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-paper disabled:pointer-events-none disabled:opacity-30"
            >
              <Icon className="size-5" aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected work"
        tabIndex={0}
        className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 [scroll-padding-inline:1.25rem] [scrollbar-width:none] motion-reduce:scroll-auto sm:px-8 sm:[scroll-padding-inline:2rem] lg:mt-16 lg:gap-6 lg:px-[max(2rem,calc(50vw-600px))] lg:[scroll-padding-inline:max(2rem,calc(50vw-600px))] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <Card
            key={project.slug}
            project={project}
            index={i}
            total={total}
            onOpen={(card) => openCase(i, card)}
          />
        ))}
      </div>

      <div aria-hidden className="wrap mt-5 flex gap-1.5 lg:hidden">
        {projects.map((p, i) => (
          <span
            key={p.slug}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
              i === active ? "w-[22px] bg-accent" : "w-1.5 bg-ink/25"
            }`}
          />
        ))}
      </div>

      <Sheet
        open={current !== null}
        onClose={closeCase}
        labelledBy="case-study-title"
        className="morph inset-x-0 bottom-0 top-auto h-[calc(100dvh-3rem)] w-full overflow-hidden rounded-t-[26px] border-t border-white/12 bg-sheet [view-transition-name:case-study] lg:inset-x-[max(2rem,calc(50vw-600px))] lg:top-6 lg:bottom-6 lg:h-auto lg:w-auto lg:rounded-[28px] lg:border"
      >
        {current && (
          <div ref={bodyRef} className="thin-scroll h-full overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-hairline bg-sheet/90 py-2.5 pl-5 pr-3 backdrop-blur-md lg:h-[72px] lg:py-0 lg:pl-[90px] lg:pr-6">
              <span aria-hidden className="absolute left-1/2 top-2 h-[5px] w-10 -translate-x-1/2 rounded-full bg-ink/25 lg:hidden" />
              <span className="flex-1" />
              {[
                { i: prev, text: "Previous", Icon: ArrowLeft },
                { i: next, text: "Next", Icon: ArrowRight },
              ].map(({ i, text, Icon }) =>
                i === null ? null : (
                  <button
                    key={text}
                    type="button"
                    onClick={() => switchCase(i)}
                    className="hidden h-10 items-center gap-2 rounded-full border border-ink/20 px-4 text-sm text-ink-soft transition-colors hover:text-ink lg:flex"
                  >
                    {text === "Previous" && <Icon className="size-4" aria-hidden />}
                    <span className="sr-only">{text}: </span>
                    {projects[i].title}
                    {text === "Next" && <Icon className="size-4" aria-hidden />}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={closeCase}
                aria-label="Close case study"
                className="mt-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-surface-raised text-ink lg:mt-0"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <article className="px-5 pb-12 pt-6 lg:px-[90px] lg:pb-20 lg:pt-14">
              <CaseStudy project={current} titleAs="h2" titleId="case-study-title" />

              <nav
                aria-label="More projects"
                className="mt-16 flex flex-col gap-3 border-t border-hairline pt-7 sm:flex-row sm:justify-between"
              >
                {prev !== null ? (
                  <button
                    type="button"
                    onClick={() => switchCase(prev)}
                    className="glass lift flex min-h-14 items-center gap-2 rounded-full px-6 text-[15px] text-[#E4E1DB]"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    <span className="sr-only">Previous: </span>
                    {projects[prev].title}
                  </button>
                ) : (
                  <span />
                )}
                {next !== null && (
                  <button
                    type="button"
                    onClick={() => switchCase(next)}
                    className="lift flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-paper hover:bg-accent-soft"
                  >
                    Next: {projects[next].title}
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                )}
              </nav>
            </article>
          </div>
        )}
      </Sheet>
    </section>
  );
}
