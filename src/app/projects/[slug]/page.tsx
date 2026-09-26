import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AskAgrim } from "@/components/ask-agrim";
import { Reveal } from "@/components/reveal";
import { ProjectMediaView } from "@/components/project-media";
import { LinkRow, mark } from "@/components/projects";
import { adjacentProjects, getProject, projects } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} | Agrim Sharma`;
  return {
    title,
    description: project.oneLiner,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.oneLiner,
      url: `/projects/${project.slug}`,
      siteName: "Agrim Sharma",
      locale: "en_AU",
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description: project.oneLiner },
  };
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-x-10 gap-y-3 border-t border-hairline py-10 sm:grid-cols-[160px_1fr]">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent sm:pt-1.5">
        {label}
      </h2>
      <div className="max-w-2xl space-y-4 text-[17px] leading-relaxed text-ink-muted">
        {children}
      </div>
    </section>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = adjacentProjects(project.slug);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-5 sm:px-8">
        <article className="pt-12 sm:pt-20 pb-24 sm:pb-32">
          <Link
            href="/#projects"
            className="link-draw inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All projects
          </Link>

          <header className="mt-8">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              {project.status}
            </p>
            <h1 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-ink">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl sm:text-2xl leading-relaxed text-ink-muted">
              {project.oneLiner}
            </p>

            <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3">
              {[
                { label: "When", value: project.period },
                { label: "My role", value: project.role },
                { label: "Stack", value: project.stack.join(" · ") },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface p-5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                    {label}
                  </dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              {project.links.length > 0 && <LinkRow links={project.links} />}
              {project.privateNote && (
                <p className="text-sm text-ink-faint">{project.privateNote}</p>
              )}
            </div>
          </header>

          {project.media && (
            <Reveal className="mt-12">
              <ProjectMediaView media={project.media} priority />
            </Reveal>
          )}

          {project.metrics && (
            <dl className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col bg-surface p-4 sm:p-6">
                  <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                    {m.label}
                  </dt>
                  <dd className="order-first font-serif text-2xl sm:text-3xl font-medium text-ink tabular-nums whitespace-nowrap">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-16">
            <Block label="Problem">
              <p>{project.problem}</p>
            </Block>
            <Block label="Approach">
              {project.approach.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </Block>
            <Block label="Impact">
              <p>{mark(project.impact, project.impactHighlights ?? [], "hl")}</p>
            </Block>
            {project.learned && (
              <Block label="What I took from it">
                <p className="font-serif text-2xl leading-snug text-ink">
                  {project.learned}
                </p>
              </Block>
            )}
          </div>

          {project.gallery && (
            <Reveal className="mt-4 grid gap-4 sm:grid-cols-3">
              {project.gallery.map((g) => (
                <ProjectMediaView key={g.src} media={g} small />
              ))}
            </Reveal>
          )}

          <nav
            aria-label="More projects"
            className="mt-20 grid gap-4 border-t border-hairline pt-10 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group relative rounded-xl border border-hairline card-draft p-6 transition-colors hover:border-accent/60"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  <ArrowLeft className="size-3.5" aria-hidden />
                  Previous
                </span>
                <span className="mt-2 block text-lg font-medium text-ink">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={`/projects/${next.slug}`}
                className="group relative rounded-xl border border-hairline card-draft p-6 text-right transition-colors hover:border-accent/60"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  Next
                  <ArrowRight className="size-3.5" aria-hidden />
                </span>
                <span className="mt-2 block text-lg font-medium text-ink">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </article>
      </main>
      <Footer />
      <AskAgrim />
    </>
  );
}
