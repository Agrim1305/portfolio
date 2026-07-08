import Image from "next/image";

// TEMPORARY comparison page for choosing the hero photo frame. Delete after pick.

function Photo() {
  return (
    <Image
      src="/headshot.jpg"
      alt="Agrim Sharma"
      fill
      sizes="240px"
      className="photo-flicker object-cover object-top"
    />
  );
}

const box = "relative w-56 aspect-[4/5]";

export default function Frames() {
  return (
    <main className="mx-auto max-w-5xl px-8 py-16">
      <h1 className="font-serif text-4xl text-ink">Hero photo frame options</h1>
      <p className="mt-3 text-ink-muted">
        All in the drafting-table language, one gold accent, no new colour.
      </p>

      <div className="mt-14 grid grid-cols-2 gap-x-10 gap-y-16 lg:grid-cols-4">
        {/* A — current: registration ticks */}
        <div>
          <figure className={`${box} overflow-hidden rounded-lg border border-hairline bg-surface`}>
            <Photo />
            <span className="absolute left-2.5 top-2.5 size-3 border-l-[1.5px] border-t-[1.5px] border-accent" />
            <span className="absolute right-2.5 top-2.5 size-3 border-r-[1.5px] border-t-[1.5px] border-accent" />
            <span className="absolute bottom-2.5 left-2.5 size-3 border-b-[1.5px] border-l-[1.5px] border-accent" />
            <span className="absolute bottom-2.5 right-2.5 size-3 border-b-[1.5px] border-r-[1.5px] border-accent" />
          </figure>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
            A · Registration ticks (current)
          </p>
        </div>

        {/* B — dimension callout */}
        <div className="pl-6 pt-6">
          <figure className={box}>
            <div className="absolute inset-0 overflow-hidden rounded-lg border border-hairline bg-surface">
              <Photo />
            </div>
            {/* top dimension line */}
            <div className="absolute -top-4 left-0 right-0 flex items-center gap-1.5">
              <span className="h-2 w-px bg-ink-faint" />
              <span className="h-px flex-1 bg-ink-faint" />
              <span className="font-mono text-[9px] text-ink-faint">240</span>
              <span className="h-px flex-1 bg-ink-faint" />
              <span className="h-2 w-px bg-ink-faint" />
            </div>
            {/* left dimension line */}
            <div className="absolute -left-4 bottom-0 top-0 flex flex-col items-center gap-1.5">
              <span className="w-2 h-px bg-ink-faint" />
              <span className="w-px flex-1 bg-ink-faint" />
              <span className="w-2 h-px bg-ink-faint" />
            </div>
          </figure>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
            B · Dimension callout
          </p>
        </div>

        {/* C — outward crop marks, no border */}
        <div className="p-3">
          <figure className={box}>
            <div className="absolute inset-0 overflow-hidden rounded-sm">
              <Photo />
            </div>
            {/* crop marks extend outward from each corner */}
            <span className="absolute -left-2 -top-2 h-4 w-px bg-accent" />
            <span className="absolute -left-2 -top-2 h-px w-4 bg-accent" />
            <span className="absolute -right-2 -top-2 h-4 w-px bg-accent" />
            <span className="absolute -right-2 -top-2 h-px w-4 bg-accent" />
            <span className="absolute -bottom-2 -left-2 h-4 w-px bg-accent" />
            <span className="absolute -bottom-2 -left-2 h-px w-4 bg-accent" />
            <span className="absolute -bottom-2 -right-2 h-4 w-px bg-accent" />
            <span className="absolute -bottom-2 -right-2 h-px w-4 bg-accent" />
          </figure>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
            C · Crop marks
          </p>
        </div>

        {/* D — title-block plate */}
        <div>
          <figure className={`${box} flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface`}>
            <div className="relative flex-1">
              <Photo />
            </div>
            <figcaption className="flex items-center justify-between border-t border-hairline px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-ink-faint">
              <span>Agrim Sharma</span>
              <span className="text-accent">Portrait · 01</span>
            </figcaption>
          </figure>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
            D · Title-block plate
          </p>
        </div>
      </div>
    </main>
  );
}
