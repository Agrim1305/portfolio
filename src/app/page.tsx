import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Currently } from "@/components/currently";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Certifications } from "@/components/certifications";
import { Awards } from "@/components/awards";
import { Contact } from "@/components/contact";
import { FadeIn } from "@/components/fade-in";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6">
        <Hero />
        <FadeIn><About /></FadeIn>
        <FadeIn><Currently /></FadeIn>
        <FadeIn><Projects /></FadeIn>
        <FadeIn><Experience /></FadeIn>
        <FadeIn><Certifications /></FadeIn>
        <FadeIn><Awards /></FadeIn>
        <FadeIn><Contact /></FadeIn>
      </main>
      <footer className="border-t border-border/60 mt-12">
        <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>© 2026 Agrim Sharma</span>
          <span className="font-mono text-xs tracking-wider">Built with Next.js · Deployed on Vercel</span>
        </div>
      </footer>
    </>
  );
}