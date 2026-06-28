import { SectionHeading } from "@/components/section-heading";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/fade-in";
import { Trophy } from "lucide-react";

type Award = {
  title: string;
  org: string;
  description: string;
  year: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
};

const awards: Award[] = [
  {
    title: "Fifteen Years on Court",
    org: "Tennis · India & Australia",
    year: "",
    description:
      "I've played tennis for fifteen years and it's shaped how I approach everything else. I reached a top 90 national ranking in India at under-18 level, trained at the Rafa Nadal Academy, and now coach in Adelaide. It taught me to stay patient, adjust quickly, and keep going when things aren't working.",
    image: "/tennis.jpg",
    imageAlt: "Agrim Sharma playing a forehand",
    caption: "Match play · Adelaide",
  },
  {
    title: "Club of the Year",
    org: "Adelaide University Sport",
    year: "2025",
    description:
      "Awarded for rebuilding Adelaide University Tennis Club from dormant status to over 100 active members, securing $7,000+ in facility upgrades, and leading the institutional merger with UniSA's tennis club.",
    image: "/award.jpg",
    imageAlt: "Adelaide University Sport Club of the Year cheque presentation",
    caption: "AU Sport Blues Awards · 2025",
  },
  {
    title: "Intervarsity Certificate of Merit",
    org: "UniSport Australia",
    year: "2025",
    description:
      "Recognition for representing Adelaide University at the UniSport Nationals tennis competition, awarded by the Adelaide University Sports Association.",
  },
  {
    title: "Top 90 — AITA U18 National Ranking",
    org: "All India Tennis Association",
    year: "2022",
    description:
      "National junior ranking in the under-18 category across India. Trained at the Rafa Nadal Academy in Spain and competed in junior ITF tournaments across India and Nepal.",
  },
];

export function Awards() {
  return (
    <section id="awards" className="py-32">
      <SectionHeading
        number="07"
        title="Beyond Code"
        caption="Recognition · what I've earned"
      />

      <div className="space-y-4">
        {awards.map((award, i) => (
          <FadeIn key={award.title} delay={i * 90}>
            <Card className="glass-panel overflow-hidden hover:border-accent-gold/40 transition-colors group">
              <div className="grid md:grid-cols-[300px_1fr] items-stretch">
                {/* Image (or icon fallback) — left, inset so it's framed, not cut */}
                <div className="p-4 md:pr-0">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[200px] overflow-hidden rounded-xl ring-1 ring-white/10">
                    {award.image ? (
                      <>
                        <Image
                          src={award.image}
                          alt={award.imageAlt ?? award.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />
                        {award.caption && (
                          <span className="absolute bottom-0 left-0 right-0 p-3 font-mono text-[11px] text-white/80 tracking-wide">
                            {award.caption}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-accent-gold/10 via-card to-accent-blue/10">
                        <Trophy className="size-12 text-accent-gold/70" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Text — right */}
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {award.title}
                    </h3>
                    {award.year && (
                      <span className="font-mono text-xs text-accent-gold tracking-wider shrink-0">
                        {award.year}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70 mb-3">{award.org}</p>
                  <p className="text-base text-white/80 leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}