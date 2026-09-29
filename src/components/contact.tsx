import { ArrowUpRight, Mail } from "lucide-react";
import { GITHUB_URL, LINKEDIN_URL } from "@/components/social-links";

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

export function Contact() {
  return (
    <section id="contact" className="relative isolate overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden
        className="glow-pulse pointer-events-none absolute left-1/2 top-10 -z-10 aspect-square w-[min(90vw,520px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_91_46/0.3),rgb(255_91_46/0.08)_42%,transparent_68%)]"
      />
      <div className="wrap flex flex-col items-center text-center">
        <h2 className="rise font-display text-[clamp(5.5rem,1.5rem+11vw,11.875rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-transparent [-webkit-text-stroke:1.5px_rgb(241_239_234/0.55)]">
          <span className="block sm:inline">Let&apos;s</span>{" "}
          <span className="block sm:inline">build</span>
        </h2>

        <p
          className="rise mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl"
          style={rise(0.08)}
        >
          I&apos;m looking for{" "}
          <span className="text-ink">
            graduate roles in software engineering, AI, data, and analytics
          </span>
          . Email is the best way to reach me. I&apos;m based in Adelaide and
          happy to relocate within Australia.
        </p>

        <div
          className="rise mt-9 grid w-full max-w-md grid-cols-3 gap-2 sm:flex sm:w-auto sm:max-w-none sm:gap-3"
          style={rise(0.16)}
        >
          <a
            href="mailto:agrimsh22@gmail.com"
            className="lift flex h-[52px] items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-semibold text-paper hover:bg-accent-soft sm:h-14 sm:px-8 sm:text-[17px]"
          >
            <Mail className="hidden size-4 sm:block" aria-hidden />
            Email me
          </a>
          {[
            { label: "LinkedIn", url: LINKEDIN_URL },
            { label: "GitHub", url: GITHUB_URL },
          ].map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass lift flex h-[52px] items-center justify-center gap-1.5 rounded-full px-4 text-[15px] text-ink sm:h-14 sm:px-6 sm:text-base"
            >
              {label}
              <ArrowUpRight className="hidden size-4 sm:block" aria-hidden />
            </a>
          ))}
        </div>

        <p
          className="rise mt-12 max-w-2xl rounded-2xl border border-hairline bg-surface/60 px-6 py-5 text-[15px] leading-relaxed text-ink-muted"
          style={rise(0.24)}
        >
          Currently in Australia on a student visa with work rights for
          internship and part-time roles. Full, unrestricted working rights
          from 15 December 2026 (graduation), eligible for the subclass 485
          Temporary Graduate visa. Available for graduate roles from December
          2026.
        </p>
      </div>
    </section>
  );
}
