import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Photo } from "@/lib/stories";

const CREDENTIAL_URL = "https://www.linkedin.com/feed/update/urn:li:activity:7376092779933835264/";

// The first photo leads, with the certificate under it; the rest stack
// beside them.
const photos: Photo[] = [
  {
    src: "/google-sydney-1.jpg",
    alt: "Agrim Sharma beside the Google logo sculpture in the Google Sydney office",
    caption: "Visiting my mentor at Google Sydney",
    width: 1400,
    height: 787,
  },
  {
    src: "/google-sydney-2.jpg",
    alt: "Agrim Sharma beside the neon Google sign in the Google Sydney office",
    caption: "Google Sydney office",
    width: 1400,
    height: 787,
  },
  {
    src: "/images/google/09-with-bart.webp",
    alt: "Agrim and his mentor Bart at the Google office",
    caption: "With Bart at Google Sydney",
    width: 2000,
    height: 1125,
  },
];

const facts = [
  { value: "14 hours", label: "one-on-one" },
  { value: "4 to 6 months", label: "of meetings" },
  { value: "Full loop", label: "mock Google interview" },
  { value: "Sydney", label: "Google office visit" },
];

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

function Shot({ photo, sizes }: { photo: Photo; sizes: string }) {
  return (
    <figure>
      <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] shadow-[0_30px_60px_rgb(0_0_0/0.45)]">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mt-3 font-mono text-xs text-ink-muted">{photo.caption}</figcaption>
    </figure>
  );
}

export function Google() {
  const [lead, ...rest] = photos;
  return (
    <section id="google" className="wrap py-20 lg:py-28">
      <p className="rise font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft lg:text-[13px]">
        Mentorship
      </p>
      <h2
        className="rise mt-3 font-display text-[clamp(3rem,1.6rem+4.8vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink"
        style={rise(0.04)}
      >
        Google,{" "}
        <span className="font-serif font-medium italic tracking-normal text-accent">up close.</span>
      </h2>
      <p className="rise mt-4 text-base text-ink-muted lg:text-xl" style={rise(0.08)}>
        Career Access Mentoring Program · Adelaide University
      </p>

      <div
        className="rise mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,700fr)_minmax(0,470fr)] lg:gap-[30px]"
        style={rise(0.16)}
      >
        <div className="flex flex-col gap-8 lg:gap-6">
          <Shot photo={lead} sizes="(min-width: 1024px) 700px, 100vw" />
          <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface px-[18px] py-3">
            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded">
              <Image
                src="/mentorship.jpeg"
                alt="University of Adelaide Certificate of Completion for the Career Access Mentoring Program"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <p className="flex-1 text-[15px] text-ink">Certificate of Completion</p>
            <a
              href={CREDENTIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 text-[15px] text-accent-soft transition-colors hover:text-accent"
            >
              Credential
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:gap-6">
          {rest.map((photo) => (
            <Shot key={photo.src} photo={photo} sizes="(min-width: 1024px) 470px, 100vw" />
          ))}
        </div>
      </div>

      <dl
        className="rise mt-10 grid grid-cols-2 border-y border-hairline lg:mt-12 lg:grid-cols-4"
        style={rise(0.24)}
      >
        {facts.map((f) => (
          <div key={f.value} className="flex flex-col py-5 lg:py-[22px]">
            <dt className="order-last mt-1 text-sm text-ink-muted">{f.label}</dt>
            <dd className="font-display text-[26px] font-extrabold leading-tight text-ink lg:text-[34px]">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* One paragraph, set in two columns on wide screens. */}
      <p
        className="rise mt-10 text-base leading-[1.65] text-ink-muted lg:columns-2 lg:gap-10 lg:text-[17px]"
        style={rise(0.32)}
      >
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
    </section>
  );
}
