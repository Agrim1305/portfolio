import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ExperienceRoles } from "@/components/experience-roles";
import { SectionHeader } from "@/components/section-header";

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
    <section id="experience" tabIndex={-1} className="outline-none wrap py-20 lg:py-28">
      <SectionHeader
        label="Experience"
        headline="Work done for a founder, for paying clients and for players, alongside a full-time degree."
        numbers={[
          { value: "1.9 s", label: "median spoken answer, voice AI" },
          { value: "31", label: "merged pull requests" },
          { value: "50+", label: "coaching clients" },
        ]}
      />

      <div className="rise" style={rise(0.16)}>
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
