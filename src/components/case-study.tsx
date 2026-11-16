import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Metric, Project, Star } from "@/lib/projects";

// Wraps the first occurrence of each phrase in `className` so a skimming reader
// lands on the numbers that matter. The `hl` stripe is reserved for the
// strongest claims; bright ink carries the rest without spending the accent.
export function mark(text: string, phrases: string[], className: string) {
  const hits = phrases
    .map((phrase) => ({ phrase, at: text.indexOf(phrase) }))
    .filter(({ at }) => at !== -1)
    .sort((a, b) => a.at - b.at);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  hits.forEach(({ phrase, at }, i) => {
    if (at < cursor) return; // phrase overlaps an earlier one
    nodes.push(text.slice(cursor, at));
    nodes.push(
      <span key={i} className={className}>
        {phrase}
      </span>,
    );
    cursor = at + phrase.length;
  });
  nodes.push(text.slice(cursor));
  return <>{nodes}</>;
}

/* Card and cover treatment per project: a background, and for projects with
   no screenshot, the colour of the big cover word (the first stack item). */
export const COVER: Record<string, { bg: string; ink: string }> = {
  "concurrent-video-player": { bg: "#1C1C20", ink: "#FF5B2E" },
  "pacific-village-explorer": {
    bg: "radial-gradient(circle at 30% 10%, #FF7A4F 0%, #B53A17 40%, #2A120B 100%)",
    ink: "#F1EFEA",
  },
  metaplay: {
    bg: "radial-gradient(circle at 70% 10%, #4A4B55 0%, #23242A 45%, #121215 100%)",
    ink: "#F1EFEA",
  },
  "adelaide-rising-stars": { bg: "#FF5B2E", ink: "#0F0F11" },
  "portfolio-ai-assistant": { bg: "#18181B", ink: "#F1EFEA" },
  "gps-tracker-dashboard": { bg: "linear-gradient(135deg, #2A2B31, #16171A)", ink: "#F1EFEA" },
  pathfinder: { bg: "#1C1C20", ink: "#FF5B2E" },
};

const label = "font-mono text-[11px] uppercase tracking-[0.15em]";
const body = "text-[17px] leading-[1.75] text-[#D6D3CD] lg:text-lg";

/* The project's links as pills (or, on a card with no public link, its
   private note; the case study puts that note on its own line),
   opening in a new tab, in the order the data gives them: Source, then a
   live link. In the case study a live link is the primary, filled; on a
   card the case study is, so the pills are all secondary, one height with
   it, and join its row. */
export function Links({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (!project.links.length && !project.privateNote) return null;
  return (
    <div className={compact ? "contents" : "flex flex-wrap items-center gap-2"}>
      {project.links.map(({ label: text, url, accent }) => (
        <a
          key={text}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`lift inline-flex items-center whitespace-nowrap rounded-full ${
            compact ? "glass h-10 gap-1 px-4 text-sm text-ink" : "h-11 gap-1.5 px-[18px] text-sm"
          } ${compact ? "" : accent ? "bg-accent font-semibold text-paper hover:bg-accent-soft" : "glass text-ink"}`}
        >
          {text}
          <ArrowUpRight className={compact ? "size-3.5" : "size-4"} aria-hidden />
        </a>
      ))}
      {compact && project.privateNote && (
        <p className="text-sm text-ink-muted">{project.privateNote}</p>
      )}
    </div>
  );
}

/* The bar across the top of a framed screenshot, like a window's. */
function WindowBar() {
  return (
    <div aria-hidden className="flex h-[1.375rem] items-center gap-1.5 border-b border-white/10 px-2.5">
      <span className="size-1.5 rounded-full bg-ink/25" />
      <span className="size-1.5 rounded-full bg-ink/25" />
      <span className="size-1.5 rounded-full bg-ink/25" />
    </div>
  );
}

/* A project's cover, for its card and its case study alike, so a card grows
   into its case study without the picture jumping: the screenshot whole in a
   browser-style frame sized to its aspect ratio, or without one, the big
   stack word. The space is a size container, so the frame can fit both its
   width and its height (see .cover-frame). Stacked, below lg, the frame is
   top-aligned and, with `corner`, keeps clear of the case study panel's
   close button in the top-right corner. From lg up the cover sits beside
   the text on its own background and the frame is centred in it (see
   .cover-side). The caller sets the size. */
