import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/fade-in";
import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";

type Tier = "flagship" | "engineering" | "building";

type Project = {
  title: string;
  status: string;
  tier: Tier;
  problem: string;   // What needed solving
  approach: string;  // What I did about it
  impact: string;    // What it does / achieved now
  stack: string[];
  href?: string; // GitHub source
  live?: string; // deployed app
  image?: string;
};

const projects: Project[] = [
  {
    title: "MetaPlay",
    status: "Live · 2025",
    tier: "flagship",
    problem:
      "Gamers track what they play across scattered notes, spreadsheets, and memory. Our brief was a single place to discover games, build a collection, and review them, backed by real game data rather than a static seed list.",
    approach:
      "I worked in a five-person team and owned the front-end and back-end integration. I built the authentication layer, with email and password login plus Google sign-in across three roles (admin, user, and guest), and designed a normalised MySQL schema across eight tables. After the course ended I came back to it on my own, fixed the remaining issues end to end, wired it up to live RAWG game data, and deployed it to production.",
    impact:
      "It runs live today with personalised dashboards, collections, reviews, and an admin panel, pulling real-time data from the RAWG API. It is the deployed version of a team project that I took the rest of the way and shipped myself.",
    stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js"],
    href: "https://github.com/Agrim1305/Metaplay",
    live: "https://metaplay-production.up.railway.app/",
    image: "/metaplay.jpg",
  },
  {
    title: "Virtual Restaurant Simulator",
    status: "C++ · 2025",
    tier: "engineering",
    problem:
      "The task was to model a working restaurant in C++, covering staff, menus, orders, and inventory. The tricky part was keeping it maintainable as new staff types and behaviours got added, instead of letting it collapse into one giant switch statement.",
    approach:
      "I designed an object-oriented hierarchy with a Person base class extended by Employee, Chef, and Head Chef, using inheritance and virtual methods so each role defines its own behaviour through a shared interface. State is persisted to and reloaded from files so a session can be saved and resumed.",
    impact:
      "A command-line simulation that runs a full restaurant cycle and stays easy to extend. Adding a new staff type just means adding a class, with no need to rewrite the existing logic. This is the project where I learned to think in terms of clean class boundaries and polymorphism.",
    stack: ["C++", "OOP", "Makefile"],
    href: "https://github.com/Agrim1305/Virtual_Restaurant_Simulator",
  },
  {
    title: "Pathfinder AI Agent",
    status: "Python · 2026",
    tier: "engineering",
    problem:
      "An agent is dropped into a grid it cannot fully see, with hidden hazards scattered around it. It has to reach the goal without dying by reasoning from limited clues rather than blindly trying every path, which means it needs to track what it knows and work out what is safe to do next.",
    approach:
      "I built a propositional knowledge base that records facts the agent senses, with inference rules that deduce which neighbouring cells are safe. On top of that I wrote a search strategy that picks the next move under uncertainty, preferring proven-safe cells and only taking a calculated risk when forced.",
    impact:
      "The agent navigates hidden environments reliably and scored ten out of ten on the course autograder across every hidden test map. It is my clearest example of logic-based AI and reasoning under uncertainty, written and tested entirely in Python.",
    stack: ["Python", "Propositional Logic", "Search"],
  },
  {
    title: "GPS Tracker Dashboard",
    status: "Java · 2026",
    tier: "engineering",
    problem:
      "A live tracking dashboard has to react to a continuous stream of location updates and raise alerts as they arrive, without the tangle of shared mutable state and manual event wiring that normally makes real-time UIs fragile.",
    approach:
      "I modelled location updates and alerts as composable event streams using functional reactive programming in Java, so data flows through transformations instead of being mutated in place. I designed the data model and event-handling logic with object-oriented principles and covered it with unit tests targeting the tricky edge cases.",
    impact:
      "A real-time dashboard that updates cleanly as new data arrives, with no shared mutable state and nineteen passing unit tests verifying its behaviour. It is where I learned to handle streaming data and event-driven design properly.",
    stack: ["Java", "Sodium FRP", "JUnit"],
  },
  {
    title: "Baseline",
    status: "In development",
    tier: "building",
    problem:
      "I coach tennis, and logging each session by typing is the kind of friction nobody keeps up with. Coaches end up losing track of what they worked on and which clients are quietly drifting away. There is no lightweight tool built for how a solo coach actually works.",
    approach:
      "I am building a mobile-first tool where a coach talks instead of types: voice notes are transcribed and turned into structured session records. It flags clients who have not booked in a while so they can be followed up before they churn.",
    impact:
      "In active development, built directly from my own coaching practice as the first real user. The goal is a tool I rely on weekly, then put in front of other Adelaide coaches.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Whisper", "PostgreSQL"],
  },
  {
    title: "Receipt Extractor",
    status: "In development",
    tier: "building",
    problem:
      "Sole traders in Australia waste hours each quarter manually keying receipts and invoices to prepare their Business Activity Statement, and small errors in GST totals are easy to make and costly to fix.",
    approach:
      "I am building a scanner that reads a receipt or invoice and pulls out the vendor, line items, and GST automatically, structuring the data so it is ready to feed straight into a BAS workflow.",
    impact:
      "Early development. The aim is to turn a pile of paper receipts into clean, reviewable data in minutes instead of an evening of manual entry.",
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

function StarBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-4 first:mt-4 pl-3 border-l-2 border-accent-gold/40">
      <span className="inline-block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent-gold bg-accent-gold/15 px-2.5 py-1 rounded mb-2">
        {label}
      </span>
      <p className="text-[15px] leading-relaxed text-white/80">{text}</p>
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
      <StarBlock label="Problem" text={project.problem} />
      <StarBlock label="Approach" text={project.approach} />
      <StarBlock label="Impact" text={project.impact} />
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

function FlagshipCard({ project }: { project: Project }) {
  return (
    <Card className="glass-panel overflow-hidden hover:border-white/25 transition-all group">
      <div className="grid md:grid-cols-2 items-stretch">
        {/* Left column: logo panel + stack + actions, filling the height */}
        <div className="p-4 md:pr-2 flex flex-col gap-4">
          <a
            href={project.live ?? project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-white/10 bg-gradient-to-br from-[#1a1320] via-card to-[#0d1420]"
            aria-label={`Open ${project.title}`}
          >
            <div className="absolute -inset-10 bg-gradient-to-tr from-rose-500/10 via-transparent to-accent-blue/10 blur-2xl" />
            <div className="relative text-center px-6">
              <p className="text-3xl md:text-4xl font-bold tracking-tight text-rose-400 transition-transform duration-500 group-hover:scale-105">
                MetaPlay
              </p>
              <p className="mt-2 font-mono text-[10px] text-white/50 uppercase tracking-[0.2em]">
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

          {/* Stack tags fill the space under the logo */}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-mono bg-accent-blue/10 text-accent-blue/90 border border-accent-blue/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action buttons anchored to the bottom of the left column */}
          <div className="mt-auto">
            <ActionButtons project={project} />
          </div>
        </div>

        {/* Right column: title + Problem / Approach / Impact */}
        <div className="p-6 md:pl-4">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider shrink-0">
              {project.status}
            </span>
          </div>
          <StarBlock label="Problem" text={project.problem} />
          <StarBlock label="Approach" text={project.approach} />
          <StarBlock label="Impact" text={project.impact} />
        </div>
      </div>
    </Card>
  );
}

function TextCard({ project }: { project: Project }) {
  return (
    <Card className="glass-panel overflow-hidden hover:border-white/25 transition-all group h-full">
      <div className="p-6">
        <ProjectMeta project={project} />
      </div>
    </Card>
  );
}

function TierLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-12 mb-4 first:mt-0">
      <span className="font-mono text-xs text-accent-gold/80 uppercase tracking-[0.2em]">
        {children}
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export function Projects() {
  const flagship = projects.filter((p) => p.tier === "flagship");
  const engineering = projects.filter((p) => p.tier === "engineering");
  const building = projects.filter((p) => p.tier === "building");

  return (
    <section id="projects" className="py-32">
      <SectionHeading
        number="03"
        title="Projects"
        caption="Problem, approach, and impact"
      />

      {flagship.map((project, i) => (
        <FadeIn key={project.title} delay={i * 90}>
          <FlagshipCard project={project} />
        </FadeIn>
      ))}

      {engineering.length > 0 && (
        <>
          <TierLabel>Other engineering work</TierLabel>
          <div className="grid md:grid-cols-2 gap-4 items-stretch">
            {engineering.map((project, i) => (
              <FadeIn key={project.title} delay={i * 90} className="h-full">
                <TextCard project={project} />
              </FadeIn>
            ))}
          </div>
        </>
      )}

      {building.length > 0 && (
        <>
          <TierLabel>Currently building</TierLabel>
          <div className="grid md:grid-cols-2 gap-4 items-stretch">
            {building.map((project, i) => (
              <FadeIn key={project.title} delay={i * 90} className="h-full">
                <TextCard project={project} />
              </FadeIn>
            ))}
          </div>
        </>
      )}
    </section>
  );
}