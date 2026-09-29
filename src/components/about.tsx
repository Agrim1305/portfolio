import Image from "next/image";
import {
  Globe,
  Blocks,
  Target,
  Code,
  GraduationCap,
  CircleDot,
  MapPin,
} from "lucide-react";

const facts = [
  { icon: Code, value: "AI major", label: "Computer Science" },
  { icon: GraduationCap, value: "Dec 2026", label: "Graduating" },
  { icon: CircleDot, value: "15 years", label: "On court" },
  { icon: MapPin, value: "Adelaide", label: "Based in Australia" },
];

const principles = [
  {
    icon: Globe,
    statement:
      "I would rather ship something real people use than perfect a prototype nobody sees.",
    evidence:
      "MetaPlay began as a group assignment. I took it the rest of the way on my own and put it in production, so today it is a live product instead of a repo I describe in interviews.",
  },
  {
    icon: Blocks,
    statement: "I build so the next person can extend it without a rewrite.",
    evidence:
      "The Restaurant Simulator was designed around exactly that: adding a new kind of staff means adding a class, not editing the code that already works.",
  },
  {
    icon: Target,
    statement: "I reach for the simplest thing that solves the real problem.",
    evidence:
      "Not the most impressive one. The point is the person on the other end, not the framework I get to use.",
  },
];

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

const print =
  "overflow-hidden rounded-[18px] border-[5px] border-ink shadow-[0_30px_60px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 hover:scale-[1.02] motion-reduce:transition-none";

export function About() {
  const [lead, ...rest] = principles;
  return (
    <section id="about" tabIndex={-1} className="outline-none wrap py-20 lg:py-28">
      <h2 className="rise font-display text-[clamp(3rem,1.6rem+4.4vw,4.75rem)] font-extrabold leading-none tracking-[-0.03em] text-ink">
        About
      </h2>

      <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-16">
        <div
          className="rise max-w-2xl space-y-6 text-lg leading-relaxed text-ink-soft"
          style={rise(0.08)}
        >
          <p>
            I build the way I play tennis, which is to say I{" "}
            <span className="hl">care about the boring part</span>. Fifteen years
            on court teaches you that the good shots come out of a lot of
            unglamorous, repeatable work, and that following through when it stops
            being fun is most of the game. I still coach, and watching a player
            finally land a shot on the fortieth try feels a lot like watching a
            stubborn build go green.
          </p>
          <p>
            Leading the tennis club turnaround is where that became how I think
            about software. Getting a group of people who didn&apos;t agree at
            first onto one plan is not far off getting a tangled codebase into a
            state the next person can actually pick up. Both come down to{" "}
            <span className="hl">follow-through</span>, and to still caring once
            the interesting part is over.
          </p>
          <p>
            When a humanitarian AI hackathon came up in Sydney, I{" "}
            <span className="hl">backed myself</span>, booked the trip interstate
            on my own, and built for 44 hours with people I met that weekend. We
            finished in the top 12. Unfamiliar rooms on short deadlines turn out
            to be where I do some of my best work.
          </p>
        </div>

        {/* Two prints on the desk: the match photo, and the portrait laid over
            its corner. */}
        <div className="rise relative mx-auto w-full max-w-[440px] pb-[18%] pr-[14%]" style={rise(0.16)}>
          <figure>
            <div className={`${print} relative aspect-[4/3] -rotate-3`}>
              <Image
                src="/tennis.jpg"
                alt="Agrim Sharma playing a forehand"
                fill
                sizes="(min-width: 1024px) 380px, 80vw"
                className="object-cover object-center"
              />
            </div>
            <figcaption className="mt-4 font-mono text-xs text-ink-muted">
              Match play · Adelaide
            </figcaption>
          </figure>
          <div className={`${print} absolute bottom-0 right-0 aspect-square w-[46%] rotate-[4deg]`}>
            <Image
              src="/headshot.jpg"
              alt="Portrait of Agrim Sharma"
              fill
              sizes="(min-width: 1024px) 200px, 40vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      <div className="rise mt-16 lg:mt-24" style={rise(0.24)}>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">
          A few things I hold to, that my projects show
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[radial-gradient(110%_90%_at_0%_0%,rgb(255_91_46/0.16),rgb(255_91_46/0)_55%),var(--surface)] p-7 lg:col-span-2 lg:rounded-[28px] lg:p-10">
            <lead.icon className="size-6 text-accent" aria-hidden />
            <p className="mt-5 max-w-3xl font-display text-[clamp(1.6rem,1.1rem+1.6vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
              {lead.statement}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft lg:text-[17px]">
              {lead.evidence}
            </p>
          </div>
          {rest.map(({ icon: Icon, statement, evidence }) => (
            <div key={statement} className="rounded-3xl border border-hairline bg-surface p-7 lg:rounded-[28px] lg:p-9">
              <Icon className="size-5 text-accent" aria-hidden />
              <p className="mt-4 font-display text-xl font-bold leading-snug text-ink lg:text-2xl">
                {statement}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft lg:text-base">
                {evidence}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink-soft">
          Right now I am in my final semester, interning on a voice AI
          prototype at Aurivox, and finishing the website for the tennis
          academy I coach at. I graduate in December.
        </p>
      </div>

      <dl className="rise mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4" style={rise(0.32)}>
        {facts.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col rounded-[22px] border border-hairline bg-surface p-5 lg:p-6">
            <Icon className="size-5 text-accent" aria-hidden />
            <dt className="order-last mt-1.5 text-sm text-ink-muted">{label}</dt>
            <dd className="mt-4 whitespace-nowrap font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.02em] text-ink lg:text-[1.9rem]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