export function ProjectCover({
  project,
  sizes,
  corner = true,
  className = "",
}: {
  project: Project;
  sizes: string;
  /** Keep the frame clear of a button in the top-right corner. */
  corner?: boolean;
  className?: string;
}) {
  const media = project.media;
  const cover = COVER[project.slug];
  return (
    <div
      className={`relative overflow-hidden px-5 pb-5 [--clear:0px] [--inset:0px] [container-type:size] md:px-0 md:pb-2 md:pt-7 md:[--inset:2rem] lg:flex lg:items-center lg:p-7 lg:[--clear:0px] lg:[--inset:0px] lg:[background:var(--cover)] ${
        corner ? "pt-16 md:[--clear:12.5rem]" : "pt-5"
      } ${className}`}
      style={{ "--cover": cover.bg } as React.CSSProperties}
    >
      {media ? (
        <div
          className="cover-frame w-full origin-top overflow-hidden lg:origin-center rounded-xl border border-white/14 bg-paper shadow-[0_24px_48px_rgb(0_0_0/0.45)] transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transition-none"
          style={{ "--ratio": media.width / media.height } as React.CSSProperties}
        >
          <WindowBar />
          <div className="relative" style={{ aspectRatio: `${media.width} / ${media.height}` }}>
            <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-contain" />
          </div>
        </div>
      ) : (
        <span
          aria-hidden
          className="absolute left-5 top-1/2 -translate-y-1/2 font-display text-[min(7.5rem,70cqh)] font-extrabold leading-none tracking-[-0.04em] transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none lg:left-10 lg:text-[min(18.75rem,var(--fit),70cqh)]"
          // Side by side the word fits the cover whatever its length: 22cqw
          // for a seven-letter word, less for a longer one.
          style={{ color: cover.ink, "--fit": `${154 / Math.max(7, project.stack[0].length)}cqw` } as React.CSSProperties}
        >
          {project.stack[0]}
        </span>
      )}
    </div>
  );
}

/* What sat under the screenshot, now it is the hero: the live address, or
   a caption. */
