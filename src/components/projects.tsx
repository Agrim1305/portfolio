import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";

type Project = {
  title: string;
  status: string;
  description: string;
  stack: string[];
  href?: string;
};

const projects: Project[] = [
  {
    title: "MetaPlay",
    status: "Shipped · 2025",
    description: "A community-driven web platform where gamers search, track, and review video games using live data from the RAWG API. Built end to end with secure authentication, role-based access, and personal collections.",
    stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js"],
    href: "https://github.com/Agrim1305/Metaplay",
  },
  {
    title: "Baseline",
    status: "In development",
    description: "A tool that lets tennis coaches log sessions by talking instead of typing, transcribing voice notes into structured logs and flagging clients who've gone quiet. Born from my own coaching practice.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Whisper", "PostgreSQL"],
  },
  {
    title: "Receipt Extractor",
    status: "In development",
    description: "A scanner that pulls GST, vendor, and line-item data from Australian receipts and invoices. Built for sole traders preparing quarterly BAS.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Vision LLM"],
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-32">
      <SectionHeading number="03" title="Projects" caption="Things I've shipped · things I'm building" />
      <div className="space-y-4">
        {projects.map((project) => {
          const Wrapper = project.href ? "a" : "div";
          return (
            <Card key={project.title} className="glass-panel p-6 hover:border-white/25 transition-all hover:-translate-y-1 group">
              <Wrapper
                {...(project.href ? { href: project.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block"
              >
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-accent-gold transition-colors flex items-center gap-2">
                    {project.title}
                    {project.href && <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </h3>
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider shrink-0">{project.status}</span>
                </div>
                <p className="text-base text-white/75 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.stack.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono bg-accent-blue/10 text-accent-blue/90 border border-accent-blue/20">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.href && (
                  <div className="flex items-center gap-1.5 mt-4 text-xs font-mono text-white/50 group-hover:text-accent-gold transition-colors">
                    <FaGithub className="size-3.5" />
                    <span>View source</span>
                  </div>
                )}
              </Wrapper>
            </Card>
          );
        })}
      </div>
    </section>
  );
}