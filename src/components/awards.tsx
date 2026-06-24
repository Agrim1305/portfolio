import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

type Award = {
  title: string;
  org: string;
  description: string;
  year: string;
};

const awards: Award[] = [
  {
    title: "Club of the Year",
    org: "Adelaide University Sport",
    year: "2025",
    description: "Awarded for rebuilding Adelaide University Tennis Club from dormant status to over 100 active members, securing $7,000+ in facility upgrades, and leading the institutional merger with UniSA's tennis club.",
  },
  {
    title: "Intervarsity Certificate of Merit",
    org: "UniSport Australia",
    year: "2025",
    description: "Recognition for representing Adelaide University at UniSport Nationals tennis competition.",
  },
  {
    title: "Top 90 — All India Tennis Association U18",
    org: "All India Tennis Association (AITA)",
    year: "2022",
    description: "National junior ranking in the under-18 category across India. Trained at the Rafa Nadal Academy in Spain and competed in junior ITF tournaments across India and Nepal.",
  },
];

export function Awards() {
  return (
    <section id="awards" className="py-32">
      <SectionHeading number="06" title="Beyond Code" caption="Recognition · what I've earned" />
      <div className="space-y-4">
        {awards.map((award) => (
          <Card key={award.title} className="glass-panel p-6 hover:border-accent-gold/40 transition-colors">
            <div className="flex items-start gap-5">
              <div className="size-12 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center shrink-0">
                <Trophy className="size-6 text-accent-gold" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-lg md:text-xl font-bold text-white">{award.title}</h3>
                  <span className="font-mono text-xs text-accent-gold tracking-wider shrink-0">{award.year}</span>
                </div>
                <p className="text-sm text-white/70 mb-3">{award.org}</p>
                <p className="text-base text-white/80 leading-relaxed">{award.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}