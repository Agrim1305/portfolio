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
    title: "I don't ship code I can't explain",
    body: "Every line in my projects is one I can walk through and defend. If I lean on a tool to generate something, I read it, understand it, and rewrite the parts I'd be embarrassed to explain in a review. The point isn't speed — it's owning what I put my name on.",
  },
  {
    n: "02",
    title: "Deploy on day one, not at the end",
    body: "I put projects online the day I start them, broken and ugly, then iterate in public. A thing that's live and rough teaches me more in a week than a thing that's perfect in my head. Shipping early surfaces the real problems while they're still cheap to fix.",
  },
  {
    n: "03",
    title: "Good software is decisions the next person can live with",
    body: "The hardest part of building MetaPlay wasn't the stack — it was choosing structures someone else could pick up six months later without cursing me. I optimise for the maintainer, not for cleverness. Boring and legible beats clever and brittle.",
  },
  {
    n: "04",
    title: "One thing at a time, to real users",
    body: "I'd rather finish one project people actually use than juggle five half-built ones. New ideas go in a backlog, not the current sprint. Focus is a discipline I learned losing tennis matches by trying to win every point at once.",
  },
];

export function HowIWork() {
  return (
    <section id="how-i-work" className="py-32">
      <SectionHeading
        number="06"
        title="How I Work"
        caption="The rules I hold myself to"
      />
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
        {principles.map((p, i) => (
          <FadeIn key={p.n} delay={i * 90} direction={i % 2 === 0 ? "left" : "right"}>
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