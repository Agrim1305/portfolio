type SectionHeadingProps = {
  number: string;
  title: string;
  caption?: string;
};

export function SectionHeading({ number, title, caption }: SectionHeadingProps) {
  return (
    <div className="mb-12 space-y-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground tracking-wider">{number}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
      {caption && (
        <p className="text-sm text-muted-foreground font-mono tracking-wide uppercase">{caption}</p>
      )}
    </div>
  );
}