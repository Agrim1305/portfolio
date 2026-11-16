/* Single source of truth for every project on the site.
   The home page cards, the /projects/[slug] case study pages and the chat
   assistant's knowledge base all read from this file, so a fact only ever
   needs changing in one place. Keep every claim here verifiable: if a
   recruiter clicks the source link, the repo should back up what is written. */

export type ProjectLink = { label: string; url: string; accent?: boolean };
/* `proof` links the label to where the number can be checked; its own label
   names that place for a screen reader. */
export type Metric = { value: string; label: string; proof?: { label: string; url: string } };

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

/* A piece of work told as Situation, Task, Action, Result. Case studies and
   the role stories in Experience share the shape and its renderer. */
export type Star = {
  situation: string;
  task: string;
  actions: { title: string; detail: string }[];
  result: string;
  /** Phrases inside result lifted to gold. */
  resultHighlights?: string[];
  learned?: string;
  /** One hard thing, told for an engineer. `code` is copied exactly from the
      public repo, 20 lines at most, and `url` is that file at a pinned commit. */
  deepDive?: {
    title: string;
    body: string[];
    code?: { file: string; lang: string; source: string; url: string };
  };
};

export type Project = Star & {
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
  metrics?: Metric[];
  stack: string[];
  links: ProjectLink[];
  /** Shown instead of links when there is no public source. */
  privateNote?: string;
  media?: ProjectMedia;
  screens?: ProjectScreen[];
  /** The first three sit in the story; any more follow it as a gallery. */
  gallery?: Extract<ProjectMedia, { kind: "photo" }>[];
};

/* How many end-to-end tests `npx playwright test --list` counts. The Aris
   case study and the Selected work header both quote it; update it here
   when the suite changes. */
export const E2E_TESTS = 390;

