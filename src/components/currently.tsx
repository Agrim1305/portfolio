import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Cloud } from "lucide-react";

type Item = {
  title: string;
  description: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  {
    title: "Sydney Humanitarian AI Hackathon",
    status: "Participating",
    icon: Sparkles,
    description: "A 48-hour hackathon building AI tools for humanitarian problems. I am joining to work with other engineers and learn from people who know the problem space.",
  },
  {
    title: "Microsoft Azure AZ-900",
    status: "In progress",
    icon: Cloud,
    description: "Studying cloud fundamentals so I can work confidently with Azure alongside my AI coursework.",
  },
];

export function Currently() {
  return (
    <section id="currently" className="py-32">
      <SectionHeading number="02" title="Currently" caption="What I'm working on right now" />
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="glass-panel p-6 space-y-4 hover:border-accent-gold/40 transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between gap-3">
                <div className="size-11 rounded-lg bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center">
                  <Icon className="size-5 text-accent-gold" />
                </div>
                <Badge variant="outline" className="font-mono text-[10px] border-white/15 text-white/70">{item.status}</Badge>
              </div>
              <h3 className="text-lg font-bold leading-tight text-white">{item.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}