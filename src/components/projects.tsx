import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

type ProjectLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type Project = {
  title: string;
  status: string;
  description: string;
  stack: string[];
  links?: ProjectLink[];
};

const projects: Project[] = [
  {
    title: "Baseline",
    status: "In development",
    description: "A tool that lets tennis coaches log their sessions by talking instead of typing, and flags clients who have gone quiet. Built for coaches managing 20 to 50 students.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Whisper", "PostgreSQL", "Clerk"],
  },
  {
    title: "Receipt Extractor",
    status: "In development",
    description: "A scanner that pulls GST, vendor, and line-item data from Australian receipts and invoices. Built for sole traders preparing their quarterly BAS.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Vision LLM", "PostgreSQL"],
  },
  {
    title: "MetaPlay",
    status: "Shipped, 2025",
    description: "A community-driven web platform where gamers search, track, and review video games using live data from the RAWG Games Database API. Users build personal collections, follow friends, and contribute reviews. Built as a group project for Web and Database Computing at the University of Adelaide.",
    stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js", "RAWG API"],
    links: [
      {
        href: "https://github.com/Agrim1305/Metaplay",
        label: "GitHub",
        icon: <FaGithub className="size-4" />,
      },
    ],
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">{project.status}</Badge>
        </div>
        <CardDescription className="text-base leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="outline">{tech}</Badge>
          ))}
        </div>
      </CardContent>
      {project.links && project.links.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2">
          {project.links.map((link) => (
            <Button key={link.href} asChild variant="outline" size="sm">
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
    <section id="projects" className="py-24">
      <h2 className="text-2xl font-semibold mb-8">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}