import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { TechStrip } from "@/components/tech-strip";
import { Projects } from "@/components/projects";
import { Leadership } from "@/components/leadership";
import { Experience } from "@/components/experience";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { AskAgrim } from "@/components/ask-agrim";
import { Reveal } from "@/components/reveal";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TechStrip />
        <Projects />
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
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
        </div>
      </main>
      <Footer />
      <AskAgrim heroId="top" />
    </>
  );
}
