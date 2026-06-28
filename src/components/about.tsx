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
      <h2 className="lg:hidden text-2xl font-bold text-white mb-6 font-mono uppercase tracking-widest text-accent-gold">
        About
      </h2>
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-12 items-start">
        <div className="space-y-5 text-lg text-white/80 leading-relaxed">
          <p>
            I&apos;m a final-year Computer Science student at the University of Adelaide, majoring in AI and graduating in December 2026. I focus on full-stack web development, and I like building things that real people end up using.
          </p>
          <p>
            I&apos;ve played tennis for fifteen years. I reached a top 90 national ranking in India at under-18 level, trained at the Rafa Nadal Academy in Spain, and competed in junior ITF tournaments across India and Nepal. For the last three years I&apos;ve coached players of all ages at Tea Tree Gully Tennis Club in Adelaide.
          </p>
          <p>
            My main project so far is <span className="text-white font-semibold">MetaPlay</span>, a full-stack web app where people can search, track, and review games. I built it end to end, including the database, the login system with Google sign-in, and an admin area, and I deployed it so anyone can use it.
          </p>
          <p>
            Right now I&apos;m building two more products: a tool that lets tennis coaches log sessions by voice instead of typing, and a receipt scanner that sorts out Australian GST automatically. I&apos;m looking for graduate and internship roles in <span className="text-white font-semibold">software engineering, AI, data, and analytics</span>.
          </p>
        </div>

        {/* Tight 2×2 stat grid with hover accent bar */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-xl glass-panel p-4 hover:border-accent-gold/40 transition-colors"
            >
              {/* Accent bar — grows up from the bottom on hover */}
              <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent-gold transition-transform duration-500 ease-out group-hover:scale-x-100" />

              <div className="flex items-center gap-2 mb-3">
                <Icon className="size-4 text-accent-gold transition-transform duration-500 group-hover:scale-110" />
                <span className="font-mono text-[10px] text-white/55 uppercase tracking-wider">
                  {label}
                </span>
              </div>
              <p className="text-sm md:text-base font-bold text-white leading-snug group-hover:text-accent-gold transition-colors">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}