import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { TechStrip } from "@/components/tech-strip";
import { Projects } from "@/components/projects";
import { Leadership } from "@/components/leadership";
import { Experience } from "@/components/experience";
import { Google } from "@/components/google";
import { Court } from "@/components/court";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { AskAgrim } from "@/components/ask-agrim";
import { Reveal } from "@/components/reveal";
import { Footer } from "@/components/footer";
import { journeyColours } from "@/lib/journey-colours";

export default async function Home() {
  const colours = await journeyColours();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TechStrip />
        <Projects />
        <Reveal>
          <Leadership />
        </Reveal>
        <Reveal>
          <Experience />
        </Reveal>
        <Reveal>
          <Google />
        </Reveal>
        <Reveal>
          <Court colours={colours} />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
      <AskAgrim heroId="top" />
    </>
  );
}
