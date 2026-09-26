import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ProjectMediaView } from "@/components/project-media";
import {
  leadProjects,
  otherProjects,
  type Project,
  type ProjectLink,
} from "@/lib/projects";

// Wraps the first occurrence of each phrase in `className` so a skimming reader
// lands on the numbers that matter. Gold (`hl`) is reserved for the strongest
// claims; bright ink carries the rest without spending the accent.
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

function StatusTag({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
      <span className="size-1.5 rounded-full bg-accent" />
      {status}
    </span>
  );
}

export function StackLine({
  stack,
  className = "text-xs",
}: {
  stack: string[];
  className?: string;
}) {
  return (
    <p className={`font-mono text-ink-faint ${className}`}>
      {stack.join(" · ")}
    </p>
  );
}

export function LinkRow({ links }: { links: ProjectLink[] }) {
  return (
    <p className="flex flex-wrap gap-x-6">
      {links.map(({ label, url, accent }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`link-draw inline-flex min-h-11 items-center gap-1 text-[15px] ${
            accent ? "text-accent" : "text-ink"
          }`}
        >
          {label}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      ))}
    </p>
  );
}

function DetailBlock({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
        {label}
      </p>
      <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-ink-muted">
        {children}
      </div>
    </div>
  );
}

// The lead treatment: full Problem / Approach / Impact depth, in the same card
// language as the others. The depth is the signal that these two matter most.
// The title and status sit above `media` so a screenshot is never the first
// thing a reader meets with no idea what they are looking at.
function CaseStudyLink({ slug, title }: { slug: string; title: string }) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="link-draw inline-flex min-h-11 items-center gap-1.5 text-[15px] text-accent"
    >
      Read the case study
      <span className="sr-only"> for {title}</span>
      <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

function CaseStudyCard({
  study,
  media,
}: {
  study: Project;
  media?: React.ReactNode;
}) {
  return (
    <article className="group relative card-draft rounded-xl border border-hairline p-6 sm:p-8 transition-colors duration-300 hover:border-accent/60">
      <span className="reg-tick reg-tl" aria-hidden />
      <span className="reg-tick reg-tr" aria-hidden />
      <span className="reg-tick reg-bl" aria-hidden />
      <span className="reg-tick reg-br" aria-hidden />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
          {study.title}
        </h3>
        <StatusTag status={study.status} />
      </div>
      {media && <div className="mt-5">{media}</div>}
      {/* Approach is the long column, so it sits alongside Problem and Impact
          rather than beside them in three rigid columns. Reading order stays
          Problem, Approach, Impact, and stacks that way on small screens. */}
      <div className="mt-6 grid gap-x-10 gap-y-6 lg:grid-cols-2">
        <DetailBlock label="Problem" className="lg:col-start-1 lg:row-start-1">
          <p>{study.problem}</p>
        </DetailBlock>
        <DetailBlock
          label="Approach"
          className="lg:col-start-2 lg:row-start-1 lg:row-span-2"
        >
          {study.approach.slice(0, 2).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </DetailBlock>
        <DetailBlock label="Impact" className="lg:col-start-1 lg:row-start-2">
          <p>{mark(study.impact, study.impactHighlights ?? [], "hl")}</p>
        </DetailBlock>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-x-6">
          <CaseStudyLink slug={study.slug} title={study.title} />
          <LinkRow links={study.links} />
        </div>
        <StackLine stack={study.stack} />
      </div>
    </article>
  );
}

function ProjectCard({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-xl border border-hairline card-draft p-7 transition duration-300 hover:-translate-y-0.5 hover:border-accent/60 ${className}`}
    >
      <span className="reg-tick reg-tl" aria-hidden />
      <span className="reg-tick reg-tr" aria-hidden />
      <span className="reg-tick reg-bl" aria-hidden />
      <span className="reg-tick reg-br" aria-hidden />
      {/* Status sits on its own line so the title never has to share a row
          with it, which kept wrapping differently card to card. */}
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
        {project.status}
      </p>
      <h3 className="mt-1.5 text-xl font-semibold leading-snug text-ink">
        {project.title}
      </h3>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-muted">
        {mark(project.oneLiner, [project.emphasis], "font-medium text-ink")}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-faint">
        {project.summary}
      </p>
      {/* Metadata band, pinned to the bottom so it lines up across the row. The
          stack matches the 11px status line above, which also keeps it on one
          line so the rule sits at the same height on every card. */}
      <div className="mt-auto space-y-2 border-t border-hairline pt-5">
        <StackLine stack={project.stack} className="text-[11px]" />
        <div className="flex flex-wrap gap-x-6">
          <CaseStudyLink slug={project.slug} title={project.title} />
          <LinkRow links={project.links} />
        </div>
        {project.privateNote && (
          <p className="text-[12px] text-ink-faint">{project.privateNote}</p>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 pb-24 sm:pb-36">
      <SectionHeading
        number="01"
        title="Projects"
        caption="Problem, approach, and impact. The stack comes second."
      />

      {leadProjects.map((study, i) => (
        <div
          key={study.slug}
          className={`rise ${i > 0 ? "mt-16" : ""}`}
          style={{ "--rise-delay": `${0.24 + i * 0.06}s` } as React.CSSProperties}
        >
          <CaseStudyCard
            study={study}
            media={
              study.media && (
                <ProjectMediaView media={study.media} priority={i === 0} />
              )
            }
          />
          {study.gallery && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {study.gallery.map((g) => (
                <ProjectMediaView key={g.src} media={g} small />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* The rest: tight one-liner-plus-supporting cards, each with its own
          case study page for anyone who wants the depth. */}
      <div
        className="rise mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        style={{ "--rise-delay": "0.36s" } as React.CSSProperties}
      >
        {otherProjects.map((project, i) => {
          const isOddLast =
            i === otherProjects.length - 1 && otherProjects.length % 2 === 1;
          return (
            <ProjectCard
              key={project.slug}
              project={project}
              className={isOddLast ? "md:col-span-2 lg:col-span-1" : ""}
            />
          );
        })}
      </div>
    </section>
  );
}