export const projects: Project[] = [
  {
    slug: "portfolio-ai-assistant",
    title: "Aris, the portfolio AI assistant",
    status: "Live · v1 May 2026, rebuilt Oct 2026",
    period: "May 2026 to Nov 2026",
    role: "Solo build",
    oneLiner:
      "Let recruiters ask my portfolio direct questions and get grounded answers in seconds, with an assistant that only answers from a knowledge base I wrote and says when it doesn't know.",
    emphasis: "only answers from a knowledge base I wrote",
    summary:
      `An assistant that answers only from a knowledge base I wrote, behind my own rate-limited server route, covered by a ${E2E_TESTS}-test suite.`,
    situation:
      "Recruiters skim. An assistant that answers their questions directly is only worth having if it never invents a date, a number or a claim about me. A public endpoint that calls a paid model is also something people will try to abuse, through cost or through prompt injection.",
    task:
      "A solo build with two requirements I set myself: every answer traces back to something I wrote, and the API key and the budget stay safe on a public site.",
    actions: [
      {
        title: "Gave the assistant one source of truth.",
        detail:
          "Its only permitted source is one knowledge base file, and its instructions tell it to say it does not know instead of inferring. Project facts are generated from the same data file that renders this page, so the site and the assistant cannot drift apart.",
      },
      {
        title: "Kept the model provider behind my own server.",
        detail:
          "The browser never talks to the Claude API. A server route calls it, parses the streamed events, and re-streams only the text, so answers appear as they generate and the key stays on the server.",
      },
      {
        title: "Hardened the endpoint.",
        detail:
          "A per-IP limit of 20 messages every 10 minutes, a 500-character input cap, a six-turn history window with malformed history dropped, and refusal of instructions that try to override the rules.",
      },
      {
        title: "Let the assistant act, without trusting it.",
        detail:
          "Aris can look a project up or open its case study through Claude tool calling. Both tools are read-only. The model only ever supplies a project slug. The server checks it against the list of real projects and builds the URL itself, and the browser checks again. A cap of three tool rounds means one visitor message can never cost more than four API calls.",
      },
      {
        title: "Planned for failure.",
        detail:
          "If the model call fails for any reason, the visitor sees a plain note with my email address instead of a raw error, and their question goes back in the box.",
      },
      {
        title: "Secured and tested the site around it.",
        detail:
          `A strict Content Security Policy, two-year HSTS with preload, and clickjacking protection. A ${E2E_TESTS}-test end-to-end suite runs against the production build, including 17 automated WCAG 2.1 AA accessibility scans, each run on desktop and mobile.`,
      },
    ],
    result:
      "Live on agrimsharma.com. The end-to-end suite passes, including all 17 accessibility scans, and the API key has never reached the browser. The worst a successful prompt injection can do is open one of my own project pages.",
    resultHighlights: ["all 17 accessibility scans", "open one of my own project pages"],
    metrics: [
      {
        value: String(E2E_TESTS),
        label: "end-to-end tests",
        proof: { label: "e2e folder in the portfolio repo", url: "https://github.com/Agrim1305/portfolio/tree/main/e2e" },
      },
      { value: "20", label: "messages per IP every 10 minutes" },
      { value: "1", label: "source of truth" },
    ],
    deepDive: {
      title: "Why the model never writes a URL",
      body: [
        "Aris can open a case study on your screen. The obvious way to build that is to let the model return a link. Then a visitor can ask it to open any address on the internet, and the only defence is whether the model refuses. Models can be talked into things, so that is the wrong place for the guarantee.",
        "Instead the model can only name a project by its slug. The server looks the slug up in the same data file that builds the site, and writes the URL itself. An unknown slug comes back to the model as an error. The browser then checks again that the address is exactly a listed project page on this site before it opens anything.",
        "Both tools are read-only, and a cap of three tool rounds bounds the cost of every message. So the worst a successful prompt injection can do is open one of my own project pages.",
      ],
      code: {
        file: "src/lib/aris-tools.ts",
        lang: "ts",
        source: [
          "/* Runs one tool call. The slug must be a listed project's; anything else is",
          "   an error result for the model to read, never an exception. */",
          "export function runTool(name: string, input: unknown): ToolOutcome {",
          "  const slug = (input as { slug?: unknown } | null)?.slug;",
          "  const project = typeof slug === \"string\" ? getProject(slug) : undefined;",
          "  if (!project) return { content: \"Unknown project. Use one of the listed slugs.\", is_error: true };",
          "  if (name === \"get_project\") return { content: projectAsKnowledge(project) };",
          "  if (name === \"open_case_study\") {",
          "    // Built here from the site's own data, never from the model's text.",
          "    const action = { action: \"open\" as const, url: caseStudyPath(project.slug) };",
          "    return { content: JSON.stringify(action), action };",
          "  }",
          "  return { content: \"Unknown tool.\", is_error: true };",
          "}",
        ].join("\n"),
        url: "https://github.com/Agrim1305/portfolio/blob/8212a810174ac60e342f568c39195f42b720df1b/src/lib/aris-tools.ts#L53-L66",
      },
    },
    stack: ["Next.js", "TypeScript", "Tailwind", "Claude API", "Vercel"],
    links: [
      { label: "Source", url: "https://github.com/Agrim1305/portfolio" },
      // The v1 branch's own deployment, kept as it shipped.
      { label: "Try v1", url: "https://portfolio-git-v1-agrimsharma.vercel.app", accent: true },
    ],
  },
  {
    slug: "concurrent-video-player",
    title: "Concurrent Video Player",
    status: "Java · 2026",
    period: "Oct 2026",
    role: "Individual coursework, Cloud and Concurrent Programming",
    oneLiner:
      "Made a single-threaded Java video player 3.7 times faster on the course's 8-core benchmark, with frame-identical output, by redesigning it as a decoder thread feeding a worker pool.",
    emphasis: "3.7 times faster",
    summary:
      "A single-threaded video player re-engineered to process frames across a worker pool. 3.7x on the 8-core benchmark, 38 of 38 functional tests, and a frame-dropping bug traced to thread starvation.",
    situation:
      "The course supplied a single-threaded video player. Every frame was decoded, run through its chain of effects and shown on one thread.",
    task:
      "Individual coursework. Re-engineer the player to process frames on several threads without changing a single pixel of the output, and keep seeking and playback correct while frames finish out of order. Built with Claude Code, with every change reviewed and checked against the tests.",
    actions: [
      {
        title: "Split decoding from processing.",
        detail:
          "One decoder thread feeds a pool of workers, with a CompletableFuture per frame.",
      },
      {
        title: "Added back-pressure.",
        detail:
          "Bounded queues stop the decoder running ahead of the workers and filling memory.",
      },
      {
        title: "Made seeking safe.",
        detail:
          "Every seek gets a new epoch number. Frames tagged with an old epoch are discarded when they arrive, so a late frame from before the seek can never be shown.",
      },
      {
        title: "Traced dropped frames to thread starvation.",
        detail:
          "Under a 40-effect load the player dropped between 49 and 95 frames. The cause was the render thread being starved by the workers, followed by catch-up bursts. I gave the workers a lower priority, added a playback clock that absorbs late frames, and primed the buffer before playback starts.",
      },
      {
        title: "Proved the output did not change.",
        detail:
          "Compared against the single-threaded version, 0 of 72 frames differed.",
      },
    ],
    result:
      "3.7 times the single-threaded reference on the course's 8-core benchmark, with 38 of 38 functional tests passing. On 9 workers, frame-processing throughput rose 5.2 times, from 57 to 297 frames a second, with identical output.",
    resultHighlights: ["3.7 times the single-threaded reference", "0 of 72 frames differed"],
    metrics: [
      { value: "3.7x", label: "on the 8-core benchmark" },
      { value: "38/38", label: "functional tests" },
      { value: "0 of 72", label: "frames differed" },
      { value: "297", label: "frames a second, up from 57" },
    ],
    learned:
      "Making it fast was the easy half. The hard half was proving it still did exactly the same thing.",
    deepDive: {
      title: "When the render thread starves",
      body: [
        "With 40 effects on every frame, the player dropped between 49 and 95 frames. The workers were doing their job. The thread that puts frames on screen was not getting a turn.",
        "When the render thread did run, it found a queue of late frames and tried to catch up in a burst, which made playback stutter and dropped more frames.",
        "Three changes fixed it. The workers run at a lower priority than the render thread. A playback clock decides when each frame is due, so a frame that is slightly late is absorbed, not dropped. And the buffer is primed before playback starts.",
      ],
    },
    stack: ["Java", "JavaFX", "Maven", "java.util.concurrent"],
    links: [],
    privateNote: "University coursework, so the source is private. Benchmark output on request",
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
      "A team assignment I took to production alone a year after the course ended. Live game data, collections, reviews and friends, running since June 2026.",
    situation:
      "MetaPlay started as a five-person university project: one place to discover games, build a collection and review them, backed by real game data instead of a static seed list. When the course ended, so did everyone's involvement. A year later it was not deployed anywhere, and the sign-in and deployment configuration no longer worked.",
    task:
      "In the team I owned the front-end to back-end integration, the authentication layer and the database schema. Afterwards, nobody asked me to do anything. I decided the project should be live, which made getting it there, and keeping it there, mine alone.",
    actions: [
      {
        title: "Built authentication with three levels of access.",
        detail:
          "Username and password login with bcrypt-hashed passwords, plus Google sign-in through Passport. Two stored roles, admin and user, and guest access when signed out.",
      },
      {
        title: "Designed the nine-table relational schema.",
        detail:
          "It sits behind collections, reviews, friends and groups.",
      },
      {
        title: "Took it to production on my own.",
        detail:
          "I traced the broken OAuth and deployment configuration, wired the app to live RAWG game data, and deployed it in June 2026.",
      },
      {
        title: "Kept it alive through two forced hosting moves.",
        detail:
          "From Railway to Render with Aiven MySQL when the Railway trial ended, then to Neon PostgreSQL when Aiven's free tier started powering the database off. The second move meant converting the schema and every query from MySQL to PostgreSQL.",
      },
      {
        title: "Hardened access to protected pages.",
        detail:
          "A check normalises every URL before the static file server sees it, so encoded or re-cased paths can no longer slip past the guards.",
      },
      {
        title: "Redesigned it and removed a framework.",
        detail:
          "The team build used Vue 2 on the profile and reviews pages. My redesign replaced it with vanilla JavaScript and added five endpoints: trending games, game screenshots, friends on a game, your stats and the friend activity feed.",
      },
    ],
    result:
      "Live since June 2026 with collections, reviews, friends, groups and an admin dashboard. The app has 43 API routes, 38 from the team build and 5 from my redesign, on 9 relational tables, and it has come through three hosting setups and one full database migration.",
    resultHighlights: ["Live since June 2026", "three hosting setups and one full database migration"],
    metrics: [
      { value: "Live", label: "publicly deployed" },
      { value: "9", label: "relational tables" },
      {
        value: "43",
        label: "API routes",
        proof: { label: "routes folder in the MetaPlay repo", url: "https://github.com/Agrim1305/Metaplay/tree/main/routes" },
      },
      { value: "3", label: "hosting setups" },
    ],
    learned:
      "Deployment is part of the product, not the last step of it. Most of what broke on the way back to production was configuration nobody had looked at since the demo.",
    deepDive: {
      title: "A guard you could walk around",
      body: [
        "Protected pages were guarded by checking the path of each request. The static file server was more forgiving than the guard: an encoded or re-cased version of the same path still resolved to the same file. So a request could miss the guard and still be served the page.",
        "The fix was not a longer list of patterns. Before the static file server is allowed to serve anything, the path is decoded, normalised and lowercased the same way the server itself resolves it. If the result is a protected page, the request goes to the guarded route. An encoded or re-cased path can no longer reach the raw file.",
      ],
      code: {
        file: "app.js",
        lang: "js",
        source: [
          "// STATIC \"PUBLIC\" FOLDER (CSS, JS, images, etc.)",
          "// Served before session/auth middleware so static assets skip that work.",
          "// Guarded pages (protectedRoutes above) are skipped so their ensureAuth/",
          "// ensureAdmin routes handle them. The path is decoded, normalized and",
          "// lowercased like serve-static resolves it, so /pages/%64ashboard.html or",
          "// /pages/DASHBOARD.html can't reach the raw file either.",
          "const serveStatic = express.static(path.resolve(__dirname, 'public'));",
          "app.use((req, res, next) => {",
          "  try {",
          "    const file = path.posix.normalize(decodeURIComponent(req.path)).toLowerCase();",
          "    if (file in protectedRoutes) return next();",
          "  } catch (err) {",
          "    // Malformed escape: leave it to serve-static, as before.",
          "  }",
          "  return serveStatic(req, res, next);",
          "});",
        ].join("\n"),
        url: "https://github.com/Agrim1305/Metaplay/blob/c0adf1fa841e1a4c4168dd886380706bd8dbba61/app.js#L63-L78",
      },
    },
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
      "A flood map a village council can use without technical staff. Top 12 of 75 submissions, built in 44 hours by a team formed on day one.",
    situation:
      "A village council deciding where to rebuild after a flood, where to move a school, or how to farm ground turning saline has no way to see its own coastline in twenty years. The digital twin platforms that answer that are typically far more expensive and need technical staff villages do not have. We had 44 hours at the University of Sydney, 110 teams in the field, and a team of three from three universities who met on day one.",
    task:
      "I owned the AI recommendation engine for the village view. With the team, I also shared the calls that decided whether we would have a working demo at all: what to build, and what to cut.",
    actions: [
      {
        title: "Chose a 2D map over a 3D digital twin.",
        detail:
          "86% of the Pacific has mobile coverage but only 27% use mobile internet, so the real constraint is usability, not connectivity. A coordinator opens the island map (Christmas Island, Kiribati, in our demo), drags a timeline from 2026 to 2100, and sees which ground floods, with planning layers for future development, housing, farmland and adaptation.",
      },
      {
        title: "Built the recommendation engine.",
        detail:
          "Each prompt sends the Claude API the village's name, country, region, population, setting and main threats, and the threatened asset's type, name, description, cultural significance, elevation and flood status in the chosen year. Guardrails keep the advice practical for a small council instead of generic climate advice.",
      },
      {
        title: "Built a fallback for when there is no API access.",
        detail:
          "A fixed set of adaptation options for each type of asset, so the village view could still recommend something offline.",
      },
      {
        title: "Cut the village view, and my own engine with it.",
        detail:
          "The research and design for tracking houses, wells, farms and sacred sites one by one were done. We cut it to keep the demo solid inside 44 hours. Richer context (budget, available labour, IPCC AR6 and SPREP climate data) was scoped as the next step, not built.",
      },
    ],
    result:
      "One of 12 Grand Finalists from 75 submissions (110 teams), and the only Adelaide University student to reach the final. The demo showed a planning tool a council can use without technical staff, designed to cost an estimated $500 or less per village. That figure is our estimate for remote setup, not a measured cost. We never ran a pilot. My engine was not in the demo, and I would make the same cut again.",
    resultHighlights: ["One of 12 Grand Finalists", "the only Adelaide University student to reach the final"],
    metrics: [
      {
        value: "Top 12",
        label: "of 75 submissions",
        proof: { label: "finalist announcement", url: "https://hack-eng.sydney.edu.au/" },
      },
      { value: "44 hrs", label: "idea to demo" },
      { value: "<$500", label: "estimated per village" },
      { value: "2026→2100", label: "timeline modelled" },
    ],
    learned:
      "Appropriate technology beats impressive technology. And scope is a decision: cutting the village view is what let us ship a demo that worked inside 44 hours.",
    deepDive: {
      title: "What the engine sends",
      body: [
        "Generic climate advice is useless to a council of a few people with no budget line for consultants. The engine does not ask the model a general question. Every request carries the village's profile and the one asset under threat, including its cultural significance and whether it is under water in the year the coordinator picked.",
        "If the API cannot be reached, the engine falls back to a fixed set of adaptation options for that type of asset, so the view still gives an answer offline.",
      ],
      code: {
        file: "api/adaptations.js",
        lang: "js",
        source: [
          "  const prompt = `You are a Pacific Islands climate adaptation expert helping a specific village plan for climate change impacts.",
          "",
          "VILLAGE CONTEXT:",
          "- Name: ${village.name}",
          "- Country: ${village.country}",
          "- Region: ${village.region}",
          "- Population: ${village.population}",
          "- Setting: ${village.description}",
          "- Main threats: ${village.mainThreats.join(', ')}",
          "",
          "THREATENED ASSET:",
          "- Type: ${asset.type}",
          "- Name: ${asset.name}",
          "- Description: ${asset.description}",
          "- Cultural significance: ${asset.culturalSignificance}",
          "- Elevation: ${asset.elevationM}m",
          "- Status in ${year}: ${threat}",
        ].join("\n"),
        url: "https://github.com/reeyansh404/Pacific-Village-Explorer/blob/48e29fb05b1d5934814eb7635cc18caabdd133be/api/adaptations.js#L18-L34",
      },
    },
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
    slug: "pathfinder",
    title: "Pathfinder",
    status: "Python · 2026",
    period: "Mar 2026 to Jun 2026",
    role: "Solo. Started as a university AI assignment, then extended with benchmarks, tests and a browser demo.",
    oneLiner:
      "Showed that A* finds the lowest-effort route across hilly terrain while expanding 59% fewer nodes than Dijkstra on the demo map, by building BFS, Dijkstra and A* from scratch in Python and benchmarking them on 6 maps.",
    emphasis: "59% fewer nodes than Dijkstra on the demo map",
    summary:
      "BFS, Dijkstra and A* built from scratch and raced on the same hilly maps, to show in numbers what a good heuristic buys you.",
    situation:
      "Shortest is not the same as cheapest. On terrain where moving uphill costs more, a route with fewer steps can be the expensive one, and a search that ignores cost will happily pick it.",
    task:
      "This started as a university AI assignment: implement the searches. I extended it on my own to answer the question the assignment left open, how much better is each algorithm and why, with benchmarks, tests and a demo anyone can run in a browser.",
    actions: [
      {
        title: "Implemented BFS, Dijkstra (Uniform Cost Search) and A* from scratch.",
        detail:
          "Python, no external dependencies. Each cell has an elevation and some are blocked. A move costs 1 plus any climb.",
      },
      {
        title: "Used the right data structures.",
        detail:
          "Dijkstra and A* share a binary heap priority queue, so each push and pop is O(log n), with an insertion counter that breaks ties and keeps the order stable. A hash-set closed list makes the already-expanded check O(1).",
      },
      {
        title: "Replaced path copying with parent pointers.",
        detail:
          "An earlier version copied the whole partial path into every queue entry, which costs O(path length) memory per entry. Each node now stores the single node it came from and the route is rebuilt once at the goal: O(V) overall, identical output.",
      },
      {
        title: "Kept A* optimal.",
        detail:
          "Every step costs at least 1, so the Manhattan heuristic never overestimates the remaining cost. Euclidean distance is provided as well.",
      },
      {
        title: "Made the results reproducible.",
        detail:
          "Six benchmark maps, 13 tests, and a parity check that the JavaScript in the browser demo matches the Python, all run in CI on every push.",
      },
    ],
    result:
      "On the demo map, both routes take 26 steps, but BFS walks over the hill for an effort of 35, 35% more than the best route, while A* finds that best route expanding 59% fewer nodes than Dijkstra. On the choice map, A* reaches the same route as Dijkstra after expanding 41 nodes instead of 75. A live browser demo races all three.",
    resultHighlights: ["35% more", "59% fewer nodes", "41 nodes instead of 75"],
    metrics: [
      { value: "59%", label: "fewer nodes than Dijkstra" },
      { value: "35%", label: "extra effort from BFS" },
      {
        value: "13",
        label: "tests in CI",
        proof: { label: "Actions tab of the Pathfinder repo", url: "https://github.com/Agrim1305/Pathfinder/actions" },
      },
      {
        value: "6",
        label: "benchmark maps",
        proof: { label: "maps folder in the Pathfinder repo", url: "https://github.com/Agrim1305/Pathfinder/tree/main/maps" },
      },
    ],
    deepDive: {
      title: "One pointer per node, and why A* stays optimal",
      body: [
        "My first version stored the whole path so far in every queue entry. It was easy to write and it costs O(path length) memory per entry. Each node now stores only the node it came from, and the route is rebuilt once at the goal. Memory is O(V) overall and the output is identical, which the tests check.",
        "A* is only worth using if it still finds the cheapest route. It does here because every move costs at least 1, and the Manhattan distance is the smallest number of moves left. The heuristic can never be more than the true remaining cost, so A* never skips the best route.",
      ],
      code: {
        file: "pathfinder.py",
        lang: "python",
        source: [
          "def reconstruct_path(came_from: dict, end: Position) -> Path:",
          "    \"\"\"",
          "    Rebuild the path by walking back from the goal to the start.",
          "",
          "    Each node only stores the node it came from, so we don't have to copy",
          "    the whole path into every queue entry (much less memory on big maps).",
          "    \"\"\"",
          "    path = [end]",
          "    while came_from[path[-1]] is not None:",
          "        path.append(came_from[path[-1]])",
          "    path.reverse()",
          "    return path",
        ].join("\n"),
        url: "https://github.com/Agrim1305/Pathfinder/blob/db4c66eb8e0a580f86f7719f4254c8e1a72f3d03/pathfinder.py#L149-L160",
      },
    },
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
      "My first paid client. A fixed quote, three weeks, and a site that now brings a 100+ player academy 50+ Google Search clicks a month and has helped win 10+ new clients.",
    situation:
      "A tennis academy coaching 100+ players was advertising mostly through a WhatsApp group. The owners wanted a professional online presence that brings in new players, without taking on software they would have to run themselves.",
    task:
      "I was the sole developer on a fixed quote, responsible for everything from scoping and price to design, build and launch, in three weeks.",
    actions: [
      {
        title: "Talked the client out of self-service booking.",
        detail:
          "They asked for it. With squads already near capacity, open booking would have overfilled sessions. The site is enquiry-only, so the coaches stay in control of who joins. This happened before any code, and it was the most useful thing I did.",
      },
      {
        title: "Ran the design with the owners over several rounds.",
        detail:
          "From a dark direction to the light theme they chose, built from the navy and lime of their existing posters.",
      },
      {
        title: "Built it so the owners never need a developer for content.",
        detail:
          "A static Nuxt site. Squads, coaches, mentors and results live in Nuxt Content collections and partners in the app config, so adding a coach is a data change, not a code change.",
      },
      {
        title: "Made enquiries reach the owners straight away.",
        detail:
          "Netlify Forms sends each enquiry to them as it arrives.",
      },
      {
        title: "Set it up to be found.",
        detail:
          "On-page SEO, a sitemap and robots file, Search Console and a Google Business Profile.",
      },
    ],
    result:
      "Delivered in three weeks on the fixed quote. The site scores 100 for SEO and 100 for accessibility in Lighthouse. As of November 2026 it brings in 50+ Google Search clicks a month, the Google Business Profile has 10 reviews, and it has helped win 10+ new clients.",
    resultHighlights: ["50+ Google Search clicks a month", "10+ new clients"],
    metrics: [
      { value: "3 wks", label: "quote to delivery" },
      { value: "50+/mo", label: "Google Search clicks" },
      { value: "10+", label: "new clients" },
      { value: "10", label: "Google reviews" },
    ],
    learned:
      "Scoping is engineering. Saying no to the booking feature did more for the client than anything I built.",
    deepDive: {
      title: "Adding a coach without a developer",
      body: [
        "The owners did not want software to run. So nothing about the academy is written into a page. Squads, coaches, mentors and results are entries in content collections, and each page is built from them.",
        "Adding a coach is one new entry. The page, the order and the layout follow from the data.",
      ],
    },
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
    slug: "gps-tracker-dashboard",
    title: "GPS Tracker Dashboard",
    status: "Java · 2026",
    period: "Mar 2026 to May 2026",
    role: "Solo coursework, Event Driven Computing",
    oneLiner:
      "Merged ten live GPS streams into one real-time dashboard with no shared mutable state, verified by 19 automated checks, by modelling the data flow with functional reactive programming.",
    emphasis: "no shared mutable state",
    summary:
      "Ten concurrent GPS streams, a filter you can change while it runs, and a rolling distance window, with no shared mutable state. 19 of 19 automated checks pass.",
    situation:
      "A live tracking dashboard has to react to a continuous stream of location updates from many devices, and let the user change what they are watching while it runs. The usual way to build that, event handlers that mutate shared state, is where real-time interfaces go wrong.",
    task:
      "Solo coursework. Merge ten concurrent GPS streams from Microsoft's Geolife dataset into one dashboard with a live location filter and a rolling distance figure, and prove the behaviour with tests, including the parts that depend on timing.",
    actions: [
      {
        title: "Modelled the dashboard as a dataflow graph.",
        detail:
          "Using the Sodium FRP library, the code describes relationships between streams and the framework handles propagation. No handler mutates shared state.",
      },
      {
        title: "Made the filter a live value, not a setting.",
        detail:
          "The latitude and longitude filter is a cell sampled with snapshot, so every event is checked against the filter's current value.",
      },
      {
        title: "Tracked distance over a rolling five-minute window.",
        detail:
          "Old readings are evicted as time passes.",
      },
      {
        title: "Resolved conflicts in the merge itself.",
        detail:
          "A left-priority merge makes real events always win over clear signals. Altitude is converted from feet to metres on the way through.",
      },
      {
        title: "Tested the timing-sensitive parts.",
        detail:
          "19 automated checks: 11 for the distance calculator and 8 for the FRP helpers, including eviction of old readings from the window.",
      },
    ],
    result:
      "Ten concurrent streams on one dashboard that updates cleanly as data arrives, with 19 of 19 automated checks passing. The bugs you would normally write in event-driven code are hard to express in this design in the first place.",
    resultHighlights: ["19 of 19 automated checks"],
    metrics: [
      { value: "10", label: "concurrent streams" },
      { value: "5 min", label: "rolling window" },
      {
        value: "19",
        label: "automated checks",
        proof: { label: "tests folder in the gps-frp-tracker repo", url: "https://github.com/Agrim1305/gps-frp-tracker/tree/main/tests" },
      },
    ],
    learned:
      "Most of reactive design is making invalid states unrepresentable. Once the dataflow graph was right, whole categories of bugs simply could not happen.",
    deepDive: {
      title: "A filter that is always current",
      body: [
        "The user can change the latitude and longitude filter while ten streams are arriving. With event handlers, that means a shared variable that one handler writes and others read, and a bug whenever the order surprises you.",
        "Here the filter is a cell, a value that changes over time. Each GPS event takes a snapshot of the cell as it passes, so every event is judged against the filter as it is at that moment. There is no variable to get out of step.",
      ],
      code: {
        file: "src/FrpHelpers.java",
        lang: "java",
        source: [
          "    // Lets events through only if inside the current range cell.",
          "    public static Stream<GpsEvent> filterByRange(Stream<GpsEvent> in, Cell<FilterRange> rangeCell){",
          "        return in.snapshot(rangeCell, (Lambda2<GpsEvent, FilterRange, GpsEvent>) (ev, range) -> range.contains(ev) ? ev : null).filter(ev -> ev != null);",
          "    }",
        ].join("\n"),
        url: "https://github.com/Agrim1305/gps-frp-tracker/blob/f773e124417e7efb8b5c578013e67e6cc7c98402/src/FrpHelpers.java#L28-L31",
      },
    },
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

/* Plain-text rendering of a Star for the chat assistant. */
export function starAsKnowledge(s: Star): string[] {
  const lines = [
    `Situation: ${s.situation}`,
    "",
    `Task: ${s.task}`,
    "",
    `Actions: ${s.actions.map((a, i) => `${i + 1}. ${a.title} ${a.detail}`).join(" ")}`,
    "",
    `Result: ${s.result}`,
  ];
  if (s.deepDive) lines.push("", `Deep dive, ${s.deepDive.title}: ${s.deepDive.body.join(" ")}`);
  if (s.learned) lines.push("", `What he learned: ${s.learned}`);
  return lines;
}

/* Plain-text rendering of one project for the chat assistant. */
export function projectAsKnowledge(p: Project): string {
  return [
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
    ...starAsKnowledge(p),
  ].join("\n");
}

/* Every project, for the chat assistant's knowledge base. */
export function projectsAsKnowledge(): string {
  return projects.map(projectAsKnowledge).join("\n\n");
}
