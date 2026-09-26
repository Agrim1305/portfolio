import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
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
      <Footer />
      <AskAgrim />
    </>
  );
}
