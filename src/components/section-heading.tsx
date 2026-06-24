type SectionHeadingProps = {
  number: string;
  title: string;
  caption?: string;
};

export function SectionHeading({ number, title, caption }: SectionHeadingProps) {
  return (
    <div className="mb-14 space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-accent-gold tracking-wider font-semibold">{number}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-accent-gold/40 via-white/10 to-transparent" />
      </div>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">{title}</h2>
      {caption && (
        <p className="text-base text-white/60 font-mono tracking-wide">{caption}</p>
      )}
    </div>
  );
}