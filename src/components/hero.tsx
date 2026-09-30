import { Avatar } from "@/components/avatar";
import { AskBar } from "@/components/ask-agrim";
import { SocialLinks } from "@/components/social-links";

// The first word again at the end, so the loop slides back to the start
// instead of jumping.
const KEYWORDS = ["software engineer.", "problem solver.", "competitor.", "coach.", "software engineer."];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-x-clip">
      {/* The topographic texture is drawn as SVG that references the contour
          file with <use>, not loaded as an image. As an image (or a CSS
          background or mask) this faint backdrop covered the most pixels and
          became the page's LCP element; drawn SVG never does. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <svg
          viewBox="0 0 1036.8 662.4"
          preserveAspectRatio="xMidYMid slice"
          className="topo-drift size-full opacity-[0.08]"
        >
          <use href="/images/topo.svg#topo" />
        </svg>
      </div>

      {/* Phones show the figure first; from lg up it sits beside the text,
          so the hero fits one screen. The columns' wrapper steps aside on
          phones (display: contents) so the figure can lead the whole hero. */}
      <div className="wrap flex flex-col pb-16 pt-2 lg:block lg:pb-24">
        {/* Non-breaking spaces keep each separator with the word after it, so
            a narrow screen breaks before a dot instead of after one. */}
        <p className="hero-rise font-mono text-xs uppercase tracking-[0.2em] text-ink-faint lg:text-sm">
          Software ·&nbsp;Applied&nbsp;AI ·&nbsp;Adelaide
        </p>
        {/* One line at every width: the size follows the viewport so the full
            name always fits. */}
        <h1 className="hero-name mt-3 whitespace-nowrap py-[0.06em] font-display text-[clamp(2.25rem,11.8vw,10.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-ink">
          Agrim Sharma
        </h1>
        <div className="contents lg:mt-1 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start lg:gap-x-10 xl:grid-cols-[minmax(0,620px)_minmax(0,1fr)]">
          <div>
            {/* Screen readers get the four words once, as plain text; the
                sliding copy is visual only. */}
            <div
              data-keywords
              className="hero-rise h-[1.2em] overflow-hidden font-serif text-[clamp(2.25rem,1rem+4vw,4.75rem)] italic leading-[1.2] text-accent"
              style={{ animationDelay: "0.6s" }}
            >
              <span className="sr-only">Software engineer, problem solver, competitor, coach</span>
              <div aria-hidden className="keywords flex flex-col whitespace-nowrap">
                {KEYWORDS.map((word, i) => (
                  <span key={i} className="h-[1.2em]">
                    {word}
                  </span>
                ))}
              </div>
            </div>
            <p
              id="hero-intro"
              className="hero-rise mt-6 max-w-[34rem] text-lg leading-[1.55] text-ink-soft lg:text-xl"
              style={{ animationDelay: "0.8s" }}
            >
              Final-year Computer Science student at Adelaide University, majoring
              in Artificial Intelligence. I build{" "}
              <span className="text-ink">software that solves problems</span>, put AI to work
              inside them, and{" "}
              <span className="text-ink">ship it so real people actually use it</span>
              .
            </p>
            <p
              className="hero-rise mt-5 flex items-start gap-2.5 font-mono text-[13px] leading-relaxed text-ink-muted"
              style={{ animationDelay: "0.9s" }}
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>
                Interning on voice AI at Aurivox · open to graduate roles from December 2026
              </span>
            </p>

            <div
              className="hero-rise mt-8 flex flex-wrap items-center gap-2.5 lg:gap-3"
              style={{ animationDelay: "1s" }}
            >
              <a
                href="mailto:agrimsh22@gmail.com"
                className="lift inline-flex h-12 items-center rounded-full bg-accent px-6 text-[15px] font-semibold text-paper hover:bg-accent-soft lg:h-[52px] lg:px-7 lg:text-base"
              >
                agrimsh22@gmail.com
              </a>
              <SocialLinks />
            </div>
            <AskBar className="mt-4 flex lg:hidden" />
          </div>

          {/* The circle takes what height is left under the name, less the
              Ask bar, between 220 and 300px: it gives way before anything
              else. 238px is the header, the eyebrow and the gaps; the name's
              box is 1.08 times its font size. */}
          <div className="order-first mb-8 flex flex-col items-center lg:order-none lg:mb-0 lg:pt-3">
            <div className="w-full max-w-[274px] lg:w-[clamp(220px,calc(100svh_-_238px_-_1.08*min(11.8vw,10.5rem)),300px)] lg:max-w-none">
              <Avatar />
            </div>
            <AskBar className="mt-6 hidden lg:flex" />
          </div>
        </div>
      </div>
    </section>
  );
}
