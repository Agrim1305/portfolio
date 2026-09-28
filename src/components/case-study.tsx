import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

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
  "speech-to-text-service": { bg: "#1C1C20", ink: "#F1EFEA" },
  "gps-tracker-dashboard": { bg: "linear-gradient(135deg, #2A2B31, #16171A)", ink: "#F1EFEA" },
  pathfinder: { bg: "#1C1C20", ink: "#FF5B2E" },
  "virtual-restaurant-simulator": { bg: "#18181B", ink: "#FF5B2E" },
};

const label = "font-mono text-[11px] uppercase tracking-[0.15em]";

function Links({ project }: { project: Project }) {
  if (!project.links.length && !project.privateNote) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {project.links.map(({ label: text, url, accent }) => (
        <a
          key={text}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`lift inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-[18px] text-sm ${
            accent ? "bg-accent font-semibold text-paper hover:bg-accent-soft" : "glass text-ink"
          }`}
        >
          {text}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      ))}
      {project.privateNote && <p className="text-sm text-ink-muted">{project.privateNote}</p>}
    </div>
  );
}

function Media({ project }: { project: Project }) {
  const media = project.media;
  const cover = COVER[project.slug];
  if (!media) {
    return (
      <div
        className="flex min-h-44 items-center justify-between gap-6 overflow-hidden rounded-[22px] px-6 lg:min-h-[340px] lg:px-14"
        style={{ background: cover.bg, color: cover.ink }}
        aria-hidden
      >
        <span className="font-display text-[5rem] font-extrabold leading-none tracking-[-0.04em] lg:text-[12.5rem]">
          {project.stack[0]}
        </span>
      </div>
    );
  }
  if (media.kind === "browser") {
    return (
      <figure>
        <Image
          src={media.src}
          alt={media.alt}
          width={2760}
          height={1424}
          sizes="(min-width: 1280px) 1020px, 100vw"
          className="w-full rounded-[22px] border border-white/12 shadow-[0_40px_80px_rgb(0_0_0/0.45)]"
        />
        <figcaption className="mt-3 font-mono text-xs text-ink-faint">
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
        </figcaption>
      </figure>
    );
  }
  return (
    <figure>
      <div className={`relative overflow-hidden rounded-[22px] border border-white/12 shadow-[0_40px_80px_rgb(0_0_0/0.45)] ${media.aspect}`}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(min-width: 1280px) 1020px, 100vw"
          className={`object-cover ${media.position === "top" ? "object-top" : "object-center"}`}
        />
      </div>
      {media.caption && (
        <figcaption className="mt-3 font-mono text-xs text-ink-faint">{media.caption}</figcaption>
      )}
    </figure>
  );
}

/* One gallery photo. The first two float beside the text on wide screens,
   tilted slightly like prints on a desk; the third runs full width. */
const GALLERY_SLOTS = [
  { figure: "lg:float-right lg:ml-11 lg:mb-6 lg:mt-1.5 lg:w-[440px]", photo: "aspect-[22/15] lg:rotate-[1.5deg]" },
  { figure: "lg:float-left lg:mr-11 lg:mb-6 lg:mt-1.5 lg:w-[300px]", photo: "aspect-[15/19] lg:-rotate-2" },
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

/* The full case study for one project, shared by the /projects/[slug] page and
   the sheet the home page's cards open into, so the two can never differ. */
export function CaseStudy({
  project,
  titleAs: Title = "h1",
  titleId,
}: {
  project: Project;
  titleAs?: "h1" | "h2";
  titleId?: string;
}) {
  // Section headings sit one level below the title.
  const Sub = Title === "h1" ? "h2" : "h3";
  return (
    <>
      <p className={`${label} text-accent`}>{project.status}</p>
      <Title
        id={titleId}
        className="mt-4 max-w-[900px] font-display text-[clamp(2.5rem,1.4rem+4.2vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink"
      >
        {project.title}
      </Title>
      <p className="mt-5 max-w-[760px] pb-1 font-serif text-[clamp(1.3rem,1rem+1vw,1.75rem)] italic leading-[1.35] text-ink-soft">
        {mark(project.oneLiner, [project.emphasis], "text-ink")}
      </p>

      <div className="mt-9 grid gap-6 border-y border-hairline py-6 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end lg:gap-7">
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
        <Links project={project} />
      </div>

      <div className="mt-11">
        <Media project={project} />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        {project.metrics ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-1 lg:content-start lg:pt-1.5">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col">
                <dt className="order-last mt-1.5 text-sm leading-snug text-ink-muted">{m.label}</dt>
                <dd className="whitespace-nowrap font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-accent sm:text-[2rem] lg:text-[2.5rem]">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <span className="hidden lg:block" />
        )}
        <section>
          <Sub className={`${label} text-accent-soft`}>Problem</Sub>
          <p className="mt-3.5 max-w-[720px] text-lg leading-[1.65] text-[#E4E1DB] first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.75rem] first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-ink lg:text-[21px]">
            {project.problem}
          </p>
        </section>
      </div>

      <section className="mt-14 flow-root">
        <GalleryPhoto project={project} index={0} />
        <Sub className={`${label} text-accent-soft`}>Approach</Sub>
        <div className="mt-3.5 space-y-5 text-[17px] leading-[1.75] text-[#D6D3CD] lg:text-lg">
          {project.approach.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {project.learned && (
        <blockquote className="my-16 border-l-4 border-accent pl-6 lg:pl-9">
          <p className="max-w-[860px] pb-1 font-serif text-[clamp(1.6rem,1rem+2vw,2.625rem)] italic leading-[1.25] text-ink">
            {project.learned}
          </p>
          <footer className={`mt-4 ${label} text-ink-faint`}>What I took from it</footer>
        </blockquote>
      )}

      <section className={`flow-root ${project.learned ? "" : "mt-14"}`}>
        <GalleryPhoto project={project} index={1} />
        <Sub className={`${label} text-accent-soft`}>Impact</Sub>
        <p className="mt-3.5 text-lg leading-[1.65] text-ink lg:text-[22px]">
          {mark(project.impact, project.impactHighlights ?? [], "hl")}
        </p>
      </section>

      {project.gallery?.[2] && (
        <div className="mt-14">
          <GalleryPhoto project={project} index={2} />
        </div>
      )}
    </>
  );
}
