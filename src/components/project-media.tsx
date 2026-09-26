import { BrowserFrame } from "@/components/browser-frame";
import { TickFrame } from "@/components/tick-frame";
import type { ProjectMedia } from "@/lib/projects";

/* Renders a project's media in the site's frame language: photos in a
   TickFrame, app screenshots in BrowserFrame chrome. `small` sizes it for a
   three-up gallery row. */
export function ProjectMediaView({
  media,
  priority = false,
  small = false,
}: {
  media: ProjectMedia;
  priority?: boolean;
  small?: boolean;
}) {
  if (media.kind === "browser") {
    return (
      <BrowserFrame
        src={media.src}
        alt={media.alt}
        url={media.url}
        href={media.href}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 900px"
      />
    );
  }
  return (
    <TickFrame
      src={media.src}
      alt={media.alt}
      caption={media.caption}
      objectPosition={media.position ?? "center"}
      sizes={
        small
          ? "(max-width: 640px) 100vw, 320px"
          : "(max-width: 1024px) 100vw, 900px"
      }
      entrance="reveal"
      priority={priority}
      className={media.aspect}
    />
  );
}
