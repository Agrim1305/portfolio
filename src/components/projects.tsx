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
      "A web app where gamers can search for titles, track what they're playing, and leave reviews. It pulls live game data from the RAWG API. I built the whole thing: the MySQL database, login with email and Google sign-in, user roles, and an admin dashboard.",
    stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js"],
    href: "https://github.com/Agrim1305/Metaplay",
    live: "https://metaplay-production.up.railway.app/",
    image: "/metaplay.jpg",
  },
  {
    title: "Baseline",
    status: "In development",
    description:
      "A tool for tennis coaches to log sessions by talking instead of typing. It turns voice notes into structured records and flags clients who haven't booked in a while. I'm building it from my own coaching work.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Whisper", "PostgreSQL"],
  },
  {
    title: "Receipt Extractor",
    status: "In development",
    description:
      "A scanner that reads Australian receipts and invoices and pulls out the GST, vendor, and line items. Built to save sole traders time when they prepare their quarterly BAS.",
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
                // Featured layout: styled logo panel beside the text
                <div className="grid md:grid-cols-2 items-stretch">
                  <div className="p-4 md:pr-0">
                    <a
                      href={project.live ?? project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center justify-center aspect-[4/3] md:aspect-auto md:h-full md:min-h-[240px] overflow-hidden rounded-xl ring-1 ring-white/10 bg-gradient-to-br from-[#1a1320] via-card to-[#0d1420]"
                      aria-label={`Open ${project.title}`}
                    >
                      {/* Soft glow accent */}
                      <div className="absolute -inset-10 bg-gradient-to-tr from-rose-500/10 via-transparent to-accent-blue/10 blur-2xl" />
                      <div className="relative text-center px-6">
                        <p className="text-3xl md:text-4xl font-bold tracking-tight text-rose-400 transition-transform duration-500 group-hover:scale-105">
                          MetaPlay
                        </p>
                        <p className="mt-2 font-mono text-[11px] text-white/50 uppercase tracking-[0.2em]">
                          Live games dashboard
                        </p>
                      </div>
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
                  </div>
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