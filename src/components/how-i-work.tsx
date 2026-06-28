import { SectionHeading } from "@/components/section-heading";
import { FadeIn } from "@/components/fade-in";

type Principle = {
  n: string;
  title: string;
  body: string;
};

const principles: Principle[] = [
  {
    n: "01",
    title: "I understand the code I write",
    body: "I can walk through any line in my projects and explain why it's there. When I use a library or a tool to move faster, I make sure I know how it works before it goes in. That way I can fix it when it breaks and answer for it in a review.",
  },
  {
    n: "02",
    title: "I ship, then improve",
    body: "I get a working version live early and refine it from there. Real feedback from a deployed product tells me more than guessing on a whiteboard. It also means there's always something to show, not just something in progress.",
  },
  {
    n: "03",
    title: "I write code other people can read",
    body: "Most code gets read far more often than it gets written. I keep mine clear and predictable so the next person, including future me, can pick it up without a guide. Clever code that nobody understands is a liability, not a flex.",
  },
  {
    n: "04",
    title: "I communicate before I'm asked",
    body: "I flag blockers early, ask questions when something's unclear, and keep the people around me in the loop. Leading a club and coaching taught me that most problems are easier to solve when you raise them before they grow.",
  },
  {
    n: "05",
    title: "I focus on the problem, not the tech",
    body: "The goal is to solve the actual problem in front of the user, not to chase the newest framework. I pick tools that fit the job and the team, and I'm happy to learn whatever a project needs.",
  },
  {
    n: "06",
    title: "I take ownership",
    body: "If I build something, I see it through. That means testing it properly, handling the edge cases, and following up after it ships instead of moving on the moment it works on my machine.",
  },
];

export function HowIWork() {
  return (
    <section id="how-i-work" className="py-32">
      <SectionHeading
        number="06"
        title="How I Work"
        caption="What I bring to a team"
      />
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
        {principles.map((p, i) => (
          <FadeIn key={p.n} delay={i * 80} direction={i % 2 === 0 ? "left" : "right"}>
            <div className="relative pl-6 border-l-2 border-accent-gold/30">
              <span className="absolute -left-[2px] top-0 h-8 w-[2px] bg-accent-gold" />
              <span className="font-mono text-xs text-accent-gold/70 tracking-wider">
                {p.n}
              </span>
              <h3 className="text-xl font-bold text-white mt-2 mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-base text-white/70 leading-relaxed">{p.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}