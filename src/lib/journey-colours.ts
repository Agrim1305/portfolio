import path from "node:path";
import sharp from "sharp";
import { chapters } from "@/lib/journey";

/* Each journey medium's main colour, for the glow behind the track: the
   dominant colour of the photo, or of a video's poster. Read from the files
   on the server, so on a static page it is worked out once, at build. */
export async function journeyColours(): Promise<Record<string, string>> {
  const media = chapters.flatMap((c) => c.media);
  const entries = await Promise.all(
    media.map(async (m) => {
      const { dominant } = await sharp(path.join(process.cwd(), "public", m.poster ?? m.src)).stats();
      const hex = `#${[dominant.r, dominant.g, dominant.b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
      return [m.src, hex] as const;
    }),
  );
  return Object.fromEntries(entries);
}
