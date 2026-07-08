import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

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
  {
    name: "Career Access Mentoring Program",
    issuer: "Adelaide University",
    year: "2025",
    credentialUrl:
      "https://www.linkedin.com/feed/update/urn:li:activity:7376092779933835264/",
  },
];

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
        I&apos;m an international student, and my coaching and retail roles are{" "}
        <span className="hl">customer-facing experience in Australian workplaces</span>
        . I already know how work here runs, so I can start contributing from day
        one.
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

      {/* Certifications, boxed, each verifiable */}
      <div
        className="rise mt-14 rounded-xl border border-hairline card-draft p-6 sm:p-7"
        style={{ "--rise-delay": "0.32s" } as React.CSSProperties}
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
