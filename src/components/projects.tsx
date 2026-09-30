"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { CaseStudy, CaseStudyHero, COVER, ProjectCover } from "@/components/case-study";
import { Panel } from "@/components/panel";
import { morphClose, morphOpen, morphSwitch } from "@/lib/morph";
import { SkipLink } from "@/components/skip-link";
import { usePinnedTrack } from "@/lib/pinned-track";
import { projects, type Project } from "@/lib/projects";

const slugFromPath = () => window.location.pathname.match(/^\/projects\/([^/]+)/)?.[1];

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
      // From md up one card takes the section: the content width less a 4%
      // peek of the next card, and pinned, all the height the heading leaves.
      className="group relative flex min-h-[460px] w-[calc(100vw-4.625rem)] max-w-[520px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-3xl pin:h-full pin:min-h-[20rem] md:w-[calc(min(1200px,100vw-4rem)*0.96-1.5rem)] md:max-w-none md:rounded-[28px] md:motion-reduce:h-[min(40rem,calc(100svh-12rem))] md:motion-reduce:min-h-[24rem]"
      style={{ background: cover.bg }}
    >
      {/* The cover takes the height the text doesn't need, so when the card
          is short the screenshot gives way, never the text. */}
      <ProjectCover
        project={project}
        sizes="(min-width: 1280px) 920px, (min-width: 768px) 75vw, 90vw"
        className="aspect-[16/11] shrink-0 md:aspect-auto md:min-h-0 md:flex-1"
      />

      {/* A slim band on a fade over the cover, below the screenshot, never
          on it. Its padding gives way on short screens before the cover
          does. */}
      <div className="flex shrink-0 flex-col gap-2 bg-[linear-gradient(180deg,rgb(23_23_27/0),rgb(23_23_27/0.96)_1rem)] px-[22px] pb-[22px] pt-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:px-9 lg:pb-[clamp(0.875rem,2.2svh,1.25rem)] lg:pt-[clamp(1rem,2.7svh,1.5rem)]">
        <div className="flex max-w-[760px] flex-col gap-2 lg:gap-1.5">
          <p className="font-mono text-[11px] text-accent-soft lg:text-xs">{project.status}</p>
          <h3 className="font-display text-[28px] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink lg:text-4xl lg:leading-none">
            {project.title}
          </h3>
          <p className="text-[15px] leading-[1.45] text-ink-soft lg:text-base lg:leading-normal">
            {project.summary}
          </p>
        </div>
        <div className="flex min-h-10 items-center justify-between gap-4 lg:block lg:shrink-0 lg:text-right">
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
        // The card opens the case study in place; the route itself is only
        // for new tabs and shared links, so there is nothing to prefetch.
        prefetch={false}
        data-expand
        onClick={(e) => {
          // Let new-tab and new-window clicks through to the real page.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          onOpen(e.currentTarget.closest("article")!);
        }}
        className="glass absolute right-3 top-3 z-10 flex h-11 items-center gap-2 rounded-full pl-4 pr-3.5 text-sm font-medium text-ink lg:right-5 lg:h-[38px]"
      >
        Open case study
        <span className="sr-only"> for {project.title}</span>
        <Plus className="size-[18px] text-accent" aria-hidden />
      </Link>
    </article>
  );
}

