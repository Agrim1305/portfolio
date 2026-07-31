import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { BrowserFrame } from "@/components/browser-frame";
import { TickFrame } from "@/components/tick-frame";

type Link = { label: string; url: string; accent?: boolean };

type Project = {
  title: string;
  status: string;
  oneLiner: string;
  emphasis: string; // phrase in the one-liner to lift to bright ink
  impact: string;
  stack: string[];
  links: Link[];
};

type CaseStudy = {
  title: string;
  status: string;
  problem: string;
  approach: string[]; // one entry per paragraph
  impact: string;
  impactHighlights?: string[]; // phrases in the impact to lift to gold
  stack: string[];
  links: Link[];
};

const pacificVillage: CaseStudy = {
  title: "Pacific Village Explorer",
  status: "Top 12 finalist · 2026 Humanitarian Innovation Hackathon",
  problem:
    "A village council deciding where to rebuild after a flood, where to move a school, or how to farm ground turning saline has no way to see its own coastline in twenty years. The digital twin platforms that answer that cost over $10,000 per site and need technical staff villages do not have.",
  approach: [
    "Built in 44 hours with a three-university team at the University of Sydney. A coordinator picks their village, drags a timeline from 2026 to 2075, and watches houses, wells, farms and sacred sites change status as the water rises, with adaptation options for every asset at risk.",
    "I led the AI recommendation engine. The prompt carries each village's real context, its population, cultural constraints, budget and community capacity, into the Claude API, with guardrails that keep every recommendation tied to that village instead of generic climate advice, plus an offline fallback so the tool still works with no API at all.",
    "The call I am proudest of was 2D over a 3D digital twin. 86% of the Pacific has mobile coverage but only 27% use mobile internet, so the real constraint is usability, not connectivity. Appropriate technology beats impressive technology.",
  ],
  impact:
    "Top 12 of 75 submissions from 110 teams, and the only finalist representing Adelaide University. Judged by a panel including Sir Peter Cosgrove, Canva, Commonwealth Bank's AI Scientist and the Pacific Region Infrastructure Facility. Under $500 per village against $10,000+ for the alternatives, on any phone from the last five years, built on IPCC AR6, SPREP and NASA sea level data. The Grand Final is on 19 August.",
  impactHighlights: [
    "Top 12 of 75 submissions",
    "the only finalist representing Adelaide University",
  ],
  stack: ["React", "Vite", "Tailwind", "Leaflet", "Claude API", "Vercel"],
  links: [
    {
      label: "Source",
      url: "https://github.com/reeyansh404/Pacific-Village-Explorer",
    },
    {
      label: "Finalist announcement",
      url: "https://hack-eng.sydney.edu.au/",
      accent: true,
    },
  ],
};

const metaplay: CaseStudy = {
  title: "MetaPlay",
  status: "Live · 2025",
  problem:
    "Gamers track what they play across scattered notes, spreadsheets, and memory. Our brief was a single place to discover games, build a collection, and review them, backed by real game data rather than a static seed list.",
  approach: [
    "I worked in a five-person team and owned the front-end and back-end integration. I built the authentication layer, with email and password login plus Google sign-in across three roles (admin, user, and guest), and designed a normalised MySQL schema across eight tables.",
    "After the course ended I came back to it on my own, fixed the remaining issues end to end, wired it up to live RAWG game data, and deployed it to production.",
  ],
  impact:
    "It runs live today with personalised dashboards, collections, reviews, and an admin panel, pulling real-time data from the RAWG API. This is the deployed version of a team project that I took the rest of the way and shipped myself.",
  impactHighlights: ["runs live today"],
  stack: ["Vue.js", "Node.js", "Express", "MySQL", "Passport.js"],
  links: [
    {
      label: "Live demo",
      url: "https://metaplay-g2q7.onrender.com/",
      accent: true,
    },
    { label: "Source", url: "https://github.com/Agrim1305/Metaplay" },
  ],
};

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
    links: [
      { label: "Source", url: "https://github.com/Agrim1305/Pathfinder" },
    ],
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
    links: [
      { label: "Source", url: "https://github.com/Agrim1305/gps-frp-tracker" },
    ],
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
    links: [
      {
        label: "Source",
        url: "https://github.com/Agrim1305/Virtual_Restaurant_Simulator",
      },
    ],
  },
];

