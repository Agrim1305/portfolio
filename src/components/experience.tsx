import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ExperienceRoles } from "@/components/experience-roles";

type Certification = {
  name: string;
  issuer: string;
  year: string;
  credentialUrl: string;
  /** The badge or issuer logo, as published, never altered. `tile` sets a
      dark-coloured logo on a light tile so it reads on the card. */
  mark: { src: string; alt: string; width: number; height: number; tile?: boolean };
};

// Official marks, unmodified:
// - The Microsoft Certified: Fundamentals badge, as earned and shown on the
//   Microsoft Learn profile.
// - Deloitte's reversed logo, for dark backgrounds, from deloitte.com:
//   https://www.deloitte.com/content/dam/assets-shared/logos/svg/a-d/deloitte.svg
// - Datacom's primary logo, from the datacom.com header:
//   https://assets.datacom.com/is/content/datacom/Datacom-Primary-Logo-RGB
const MICROSOFT_BADGE = {
  src: "/images/credentials/microsoft-certified-fundamentals-badge.svg",
  alt: "Microsoft Certified: Fundamentals badge",
  width: 56,
  height: 56,
};
const DELOITTE = { src: "/images/credentials/deloitte.svg", alt: "Deloitte Australia", width: 128, height: 24 };
const DATACOM = { src: "/images/credentials/datacom.svg", alt: "Datacom", width: 128, height: 24, tile: true };

const certifications: Certification[] = [
  {
    name: "Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
    mark: MICROSOFT_BADGE,
  },
  {
    name: "Technology Job Simulation",
    issuer: "Deloitte Australia",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
    mark: DELOITTE,
  },
  {
    name: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
    mark: DELOITTE,
  },
  {
    name: "Partnering with AI in the Workplace",
    issuer: "Datacom",
    year: "2026",
    credentialUrl:
      "https://www.linkedin.com/in/agrim-sharma-821788302/details/certifications/",
    mark: DATACOM,
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
        {/* Credential cards, all alike: the badge or issuer logo in a slot
            of fixed height so the names line up, the credential, and the
            year with a link to verify it. */}
        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {certifications.map((c) => (
            <li
              key={c.name}
              className="flex flex-col gap-4 rounded-[22px] border border-hairline bg-surface px-5 pb-3 pt-5 transition-[translate,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex h-14 items-center">
                <span className={c.mark.tile ? "rounded-md bg-ink px-2.5 py-2" : ""}>
                  <Image
                    src={c.mark.src}
                    alt={c.mark.alt}
                    width={c.mark.width}
                    height={c.mark.height}
                    className="block"
                    style={{ height: c.mark.height, width: "auto" }}
                  />
                </span>
              </div>
              <p className="flex-1 text-[15px] leading-snug text-ink">{c.name}</p>
              <p className="flex items-center justify-between gap-3">
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