export function Projects() {
  const total = projects.length;
  const { sectionRef, trackRef, pinned, active, go, step, onFocus } = usePinnedTrack(total);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  // Whether the open case study added a history entry that Back should undo.
  const pushed = useRef(false);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  const cardAt = (i: number) => trackRef.current?.querySelector<HTMLElement>(`[data-index="${i}"]`);
  // Shrinks the panel into card `i`, the one in view. Focus goes to that
  // card's link rather than back to wherever the panel first opened from,
  // which could send the carousel back to an older card.
  const shrink = (i: number) =>
    morphClose(cardAt(i), () => {
      flushSync(() => setOpen(null));
      cardAt(i)?.querySelector<HTMLElement>("[data-expand]")?.focus({ preventScroll: true });
    });

  // Back and Forward move between the home page and an open case study. The
  // sheet shrinks back into its card on the way out.
  useEffect(() => {
    const onPop = () => {
      const i = projects.findIndex((p) => p.slug === slugFromPath());
      pushed.current = i >= 0;
      if (i >= 0) return setOpen(i);
      const current = openRef.current;
      if (current !== null) shrink(current);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // shrink only reads refs and sets state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The address bar shows the case study's own URL while it is open, so it can
  // be shared, and a reload lands on the full page.
  function openCase(i: number, card: HTMLElement) {
    window.history.pushState(null, "", `/projects/${projects[i].slug}`);
    pushed.current = true;
    morphOpen(card, () => flushSync(() => setOpen(i)));
  }

  // The carousel behind moves to the new project too, so closing shrinks
  // the panel into the card that is now in view.
  function switchCase(i: number) {
    if (open === null) return;
    window.history.replaceState(null, "", `/projects/${projects[i].slug}`);
    go(i, true);
    morphSwitch(i > open ? 1 : -1, bodyRef.current, () => {
      flushSync(() => setOpen(i));
      bodyRef.current?.scrollTo({ top: 0 });
    });
  }

  function closeCase() {
    if (pushed.current) {
      pushed.current = false;
      window.history.back(); // the popstate handler closes the sheet
    } else if (open !== null) {
      shrink(open);
    }
  }

  const current = open === null ? null : projects[open];
  const prev = open !== null && open > 0 ? open - 1 : null;
  const next = open !== null && open < total - 1 ? open + 1 : null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="pin-section py-20 lg:py-28"
      style={{ "--slides": total } as React.CSSProperties}
    >
      <div className="pin-stage">
        <SkipLink to="leadership" />
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <h2 className="font-display text-[3.75rem] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-ink md:text-[clamp(3rem,1.2rem+3.1vw,4rem)]">
              <span className="block md:inline">Selected</span>{" "}
              {/* The reference ghosts this word almost into the page; this is the
                  faintest grey that still clears 3:1 for large text. */}
              <span className="block text-[#636167] md:inline">work</span>
            </h2>
            <div className="hidden items-center gap-5 md:flex">
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
                { label: "Previous project", by: -1, Icon: ArrowLeft },
                { label: "Next project", by: 1, Icon: ArrowRight },
              ].map(({ label, by, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  disabled={active + by < 0 || active + by >= total}
                  onClick={() => step(by)}
                  className="flex size-14 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-paper disabled:pointer-events-none disabled:opacity-30"
                >
                  <Icon className="size-5" aria-hidden />
                </button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-[15px] text-ink-muted md:mt-1 lg:text-base">
            Problem, approach, and impact. The stack comes second.
          </p>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Selected work"
          tabIndex={0}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
            else return;
            e.preventDefault();
          }}
          className="mt-10 pin:mt-[clamp(0.5rem,1.8svh,1rem)] pin:min-h-0 pin:flex-1"
        >
          <div
            ref={trackRef}
            className="pin-track flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 [scroll-padding-inline:1.25rem] [scrollbar-width:none] motion-reduce:scroll-auto pin:h-full sm:px-8 sm:[scroll-padding-inline:2rem] md:gap-6 lg:px-[max(2rem,calc(50vw-600px))] lg:[scroll-padding-inline:max(2rem,calc(50vw-600px))] [&::-webkit-scrollbar]:hidden"
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
        </div>

        <div aria-hidden className={`wrap mt-5 flex gap-1.5 ${pinned ? "hidden" : "md:hidden"}`}>
          {projects.map((p, i) => (
            <span
              key={p.slug}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                i === active ? "w-[22px] bg-accent" : "w-1.5 bg-ink/25"
              }`}
            />
          ))}
        </div>
      </div>

      <Panel
        open={current !== null}
        onClose={closeCase}
        closeLabel="Close case study"
        labelledBy="case-study-title"
        prev={prev === null ? null : { hint: "Previous: ", label: projects[prev].title, onClick: () => switchCase(prev) }}
        next={next === null ? null : { hint: "Next: ", label: projects[next].title, onClick: () => switchCase(next) }}
        bodyRef={bodyRef}
        hero={current && <CaseStudyHero project={current} titleAs="h2" titleId="case-study-title" />}
      >
        {current && (
          <article className="px-5 pb-12 pt-6 lg:px-[90px] lg:pb-20 lg:pt-8">
            <CaseStudy project={current} titleAs="h2" />

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
        )}
      </Panel>
    </section>
  );
}
