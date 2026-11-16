/* Single source of truth for the roles in Experience. The role list, each
   role's story panel and (through the knowledge base) the chat assistant
   all read from this file. */

import { starAsKnowledge, type Metric, type Star } from "./projects.ts";
import {
  COACHING_PHOTO_CONSENT,
  awardPhoto,
  clubPhotos,
  coachingPhoto,
  mergerStory,
  type Photo,
} from "./stories.ts";

export type Role = {
  /** Used in the story's address, #story-<id>. */
  id: string;
  role: string;
  org: string;
  dates: string;
  description: string;
  stats: Metric[];
  photos: Photo[];
  /** Told in beats instead of the description. */
  beats?: typeof mergerStory;
  /** Told as Situation, Task, Action, Result instead of the description. */
  story?: Star;
};

export const roles: Role[] = [
  {
    id: "internship",
    role: "AI Software Engineering Intern",
    org: "Viemo Capital",
    dates: "Aug 2026 to Nov 2026",
    description:
      "Built a real-time voice assistant for live meetings on the Claude API: spoken answers in a median of 1.9 seconds, summaries that hold up in long meetings, and consent and data residency guardrails. In internal use.",
    stats: [
      { value: "1.9 s", label: "median spoken answer" },
      { value: "15 of 15", label: "action items captured, up from 7" },
      { value: "17%", label: "lower cost per summary" },
      { value: "31", label: "merged pull requests" },
    ],
    photos: [],
    story: {
      situation:
        "An assistant that listens to a live meeting has to do four hard things at once. It has to answer out loud fast enough to feel like conversation. It must not mistake its own voice for a question. Its summaries have to keep working as the meeting gets longer. And it is handling people's private conversations, so nothing can be processed or sent without their say.",
      task:
        "Working to an open brief from the founder, I built and owned the assistant end to end: the voice pipeline, the data model, the debugging, and its cost and reliability.",
      actions: [
        {
          title: "Built the real-time voice pipeline.",
          detail:
            "Deepgram speech-to-text streams into the Claude API, and Google TTS reads the reply aloud, all over WebSockets. Spoken answers arrive in a median of 1.9 seconds, and a dropped connection recovers in 2.8 seconds.",
        },
        {
          title: "Found the silent bug that froze every summary after about four minutes.",
          detail:
            "I built a Python evaluation harness that replays scripted meetings, and traced the failure to replies being cut off at the 1,500-token output cap. Size budgets and a stop-reason check fixed it.",
        },
        {
          title: "Kept the model's input bounded as meetings grow.",
          detail:
            "Incremental summarisation sends only a size-capped previous summary and the new transcript. Each summary update costs 17% less and runs 23% faster, at equal accuracy.",
        },
        {
          title: "Gave the model context, not tools.",
          detail:
            "The assistant works from live meeting text, recent summaries, and drafts that a person approves. No action is ever sent without human approval.",
        },
        {
          title: "Mapped the data flows, then made consent fail closed.",
          detail:
            "I mapped where voice data travels so it could be kept in-region for data residency requirements. Every AI endpoint then checks, in the browser and on the server, that all participants have consented to overseas processing, and blocks the request if not. Attendee names are pseudonymised in the browser before the model sees them, in a TypeScript layer covered by 25 unit tests.",
        },
        {
          title: "Made capture crash-safe.",
          detail:
            "All 54 transcript lines survived a mid-meeting browser crash that used to lose the whole meeting. The 7-entity data model I designed was adopted company-wide.",
        },
        {
          title: "Measured instead of guessing.",
          detail:
            "The harness plays scripted meetings in synthetic voices and scores accuracy, latency and cost, so every change was measured before release. Across 20 spoken tests the assistant never mistook its own speech for a user's question.",
        },
      ],
      result:
        "The assistant is in internal use. Action items captured in summaries rose from 7 of 15 to 15 of 15 across three test meetings. Over the placement I shipped 31 merged pull requests to a 22,000-line TypeScript and React codebase.",
      resultHighlights: ["7 of 15 to 15 of 15", "31 merged pull requests"],
      learned:
        "A silent failure is worse than a loud one. Nothing crashed when the summaries froze. I only found it because I had built something that could replay a whole meeting and count what came out.",
      deepDive: {
        title: "The summary that froze at four minutes",
        body: [
          "The summary of a meeting stopped updating after about four minutes. Nothing crashed. It simply stopped changing, so in a short test everything looked fine.",
          "To see it at all I needed meetings I could run again and again. I built a harness in Python that replays scripted meetings and counts what comes out: which action items and decisions the summary caught.",
          "The replays showed the cause: the model's replies were being cut off at the 1,500-token output cap. The fix was size budgets and a check on the stop reason of every reply, so a cut-off is caught instead of ignored.",
        ],
      },
    },
  },
  {
    id: "president",
    role: "President",
    org: "Adelaide University Tennis Club",
    dates: "Jul 2024 to Mar 2026",
    description:
      "Turned a dormant club into Club of the Year 2025, growing active membership from about 10 to 100+ in 18 months and lifting regular participation by 75%, by recruiting and leading an 8-person committee, merging with the UniSA club and securing $7,000+ in grants. I also ran the competitive program end to end: the club's entries in the University Tennis League, UniSport Nationals and the SA Challenge, internal tournaments, and a regular calendar of social tennis. I co-authored the merged club's constitution and designed its new logo.",
    stats: [
      { value: "10 to 100+", label: "active members in 18 months" },
      { value: "2 to 1", label: "clubs merged" },
      { value: "$7,000+", label: "in grants, from four applications" },
      { value: "8", label: "committee members recruited and led" },
      { value: "75%", label: "more regular participation" },
      { value: "2025", label: "Club of the Year" },
    ],
    photos: [awardPhoto, ...clubPhotos],
    beats: mergerStory,
  },
  {
    id: "coaching",
    role: "Tennis Coach and Assistant Head Coach",
    org: "Tea Tree Gully Tennis Club · Adelaide Rising Stars Tennis Academy",
    dates: "Mar 2024 to Present",
    description:
      "I coach 10+ sessions a week at Tea Tree Gully Tennis Club for more than fifty clients, from juniors to adults, one-on-one and in groups. I coach for both the club and the academy, which run side by side at Tea Tree Gully, with private players from beginner to performance level. I run junior and performance squads of up to thirty players in a two-hour block, setting the drill plan and directing assistant coaches across four courts. It has made me good at explaining the same idea a few different ways until it clicks, and at keeping a big group moving on one plan.",
    stats: [
      { value: "50+", label: "clients" },
      { value: "10+", label: "sessions a week" },
      { value: "30", label: "players in the largest squads" },
      { value: "4", label: "courts run at once" },
    ],
    photos: COACHING_PHOTO_CONSENT ? [coachingPhoto] : [],
  },
  {
    id: "retail",
    role: "Retail Assistant",
    org: "IGA Supermarkets",
    dates: "Feb 2024 to Oct 2024",
    description:
      "Part-time customer service across two stores while studying full-time. Busy retail floor, steady standards, and a lot of practice juggling work and study at the same time.",
    stats: [
      { value: "2", label: "stores" },
      { value: "Part-time", label: "alongside full-time study" },
    ],
    photos: [],
  },
];

/* Plain-text rendering of one role for the chat assistant. */
function roleAsKnowledge(r: Role): string {
  const lines = [
    `### ${r.role}, ${r.org} (${r.dates})`,
    "",
    r.description,
    "",
    `Numbers: ${r.stats.map((s) => `${s.value} ${s.label}`).join("; ")}.`,
  ];
  if (r.beats) lines.push("", ...r.beats.map((b) => `${b.label}: ${b.text}`));
  if (r.story) lines.push("", ...starAsKnowledge(r.story));
  return lines.join("\n");
}

/* Every role, for the chat assistant's knowledge base. */
export function experienceAsKnowledge(): string {
  return roles.map(roleAsKnowledge).join("\n\n");
}
