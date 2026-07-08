type SectionHeadingProps = {
  number: string;
  title: string;
  caption?: string;
};

export function SectionHeading({ number, title, caption }: SectionHeadingProps) {
  return (
    <div className="mb-12 sm:mb-16">
      <div className="flex items-center gap-4">
        <span className="rise font-mono text-xs tracking-[0.2em] text-accent">
          {number}
        </span>
        {/* The section's governing grid hairline. It fades out toward the edge
            so it reads as a drafting guide, not a full-width divider rule. */}
        <span className="draw-line h-px flex-1 bg-gradient-to-r from-hairline via-hairline/50 to-transparent" />
      </div>
      <h2
        className="rise mt-5 font-serif text-5xl sm:text-6xl font-medium tracking-tight text-ink"
        style={{ "--rise-delay": "0.08s" } as React.CSSProperties}
      >
        {title}
      </h2>
      {caption && (
        <p
          className="rise mt-4 text-base text-ink-faint"
          style={{ "--rise-delay": "0.16s" } as React.CSSProperties}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
