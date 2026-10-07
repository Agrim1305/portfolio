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
      "A climate adaptation planner that shows a Pacific village council its own coastline decades out, built in 44 hours and a top 12 finalist.",
    emphasis: "top 12 finalist",
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
      "Top 12 of 75 submissions from 110 teams, and the only Adelaide University student to reach the Grand Final, where we pitched in Sydney on 19 August. Judged by a panel including Sir Peter Cosgrove, Canva, Commonwealth Bank's AI Scientist and the Pacific Region Infrastructure Facility. Under $500 per village against $10,000+ for the alternatives, on any phone from the last five years.",
    impactHighlights: [
      "Top 12 of 75 submissions",
      "the only Adelaide University student to reach the Grand Final",
    ],
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
      "A game tracking platform I took from a finished team assignment to a live product on my own.",
    emphasis: "a live product on my own",
    summary:
      "Search live game data, build collections, write reviews and connect with other players. Still running today.",
    problem:
      "Gamers track what they play across scattered notes, spreadsheets, and memory. Our brief was a single place to discover games, build a collection, and review them, backed by real game data rather than a static seed list.",
    approach: [
      "I worked in a five-person team and owned the front-end and back-end integration. I built the authentication layer, with bcrypt-hashed email and password login plus Google sign-in through Passport, with two stored roles, admin and user, and guest access when signed out, and designed the nine-table relational schema behind collections, reviews, friends and groups.",
      "When the course ended, so did everyone else's involvement. A year later I came back to it on my own, traced the broken OAuth and deployment configuration, wired it to live RAWG game data, and put it into production.",
      "Then the original host's trial ran out and the database went with it. I moved the app to Render and migrated the data layer from MySQL to PostgreSQL, which taught me more about deployment than the first launch did.",
    ],
    impact:
      "It runs live today with personal collections (wishlist, currently playing, completed), reviews, friends and groups, and an admin dashboard, pulling real-time data from the RAWG API. The deployed version of a team project that I took the rest of the way and shipped myself.",
    impactHighlights: ["runs live today"],
    metrics: [
      { value: "Live", label: "publicly deployed" },
      { value: "9", label: "relational tables" },
      { value: "2", label: "stored roles" },
      { value: "2", label: "hosting stacks" },
    ],
    learned:
      "Deployment is part of the product, not the last step of it. Most of what broke on the way back to production was configuration nobody had looked at since the demo.",
    stack: ["Node.js", "Express", "Vue.js", "PostgreSQL", "Passport.js", "RAWG API"],
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
      alt: "MetaPlay landing page: personalised gaming hub with account sign-up and Google sign-in",
      url: "metaplay-g2q7.onrender.com",
      href: "https://metaplay-g2q7.onrender.com/",
    },
  },
  {
    slug: "adelaide-rising-stars",
    title: "Adelaide Rising Stars",
    status: "Live · Freelance, 2026",
    period: "Jul 2026 to Sep 2026",
    role: "Sole developer, from quote to delivery",
    oneLiner:
      "A mobile-first website and enquiry system for a tennis academy coaching 100+ players. My first paid client build.",
    emphasis: "My first paid client build",
    summary:
      "Freelance work for a local tennis academy. I built the site around what the business needed, to give it a proper presence online.",
    problem:
      "A tennis academy coaching 100+ players was advertising mostly through a WhatsApp group. The owners wanted a professional online presence that brings in new players, without taking on software they would have to run themselves.",
    approach: [
      "I scoped and quoted the job, then ran the design with the owners through several rounds, from a dark direction to the light theme they chose, built from the navy and lime of their existing posters.",
      "The most useful thing I did happened before any code: I talked them out of self-service booking. With squads already near capacity, open booking would have overfilled sessions, so the site is enquiry-only and the coaches stay in control of who joins.",
      "It is a static Nuxt site. Squads, coaches and partners live in Nuxt Content collections, so adding a coach is a data change rather than a code change. Enquiries go through Netlify Forms and notify the owners straight away, and a sitemap and robots file get it indexed properly.",
    ],
    impact:
      "Delivered in three weeks on a fixed quote: a multi-page site covering programs, coaches, venue partners and enquiries, built mobile-first because that is where parents find it.",
    impactHighlights: ["Delivered in three weeks on a fixed quote"],
    metrics: [
      { value: "3 wks", label: "quote to delivery" },
      { value: "100+", label: "players at the academy" },
      { value: "0", label: "admin tools to maintain" },
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
      alt: "Adelaide Rising Stars home page: a night-time squad photo on court under the headline Where Stars Are Made, with Enquire about a squad and See session times buttons",
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
      "The site you are on, and the assistant in the corner that only answers from a knowledge base I wrote.",
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
      "A live, grounded assistant that answers recruiter questions in seconds and admits when it does not know, running on the same codebase as the portfolio it describes.",
    impactHighlights: ["admits when it does not know"],
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
    slug: "speech-to-text-service",
    title: "Concurrent Speech-to-Text Service",
    status: "Java · 2026",
    period: "Sep 2026",
    role: "Solo coursework, Cloud and Concurrent Programming",
    oneLiner:
      "A Spring Boot web service that transcribes speech through OpenAI's API and passed all eleven automated functional tests.",
    emphasis: "all eleven automated functional tests",
    summary:
      "Built for many requests at once: thread-safe request handling and usage stats, plus admin and stats REST endpoints implemented against an OpenAPI spec.",
    problem:
      "Build a web service that converts speech to text and stays correct when many users hit it at the same time, with admin and statistics endpoints defined by a fixed API specification.",
    approach: [
      "A Spring Boot application that accepts audio, sends it to OpenAI's transcription API, and returns the text. Admin and usage-statistics REST endpoints are implemented against an OpenAPI YAML spec, so the contract was fixed before the code.",
      "Request handling and the shared statistics are designed to be thread-safe, since the whole point of the course is what happens when many requests land at once.",
    ],
    impact:
      "Passed all 11 tests on the course's automated functional test suite. It pairs with my internship as hands-on speech-to-text experience.",
    impactHighlights: ["Passed all 11 tests"],
    stack: ["Java", "Spring Boot", "OpenAI API", "REST", "OpenAPI"],
    links: [],
    privateNote: "Private repo (coursework) · walkthrough on request",
  },
  {
    slug: "gps-tracker-dashboard",
    title: "GPS Tracker Dashboard",
    status: "Java · 2026",
    period: "Mar 2026 to May 2026",
    role: "Solo coursework, Cloud and Concurrent Programming",
    oneLiner:
      "A real-time dashboard that merges ten live GPS streams without a single piece of shared mutable state.",
    emphasis: "without a single piece of shared mutable state",
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
    role: "Solo build",
    oneLiner:
      "BFS, uniform-cost search and A* from scratch on terrain where climbing costs more. A* expanded 41 nodes where BFS needed 112.",
    emphasis: "A* expanded 41 nodes where BFS needed 112",
    summary:
      "Three classic search algorithms on elevation-aware grids, compared on the same maps to show exactly what a good heuristic buys you.",
    problem:
      "Shortest is not the same as cheapest. On terrain where moving uphill costs more, a route with fewer steps can be the expensive one, and a search that ignores cost will happily pick it.",
    approach: [
      "Implemented breadth-first search, uniform-cost search (Dijkstra) and A* from scratch in Python. Each grid cell has an elevation, moving costs 1 plus any climb, obstacles block movement, and moves are four-directional.",
      "A* runs with two admissible heuristics, Euclidean and Manhattan distance, and every algorithm runs on the same set of test maps, from a small maze to a 20 by 20 random terrain, so the comparison is fair.",
    ],
    impact:
      "On the same path, A* expanded 41 nodes against uniform-cost search's 75 and BFS's 112. On the 20 by 20 map, BFS's route cost 24% more than the optimal one, which is the whole argument for cost-aware search in one number.",
    impactHighlights: ["41 nodes", "24% more"],
    metrics: [
      { value: "41", label: "nodes, A*" },
      { value: "75", label: "nodes, UCS" },
      { value: "112", label: "nodes, BFS" },
      { value: "+24%", label: "BFS route cost" },
    ],
    stack: ["Python", "BFS", "Dijkstra", "A*"],
    links: [{ label: "Source", url: "https://github.com/Agrim1305/Pathfinder" }],
    media: {
      kind: "photo",
      src: "/images/projects/pathfinder/comparison.webp",
      alt: "Terminal output of example.py on the 8 by 8 choice map: A* finds the 15-step path at cost 14 after visiting 41 nodes, and the comparison lists 112 nodes explored for BFS, 75 for UCS and 41 for A*",
      width: 2000,
      height: 1250,
    },
    screens: [
      {
        src: "/images/projects/pathfinder/astar-visits.webp",
        alt: "Terminal output of pathfinder.py in debug mode with A* and the Manhattan heuristic on the choice map: the path marked with asterisks down the left edge and along the bottom, then grids of how often and in what order each cell was visited",
        width: 2000,
        height: 1431,
      },
    ],
  },
  {
    slug: "virtual-restaurant-simulator",
    title: "Virtual Restaurant Simulator",
    status: "C++ · 2024",
    period: "Jul 2024 to Oct 2024",
    role: "Team project",
    oneLiner:
      "A restaurant simulation designed around clean class hierarchies, so new staff roles extend it without rewrites.",
    emphasis: "without rewrites",
    summary:
      "Fourteen classes and 1,200+ lines of C++, with inheritance and virtual methods letting each staff role define its own behaviour through a shared interface.",
    problem:
      "Model a working restaurant, staff, menus, orders and inventory, and keep it maintainable as new staff types get added, instead of collapsing into one giant switch statement.",
    approach: [
      "A 14-class architecture using multi-level inheritance, abstract base classes and virtual methods, so each staff role defines its own behaviour through one shared interface. Adding a role means adding a class, not editing the code that already works.",
      "Inventory, menu and order data persist to three separate files and reload on request, so a session can be saved and resumed. Input validation handles case-insensitive matching, stock caps and low-stock alerts, so malformed input cannot crash it.",
    ],
    impact:
      "A command-line simulation that runs a full restaurant cycle and stays easy to extend. The project where I learned to think in class boundaries and polymorphism.",
    impactHighlights: ["stays easy to extend"],
    stack: ["C++", "OOP", "Makefile"],
    links: [
      {
        label: "Source",
        url: "https://github.com/Agrim1305/Virtual_Restaurant_Simulator",
      },
    ],
    media: {
      kind: "photo",
      src: "/images/projects/virtual-restaurant-simulator/served.webp",
      alt: "Terminal session of the restaurant simulator: an order of Pasta and Pizza totals $27.98, serving it frees table 4 for customer Maya, and the main menu waits for the next option",
      width: 2000,
      height: 1250,
    },
    screens: [
      {
        src: "/images/projects/virtual-restaurant-simulator/build-and-seat.webp",
        alt: "Terminal output of make compiling the simulator's 15 source files with g++, then the simulator's main menu, with customer Maya seated at table 4",
        width: 2000,
        height: 1358,
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

/* Plain-text rendering for the chat assistant's knowledge base. */
export function projectsAsKnowledge(): string {
  return projects
    .map((p) => {
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
    })
    .join("\n\n");
}
