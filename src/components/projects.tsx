import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { SectionHeading } from "@/components/section-heading";

type ProjectLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type Project = {
  title: string;
  status: string;
  description: string;
  highlight?: string;
  stack: string[];
  links?: ProjectLink[];
};

const projects: Project[] = [
  {
    title: "MetaPlay",
    status: "Shipped, 2025",
    highlight: "Built end to end with secure authentication and role-based access.",
    description: "A community-driven web platform where gamers search, track, and review video games using live data from the RAWG Games Database API. Users build personal collections, follow friends, and contribute reviews. Built as a group project for Web and Database Computing at Adelaide University.",
    stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js", "RAWG API"],
    links: [
      {
        href: "https://github.com/Agrim1305/Metaplay",
        label: "GitHub",
        icon: <FaGithub className="size-4" />,
      },
    ],
  },
  {
    title: "Baseline",
    status: "In development",
    highlight: "Built for tennis coaches managing 20 to 50 students.",
    description: "A tool that lets tennis coaches log their sessions by talking instead of typing, transcribing voice notes into structured session logs and flagging clients who have gone quiet. Born from my own coaching practice at Tea Tree Gully.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Whisper", "PostgreSQL", "Clerk"],
  },
  {
    title: "Receipt Extractor",
    status: "In development",
    highlight: "Built for Australian sole traders preparing quarterly BAS.",
    description: "A scanner that pulls GST, vendor, and line-item data from Australian receipts and invoices. Targeted at the bookkeeping pain that small operators actually deal with every quarter.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Vision LLM", "PostgreSQL"],
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="transition-all duration-300 hover:border-foreground/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-2xl md:text-3xl">{project.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">{project.status}</Badge>
        </div>
        {project.highlight && (
          <p className="text-sm font-mono text-muted-foreground/80 mt-2">{project.highlight}</p>
        )}
        <CardDescription className="text-base md:text-lg leading-relaxed mt-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="outline" className="font-mono text-xs">{tech}</Badge>
          ))}
        </div>
      </CardContent>
      {project.links && project.links.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2">
          {project.links.map((link) => (
            <Button key={link.href} asChild variant="outline" size="sm" className="h-9">
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.icon}
                {link.label}
              </a>
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-32">
      <SectionHeading number="03" title="Projects" caption="Things I've built · things I'm building" />
      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}