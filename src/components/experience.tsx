import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

type Experience = {
  role: string;
  org: string;
  dates: string;
  paragraphs: string[];
};

const experiences: Experience[] = [
  {
    role: "President",
    org: "Adelaide University Tennis Club",
    dates: "August 2024 — March 2026",
    paragraphs: [
      "Took over a dormant club with no active committee or structured programming and rebuilt it from the ground up. Led the merger of two university tennis clubs during the Adelaide University–UniSA institutional consolidation, unifying memberships, committees, and operations into a single organisation under Adelaide University Sport and Fitness. Co-authored the constitution for the merged club and designed its new visual identity and logo.",
      "Recruited and led an eight-member committee, establishing governance structures and coordinating across events, competitions, and communications. Secured over $7,000 in facility upgrades, including new fencing, nets, and poles, through grant applications and negotiation with university sports administration.",
      "Built and ran the competitive program end to end: coordinated the club's participation in the University Tennis League, UniSport Nationals, and the SA Challenge; managed weekly team entries for university competitions; and organised internal tournaments alongside a regular calendar of social tennis events. Grew active membership to over 100, increased regular participation by 75%, and led the club to Club of the Year recognition with a $1,000 prize.",
    ],
  },
  {
    role: "Tennis Coach",
    org: "Tea Tree Gully Tennis Club, Adelaide",
    dates: "March 2024 — June 2026",
    paragraphs: [
      "Coach junior and adult players across skill levels, delivering one-on-one and group sessions. Plan lesson structure, adapt feedback to player ability, and track progress over time. The role has sharpened the same things that matter outside the court: how to explain something three different ways until it lands, how to read a room, and how to keep people improving when motivation dips.",
    ],
  },
  {
    role: "Retail Assistant",
    org: "IGA Supermarkets, Adelaide",
    dates: "February — September 2024",
    paragraphs: [
      "Part-time customer service role alongside full-time study, across two IGA locations. Maintained service standards in a high-volume retail environment.",
    ],
  },
];

function ExperienceEntry({ exp }: { exp: Experience }) {
  return (
    <Card className="p-7 hover:border-foreground/30 transition-colors">
      <div className="flex items-start gap-4 mb-5">
        <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0 mt-1">
          <Briefcase className="size-5 text-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold">{exp.role}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {exp.org}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1 tracking-wider">
            {exp.dates}
          </p>
        </div>
      </div>
      <div className="space-y-3 text-base text-muted-foreground leading-relaxed pl-14">
        {exp.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </Card>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-32">
      <SectionHeading number="04" title="Experience" caption="Where I've worked · what I learned" />
      <div className="space-y-5">
        {experiences.map((exp) => (
          <ExperienceEntry key={exp.role + exp.org} exp={exp} />
        ))}
      </div>
    </section>
  );
}