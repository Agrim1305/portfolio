import { TickFrame } from "@/components/tick-frame";
import { SocialLinks } from "@/components/social-links";

export function Hero() {
  return (
    <section id="top" className="overflow-x-clip pt-16 sm:pt-28 pb-24 sm:pb-36">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10">
        <div className="relative max-w-3xl">
          {/* Registration marks: thin guides that converge on the name, then
              dissolve into the ambient grid. Decorative; hidden on reduced
              motion. */}
          <span className="hero-guide-v" aria-hidden />
          <span className="hero-guide-h" aria-hidden />

          <div className="sm:hidden mb-7">
            <TickFrame
              src="/headshot.jpg"
              alt="Agrim Sharma"
              sizes="160px"
              variant="titleblock"
              caption="Agrim Sharma"
              marks
              entrance="load"
              priority
              className="w-40 aspect-[4/5]"
            />
          </div>

          <p
            className="hero-rise font-mono text-xs uppercase tracking-[0.2em] text-ink-faint"
            style={{ animationDelay: "0.6s" }}
          >
            Software · Applied AI · Adelaide
          </p>
          <h1 className="hero-name mt-5 font-serif text-6xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-ink">
            Agrim Sharma
          </h1>
          <p
            className="hero-rise mt-8 text-xl sm:text-2xl leading-relaxed text-ink-muted max-w-2xl"
            style={{ animationDelay: "0.8s" }}
          >
            Final-year Computer Science student at Adelaide University, majoring
            in Artificial Intelligence. I build{" "}
            <span className="text-ink">full-stack products</span>, put AI to work
            inside them, and{" "}
            <span className="text-ink">ship them so real people can use them</span>
            .
          </p>
          <p
            className="hero-rise mt-6 flex items-start gap-2.5 font-mono text-[13px] leading-relaxed text-ink-muted"
            style={{ animationDelay: "0.9s" }}
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            <span>
              Available for internships now · graduate roles from December 2026
            </span>
          </p>

          <div
            className="hero-rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            style={{ animationDelay: "1s" }}
          >
            <a
              href="mailto:agrimsh22@gmail.com"
              className="link-draw inline-flex min-h-11 items-center text-[15px] text-ink"
            >
              agrimsh22@gmail.com
            </a>
            <div className="flex items-center gap-3">
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="hidden sm:block shrink-0 pt-1">
          <TickFrame
            src="/headshot.jpg"
            alt="Agrim Sharma"
            sizes="(max-width: 1024px) 208px, 240px"
            variant="titleblock"
            caption="Agrim Sharma"
            marks
            entrance="load"
            priority
            className="w-52 lg:w-60 aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  );
}
