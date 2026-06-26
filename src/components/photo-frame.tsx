import Image from "next/image";

/**
 * A single consistent frame treatment for every photo on the site:
 * rounded corners, subtle ring, gradient floor, hover zoom, optional caption.
 * `aspect` controls the box shape so mixed-ratio source images all sit in
 * uniformly-styled frames.
 */
export function PhotoFrame({
  src,
  alt,
  caption,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 500px",
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={`group relative ${aspect} w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-accent-blue/5 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />
      {caption && (
        <figcaption className="absolute bottom-0 left-0 right-0 p-4 font-mono text-[11px] text-white/80 tracking-wide">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}