import { COACHING_PHOTO_CONSENT, coachingPhoto } from "@/lib/stories";

/* The journey strip under Built on court: three chapters of photos and
   short clips, school to university. Captions are approved copy. */

export type JourneyMedia = {
  kind: "photo" | "video";
  /** The photo, or for a video its silent loop. */
  src: string;
  /** A video's poster and its full clip with sound, for the lightbox. */
  poster?: string;
  full?: string;
  /** The real size in pixels: the photo's, or the video's frame. */
  width: number;
  height: number;
  /** What is visible. A video's button adds "video" to it. */
  alt: string;
  title: string;
  detail: string;
  /** A wide medium that fills a column alone, at full height. */
  solo?: boolean;
};

export type Chapter = { label: string; heading: string; line: string; media: JourneyMedia[] };

const photo = (file: string, width: number, height: number, alt: string, title: string, detail: string): JourneyMedia => ({
  kind: "photo",
  src: `/images/court/${file}.webp`,
  width,
  height,
  alt,
  title,
  detail,
});

const video = (name: string, width: number, height: number, alt: string, title: string, detail: string): JourneyMedia => ({
  kind: "video",
  src: `/videos/court/${name}-loop.mp4`,
  poster: `/videos/court/${name}-poster.jpg`,
  full: `/videos/court/${name}-full.mp4`,
  width,
  height,
  alt,
  title,
  detail,
});

export const chapters: Chapter[] = [
  {
    label: "01 / India",
    heading: "Where it started.",
    line: "Juniors, a state team and the Rafa Nadal Academy.",
    media: [
      photo("07-school-serve", 800, 1200, "Agrim serving in a school match", "Serving at school", "India"),
      video("v1-clay-rally-india", 1280, 720, "A training rally on an outdoor clay court", "On clay", "Training, India"),
      video(
        "v3-night-match",
        848,
        480,
        "A night tournament match on a floodlit hard court at the Rafa Nadal Academy",
        "Night match",
        "Tournament, Rafa Nadal Academy",
      ),
      photo("05-tony-nadal", 768, 1024, "Agrim as a junior with Toni Nadal", "With Toni Nadal", "Rafa Nadal Academy"),
      photo("06-nationals-punjab", 1125, 2000, "Agrim holding a trophy and medal", "State team, Punjab", "3rd at the nationals"),
      video(
        "v2-rafa-academy-ceremony",
        848,
        480,
        "Team India on stage with an Indian flag at the Rafa Nadal Academy inauguration ceremony",
        "Team India on stage",
        "Inauguration ceremony, Rafa Nadal Academy",
      ),
      photo("08-singha-winner", 1125, 2000, "Agrim as a junior holding a winner's trophy in an AITA tournament photo frame", "Winner", "AITA tournament"),
    ],
  },
  {
    label: "02 / Adelaide",
    heading: "Recognition.",
    line: "Intervarsity wins and awards at university.",
    media: [
      photo("04-sa-challenge-win", 1125, 2000, "Agrim with a winner's certificate and shield on court", "SA Challenge", "1st place, men's tennis, 2024"),
      photo("03-blues-certificate-of-merit", 1334, 2000, "Agrim holding his certificate of merit at the Blues awards", "Certificate of Merit", "Intervarsity tennis, 2024"),
      photo("14-vc-certificate-of-merit", 800, 533, "Agrim receiving a certificate on stage", "From the Vice-Chancellor", "Certificate of merit, first year"),
      photo(
        "12-club-of-the-year-solo",
        2000,
        1333,
        "Agrim holding the Club of the Year shield in front of an Adelaide University backdrop",
        "Club of the Year",
        "Adelaide University Sport",
      ),
    ],
  },
  {
    label: "03 / Adelaide",
    heading: "University tennis.",
    line: "Nationals, UTL and the club I led.",
    media: [
      // Landing in Australia opens the chapter, a full column to itself.
      {
        ...photo(
          "10-local-tournament-four",
          1600,
          1200,
          "Four players at the net at Tea Tree Gully Tennis Club, each holding a small trophy",
          "First season, first title",
          "Tea Tree Gully Tennis Club, my first season in Australia",
        ),
        solo: true,
      },
      photo("09-unisport-nationals-team", 1200, 1600, "The UTL team lined up on court in Perth, with their coach crouching in front", "UTL team", "Perth, first year"),
      photo("11-nationals-serve", 1333, 2000, "Agrim jumping into a serve at UniSport Nationals in Canberra", "UniSport Nationals", "Canberra, first year"),
      photo("01-utl-team", 1600, 1200, "Adelaide University tennis team at the net", "UTL team", "Adelaide University"),
      photo("02-utl-playing", 1080, 720, "Agrim hitting a forehand", "Match play", "UTL"),
      video("v4-adelaide-hitting", 1080, 608, "Agrim hitting on a blue hard court", "Hitting session", "Adelaide"),
      ...(COACHING_PHOTO_CONSENT
        ? [{ ...coachingPhoto, kind: "photo" as const, title: "Coaching juniors", detail: "Adelaide Rising Stars" }]
        : []),
    ],
  },
];

/* Wide media (6:5 and wider) pair up, stacked in one column; anything
   taller, or marked solo, fills a column alone. Wide media pair in the
   order they come, each pair where its first sits; with an odd number in a
   chapter, the last wide one fills a column alone. */
const pairs = (m: JourneyMedia) => !m.solo && m.width / m.height >= 1.2;

export type Column = { media: JourneyMedia[] };

export function columnsOf(media: JourneyMedia[]): Column[] {
  const wide = media.filter(pairs);
  const partner = new Map<JourneyMedia, JourneyMedia>();
  for (let i = 0; i + 1 < wide.length; i += 2) partner.set(wide[i], wide[i + 1]);
  const seconds = new Set(partner.values());
  return media.filter((m) => !seconds.has(m)).map((m) => ({ media: partner.has(m) ? [m, partner.get(m)!] : [m] }));
}
