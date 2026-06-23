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
    title: "Top 90 — AITA U18",
    org: "All India Tennis Association",
    year: "2022",
    description: "National junior ranking in the under-18 category across India. Trained at the Rafa Nadal Academy in Spain and competed in junior ITF tournaments across India and Nepal.",
  },
];

export function Awards() {
  return (
    <section id="awards" className="py-32">
      <SectionHeading number="06" title="Awards" caption="Recognition · what I've earned" />
      <div className="space-y-4">
        {awards.map((award) => (
          <Card key={award.title} className="p-6 hover:border-foreground/30 transition-colors">
            <div className="flex items-start gap-5">
              <div className="size-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Trophy className="size-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="text-lg md:text-xl font-semibold">{award.title}</h3>
                  <span className="font-mono text-xs text-muted-foreground tracking-wider shrink-0">{award.year}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{award.org}</p>
                <p className="text-base text-muted-foreground leading-relaxed">{award.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}