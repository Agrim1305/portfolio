import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

type Certification = {
  title: string;
  issuer: string;
  date: string;
};

const certifications: Certification[] = [
  { title: "Deloitte Australia — Technology Job Simulation", issuer: "Forage", date: "May 2026" },
  { title: "Deloitte Australia — Data Analytics Job Simulation", issuer: "Forage", date: "May 2026" },
  { title: "Datacom — Partnering with AI in the Workplace", issuer: "Datacom", date: "May 2026" },
  { title: "Career Access Mentoring Program", issuer: "Adelaide University", date: "September 2025" },
];

export function Certifications() {
  return (
    <section id="certifications" className="py-32">
      <SectionHeading number="05" title="Certifications" caption="Credentials · industry simulations" />
      <div className="grid md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <Card key={cert.title} className="glass-panel p-6 hover:border-accent-blue/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-lg bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center shrink-0">
                <Award className="size-5 text-accent-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold leading-tight text-white">{cert.title}</h3>
                <p className="text-sm text-white/70 mt-1">{cert.issuer}</p>
                <p className="font-mono text-xs text-accent-gold mt-2 tracking-wider">{cert.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}