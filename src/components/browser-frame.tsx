import Image from "next/image";

/* Mounts an app screenshot in minimal browser chrome so captures read as a
   shipped product on the page, not a floating rectangle. */
export function BrowserFrame({
  src,
  alt,
  url,
  href,
  sizes = "(max-width: 1024px) 100vw, 960px",
  priority = false,
}: {
  src: string;
  alt: string;
  url: string;
  href?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const frame = (
    <figure className="overflow-hidden rounded-xl border border-hairline bg-surface">
      <div className="flex min-w-0 items-center gap-3 border-b border-hairline px-4 py-3">
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-ink-faint/40" />
          <span className="size-2.5 rounded-full bg-ink-faint/40" />
          <span className="size-2.5 rounded-full bg-ink-faint/40" />
        </span>
        <span className="min-w-0 truncate rounded bg-secondary px-2.5 py-1 font-mono text-[11px] text-ink-faint">
          {url}
        </span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={2760}
        height={1424}
        sizes={sizes}
        priority={priority}
        className="w-full h-auto"
      />
    </figure>
  );

  if (!href) return frame;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${url}`}
      className="block transition-transform duration-300 hover:-translate-y-1"
    >
      {frame}
    </a>
  );
}
