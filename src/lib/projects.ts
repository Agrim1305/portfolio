/* Single source of truth for every project on the site.
   The home page cards, the /projects/[slug] case study pages and the chat
   assistant's knowledge base all read from this file, so a fact only ever
   needs changing in one place. Keep every claim here verifiable: if a
   recruiter clicks the source link, the repo should back up what is written. */

export type ProjectLink = { label: string; url: string; accent?: boolean };
export type Metric = { value: string; label: string };

/* A screenshot or photo, with its real size in pixels. */
export type ProjectMedia =
  | {
      kind: "photo";
      src: string;
      alt: string;
      caption?: string;
      width: number;
      height: number;
      position?: "top" | "center";
    }
  | {
      kind: "browser";
      src: string;
      alt: string;
      url: string;
      href: string;
      width: number;
      height: number;
    };

/* A real capture of the project running, beyond the card's: a page in a
   browser or a terminal, shown whole in the case study. */
export type ProjectScreen = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  /** Short tag shown above the title, e.g. "Live · 2025". */
  status: string;
  period: string;
  role: string;
  /** Marks the two flagship projects. Every card shares one treatment in the
      current design, so nothing reads this at the moment. */
  lead?: boolean;
  oneLiner: string;
  /** Phrase inside oneLiner lifted to bright ink. */
  emphasis: string;
  /** Two or three sentences for the home page card. */
  summary: string;
  problem: string;
  approach: string[];
  impact: string;
  /** Phrases inside impact lifted to gold. */
  impactHighlights?: string[];
  metrics?: Metric[];
  learned?: string;
  stack: string[];
  links: ProjectLink[];
  /** Shown instead of links when there is no public source. */
  privateNote?: string;
  media?: ProjectMedia;
  screens?: ProjectScreen[];
  /** The first three sit in the story; any more follow it as a gallery. */
  gallery?: Extract<ProjectMedia, { kind: "photo" }>[];
};

