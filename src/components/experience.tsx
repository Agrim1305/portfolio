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
    dates: "July 2025 to March 2026",
    paragraphs: [
      "Rebuilt the club from the ground up after inheriting a dormant organisation with no active committee, and led the merger of two tennis clubs during the Adelaide University and UniSA institutional consolidation.",
      "Recruited and led an 8-member committee with defined governance structures, role definitions, and coordination across events, competitions, and communications. Secured $7,000+ in facility upgrades (fencing, nets, poles) through grant applications and negotiation with university sports administration. Organised social tennis, national team trials, and a weekly competition across five division teams.",
      "Grew membership from 10 to 100+, a 75% increase in active participation, culminating in Club of the Year recognition and a $1,000 club prize.",
    ],
  },
  {
    role: "Tennis Coach",
    org: "Tea Tree Gully Tennis Club, Adelaide",
    dates: "March 2024 to present",
    paragraphs: [
      "Coach 20 to 50 students across private and group sessions, drawing on fifteen years of competitive playing experience including international junior tournaments. Manage scheduling and family communication across evenings and weekends, and take responsibility for child safety and wellbeing during all sessions.",
    ],
  },
  {
    role: "Retail Assistant",
    org: "IGA, Adelaide",
    dates: "January to November 2024",
    paragraphs: [
      "Worked across two IGA locations (Elizabeth Downs and Hutt Street) handling cash register operations, stock auditing, shelf restocking, and shift reporting. Managed customer inquiries and used Microsoft Office tools for stock and shift reports.",
    ],
  },
];

function ExperienceEntry({ exp }: { exp: Experience }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-lg font-semibold">{exp.role}</h3>
        <p className="text-sm text-muted-foreground">
          {exp.org} · {exp.dates}
        </p>
      </div>
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        {exp.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-24">
      <h2 className="text-2xl font-semibold mb-8">Experience</h2>
      <div className="space-y-10">
        {experiences.map((exp) => (
          <ExperienceEntry key={exp.role + exp.org} exp={exp} />
        ))}
      </div>
    </section>
  );
}