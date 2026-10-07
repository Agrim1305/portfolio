import Image from "next/image";

const facts = [
  { value: "AI major", label: "Computer Science" },
  { value: "Dec 2026", label: "Graduating" },
  { value: "15 years", label: "On court" },
  { value: "Adelaide", label: "Based in Australia" },
];

const principles = [
  {
    statement:
      "I would rather ship something real people use than perfect a prototype nobody sees.",
    evidence:
      "MetaPlay began as a group assignment. I took it the rest of the way on my own and put it in production, so today it is a live product instead of a repo I describe in interviews.",
  },
  {
    statement: "I build so the next person can extend it without a rewrite.",
    evidence:
      "The Restaurant Simulator was designed around exactly that: adding a new kind of staff means adding a class, not editing the code that already works.",
  },
  {
    statement: "I reach for the simplest thing that solves the real problem.",
    evidence:
      "Not the most impressive one. The point is the person on the other end, not the framework I get to use.",
  },
];

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

export function About() {
  return (
    <section id="about" tabIndex={-1} className="outline-none wrap py-20 lg:py-28">
      <h2 className="rise font-display text-[clamp(3rem,1.6rem+4.8vw,6rem)] font-extrabold leading-none tracking-[-0.04em] text-ink">
        About
      </h2>

      <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20">
        <div className="rise mx-auto w-full max-w-[360px]" style={rise(0.08)}>
          <div className="relative aspect-[360/400] overflow-hidden rounded-[22px]">
            <Image
              src="/headshot.jpg"
              alt="Portrait of Agrim Sharma"
              fill
              sizes="360px"
              className="object-cover object-[50%_20%]"
            />
          </div>
          <dl className="mt-5 grid grid-cols-2 overflow-hidden rounded-[18px] border border-hairline">
            {facts.map(({ value, label }, i) => (
              <div
                key={label}
                className={`flex flex-col px-[18px] py-4 ${i < 2 ? "border-b border-hairline" : ""} ${
                  i % 2 === 0 ? "border-r border-hairline" : ""
                }`}
              >
                <dt className="order-last mt-0.5 text-[13px] text-ink-muted">{label}</dt>
                <dd className="whitespace-nowrap font-display text-[22px] font-extrabold leading-tight text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="rise max-w-[760px] space-y-6 text-lg leading-[1.7] text-ink-soft lg:text-[19px]"
          style={rise(0.16)}
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
      </div>

      <div className="rise mt-16 lg:mt-24" style={rise(0.24)}>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft lg:text-[13px]">
          A few things I hold to, that my projects show
        </p>
        <ol className="mt-5 border-b border-hairline">
          {principles.map(({ statement, evidence }, i) => (
            <li
              key={statement}
              className="grid gap-3 border-t border-hairline py-6 lg:grid-cols-[40px_520px_minmax(0,1fr)] lg:gap-10"
            >
              <span aria-hidden className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-xl font-bold leading-[1.25] text-ink lg:text-[22px]">{statement}</p>
              <p className="text-[15px] leading-relaxed text-ink-muted">{evidence}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink-soft">
          Right now I am in my final semester, interning on a voice AI
          prototype at Aurivox, and finishing the website for the tennis
          academy I coach at. I graduate in December.
        </p>
      </div>
    </section>
  );
}
