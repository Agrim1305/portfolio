import Image from "next/image";
import { LeadershipStory } from "@/components/leadership-story";

const outcomes = [
  { value: "2 → 1", label: "clubs merged" },
  { value: "$7,000+", label: "grants secured" },
  { value: "10 → 100+", label: "active members" },
  { value: "Winner", label: "Club of the Year 2025" },
];

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

export function Leadership() {
  return (
    <section id="leadership" className="wrap py-20 lg:py-28">
      <h2 className="rise font-display text-[clamp(3rem,1.6rem+4.4vw,4.75rem)] font-extrabold leading-none tracking-[-0.03em] text-ink">
        Leadership
      </h2>
      <p className="rise mt-4 text-[15px] text-ink-muted lg:text-[17px]" style={rise(0.08)}>
        Adelaide University Tennis Club · President, Jul 2024 to Mar 2026
      </p>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-14">
        <article
          className="rise relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_90%_at_100%_0%,rgb(255_91_46/0.2),rgb(255_91_46/0)_55%),var(--surface)] p-7 shadow-[0_40px_80px_rgb(0_0_0/0.45)] lg:rounded-[28px] lg:px-11 lg:py-10"
          style={rise(0.16)}
        >
          <h3 className="font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            A dormant club to <span className="hl">Club of the Year</span> in
            eighteen months.
          </h3>
          <p className="mt-5 text-base leading-relaxed text-ink-soft lg:text-[17px]">
            I took over a club that had gone quiet and rebuilt it from scratch. I
            led the merger of two university tennis clubs during the Adelaide and
            UniSA consolidation, co-authored the new constitution, brought
            together an eight-member committee, and won grants for facility
            upgrades. The real challenge was getting two groups who didn&apos;t
            know each other to trust the process and work as one.
          </p>
        </article>

        <figure className="rise mx-auto w-full max-w-[460px] lg:max-w-none" style={rise(0.24)}>
          {/* A print on the desk: tilted, and straightens under the pointer. */}
          <div className="relative aspect-[4/3] rotate-[2.5deg] overflow-hidden rounded-[18px] border-[5px] border-ink shadow-[0_30px_60px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-[0.5deg] hover:scale-[1.02] motion-reduce:transition-none">
            <Image
              src="/award.jpg"
              alt="Adelaide University Sport Club of the Year cheque presentation"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-5 font-mono text-xs text-ink-muted">
            Club of the Year · Adelaide University Sport, 2025
          </figcaption>
        </figure>
      </div>

      <dl
        className="rise mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-dashed border-ink/20 pt-8 lg:mt-16 lg:grid-cols-4"
        style={rise(0.32)}
      >
        {outcomes.map((o) => (
          <div key={o.label} className="flex flex-col">
            <dt className="order-last mt-2 text-sm text-ink-muted">{o.label}</dt>
            <dd className="whitespace-nowrap font-display text-[clamp(2rem,1.2rem+2.4vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em] text-ink">
              {o.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="rise mt-10" style={rise(0.4)}>
        <LeadershipStory />
      </div>
    </section>
  );
}