function HeroNote({ project }: { project: Project }) {
  const media = project.media;
  if (media?.kind === "browser") {
    return (
      <p className="font-mono text-xs text-ink-faint">
        <a
          href={media.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${media.url}`}
          className="inline-flex min-h-11 items-center gap-1 hover:text-ink"
        >
          {media.url}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </p>
    );
  }
  if (media?.caption) return <p className="font-mono text-xs text-ink-faint">{media.caption}</p>;
  return null;
}

/* The top of a case study, laid out like its card: the cover with the
   framed screenshot, and the status and title beside it from lg up, or on a
   band beneath it below. Side by side it has the card's proportions at the
   panel's width, so as a card grows into the panel (a morph that only runs
   from lg up) its picture lands where it was. The cover carries
   `panel-hero`, so switching crossfades it while the title slides with the
   rest (see morphSwitch). The panel's hero, and the case study page's. */
export function CaseStudyHero({
  project,
  titleAs: Title = "h1",
  titleId,
}: {
  project: Project;
  titleAs?: "h1" | "h2";
  titleId?: string;
}) {
  return (
    <header className="relative flex flex-col overflow-hidden lg:flex-row" style={{ background: COVER[project.slug].bg }}>
      <ProjectCover
        project={project}
        sizes="(min-width: 1280px) 750px, (min-width: 1024px) 68vw, 100vw"
        className="panel-hero cover-side aspect-[16/11] shrink-0 [--w:min(1100px,100vw-4rem)] md:aspect-auto md:h-[52vh] md:min-h-64 lg:h-auto lg:w-[68%]"
      />
      <div className="relative flex flex-col bg-[linear-gradient(180deg,rgb(20_20_23/0),rgb(20_20_23/0.97)_1.5rem)] px-5 pb-7 pt-8 lg:w-[32%] lg:justify-end lg:bg-surface lg:bg-none lg:px-8 lg:pb-8 lg:pt-20">
        <p className={`${label} text-accent`}>{project.status}</p>
        <Title
          id={titleId}
          className="mt-4 max-w-[900px] font-display text-[clamp(2.5rem,1.4rem+4.2vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink lg:text-[clamp(2.25rem,0.9rem+2.2vw,3.25rem)]"
        >
          {project.title}
        </Title>
      </div>
    </header>
  );
}

/* One gallery photo. The first two float beside the text on wide screens;
   the third runs full width. */
const GALLERY_SLOTS = [
  { figure: "lg:float-right lg:ml-11 lg:mb-6 lg:mt-1.5 lg:w-[440px]", photo: "aspect-[22/15]" },
  { figure: "lg:float-left lg:mr-11 lg:mb-6 lg:mt-1.5 lg:w-[300px]", photo: "aspect-[15/19]" },
  { figure: "", photo: "aspect-[1020/420]" },
];

function GalleryPhoto({ project, index }: { project: Project; index: number }) {
  const photo = project.gallery?.[index];
  if (!photo) return null;
  return (
    <figure className={`mb-8 lg:mb-0 ${GALLERY_SLOTS[index].figure}`}>
      <div
        className={`relative overflow-hidden rounded-[18px] shadow-[0_30px_60px_rgb(0_0_0/0.45)] ${GALLERY_SLOTS[index].photo}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 440px, 100vw"
          className="object-cover object-center"
        />
      </div>
      {photo.caption && (
        <figcaption className="mt-3.5 font-mono text-xs text-ink-faint">{photo.caption}</figcaption>
      )}
    </figure>
  );
}

/* A row or column of numbers, each over its label; a label with `proof`
   links to where the number can be checked. One style for every case study,
   role and section. The caller sets the grid. */
export function Metrics({
  metrics,
  className,
  small = false,
}: {
  metrics: Metric[];
  className: string;
  /** For a narrow column, where four numbers share a row. */
  small?: boolean;
}) {
  return (
    <dl className={`grid gap-x-6 gap-y-5 ${className}`}>
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col">
          <dt className="order-last mt-1.5 text-sm leading-snug text-ink-muted">
            {m.proof ? (
              <a
                href={m.proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-ink-faint underline-offset-4 hover:text-ink"
              >
                {m.label}
                <span className="sr-only"> ({m.proof.label})</span>
                <ArrowUpRight className="ml-0.5 inline size-3.5" aria-hidden />
              </a>
            ) : (
              m.label
            )}
          </dt>
          <dd className={`whitespace-nowrap font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-accent ${
                small ? "" : "sm:text-[2rem] lg:text-[2.5rem]"
              }`}>
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* A Star told in order: Situation, Task, Action, Result, the deep dive,
   then the lesson. The case studies and the role stories in Experience both
   render through this. `aside` sits beside Situation and Task from lg up (a
   case study's numbers); `photos` float beside Action and Result. */
export function StarStory({
  story,
  headingAs: Sub,
  aside,
  photos,
}: {
  story: Star;
  headingAs: "h2" | "h3";
  aside?: React.ReactNode;
  photos?: React.ReactNode[];
}) {
  return (
    <>
      <div className={`grid gap-10 ${aside ? "lg:grid-cols-[220px_minmax(0,1fr)]" : ""}`}>
        {aside}
        <div>
          <section>
            <Sub className={`${label} text-accent-soft`}>Situation</Sub>
            <p className="mt-3.5 max-w-[720px] text-lg leading-[1.65] text-[#E4E1DB] first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.75rem] first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-ink lg:text-[21px]">
              {story.situation}
            </p>
          </section>
          <section className="mt-10">
            <Sub className={`${label} text-accent-soft`}>Task</Sub>
            <p className={`mt-3.5 max-w-[720px] ${body}`}>{story.task}</p>
          </section>
        </div>
      </div>

      <section className="mt-14 flow-root">
        {photos?.[0]}
        <Sub className={`${label} text-accent-soft`}>Action</Sub>
        {/* The number sits in the text's own column, so a photo floated
            beside the list can never cover it. */}
        <ol className={`mt-3.5 space-y-5 ${body}`}>
          {story.actions.map(({ title, detail }, i) => (
            <li key={title} className="flex gap-3.5">
              <span aria-hidden className="w-5 shrink-0 font-mono text-sm leading-[inherit] text-ink-faint">
                {i + 1}
              </span>
              <span>
                <strong className="font-semibold text-ink">{title}</strong> {detail}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 flow-root">
        {photos?.[1]}
        <Sub className={`${label} text-accent-soft`}>Result</Sub>
        <p className="mt-3.5 text-lg leading-[1.65] text-ink lg:text-[22px]">
          {mark(story.result, story.resultHighlights ?? [], "hl")}
        </p>
      </section>

      {story.deepDive && (
        <section className="mt-14">
          <p className={`${label} text-accent-soft`}>Deep dive</p>
          <Sub className="mt-3 font-display text-2xl font-bold leading-tight text-ink lg:text-[1.75rem]">
            {story.deepDive.title}
          </Sub>
          <div className={`mt-4 max-w-[720px] space-y-5 ${body}`}>
            {story.deepDive.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          {story.deepDive.code && (
            <figure className="mt-7 overflow-hidden rounded-xl border border-white/14 bg-paper">
              <figcaption className="flex items-center justify-between gap-4 border-b border-white/10 px-4 font-mono text-xs text-ink-muted">
                {story.deepDive.code.file}
                <a
                  href={story.deepDive.code.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center gap-1 text-ink hover:text-accent-soft"
                >
                  View in repo
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </figcaption>
              {/* Long lines scroll inside the block, never the page; it is
                  focusable so the keyboard can scroll it too. */}
              <pre
                tabIndex={0}
                role="region"
                aria-label={`Code from ${story.deepDive.code.file}`}
                data-lenis-prevent-horizontal
                className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.7] text-[#D6D3CD]"
              >
                <code>{story.deepDive.code.source}</code>
              </pre>
            </figure>
          )}
        </section>
      )}

      {story.learned && (
        <blockquote className="mt-16 border-l-4 border-accent pl-6 lg:pl-9">
          <p className="max-w-[860px] pb-1 font-serif text-[clamp(1.6rem,1rem+2vw,2.625rem)] italic leading-[1.25] text-ink">
            {story.learned}
          </p>
          <footer className={`mt-4 ${label} text-ink-faint`}>What I took from it</footer>
        </blockquote>
      )}
    </>
  );
}

/* The body of the case study for one project, under CaseStudyHero, shared
   by the /projects/[slug] page and the panel the home page's cards open
   into, so the two can never differ. */
export function CaseStudy({ project, titleAs = "h1" }: { project: Project; titleAs?: "h1" | "h2" }) {
  // Section headings sit one level below the title.
  const Sub = titleAs === "h1" ? "h2" : "h3";
  return (
    <>
      <HeroNote project={project} />
      <p className="mt-5 max-w-[760px] pb-1 font-serif text-[clamp(1.3rem,1rem+1vw,1.75rem)] italic leading-[1.35] text-ink-soft">
        {mark(project.oneLiner, [project.emphasis], "text-ink")}
      </p>

      <div className="mt-9 grid gap-6 border-y border-hairline py-6 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-start lg:gap-7">
        <dl className="contents">
          {[
            { term: "When", value: project.period },
            { term: "My role", value: project.role },
            { term: "Stack", value: project.stack.join(" · ") },
          ].map(({ term, value }) => (
            <div key={term}>
              <dt className={`${label} text-ink-faint`}>{term}</dt>
              <dd className="mt-1.5 text-[15px] leading-snug text-[#E4E1DB]">{value}</dd>
            </div>
          ))}
        </dl>
        {project.links.length > 0 && <Links project={project} />}
        {project.privateNote && (
          <p className="text-sm text-ink-muted lg:col-span-full">{project.privateNote}</p>
        )}
      </div>

      <div className="mt-14">
        <StarStory
          story={project}
          headingAs={Sub}
          aside={
            project.metrics ? (
              <Metrics metrics={project.metrics} className="grid-cols-2 lg:grid-cols-1 lg:content-start lg:pt-1.5" />
            ) : (
              <span className="hidden lg:block" />
            )
          }
          photos={[
            <GalleryPhoto key={0} project={project} index={0} />,
            <GalleryPhoto key={1} project={project} index={1} />,
          ]}
        />
      </div>

      {project.gallery?.[2] && (
        <div className="mt-14">
          <GalleryPhoto project={project} index={2} />
        </div>
      )}

      {/* More of the project running, each framed and whole. A tall capture
          is held to 720px high by narrowing its frame, centred, so it is
          never cropped or letterboxed. */}
      {project.screens && (
        <div className="mt-14 flex flex-col gap-8">
          {project.screens.map((screen) => (
            <figure
              key={screen.src}
              className="mx-auto w-full overflow-hidden rounded-xl border border-white/14 bg-paper shadow-[0_24px_48px_rgb(0_0_0/0.45)]"
              style={{ maxWidth: `${Math.round((720 * screen.width) / screen.height)}px` }}
            >
              <WindowBar />
              <Image
                src={screen.src}
                alt={screen.alt}
                width={screen.width}
                height={screen.height}
                sizes="(min-width: 1280px) 1020px, 100vw"
                className="h-auto w-full object-contain"
              />
            </figure>
          ))}
        </div>
      )}

      {/* The rest of the photos, under the story, each whole: two columns
          of their own heights, so no shape is cropped to fit. */}
      {project.gallery && project.gallery.length > 3 && (
        <div className="mt-14 gap-6 sm:columns-2">
          {project.gallery.slice(3).map((photo) => (
            <figure key={photo.src} className="mb-8 break-inside-avoid">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1280px) 520px, (min-width: 640px) 45vw, 100vw"
                className="h-auto w-full rounded-[18px] shadow-[0_30px_60px_rgb(0_0_0/0.45)]"
              />
              {photo.caption && (
                <figcaption className="mt-3.5 font-mono text-xs text-ink-faint">{photo.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      <p className="mt-14 text-[15px] text-ink-muted">
        Questions about this project? Email{" "}
        <a href="mailto:agrimsh22@gmail.com" className="text-ink underline decoration-ink-faint underline-offset-4 hover:text-accent-soft">
          agrimsh22@gmail.com
        </a>{" "}
        or ask Aris.
      </p>
    </>
  );
}
