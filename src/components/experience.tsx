import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { CountUp } from "@/components/count-up";

type Stat = {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  text?: string; // if set, render this static text instead of counting up
};

type Experience = {
  role: string;
  org: string;
  short: string; // monogram for the badge
  dates: string;
  description: string;
  tags: string[];
  stats?: Stat[];
};

const experiences: Experience[] = [
  {
    role: "President",
    org: "Adelaide University Tennis Club",
    short: "AU",
    dates: "Aug 2024 — Mar 2026",
    description:
      "I took over a club that had gone quiet and rebuilt it from scratch. I led the merger of two university tennis clubs during the Adelaide and UniSA consolidation, co-authored the new constitution, brought together an eight-member committee, and won grants for facility upgrades. The real challenge was getting two groups who didn't know each other to trust the process and work as one.",
    tags: ["Leadership", "Governance", "Operations", "Stakeholder Management"],
    stats: [
      { value: 100, prefix: "10 → ", suffix: "+", label: "active members" },
      { value: 7000, prefix: "$", suffix: "+", label: "grants secured" },
      { value: 2, suffix: " clubs", label: "merged into one" },
      { value: 0, text: "Winner", label: "Club of the Year '25" },
    ],
  },
  {
    role: "Tennis Coach",
    org: "Tea Tree Gully Tennis Club",
    short: "TTG",
    dates: "Mar 2024 — Jun 2026",
    description:
      "I coach juniors and adults at all skill levels, both one-on-one and in groups. I plan each session, adjust my feedback to the player, and track their progress over time. It's made me good at explaining the same idea a few different ways until it clicks, and at keeping people motivated when they're finding it hard.",
    tags: ["Communication", "Mentoring", "Planning"],
  },
  {
    role: "Retail Assistant",
    org: "IGA Supermarkets",
    short: "IGA",
    dates: "Feb 2024 — Sep 2024",
    description:
      "Part-time customer service across two stores while studying full-time. Busy retail floor, steady standards, and a lot of practice juggling work and uni at the same time.",
    tags: ["Customer Service", "Teamwork"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-32">
      <SectionHeading
        number="04"
        title="Experience"
        caption="Where I've led and worked"
      />
      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card
            key={exp.role + exp.org}
            className="glass-panel p-6 hover:border-white/25 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {/* Org monogram badge — consistent across all roles */}
              <div className="size-12 shrink-0 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-blue/10 border border-white/10 flex items-center justify-center">
                <span className="font-mono text-sm font-bold text-accent-gold tracking-tight">
                  {exp.short}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-white/50 uppercase tracking-wider mb-1">
                  {exp.dates}
                </p>
                <h3 className="text-lg font-bold text-white group-hover:text-accent-gold transition-colors">
                  {exp.role}, {exp.org}
                </h3>
                <p className="mt-3 text-base text-white/75 leading-relaxed">
                  {exp.description}
                </p>

                {exp.stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-5 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    {exp.stats.map((s) => (
                      <div
                        key={s.label}
                        className="bg-card/60 px-4 py-4 text-center"
                      >
                        <p className="text-xl md:text-2xl font-bold text-accent-gold leading-tight tabular-nums">
                          {s.text ? (
                            s.text
                          ) : (
                            <CountUp
                              value={s.value}
                              prefix={s.prefix}
                              suffix={s.suffix}
                            />
                          )}
                        </p>
                        <p className="font-mono text-[10px] text-white/55 uppercase tracking-wider mt-1">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-accent-gold/10 text-accent-gold/90 border border-accent-gold/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}