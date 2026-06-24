import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

type Experience = {
  role: string;
  org: string;
  dates: string;
  description: string;
  tags: string[];
};

const experiences: Experience[] = [
  {
    role: "President",
    org: "Adelaide University Tennis Club",
    dates: "Aug 2024 — Mar 2026",
    description: "Took over a dormant club and rebuilt it from the ground up. Led the merger of two university tennis clubs during the Adelaide–UniSA consolidation, co-authored the new constitution, recruited an eight-member committee, and secured over $7,000 in facility upgrades through grants. Grew active membership from 10 to over 100, a 75% increase, and led the club to Club of the Year.",
    tags: ["Leadership", "Governance", "Operations", "Stakeholder Management"],
  },
  {
    role: "Tennis Coach",
    org: "Tea Tree Gully Tennis Club",
    dates: "Mar 2024 — Jun 2026",
    description: "Coach junior and adult players across skill levels through one-on-one and group sessions. Plan lesson structure, adapt feedback to ability, and track progress. The role sharpened how I explain things three different ways until they land, read a room, and keep people improving when motivation dips.",
    tags: ["Communication", "Mentoring", "Planning"],
  },
  {
    role: "Retail Assistant",
    org: "IGA Supermarkets",
    dates: "Feb 2024 — Sep 2024",
    description: "Part-time customer service across two locations alongside full-time study. Maintained service standards in a high-volume retail environment.",
    tags: ["Customer Service", "Teamwork"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-32">
      <SectionHeading number="04" title="Experience" caption="Where I've led and worked" />
      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.role + exp.org} className="glass-panel p-6 hover:border-white/25 transition-colors group">
            <p className="font-mono text-xs text-white/50 uppercase tracking-wider mb-2">{exp.dates}</p>
            <h3 className="text-lg font-bold text-white group-hover:text-accent-gold transition-colors">
              {exp.role} · {exp.org}
            </h3>
            <p className="mt-3 text-base text-white/75 leading-relaxed">{exp.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {exp.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-accent-gold/10 text-accent-gold/90 border border-accent-gold/20">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}