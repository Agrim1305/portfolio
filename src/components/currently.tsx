import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

type Item = {
  title: string;
  description: string;
  status: string;
};

const items: Item[] = [
  {
    title: "Sydney Humanitarian AI Hackathon",
    status: "Participating",
    description: "Joining a 48-hour build focused on applying AI to humanitarian challenges. Looking to collaborate with engineers and domain experts on something useful.",
  },
  {
    title: "Big 4 graduate applications",
    status: "Submitting July 2026",
    description: "Applying to Deloitte, KPMG, PwC, and EY graduate programs for the 2027 intake across software, data, and analytics streams.",
  },
  {
    title: "Microsoft Azure certification",
    status: "In progress",
    description: "Working through AZ-900 to round out cloud fundamentals alongside the AI specialisation.",
  },
];

export function Currently() {
  return (
    <section id="currently" className="py-32">
      <SectionHeading number="02" title="Currently" caption="What I'm working on right now" />
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.title} className="p-6 space-y-3 hover:border-foreground/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <Sparkles className="size-5 text-muted-foreground shrink-0" />
              <Badge variant="secondary" className="font-mono text-[10px]">{item.status}</Badge>
            </div>
            <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}