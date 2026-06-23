import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <footer className="mx-auto max-w-3xl px-6 py-12 text-sm text-muted-foreground">
        © 2026 Agrim Sharma
      </footer>
    </>
  );
}