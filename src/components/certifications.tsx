import { SectionHeading } from "@/components/section-heading";
import { FadeIn } from "@/components/fade-in";
import { BadgeCheck } from "lucide-react";

type Cert = {
  name: string;
  issuer: string;
  year: string;
  skills: string[];
};

const certs: Cert[] = [
  {
    name: "Technology Job Simulation",
    issuer: "Deloitte Australia",
    year: "2025",
    skills: ["Coding", "Development", "Dev Tools"],
  },
  {
    name: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia",
    year: "2025",
    skills: ["Data Analysis", "Tableau", "Forensic Tech"],
  },
  {
    name: "Partnering with AI in the Workplace",
    issuer: "Datacom",
    year: "2025",
    skills: ["Applied AI", "Workflow Design"],
  },
  {
    name: "Career Access Mentoring Program",
    issuer: "Adelaide University",
    year: "2025",
    skills: ["Industry Mentoring", "Professional Skills"],
  },
];

export function Certifications() {
  return (
    <section id="certifications" className="py-32">
      <SectionHeading
        number="05"
        title="Certifications"
        caption="Simulations & programs completed"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {certs.map((cert, i) => (
          <FadeIn key={cert.name} delay={i * 80} direction={i % 2 === 0 ? "left" : "right"}>
            <div className="group relative overflow-hidden glass-panel rounded-xl p-5 h-full hover:border-accent-gold/40 transition-colors">
              {/* Accent bar — grows across the bottom on hover (matches About) */}
              <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent-gold transition-transform duration-500 ease-out group-hover:scale-x-100" />

              <div className="flex items-start gap-3">
                <BadgeCheck className="size-5 text-accent-gold shrink-0 mt-0.5 transition-transform duration-500 group-hover:scale-110" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">
                      {cert.issuer}
                    </p>
                    <span className="font-mono text-[10px] text-white/45 shrink-0">
                      {cert.year}
                    </span>
                  </div>
                  <p className="text-base text-white/80 mt-0.5">{cert.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-accent-blue/10 text-accent-blue/80 border border-accent-blue/15"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}