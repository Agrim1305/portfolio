import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/fade-in";
import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";

type Project = {
  title: string;
  status: string;
  description: string;
  stack: string[];
  href?: string; // GitHub source
  live?: string; // deployed app
  image?: string;
};

const projects: Project[] = [
  {
    title: "MetaPlay",
    status: "Live · 2025",
    description:
      "A community-driven web platform where gamers search, track, and review video games using live data from the RAWG API. Built end to end with secure authentication (local + Google OAuth), role-based access, and personal collections.",
    stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js"],
    href: "https://github.com/Agrim1305/Metaplay",
    live: "https://metaplay-production.up.railway.app/",
    image: "/metaplay.jpg",
  },
  {
    title: "Baseline",
    status: "In development",
    description:
      "A tool that lets tennis coaches log sessions by talking instead of typing, transcribing voice notes into structured logs and flagging clients who've gone quiet. Born from my own coaching practice.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Whisper", "PostgreSQL"],
  },
  {
    title: "Receipt Extractor",
    status: "In development",
    description:
      "A scanner that pulls GST, vendor, and line-item data from Australian receipts and invoices. Built for sole traders preparing quarterly BAS.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Vision LLM"],
  },
];

function ActionButtons({ project }: { project: Project }) {
  if (!project.live && !project.href) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 mt-5">
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-gold px-4 py-2 text-sm font-bold text-background hover:bg-accent-gold/90 hover:scale-[1.02] transition-all"
        >
          <ExternalLink className="size-4" />
          Launch live app
        </a>
      )}
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:border-accent-gold/40 hover:text-accent-gold transition-all"
        >
          <FaGithub className="size-4" />
          View source
        </a>
      )}
    </div>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-1">
        <h3 className="text-lg font-bold text-white">{project.title}</h3>
        <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider shrink-0">
          {project.status}
        </span>
      </div>
      <p className="text-base text-white/75 leading-relaxed">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 rounded-full text-xs font-mono bg-accent-blue/10 text-accent-blue/90 border border-accent-blue/20"
          >
            {tech}
          </span>
        ))}
      </div>
      <ActionButtons project={project} />
    </>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-32">
      <SectionHeading
        number="03"
        title="Projects"
        caption="Things I've shipped · things I'm building"
      />
      <div className="space-y-4">
        {projects.map((project, i) => (
          <FadeIn key={project.title} delay={i * 90}>
            <Card className="glass-panel overflow-hidden hover:border-white/25 transition-all group">
              {project.image ? (
                // Featured layout: screenshot beside the text
                <div className="grid md:grid-cols-2 items-stretch">
                  <a
                    href={project.live ?? project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block min-h-[220px] md:min-h-full overflow-hidden bg-accent-blue/5 border-b md:border-b-0 md:border-r border-white/10"
                    aria-label={`Open ${project.title}`}
                  >
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                    {project.live && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur px-3 py-1.5 text-xs font-mono text-white border border-white/15">
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                        </span>
                        Live
                      </span>
                    )}
                  </a>
                  <div className="p-6">
                    <ProjectMeta project={project} />
                  </div>
                </div>
              ) : (
                // Simple text card for in-development projects
                <div className="p-6">
                  <ProjectMeta project={project} />
                </div>
              )}
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}