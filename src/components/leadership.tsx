import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { TickFrame } from "@/components/tick-frame";

const outcomes = [
  { value: "2 → 1", label: "clubs merged" },
  { value: "$7,000+", label: "grants secured" },
  { value: "10 → 100+", label: "active members" },
  { value: "Winner", label: "Club of the Year 2025" },
];

const story = [
  {
    label: "Setup",
    text: "Adelaide and UniSA were merging, so every affiliated club had to merge too. As president I ran our side of it: revenue, events, venues and competitions, and keeping every stakeholder informed, the University most of all.",
  },
  {
    label: "What I did",
    text: "The club merger itself went smoothly through third-party facilitation. The hard part was the coaches, independent businesses loyal to both clubs, so I brought them together over five to seven meetings of negotiation and compromise to run as one team without either losing out.",
  },
  {
    label: "Result",
    text: "One merged club running smoothly, both coaches retained, and the members kept happy through the transition.",
  },
];

export function Leadership() {
  return (
    <section id="leadership" className="scroll-mt-24 pb-24 sm:pb-36">
      <SectionHeading
        number="02"
        title="Leadership"
        caption="Adelaide University Tennis Club · President, Aug 2024 to Present"
      />

      <div
        className="rise grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch"
        style={{ "--rise-delay": "0.24s" } as React.CSSProperties}
      >
        <article className="group relative flex flex-col justify-center card-draft rounded-xl border border-hairline p-7 sm:p-8 transition-colors duration-300 hover:border-accent/60">
          <span className="reg-tick reg-tl" aria-hidden />
          <span className="reg-tick reg-tr" aria-hidden />
          <span className="reg-tick reg-bl" aria-hidden />
          <span className="reg-tick reg-br" aria-hidden />
          <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-snug text-ink">
            A dormant club to <span className="hl">Club of the Year</span> in
            eighteen months.
          </h3>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            I took over a club that had gone quiet and rebuilt it from scratch. I
            led the merger of two university tennis clubs during the Adelaide and
            UniSA consolidation, co-authored the new constitution, brought
            together an eight-member committee, and won grants for facility
            upgrades. The real challenge was getting two groups who didn&apos;t
            know each other to trust the process and work as one.
          </p>
        </article>

        <TickFrame
          src="/award.jpg"
          alt="Adelaide University Sport Club of the Year cheque presentation"
          sizes="(max-width: 1024px) 100vw, 380px"
          caption="Club of the Year · Adelaide University Sport, 2025"
          className="min-h-56 lg:min-h-0"
        />
      </div>

      <dl
        className="rise mt-6 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline"
        style={{ "--rise-delay": "0.32s" } as React.CSSProperties}
      >
        {outcomes.map((o) => (
          <div key={o.label} className="bg-surface p-4 sm:p-6">
            <dd className="font-serif text-xl sm:text-3xl lg:text-[1.9rem] font-medium text-ink tabular-nums whitespace-nowrap">
              {o.value}
            </dd>
            <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
              {o.label}
            </dt>
          </div>
        ))}
      </dl>

      {/* The 'tell me about a conflict' story, collapsed by default */}
      <details
        className="rise group relative mt-6 overflow-hidden rounded-xl border border-hairline card-draft"
        style={{ "--rise-delay": "0.4s" } as React.CSSProperties}
      >
        <span className="reg-tick reg-tl" aria-hidden />
        <span className="reg-tick reg-tr" aria-hidden />
        <span className="reg-tick reg-bl" aria-hidden />
        <span className="reg-tick reg-br" aria-hidden />
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:p-7 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
              The challenge
            </span>
            <span className="mt-1.5 block text-lg font-medium text-ink">
              Running our side of a two-university club merger
            </span>
          </span>
          <ChevronDown
            className="size-5 shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="space-y-4 px-6 pb-6 sm:px-7 sm:pb-7">
          {story.map((beat) => (
            <div key={beat.label}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                {beat.label}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
                {beat.text}
              </p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
