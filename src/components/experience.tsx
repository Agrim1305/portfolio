import { ArrowUpRight } from "lucide-react";
import { ExperienceRoles } from "@/components/experience-roles";

type Certification = {
  name: string;
  issuer: string;
  year: string;
  credentialUrl: string;
};

const certifications: Certification[] = [
  {
    name: "Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
  },
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

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

const credentialLink =
  "inline-flex min-h-11 items-center gap-1 text-sm text-accent-soft transition-colors hover:text-accent";

export function Experience() {
  return (
    <section id="experience" className="wrap py-20 lg:py-28">
      <h2 className="rise font-display text-[clamp(3rem,1.6rem+4.4vw,4.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
        Where I&apos;ve{" "}
        <span className="font-serif text-[1.18em] font-medium italic tracking-normal text-accent">
          worked
        </span>
      </h2>
      <p className="rise mt-3 text-[15px] text-ink-muted lg:text-[17px]" style={rise(0.04)}>
        Hover a role for the short version. Read more for the full story.
      </p>

      <p
        className="rise mt-5 max-w-3xl text-base leading-relaxed text-ink-soft lg:text-[17px]"
        style={rise(0.08)}
      >
        Across leading a committee, coaching more than fifty clients of every
        age and background, and working a busy retail floor, the common thread
        is <span className="hl">working with people</span>. It&apos;s made me
        good at reading and communicating with people from all walks of life,
        and comfortable fitting into any environment, including the Australian
        workplace I want to build my career in.
      </p>

      <div className="rise mt-10 lg:mt-14" style={rise(0.16)}>
        <ExperienceRoles />
      </div>


      <div className="rise mt-16 lg:mt-20" style={rise(0.24)}>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">
          Certifications
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {certifications.map((c) => (
            <li
              key={c.name}
              className="flex flex-col justify-between gap-3 rounded-[22px] border border-hairline bg-surface px-5 pb-3 pt-5"
            >
              <p className="text-base leading-snug text-ink">
                {c.name}
                <span className="text-ink-muted"> · {c.issuer}</span>
              </p>
              <p className="flex items-center justify-between gap-4">
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={credentialLink}
                >
                  Credential
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
                <span className="font-mono text-xs text-ink-faint">{c.year}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