// Wraps the first occurrence of each phrase in `className` so a skimming reader
// lands on the numbers that matter. Gold (`hl`) is reserved for the strongest
// claims; bright ink carries the rest without spending the accent.
function mark(text: string, phrases: string[], className: string) {
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

function StackLine({
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

function LinkRow({ links }: { links: Link[] }) {
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
function CaseStudyCard({
  study,
  media,
}: {
  study: CaseStudy;
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
          {study.approach.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </DetailBlock>
        <DetailBlock label="Impact" className="lg:col-start-1 lg:row-start-2">
          <p>{mark(study.impact, study.impactHighlights ?? [], "hl")}</p>
        </DetailBlock>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <LinkRow links={study.links} />
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
        {project.impact}
      </p>
      {/* Metadata band, pinned to the bottom so it lines up across the row. The
          stack matches the 11px status line above, which also keeps it on one
          line so the rule sits at the same height on every card. */}
      <div className="mt-auto space-y-2 border-t border-hairline pt-5">
        <StackLine stack={project.stack} className="text-[11px]" />
        <LinkRow links={project.links} />
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

      {/* Lead: the card carries the depth, and the hackathon photos sit
          underneath as evidence of how it was built. */}
      <div
        className="rise"
        style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
      >
        <CaseStudyCard
          study={pacificVillage}
          media={
            <TickFrame
              src="/pacific-app.jpg"
              alt="Pacific Village Explorer: flooding vulnerability on Christmas Island, Kiribati at 2055, with the sea level timeline and climate planning layers"
              sizes="(max-width: 1024px) 100vw, 900px"
              caption="Christmas Island, Kiribati at 2055"
              objectPosition="top"
              entrance="reveal"
              priority
              className="aspect-[1920/1035]"
            />
          }
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <TickFrame
            src="/pacific-team.jpg"
            alt="Agrim Sharma with his two teammates at the Humanitarian Innovation Hackathon"
            sizes="(max-width: 640px) 100vw, 320px"
            caption="The team"
            objectPosition="center"
            entrance="reveal"
            className="aspect-[3/2]"
          />
          <TickFrame
            src="/pacific-build.jpg"
            alt="Whiteboarding the app architecture during the hackathon"
            sizes="(max-width: 640px) 100vw, 320px"
            caption="Whiteboarding the build"
            objectPosition="center"
            entrance="reveal"
            className="aspect-[3/2]"
          />
          <TickFrame
            src="/pacific-work.jpg"
            alt="The three-university team building during the 44-hour hackathon"
            sizes="(max-width: 640px) 100vw, 320px"
            caption="44 hours in"
            objectPosition="center"
            entrance="reveal"
            className="aspect-[3/2]"
          />
        </div>
      </div>

      {/* Second: MetaPlay, the deployed product. */}
      <div
        className="rise mt-16"
        style={{ "--rise-delay": "0.3s" } as React.CSSProperties}
      >
        <CaseStudyCard
          study={metaplay}
          media={
            <BrowserFrame
              src="/metaplay-landing.png"
              alt="MetaPlay landing page: personalised gaming hub with account sign-up and Google sign-in"
              url="metaplay-production.up.railway.app"
              href="https://metaplay-production.up.railway.app/"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          }
        />
      </div>

      {/* The rest: tight one-liner-plus-supporting cards. Three-up once there is
          room; at the two-column width an odd last card takes the full row so it
          never sits alone in a half-empty one. */}
      <div
        className="rise mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        style={{ "--rise-delay": "0.36s" } as React.CSSProperties}
      >
        {projects.map((project, i) => {
          const isOddLast =
            i === projects.length - 1 && projects.length % 2 === 1;
          return (
            <ProjectCard
              key={project.title}
              project={project}
              className={isOddLast ? "md:col-span-2 lg:col-span-1" : ""}
            />
          );
        })}
      </div>
    </section>
  );
}
