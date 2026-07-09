import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TickFrame } from "@/components/tick-frame";

type Role = {
  role: string;
  org: string;
  dates: string;
  description: string;
};

const roles: Role[] = [
  {
    role: "President",
    org: "Adelaide University Tennis Club",
    dates: "Aug 2024 to Mar 2026 ",
    description:
      "Led the club revival covered above: merger, constitution, committee, grants, and the award.",
  },
  {
    role: "Tennis Coach",
    org: "Tea Tree Gully Tennis Club",
    dates: "Mar 2024 to Present",
    description:
      "I coach juniors and adults at all skill levels, both one-on-one and in groups. I plan each session, adjust my feedback to the player, and track their progress over time. It has made me good at explaining the same idea a few different ways until it clicks, and at keeping people motivated when they are finding it hard.",
  },
  {
    role: "Retail Assistant",
    org: "IGA Supermarkets",
    dates: "Feb 2024 to Sep 2024",
    description:
      "Part-time customer service across two stores while studying full-time. Busy retail floor, steady standards, and a lot of practice juggling work and study at the same time.",
  },
];

type Certification = {
  name: string;
  issuer: string;
  year: string;
  credentialUrl: string;
};

const certifications: Certification[] = [
  {
    name: "Technology Job Simulation",
    issuer: "Deloitte Australia",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
  },
  {
    name: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
  },
  {
    name: "Partnering with AI in the Workplace",
    issuer: "Datacom",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
  },
];

const MENTORSHIP_CREDENTIAL_URL =
  "https://www.linkedin.com/feed/update/urn:li:activity:7376092779933835264/";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 pb-24 sm:pb-36">
      <SectionHeading
        number="03"
        title="Experience"
        caption="Where I've led and worked"
      />

      <p
        className="rise max-w-3xl text-base leading-relaxed text-ink-muted"
        style={{ "--rise-delay": "0.16s" } as React.CSSProperties}
      >
        Across leading a committee, coaching more than fifty clients of every
        age and background, and working a busy retail floor, the common thread
        is <span className="hl">working with people</span>. It&apos;s made me
        good at reading and communicating with people from all walks of life,
        and comfortable fitting into any environment, including the Australian
        workplace I want to build my career in.
      </p>

      {/* Roles on a quiet timeline rail */}
      <div
        className="rise mt-10"
        style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
      >
        {roles.map((r) => (
          <div
            key={r.role + r.org}
            className="grid gap-x-8 gap-y-2 pb-10 last:pb-0 sm:grid-cols-[170px_1fr]"
          >
            <p className="font-mono text-xs leading-7 text-ink-faint">
              {r.dates}
            </p>
            <div className="relative border-l border-hairline pl-6">
              <span className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-accent ring-4 ring-paper" />
              <h3 className="text-xl font-semibold text-ink">
                {r.role}, {r.org}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                {r.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mentorship: kept separate from the roles and given more weight than
          the certifications, since it is the more significant of the two. */}
      <div
        className="rise mt-14 rounded-xl border border-hairline card-draft p-6 sm:p-7"
        style={{ "--rise-delay": "0.32s" } as React.CSSProperties}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          Mentorship
        </p>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-[15px] text-ink">
                Career Access Mentoring Program
                <span className="text-ink-faint"> · Adelaide University</span>
              </h3>
              <a
                href={MENTORSHIP_CREDENTIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw inline-flex items-center gap-1 text-[13px] text-accent"
              >
                Credential
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              A structured 14-hour mentorship through Adelaide University, spread
              across meetings over four to six months, mentored one-on-one by an{" "}
              <span className="hl">APT Analyst at Google Threat Intelligence</span>
              . We have stayed in touch for more than a year since. He ran me
              through a full mock Google interview loop, from the online
              assessment to the technical, behavioural and HR rounds, and was
              direct about exactly where I was weak and what to work on. He showed
              me how each round actually works, how to structure an answer, and
              which of my own experiences to draw on for it. We also covered how
              engineers at that level approach software craft and problem-solving,
              and where my strengths fit best. He still reviews my thinking
              whenever I am making a decision about my career.
            </p>
          </div>
          <TickFrame
            src="/mentorship.jpeg"
            alt="University of Adelaide Certificate of Completion for the Career Access Mentoring Program"
            sizes="(max-width: 640px) 160px, 176px"
            entrance="reveal"
            className="w-40 sm:w-44 shrink-0 aspect-[800/1132]"
          />
        </div>
      </div>

      {/* Certifications, boxed, each verifiable */}
      <div
        className="rise mt-6 rounded-xl border border-hairline card-draft p-6 sm:p-7"
        style={{ "--rise-delay": "0.4s" } as React.CSSProperties}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          Certifications
        </p>
        <ul className="mt-4 divide-y divide-hairline">
          {certifications.map((c) => (
            <li
              key={c.name}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0 text-[15px]"
            >
              <span className="text-ink">
                {c.name}
                <span className="text-ink-faint"> · {c.issuer}</span>
              </span>
              <span className="flex items-center gap-4">
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw inline-flex items-center gap-1 text-[13px] text-accent"
                >
                  Credential
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
                <span className="font-mono text-xs text-ink-faint">{c.year}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
