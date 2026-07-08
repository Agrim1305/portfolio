import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { BrowserFrame } from "@/components/browser-frame";

type Project = {
  title: string;
  status: string;
  oneLiner: string;
  emphasis: string; // phrase in the one-liner to lift to bright ink
  impact: string;
  stack: string[];
  href?: string; // GitHub source
  live?: string; // deployed app
};

const flagship = {
  title: "MetaPlay",
  status: "Live · 2025",
  problem:
    "Gamers track what they play across scattered notes, spreadsheets, and memory. Our brief was a single place to discover games, build a collection, and review them, backed by real game data rather than a static seed list.",
  approach:
    "I worked in a five-person team and owned the front-end and back-end integration. I built the authentication layer, with email and password login plus Google sign-in across three roles (admin, user, and guest), and designed a normalised MySQL schema across eight tables. After the course ended I came back to it on my own, fixed the remaining issues end to end, wired it up to live RAWG game data, and deployed it to production.",
  impact:
    "It runs live today with personalised dashboards, collections, reviews, and an admin panel, pulling real-time data from the RAWG API. This is the deployed version of a team project that I took the rest of the way and shipped myself.",
  stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js"],
  href: "https://github.com/Agrim1305/Metaplay",
  live: "https://metaplay-production.up.railway.app/",
};

// Adding a future project is one new entry here; the grid renders any count.
const projects: Project[] = [
  {
    title: "Pathfinder AI Agent",
    status: "Python · 2026",
    oneLiner:
      "A logic-based agent that reasons its way through hidden hazards. It scored ten out of ten on every hidden autograder map.",
    emphasis: "ten out of ten",
    impact:
      "It builds a propositional knowledge base from what it senses and deduces which cells are safe, taking a calculated risk only when forced. My clearest example of logic-based AI and reasoning under uncertainty.",
    stack: ["Python", "Propositional Logic", "Search"],
  },
  {
    title: "GPS Tracker Dashboard",
    status: "Java · 2026",
    oneLiner:
      "A real-time tracking dashboard built on functional reactive streams, verified by nineteen unit tests.",
    emphasis: "nineteen unit tests",
    impact:
      "Location updates and alerts flow through composable event streams instead of shared mutable state, so the UI updates cleanly as data arrives. It is where I learned to handle streaming data and event-driven design properly.",
    stack: ["Java", "Sodium FRP", "JUnit"],
    href: "https://github.com/Agrim1305/gps-frp-tracker",
  },
  {
    title: "Virtual Restaurant Simulator",
    status: "C++ · 2025",
    oneLiner:
      "A restaurant simulation designed around clean class hierarchies, so new staff roles extend it without rewrites.",
    emphasis: "without rewrites",
    impact:
      "A Person base class with inheritance and virtual methods lets each role define its own behaviour through a shared interface, and state persists to files between sessions. Adding a staff type means adding a class, not rewriting logic.",
    stack: ["C++", "OOP", "Makefile"],
    href: "https://github.com/Agrim1305/Virtual_Restaurant_Simulator",
  },
  {
    title: "Baseline",
    status: "In development",
    oneLiner:
      "A voice-first session log for tennis coaches, built from my own coaching practice.",
    emphasis: "voice-first session log",
    impact:
      "Voice notes are transcribed into structured session records, and clients who have not booked in a while get flagged before they churn. I am the first real user; other Adelaide coaches are next.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Whisper", "PostgreSQL"],
  },
  {
    title: "Receipt Extractor",
    status: "In development",
    oneLiner:
      "A scanner that turns Australian receipts into structured, GST-ready data.",
    emphasis: "GST-ready data",
    impact:
      "It reads a receipt or invoice and pulls out the vendor, line items, and GST, structured to feed straight into a BAS workflow. An evening of manual entry becomes a few minutes of review.",
    stack: ["Next.js", "TypeScript", "FastAPI", "Vision LLM"],
  },
];

// Wraps the first occurrence of `phrase` in the keyword-highlight (gold) treatment.
function highlight(text: string, phrase: string) {
  const i = text.indexOf(phrase);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="hl">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

// Lifts the key phrase of an otherwise muted line to bright ink, so the eye
// lands on it without spending the gold accent.
function emphasize(text: string, phrase: string) {
  const i = text.indexOf(phrase);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-medium text-ink">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

function StatusTag({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
      <span className="size-1.5 rounded-full bg-accent" />
      {status}
    </span>
  );
}

function StackLine({ stack }: { stack: string[] }) {
  return (
    <p className="font-mono text-xs text-ink-faint">{stack.join(" · ")}</p>
  );
}

function ProjectLinks({ live, href }: { live?: string; href?: string }) {
  if (!live && !href) return null;
  return (
    <p className="flex flex-wrap gap-x-6">
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw inline-flex min-h-11 items-center gap-1 text-[15px] text-accent"
        >
          Live demo
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw inline-flex min-h-11 items-center gap-1 text-[15px] text-ink"
        >
          Source
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
    </p>
  );
}

function DetailBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
        {label}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        {children}
      </p>
    </div>
  );
}

// Flagship: full Problem / Approach / Impact depth, in the same card language
// as the others. The depth difference is the signal that this one matters most.
function FlagshipCard() {
  return (
    <article className="group relative card-draft rounded-xl border border-hairline p-6 sm:p-8 transition-colors duration-300 hover:border-accent/60">
      <span className="reg-tick reg-tl" aria-hidden />
      <span className="reg-tick reg-tr" aria-hidden />
      <span className="reg-tick reg-bl" aria-hidden />
      <span className="reg-tick reg-br" aria-hidden />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
          {flagship.title}
        </h3>
        <StatusTag status={flagship.status} />
      </div>
      <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-3">
        <DetailBlock label="Problem">{flagship.problem}</DetailBlock>
        <DetailBlock label="Approach">{flagship.approach}</DetailBlock>
        <DetailBlock label="Impact">
          {highlight(flagship.impact, "runs live today")}
        </DetailBlock>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <ProjectLinks live={flagship.live} href={flagship.href} />
        <StackLine stack={flagship.stack} />
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-hairline card-draft p-7 transition-colors duration-300 hover:border-accent/60">
      <span className="reg-tick reg-tl" aria-hidden />
      <span className="reg-tick reg-tr" aria-hidden />
      <span className="reg-tick reg-bl" aria-hidden />
      <span className="reg-tick reg-br" aria-hidden />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-xl font-semibold text-ink">{project.title}</h3>
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
          {project.status}
        </span>
      </div>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-muted">
        {emphasize(project.oneLiner, project.emphasis)}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-faint">
        {project.impact}
      </p>
      <div className="mt-auto pt-6 space-y-1">
        <StackLine stack={project.stack} />
        <ProjectLinks live={project.live} href={project.href} />
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

      {/* Flagship: the screenshot is the anchor, the card carries the depth */}
      <div
        className="rise"
        style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
      >
        <BrowserFrame
          src="/metaplay-landing.png"
          alt="MetaPlay landing page: personalised gaming hub with account sign-up and Google sign-in"
          url="metaplay-production.up.railway.app"
          href={flagship.live}
          priority
        />
        <div className="mt-6">
          <FlagshipCard />
        </div>
      </div>

      {/* The rest: tight one-liner-plus-supporting cards, two-up */}
      <div
        className="rise mt-16 grid gap-5 md:grid-cols-2"
        style={{ "--rise-delay": "0.32s" } as React.CSSProperties}
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
