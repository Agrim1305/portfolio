import type { mergerStory } from "@/lib/stories";

/* The merger's beats in the President story: equal boxes stacked at the
   panel's width, one border and padding each, the text directly under its
   label at a reading measure. */
export function MergerBeats({ beats }: { beats: typeof mergerStory }) {
  return (
    <ol className="flex flex-col gap-8">
      {beats.map((beat) => (
        <li key={beat.label} className="rounded-[22px] border border-hairline bg-[#1A1A1F] p-6">
          <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-accent-soft">{beat.label}</h4>
          <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-[#D6D3CD]">{beat.text}</p>
        </li>
      ))}
    </ol>
  );
}
