import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Code2, Trophy, GraduationCap } from "lucide-react";

const stats = [
  { icon: GraduationCap, label: "University", value: "Adelaide" },
  { icon: Code2, label: "Major", value: "CS (AI)" },
  { icon: Trophy, label: "Graduating", value: "Dec 2026" },
];

export function About() {
  return (
    <section id="about" className="py-32">
      <SectionHeading number="01" title="About" caption="Who I am · what I do" />

      <div className="grid md:grid-cols-3 gap-3 mb-12">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-md bg-muted flex items-center justify-center">
              <Icon className="size-5 text-foreground" />
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="text-base font-semibold">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
        <p>
          I solve problems that sit between systems and people. Figuring out where the boundaries should be, how to ship something that holds up under change, and how to bring others along with the decision. My focus is software engineering and AI, but the way I work is shaped as much by leading teams through hard transitions as it is by writing code.
        </p>
        <p>
          Tennis has shaped most of my life. I&apos;ve played for fifteen years, reached top 90 in India in the under-18 category, trained at the Rafa Nadal Academy in Spain, and competed in junior ITF tournaments across India, Nepal, and at the national level. For the last three years I&apos;ve been coaching at Tea Tree Gully Tennis Club.
        </p>
        <p>
          The project I&apos;m proudest of so far is MetaPlay, a game discovery platform I built end to end with secure authentication, role-based access, and live data flowing in from an external API. What I learned building it wasn&apos;t the stack. It was how much of good software is about making decisions the next person can live with.
        </p>
        <p>
          Right now I&apos;m building two more products: a tool that lets tennis coaches log sessions by talking instead of typing, and a receipt scanner that handles Australian GST automatically. After graduating, I&apos;m looking for graduate and internship opportunities in software engineering or AI and ML, with teams that prioritise engineering depth and problem-solving over ticket throughput.
        </p>
      </div>
    </section>
  );
}