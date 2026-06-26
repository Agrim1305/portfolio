import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/fade-in";
import { PhotoFrame } from "@/components/photo-frame";
import { Trophy } from "lucide-react";

type Award = {
  title: string;
  org: string;
  description: string;
  year: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
  imageAspect?: string;
};

const awards: Award[] = [
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
      "Recognition for representing Adelaide University at UniSport Nationals tennis competition.",
    image: "/certificate.jpg",
    imageAlt: "Intervarsity Certificate of Merit for Tennis",
    caption: "UniSport Nationals · Tennis",
    imageAspect: "aspect-[3/4]",
  },
  {
    title: "Top 90 — All India Tennis Association U18",
    org: "All India Tennis Association (AITA)",
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

      {/* Tennis split hero */}
      <FadeIn direction="up">
        <Card className="glass-panel overflow-hidden mb-8">
          <div className="grid md:grid-cols-[1.3fr_1fr] items-stretch gap-0">
            <div className="p-3">
              <PhotoFrame
                src="/tennis.jpg"
                alt="Agrim Sharma playing a forehand"
                aspect="aspect-[16/11]"
                caption="Match play · Adelaide"
                sizes="(max-width: 768px) 100vw, 520px"
                className="h-full"
              />
            </div>
            <div className="p-7 flex flex-col justify-center">
              <p className="font-mono text-[11px] text-accent-gold uppercase tracking-[0.2em] mb-3">
                Fifteen years on court
              </p>
              <p className="text-base text-white/80 leading-relaxed">
                Tennis taught me how to lose, adjust, and come back the next
                point. I&apos;ve played for fifteen years, ranked top 90 in India
                at U18, trained at the Rafa Nadal Academy, and now coach in
                Adelaide. The discipline carries into how I build.
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>

      <div className="space-y-4">
        {awards.map((award, i) => (
          <FadeIn key={award.title} delay={i * 90}>
            <Card className="glass-panel p-6 hover:border-accent-gold/40 transition-colors">
              <div className="flex items-start gap-5">
                <div className="size-12 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center shrink-0">
                  <Trophy className="size-6 text-accent-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {award.title}
                    </h3>
                    <span className="font-mono text-xs text-accent-gold tracking-wider shrink-0">
                      {award.year}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">{award.org}</p>
                  <p className="text-base text-white/80 leading-relaxed">
                    {award.description}
                  </p>
                  {award.image && (
                    <div className={`mt-5 ${award.imageAspect ? "max-w-[280px]" : "max-w-sm"}`}>
                      <PhotoFrame
                        src={award.image}
                        alt={award.imageAlt ?? award.title}
                        aspect={award.imageAspect ?? "aspect-[4/3]"}
                        caption={award.caption}
                        sizes="(max-width: 768px) 100vw, 384px"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}