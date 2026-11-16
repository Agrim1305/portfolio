import { Metrics } from "@/components/case-study";
import type { Metric } from "@/lib/projects";

/* How every section opens: a label, a headline that makes a claim, and a
   row of numbers, two to a row on a phone. The section's evidence follows
   at one gap. */
export function SectionHeader({
  label,
  headline,
  numbers,
}: {
  label: string;
  headline: string;
  numbers?: Metric[];
}) {
  return (
    <header className="rise mb-10 lg:mb-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft lg:text-[13px]">{label}</p>
      <h2 className="mt-3 max-w-[820px] font-display text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
        {headline}
      </h2>
      {numbers && <Metrics metrics={numbers} className="mt-8 grid-cols-2 lg:grid-cols-4 [&_dd]:whitespace-normal" />}
    </header>
  );
}
