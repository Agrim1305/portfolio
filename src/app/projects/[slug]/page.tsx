import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { AskAgrim } from "@/components/ask-agrim";
import { CaseStudy } from "@/components/case-study";
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
      <main className="wrap pb-24 pt-6 lg:pb-32 lg:pt-8">
        <Link
          href="/#projects"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All projects
        </Link>

        <article className="mx-auto mt-8 max-w-[1020px] lg:mt-12">
          <CaseStudy project={project} />
        </article>

        <nav
          aria-label="More projects"
          className="mx-auto mt-20 grid max-w-[1020px] gap-4 border-t border-hairline pt-10 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="lift rounded-3xl border border-hairline bg-surface p-6 transition-colors hover:border-accent/60"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
                <ArrowLeft className="size-3.5" aria-hidden />
                Previous
              </span>
              <span className="mt-2 block font-display text-xl font-bold text-ink">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="lift rounded-3xl border border-hairline bg-surface p-6 text-right transition-colors hover:border-accent/60"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
                Next
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
              <span className="mt-2 block font-display text-xl font-bold text-ink">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </main>
      <Footer />
      <AskAgrim />
    </>
  );
}
