import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Currently } from "@/components/currently";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Certifications } from "@/components/certifications";
import { HowIWork } from "@/components/how-i-work";
import { Awards } from "@/components/awards";
import { Contact } from "@/components/contact";
import { FadeIn } from "@/components/fade-in";
import { AskAgrim } from "@/components/ask-agrim";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 lg:px-8 pt-24 sm:pt-28">
        <Hero />
        <FadeIn direction="up"><About /></FadeIn>
        <FadeIn direction="up"><Currently /></FadeIn>
        <Projects />
        <FadeIn direction="up"><Experience /></FadeIn>
        <FadeIn direction="up"><Certifications /></FadeIn>
        <FadeIn direction="up"><HowIWork /></FadeIn>
        <Awards />
        <FadeIn direction="up"><Contact /></FadeIn>
      </main>
      <footer className="mx-auto max-w-6xl px-6 lg:px-8 border-t border-white/10 mt-12">
        <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm text-white/60">
          <span>© 2026 Agrim Sharma</span>
          <span className="font-mono text-xs tracking-wider">Built with Next.js · Deployed on Vercel</span>
        </div>
      </footer>
      <AskAgrim />
    </>
  );
}