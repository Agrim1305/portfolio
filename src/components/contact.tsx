import { SectionHeading } from "@/components/section-heading";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 pb-24 sm:pb-32">
      <SectionHeading number="05" title="Contact" />
      <div
        className="rise max-w-3xl"
        style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
      >
        <p className="text-lg sm:text-xl leading-relaxed text-ink-muted">
          I&apos;m looking for{" "}
          <span className="text-ink">
            graduate and internship roles in software engineering, AI, data, and
            analytics
          </span>
          . Email is the best way to reach me. I&apos;m based in Adelaide and
          happy to relocate within Australia.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="mailto:agrimsh22@gmail.com"
            className="inline-flex min-h-12 items-center rounded-md bg-ink px-6 text-[15px] font-medium text-paper hover:bg-ink/90 transition-all hover:-translate-y-0.5"
          >
            Email me
          </a>
          <a
            href="https://github.com/Agrim1305"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex min-h-12 items-center text-[15px] text-ink-muted hover:text-ink"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/agrim-sharma-821788302/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw inline-flex min-h-12 items-center text-[15px] text-ink-muted hover:text-ink"
          >
            LinkedIn
          </a>
        </div>

        <p className="mt-12 border-l-2 border-accent pl-5 text-[15px] leading-relaxed text-ink-muted">
          Currently in Australia on a student visa with work rights for
          internship and part-time roles. Full, unrestricted working rights
          from 15 December 2026 (graduation), eligible for the subclass 485
          Temporary Graduate visa. Available for graduate roles from December
          2026, and for internships immediately.
        </p>
      </div>
    </section>
  );
}
