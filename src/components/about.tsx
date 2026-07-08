import {
  Globe,
  Blocks,
  Target,
  Code,
  GraduationCap,
  CircleDot,
  MapPin,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TickFrame } from "@/components/tick-frame";

const facts = [
  { icon: Code, value: "AI major", label: "Computer Science" },
  { icon: GraduationCap, value: "Dec 2026", label: "Graduating" },
  { icon: CircleDot, value: "15 years", label: "On court" },
  { icon: MapPin, value: "Adelaide", label: "Based in Australia" },
];

const principles = [
  {
    icon: Globe,
    lead: true,
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

export function About() {
  return (
    <section id="about" className="scroll-mt-24 pb-24 sm:pb-36">
      <SectionHeading number="04" title="About" />

      <div
        className="rise grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start"
        style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
      >
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink-muted">
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
        </div>

        <TickFrame
          src="/tennis.jpg"
          alt="Agrim Sharma playing a forehand"
          sizes="(max-width: 1024px) 100vw, 360px"
          caption="Match play · Adelaide"
          objectPosition="center"
          entrance="reveal"
          className="aspect-[4/3] lg:aspect-[4/5]"
        />
      </div>

      <div
        className="rise mt-12 max-w-3xl"
        style={{ "--rise-delay": "0.32s" } as React.CSSProperties}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          A few things I hold to, that my projects show
        </p>
        <div className="mt-6 space-y-7">
          {principles.map(({ icon: Icon, lead, statement, evidence }) => (
            <div key={statement} className="flex gap-4">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface">
                <Icon className="size-4 text-accent" aria-hidden />
              </span>
              <div>
                <p
                  className={
                    lead
                      ? "font-serif text-xl sm:text-2xl font-medium leading-snug text-ink"
                      : "text-lg font-medium text-ink"
                  }
                >
                  {statement}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  {evidence}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-lg leading-relaxed text-ink-muted">
          Right now I am building two tools I want in my own hands, a voice log
          for tennis coaches and a receipt scanner for Australian GST, studying
          for the Azure AZ-900, and heading to a humanitarian AI hackathon in
          Sydney to build alongside people who understand those problems better
          than I do.
        </p>
      </div>

      <dl className="rise mt-14 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline">
        {facts.map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-surface p-4 sm:p-6">
            <Icon className="mb-3 size-4 text-ink-faint" aria-hidden />
            <dd className="font-serif text-xl sm:text-2xl lg:text-[1.6rem] font-medium text-ink whitespace-nowrap">
              {value}
            </dd>
            <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
