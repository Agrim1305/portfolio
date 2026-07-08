import Image from "next/image";

/* An image mounted in the drafting-table frame language: a hairline border with
   either L-shaped registration ticks (the default) or a title-block strip. Used
   for the portrait and for photographic evidence, so no image reads as a loose
   photo. */
export function TickFrame({
  src,
  alt,
  sizes,
  caption,
  plate = "Portrait · 01",
  priority = false,
  objectPosition = "top",
  variant = "ticks",
  flicker = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  caption?: string;
  plate?: string;
  priority?: boolean;
  objectPosition?: "top" | "center";
  variant?: "ticks" | "titleblock";
  flicker?: boolean;
  className?: string;
}) {
  const isTitleBlock = variant === "titleblock";
  const objectClass = `object-cover ${
    objectPosition === "center" ? "object-center" : "object-top"
  }`;

  return (
    <figure
      className={`tick-frame relative overflow-hidden rounded-lg border border-hairline bg-surface ${
        isTitleBlock ? "flex flex-col" : ""
      } ${className}`}
    >
      <div
        className={`${isTitleBlock ? "relative flex-1" : "absolute inset-0"} ${
          flicker ? "photo-flicker" : ""
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={objectClass}
        />
      </div>

      {!isTitleBlock && (
        <>
          <span className="reg-tick reg-tl" aria-hidden />
          <span className="reg-tick reg-tr" aria-hidden />
          <span className="reg-tick reg-bl" aria-hidden />
          <span className="reg-tick reg-br" aria-hidden />
          {caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper/90 to-transparent px-3 pb-2.5 pt-8 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {caption}
            </figcaption>
          )}
        </>
      )}

      {isTitleBlock && (
        <figcaption className="flex items-center justify-between border-t border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          <span>{caption}</span>
          <span className="text-accent">{plate}</span>
        </figcaption>
      )}
    </figure>
  );
}
