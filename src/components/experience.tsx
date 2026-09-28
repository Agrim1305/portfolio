import Image from "next/image";
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

const MENTORSHIP_CREDENTIAL_URL =
  "https://www.linkedin.com/feed/update/urn:li:activity:7376092779933835264/";

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

const credentialLink =
  "inline-flex min-h-11 items-center gap-1 text-sm text-accent-soft transition-colors hover:text-accent";

/* A photo mounted like a print: white border, slight tilt that straightens
   under the pointer. */
function Print({
  src,
  alt,
  caption,
  aspect,
  tilt,
  sizes,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect: string;
  tilt: string;
  sizes: string;
}) {
  return (
    <figure>
      <div
        className={`relative overflow-hidden rounded-[18px] border-[5px] border-ink shadow-[0_30px_60px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 hover:scale-[1.02] motion-reduce:transition-none ${aspect} ${tilt}`}
      >
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-center" />
      </div>
      {caption && <figcaption className="mt-4 font-mono text-xs text-ink-muted">{caption}</figcaption>}
    </figure>
  );
}

export function Experience() {
  return (
    <section id="experience" className="wrap py-20 lg:py-28">
      <h2 className="rise font-display text-[clamp(3rem,1.6rem+4.4vw,4.75rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
        Where I&apos;ve led and{" "}
        <span className="font-serif text-[1.18em] font-medium italic tracking-normal text-accent">
          worked
        </span>
      </h2>

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

      <article
        className="rise mt-16 rounded-3xl border border-hairline bg-surface p-6 lg:mt-20 lg:rounded-[28px] lg:p-11"
        style={rise(0.24)}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">
              Mentorship
            </p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-2xl font-bold leading-snug text-ink lg:text-[28px]">
                Career Access Mentoring Program
                <span className="font-sans text-lg font-normal text-ink-muted lg:text-xl">
                  {" "}
                  · Adelaide University
                </span>
              </h3>
              <a
                href={MENTORSHIP_CREDENTIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={credentialLink}
              >
                Credential
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            </div>
            <p className="mt-4 text-base leading-relaxed text-ink-soft lg:text-[17px]">
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
              and where my strengths fit best. We met in person for the first
              time at Google&apos;s Sydney office, where he gave me a tour, and he
              still reviews my thinking whenever I am making a decision about my
              career.
            </p>
          </div>
          <div className="mx-auto w-44 lg:mx-0 lg:w-full">
            <Print
              src="/mentorship.jpeg"
              alt="University of Adelaide Certificate of Completion for the Career Access Mentoring Program"
              aspect="aspect-[800/1132]"
              tilt="rotate-[2deg]"
              sizes="(min-width: 1024px) 240px, 176px"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-10">
          <Print
            src="/google-sydney-1.jpg"
            alt="Agrim Sharma beside the Google logo sculpture in the Google Sydney office"
            caption="Visiting my mentor at Google Sydney"
            aspect="aspect-[16/9]"
            tilt="-rotate-[1.5deg]"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
          <Print
            src="/google-sydney-2.jpg"
            alt="Agrim Sharma beside the neon Google sign in the Google Sydney office"
            caption="Google Sydney office"
            aspect="aspect-[16/9]"
            tilt="rotate-[1.5deg]"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </div>
      </article>

      <div className="rise mt-6" style={rise(0.32)}>
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
