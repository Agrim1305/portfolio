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
        {/* Credential badges: the issuer where its mark would sit, the
            credential, the year and a link to verify it. AZ-900 leads with
            the accent glow, and from lg up it is half as wide again. */}
        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
          {certifications.map((c, i) => (
            <li
              key={c.name}
              className="relative flex flex-col gap-4 overflow-hidden rounded-[22px] border border-hairline bg-surface px-5 pb-3 pt-5 transition-[translate,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {i === 0 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-[radial-gradient(circle,rgb(255_91_46/0.26),transparent_65%)]"
                />
              )}
              <p className="relative flex h-7 items-center font-display text-[15px] font-bold tracking-[-0.01em] text-ink">
                {c.issuer}
              </p>
              <p className={`relative flex-1 leading-snug ${i === 0 ? "text-lg font-medium text-ink" : "text-[15px] text-ink-soft"}`}>
                {c.name}
              </p>
              <p className="relative flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-ink-faint">{c.year}</span>
                <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className={credentialLink}>
                  Verify
                  <span className="sr-only"> {c.name}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
