import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Leadership } from "@/components/leadership";
import { Experience } from "@/components/experience";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { AskAgrim } from "@/components/ask-agrim";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-5 sm:px-8">
        <Hero />
        <Reveal>
          <Projects />
        </Reveal>
        <Reveal>
          <Leadership />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <footer>
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-ink-faint">
          <span>© 2026 Agrim Sharma</span>
          <span className="font-mono text-xs">
            Built with Next.js · Deployed on Vercel
          </span>
        </div>
      </footer>
      <AskAgrim />
    </>
  );
}
