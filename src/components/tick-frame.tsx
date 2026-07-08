import Image from "next/image";

/* An image mounted in the drafting-table frame language: a hairline border with
   either L-shaped registration ticks (the default) or a title-block strip. Used
   for the portrait and for photographic evidence, so no image reads as a loose
   photo. With `entrance`, the corner marks draw out and the photo resolves in
   (see the tf-* rules in globals.css) — "load" plays on mount, "reveal" waits
   for the surrounding <Reveal> to scroll into view. */
export function TickFrame({
  src,
  alt,
  sizes,
  caption,
  plate = "Portrait · 01",
  priority = false,
  objectPosition = "top",
  variant = "ticks",
  marks = false,
  entrance,
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
  marks?: boolean;
  entrance?: "load" | "reveal";
  className?: string;
}) {
  const isTitleBlock = variant === "titleblock";
  const objectClass = `object-cover ${
    objectPosition === "center" ? "object-center" : "object-top"
  }`;

  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={objectClass}
    />
  );

  return (
    <figure
      data-tf={entrance}
      className={`tick-frame relative overflow-hidden rounded-lg border border-hairline bg-surface ${
        isTitleBlock ? "flex flex-col" : ""
      } ${className}`}
    >
      {isTitleBlock ? (
        <div className="relative flex-1">
          <div className="tf-photo absolute inset-0">{image}</div>
          {marks && (
            <span className="tf-marks absolute inset-0" aria-hidden>
              <span className="frame-mark tl" />
              <span className="frame-mark tr" />
              <span className="frame-mark bl" />
              <span className="frame-mark br" />
            </span>
          )}
        </div>
      ) : (
        <>
          <div className="tf-photo absolute inset-0">{image}</div>
          <span className="tf-marks absolute inset-0" aria-hidden>
            <span className="reg-tick reg-tl" />
            <span className="reg-tick reg-tr" />
            <span className="reg-tick reg-bl" />
            <span className="reg-tick reg-br" />
          </span>
          {caption && (
            <figcaption className="tf-photo absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper/90 to-transparent px-3 pb-2.5 pt-8 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {caption}
            </figcaption>
          )}
        </>
      )}

      {isTitleBlock && (
        <figcaption className="tf-photo flex items-center justify-between border-t border-hairline px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          <span>{caption}</span>
          <span className="text-accent">{plate}</span>
        </figcaption>
      )}
    </figure>
  );
}
