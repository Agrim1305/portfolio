import { Card } from "@/components/ui/card";
import { Code2, Trophy, GraduationCap, MapPin } from "lucide-react";

const stats = [
  { icon: GraduationCap, label: "University", value: "Adelaide University" },
  { icon: Code2, label: "Major", value: "Computer Science (AI)" },
  { icon: Trophy, label: "Graduating", value: "Dec 2026" },
  { icon: MapPin, label: "Based in", value: "Adelaide, AU" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24">
      <h2 className="lg:hidden text-2xl font-bold text-white mb-6 font-mono uppercase tracking-widest text-accent-gold">About</h2>
      <div className="space-y-5 text-lg text-white/80 leading-relaxed">
        <p>
          I solve problems that sit between systems and people. Figuring out where the boundaries should be, how to ship something that holds up under change, and how to bring others along with the decision. My focus is software engineering and AI, but the way I work is shaped as much by leading teams through hard transitions as by writing code.
        </p>
        <p>
          Tennis has shaped most of my life. I&apos;ve played for fifteen years, reached{" "}
          <span className="text-accent-gold font-semibold">top 90 in India</span>{" "}
          in the under-18 category, trained at the Rafa Nadal Academy in Spain, and competed in junior ITF tournaments across India, Nepal, and at the national level. For the last three years I&apos;ve been coaching at Tea Tree Gully Tennis Club.
        </p>
        <p>
          The project I&apos;m proudest of so far is <span className="text-white font-semibold">MetaPlay</span>, a game discovery platform I built end to end with secure authentication, role-based access, and live data from an external API. What I learned building it wasn&apos;t the stack. It was how much of good software is about making decisions the next person can live with.
        </p>
        <p>
          Right now I&apos;m building two more products: a tool that lets tennis coaches log sessions by talking instead of typing, and a receipt scanner that handles Australian GST automatically. I&apos;m looking for graduate and internship roles in <span className="text-white font-semibold">software engineering, AI, data, and analytics</span>.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="glass-panel p-4 flex items-center gap-3 hover:border-accent-gold/40 transition-colors">
            <div className="size-9 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center shrink-0">
              <Icon className="size-4 text-accent-gold" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] text-white/60 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-white truncate">{value}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}