export const projects: Project[] = [
  {
    slug: "pacific-village-explorer",
    title: "Pacific Village Explorer",
    status: "Top 12 finalist · 2026 Humanitarian Innovation Hackathon",
    period: "July 2026, 44 hours",
    role: "Led the AI recommendation engine in a three-person team",
    lead: true,
    oneLiner:
      "Reached the top 12 of 75 submissions at the 2026 Humanitarian Innovation Hackathon by building, in 44 hours, a climate planner that shows a Pacific village council its own coastline out to 2100.",
    emphasis: "the top 12 of 75 submissions",
    summary:
      "Drag a timeline from 2026 to 2100 and watch which ground floods as the sea rises, with planning layers for where to build, house, farm and adapt.",
    problem:
      "A village council deciding where to rebuild after a flood, where to move a school, or how to farm ground turning saline has no way to see its own coastline in twenty years. The digital twin platforms that answer that cost over $10,000 per site and need technical staff villages do not have.",
    approach: [
      "Built in 44 hours at the University of Sydney with a team put together on day one, across three universities. A coordinator opens the island map (Christmas Island, Kiribati, in our demo), drags a timeline from 2026 to 2100, and sees which ground floods as the water rises, with planning layers for future development, housing, farmland and adaptation. We also designed a village view that tracks houses, wells, farms and sacred sites one by one. The research and design were done, but we cut it to keep the demo solid inside 44 hours.",
      "I built the AI recommendation engine for the village view. Each prompt sends the Claude API the village's name, country, region, population, setting and main threats, and the threatened asset's type, name, description, cultural significance, elevation and flood status in the chosen year, with guardrails that keep recommendations practical for a small council instead of generic climate advice. The next step we researched and scoped was richer village context: budget and available labour, alongside IPCC AR6 and SPREP climate data. When we cut the village view, the engine was cut from the demo with it.",
      "I also built a fallback for the engine: a fixed set of adaptation options for each type of asset, so the village view could still recommend something with no API access.",
      "The call I am proudest of was 2D over a 3D digital twin. 86% of the Pacific has mobile coverage but only 27% use mobile internet, so the real constraint is usability, not connectivity.",
    ],
    impact:
      "One of 12 Grand Finalists from 75 submissions (110 teams), and the only Adelaide University student to reach the final, by choosing a 2D map a village council can use without technical staff over a 3D digital twin. Under $500 per village, against over $10,000 per site for existing platforms.",
    impactHighlights: ["One of 12 Grand Finalists", "the only Adelaide University student to reach the final"],
    metrics: [
      { value: "Top 12", label: "of 75 submissions" },
      { value: "44 hrs", label: "idea to demo" },
      { value: "<$500", label: "per village" },
      { value: "2026→2100", label: "timeline modelled" },
    ],
    learned:
      "Appropriate technology beats impressive technology. And scope is a decision: cutting the village view is what let us ship a demo that worked inside 44 hours.",
    stack: ["React", "Vite", "Tailwind", "Leaflet (village view, not in the demo)", "Claude API (village view, not in the demo)", "Vercel"],
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
    media: {
      kind: "photo",
      src: "/images/projects/pacific-village-explorer/map-2055.webp",
      alt: "Pacific Village Explorer: flooding vulnerability on Christmas Island, Kiribati at 2055, with the sea level timeline and climate planning layers",
      caption: "Christmas Island, Kiribati at 2055",
      width: 2000,
      height: 1250,
      position: "top",
    },
    screens: [
      {
        src: "/images/projects/pacific-village-explorer/adaptation-methods.webp",
        alt: "Pacific Village Explorer at 2055 with the Adaptation Methods layer open: Mangrove Planting, Deep-Rooted Plants and Stilted Foundations listed beside the Christmas Island flooding map",
        width: 2000,
        height: 1250,
      },
    ],
    gallery: [
      {
        kind: "photo",
        src: "/pacific-team.jpg",
        alt: "Agrim Sharma with his two teammates at the Humanitarian Innovation Hackathon",
        caption: "The team",
        width: 1600,
        height: 850,
        position: "center",
      },
      {
        kind: "photo",
        src: "/pacific-build.jpg",
        alt: "Whiteboarding the app architecture during the hackathon",
        caption: "Whiteboarding the build",
        width: 1350,
        height: 1800,
        position: "center",
      },
      {
        kind: "photo",
        src: "/pacific-work.jpg",
        alt: "The three-university team building during the 44-hour hackathon",
        caption: "44 hours in",
        width: 1600,
        height: 904,
        position: "center",
      },
      {
        kind: "photo",
        src: "/images/projects/08-hackathon-awards-team.webp",
        alt: "Agrim and teammates holding finalist certificates",
        caption: "Finalists at the 2026 Humanitarian Innovation Hackathon awards",
        width: 1500,
        height: 2000,
      },
      {
        kind: "photo",
        src: "/images/projects/10-hackathon-sofa-organiser.webp",
        alt: "Agrim, a teammate and an organiser on a sofa",
        caption: "With the team and an organiser",
        width: 2000,
        height: 1499,
      },
      {
        kind: "photo",
        src: "/images/projects/16-hackathon-group.webp",
        alt: "Agrim with other hackathon participants",
        caption: "At the awards night",
        width: 750,
        height: 500,
      },
      {
        kind: "photo",
        src: "/images/projects/17-hackathon-all-teams.webp",
        alt: "Group photo of all hackathon participants",
        caption: "All teams at the awards ceremony",
        width: 1000,
        height: 500,
      },
    ],
  },
  {
    slug: "metaplay",
    title: "MetaPlay",
    status: "Live · Built 2025, deployed 2026",
    period: "Mar 2025 to Jun 2025, deployed to production Jun 2026",
    role: "Front-end to back-end integration, auth and schema in a team of five",
    lead: true,
    oneLiner:
      "Took a finished five-person team assignment to a live product on my own, and kept it running through two forced hosting moves.",
    emphasis: "a live product on my own",
    summary:
      "Search live game data, build collections, write reviews and connect with other players. Still running today.",
    problem:
      "Gamers track what they play across scattered notes, spreadsheets, and memory. Our brief was a single place to discover games, build a collection, and review them, backed by real game data rather than a static seed list.",
    approach: [
      "I worked in a five-person team and owned the front-end and back-end integration. I built the authentication layer, with username and password login (passwords hashed with bcrypt) plus Google sign-in through Passport, with two stored roles, admin and user, and guest access when signed out, and designed the nine-table relational schema behind collections, reviews, friends and groups.",
      "When the course ended, so did everyone else's involvement. A year later I came back to it on my own, traced the broken OAuth and deployment configuration, wired it to live RAWG game data, and put it into production.",
      "It has moved twice since it first went live on Railway: to Render with Aiven MySQL when the Railway trial ended, then to Neon PostgreSQL when Aiven's free tier started powering the database off. That meant converting the schema and every query, and it taught me more about deployment than the first launch did.",
      "Since then I have redesigned it and hardened its security, including a check that normalises every URL before the static file server sees it, so encoded or re-cased paths can no longer slip past the guards on protected pages.",
    ],
    impact:
      "Live with collections, reviews, friends, groups and an admin dashboard, after I traced the broken OAuth and deployment config, moved the database across three hosting setups, and hardened access to protected pages.",
    impactHighlights: ["traced the broken OAuth and deployment config"],
    metrics: [
      { value: "Live", label: "publicly deployed" },
      { value: "9", label: "relational tables" },
      { value: "40+", label: "API endpoints" },
      { value: "3", label: "hosting setups" },
    ],
    learned:
      "Deployment is part of the product, not the last step of it. Most of what broke on the way back to production was configuration nobody had looked at since the demo.",
    stack: ["Node.js", "Express", "Vanilla JavaScript", "PostgreSQL", "Passport.js", "RAWG API"],
    links: [
      { label: "Source", url: "https://github.com/Agrim1305/Metaplay" },
      {
        label: "Live demo",
        url: "https://metaplay-g2q7.onrender.com/",
        accent: true,
      },
    ],
    media: {
      kind: "browser",
      src: "/images/projects/metaplay/landing.webp",
      width: 2000,
      height: 1250,
      alt: "MetaPlay landing page: the headline Your whole game life, on one shelf, with Start your shelf and Continue with Google buttons beside a grid of game covers.",
      url: "metaplay-g2q7.onrender.com",
      href: "https://metaplay-g2q7.onrender.com/",
    },
  },
  {
    slug: "adelaide-rising-stars",
    title: "Adelaide Rising Stars",
    status: "Live · Freelance, 2026",
    period: "Aug 2026 to Sep 2026",
    role: "Sole developer, from quote to delivery",
    oneLiner:
      "Took a 100+ player tennis academy from no website to 50+ Google Search clicks a month and 10+ new clients, with a site delivered in three weeks.",
    emphasis: "50+ Google Search clicks a month and 10+ new clients",
    summary:
      "Freelance work for a local tennis academy. I built the site around what the business needed, to give it a proper presence online.",
    problem:
      "A tennis academy coaching 100+ players was advertising mostly through a WhatsApp group. The owners wanted a professional online presence that brings in new players, without taking on software they would have to run themselves.",
    approach: [
      "I scoped and quoted the job, then ran the design with the owners through several rounds, from a dark direction to the light theme they chose, built from the navy and lime of their existing posters.",
      "The most useful thing I did happened before any code: I talked them out of self-service booking. With squads already near capacity, open booking would have overfilled sessions, so the site is enquiry-only and the coaches stay in control of who joins.",
      "It is a static Nuxt site. Squads, coaches, mentors and results live in Nuxt Content collections and partners in the app config, so adding a coach is a data change rather than a code change. Enquiries go through Netlify Forms and notify the owners straight away, and a sitemap and robots file get it indexed properly.",
    ],
    impact:
      "Delivered in three weeks on a fixed quote. The static Nuxt site scores 100 for SEO and 100 for accessibility in Lighthouse, and with on-page SEO, Search Console and a Google Business Profile that now has 10 reviews, it brings in 50+ Google Search clicks a month and has helped win 10+ new clients, as of November 2026.",
    impactHighlights: ["50+ Google Search clicks a month", "10+ new clients"],
    metrics: [
      { value: "3 wks", label: "quote to delivery" },
      { value: "50+/mo", label: "Google Search clicks" },
      { value: "10+", label: "new clients" },
      { value: "10", label: "Google reviews" },
    ],
    learned:
      "Scoping is engineering. Saying no to the booking feature did more for the client than anything I built.",
    stack: ["Nuxt", "Tailwind", "Nuxt Content", "Netlify Forms"],
    links: [{ label: "Live site", url: "https://arstennisacademy.com.au", accent: true }],
    media: {
      kind: "browser",
      src: "/images/projects/adelaide-rising-stars/home.webp",
      width: 2000,
      height: 1250,
      alt: "Adelaide Rising Stars home page: a night-time squad photo on court, with the headline Where Stars Are Made and Enquire about a squad and See session times buttons across its foot.",
      url: "arstennisacademy.com.au",
      href: "https://arstennisacademy.com.au",
    },
    screens: [
      {
        src: "/images/projects/adelaide-rising-stars/squads.webp",
        alt: "Adelaide Rising Stars squads page: the Squads and Session Times heading, a note that places are limited and grouped by level, and three squad photos",
        width: 2000,
        height: 1250,
      },
    ],
  },
  {
    slug: "portfolio-ai-assistant",
    title: "Portfolio AI Assistant",
    status: "Version 1 · Next.js · 2026",
    period: "May 2026 to Jun 2026",
    role: "Solo build",
    oneLiner:
      "Let recruiters ask my portfolio direct questions and get grounded answers in seconds, with an assistant that only answers from a knowledge base I wrote and says when it doesn't know.",
    emphasis: "only answers from a knowledge base I wrote",
    summary:
      "Streams answers from the Claude API through my own server route, so the key never reaches the browser, with rate limits and injection refusal on the endpoint.",
    problem:
      "Recruiters skim. I wanted them to be able to ask a direct question and get a direct answer, without the assistant ever inventing a date, a number or a claim about me.",
    approach: [
      "Built from scratch in about 5,700 lines of TypeScript on Next.js. The assistant's only permitted source is one knowledge base file, and its instructions tell it to say it does not know rather than infer. Project facts are generated from the same data file that renders this page, so the site and the assistant cannot drift apart.",
      "The browser never talks to the model provider. A server route calls the Claude API, parses the streamed server-sent events, and re-streams just the text to the client, so answers appear as they generate and the API key stays on the server.",
      "The endpoint is hardened: a per-IP limit of 20 messages every 10 minutes, a 500-character input cap, a six-turn history window with malformed history dropped, and refusal of instructions that try to override the rules. The site itself sends a strict Content Security Policy, two-year HSTS with preload, and clickjacking protection.",
    ],
    impact:
      "Passes 17 automated WCAG 2.1 AA accessibility checks on desktop and mobile within a 257-test end-to-end suite, and keeps the API key off the browser behind a rate-limited, injection-resistant server route.",
    impactHighlights: ["17 automated WCAG 2.1 AA accessibility checks"],
    metrics: [
      { value: "~5.7k", label: "lines of TypeScript" },
      { value: "20", label: "messages per IP every 10 minutes" },
      { value: "1", label: "source of truth" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "Claude API", "Vercel"],
    links: [
      { label: "Source", url: "https://github.com/Agrim1305/portfolio" },
      // The v1 branch's own deployment, kept as it shipped.
      { label: "Try v1", url: "https://portfolio-git-v1-agrimsharma.vercel.app", accent: true },
    ],
  },
  {
    slug: "gps-tracker-dashboard",
    title: "GPS Tracker Dashboard",
    status: "Java · 2026",
    period: "Mar 2026 to May 2026",
    role: "Solo coursework, Cloud and Concurrent Programming",
    oneLiner:
      "Merged ten live GPS streams into one real-time dashboard with no shared mutable state, verified by 19 automated checks, by modelling the data flow with functional reactive programming.",
    emphasis: "no shared mutable state",
    summary:
      "Built with functional reactive programming, so location updates flow through composable streams instead of event handlers mutating state. Covered by 19 automated checks.",
    problem:
      "A live tracking dashboard has to react to a continuous stream of location updates from many devices, and let the user change what they are watching while it runs, without the tangle of shared state that makes real-time interfaces fragile.",
    approach: [
      "The app merges ten concurrent GPS streams from Microsoft's Geolife dataset. Instead of imperative handlers that mutate state, it describes relationships between streams with the Sodium FRP library, and the framework handles propagation.",
      "Users set a latitude and longitude filter while it runs; the filter is a cell sampled with snapshot, so every event is checked against the current value. Distance travelled is tracked over a rolling five-minute window, a left-priority merge makes real events always win over clear signals, and altitude is converted from feet to metres on the way through.",
      "Everything is covered by 19 automated checks, including the timing-sensitive eviction of old readings from the window.",
    ],
    impact:
      "A dashboard that updates cleanly as data arrives, where the bugs you would normally write in event-driven code are hard to express in the first place.",
    impactHighlights: ["19 automated checks"],
    metrics: [
      { value: "10", label: "concurrent streams" },
      { value: "5 min", label: "rolling window" },
      { value: "19", label: "automated checks" },
    ],
    learned:
      "Most of reactive design is making invalid states unrepresentable. Once the dataflow graph was right, whole categories of bugs simply could not happen.",
    stack: ["Java", "Sodium FRP", "Swing"],
    links: [
      { label: "Source", url: "https://github.com/Agrim1305/gps-frp-tracker" },
    ],
    media: {
      kind: "photo",
      src: "/images/projects/gps-tracker-dashboard/tests.webp",
      alt: "Terminal output of the tracker's test suite: 11 of 11 DistanceCalculator tests and 8 of 8 FrpHelpers tests pass, covering feet to metres, distances, range filtering, clearing after a delay and the sliding window",
      width: 2000,
      height: 1250,
    },
  },
  {
    slug: "pathfinder",
    title: "Pathfinder",
    status: "Python · 2026",
    period: "Mar 2026 to Jun 2026",
    role: "Solo. Started as a university AI assignment, then extended with benchmarks, tests and a browser demo.",
    oneLiner:
      "Found the lowest-effort route across hilly terrain with A*, expanding 59% fewer nodes than Dijkstra, by building BFS, Dijkstra and A* from scratch in Python and benchmarking them on 6 maps.",
    emphasis: "expanding 59% fewer nodes than Dijkstra",
    summary:
      "Three classic search algorithms on elevation-aware grids, compared on the same maps to show exactly what a good heuristic buys you.",
    problem:
      "Shortest is not the same as cheapest. On terrain where moving uphill costs more, a route with fewer steps can be the expensive one, and a search that ignores cost will happily pick it.",
    approach: [
      "I implemented BFS, Dijkstra (Uniform Cost Search) and A* from scratch in Python, with no external dependencies. Each grid cell has an elevation and some are blocked, and a move to a neighbouring cell costs 1 plus any climb, so the flat and downhill cost 1 and climbing costs extra.",
      "Dijkstra and A* share a binary heap priority queue, so each push and pop is O(log n), with an insertion counter that breaks ties and keeps the order stable. A hash-set closed list makes checking whether a node was already expanded O(1).",
      "Each node stores a parent pointer, the single node it came from, and the route is rebuilt once at the goal. An earlier version copied the whole partial path into every queue entry, which costs O(path length) memory per entry. Parent pointers keep it at O(V) overall, with identical output.",
      "Every step costs at least 1, so the Manhattan heuristic never overestimates the remaining cost and A* stays optimal. Euclidean distance is provided as well.",
    ],
    impact:
      "On the demo map, BFS (which only counts steps) walks over a hill and pays 35% more effort than the best route of the same length, while A* finds that best route expanding 59% fewer nodes than Dijkstra. A live browser demo races all three, and 13 tests plus a Python-to-JavaScript parity check run in CI on every push.",
    impactHighlights: ["35% more effort", "59% fewer nodes"],
    metrics: [
      { value: "59%", label: "fewer nodes than Dijkstra" },
      { value: "35%", label: "extra effort from BFS" },
      { value: "13", label: "tests in CI" },
      { value: "6", label: "benchmark maps" },
    ],
    stack: ["Python", "JavaScript", "GitHub Actions"],
    links: [
      { label: "Source", url: "https://github.com/Agrim1305/Pathfinder" },
      { label: "Live demo", url: "https://agrim1305.github.io/Pathfinder/", accent: true },
    ],
    media: {
      kind: "browser",
      src: "/images/projects/pathfinder/race.webp",
      alt: "Pathfinder Terrain Lab racing all three algorithms on hilly terrain: A* has found its route with 125 cells examined while BFS and Dijkstra are still searching, their examined cells marked with orange dots",
      width: 2000,
      height: 1250,
      url: "agrim1305.github.io/Pathfinder",
      href: "https://agrim1305.github.io/Pathfinder/",
    },
    screens: [
      {
        src: "/images/projects/pathfinder/routes.webp",
        alt: "The demo map: both routes take 26 steps, but the BFS route in orange goes over the hill for an effort of 35, while the lowest-effort A* route in blue goes around it for 26",
        width: 979,
        height: 1146,
      },
      {
        src: "/images/projects/pathfinder/explored.webp",
        alt: "The choice map searched twice: Dijkstra expands 75 nodes, including cells on the hill, while A* with the Manhattan heuristic finds the same route expanding 41",
        width: 1289,
        height: 742,
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}

/* The path of a project's case study page. */
export function caseStudyPath(slug: string) {
  return `/projects/${slug}`;
}

/* The slug behind a case study URL, or undefined unless the URL is exactly a
   listed project's page on `origin`. The chat uses this before it opens
   anything, so no other address can ever be navigated to. */
export function slugFromCaseStudyUrl(url: unknown, origin: string) {
  if (typeof url !== "string") return undefined;
  let parsed: URL;
  try {
    parsed = new URL(url, origin);
  } catch {
    return undefined;
  }
  if (parsed.origin !== origin) return undefined;
  return projects.find((p) => parsed.href === origin + caseStudyPath(p.slug))?.slug;
}

/* Plain-text rendering of one project for the chat assistant. */
export function projectAsKnowledge(p: Project): string {
  const lines = [
    `### ${p.title}`,
    "",
    `Status: ${p.status}. Period: ${p.period}. Role: ${p.role}.`,
    `Stack: ${p.stack.join(", ")}.`,
    ...p.links.map((l) => `${l.label}: ${l.url}`),
    ...(p.privateNote ? [`Source: ${p.privateNote}.`] : []),
    `Case study page: https://agrimsharma.com/projects/${p.slug}`,
    "",
    `Summary: ${p.oneLiner}`,
    "",
    `Problem: ${p.problem}`,
    "",
    `Approach: ${p.approach.join(" ")}`,
    "",
    `Impact: ${p.impact}`,
  ];
  if (p.learned) lines.push("", `What he learned: ${p.learned}`);
  return lines.join("\n");
}

/* Every project, for the chat assistant's knowledge base. */
export function projectsAsKnowledge(): string {
  return projects.map(projectAsKnowledge).join("\n\n");
}
