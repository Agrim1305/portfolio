import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Contact() {
  return (
    <section id="contact" className="py-32">
      <div className="text-center max-w-3xl mx-auto">
        <p className="font-mono text-sm text-accent-gold uppercase tracking-[0.25em] mb-6">
          Let&apos;s build something
        </p>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.0]">
          Get in Touch<span className="text-accent-gold">.</span>
        </h2>
        <p className="mt-8 text-lg md:text-xl text-white/75 leading-relaxed">
          I&apos;m looking for graduate and internship roles in software
          engineering, AI, data, and analytics. Email is the best way to reach
          me. I&apos;m based in Adelaide and happy to
          relocate within Australia.
        </p>
        <p className="mt-4 text-sm text-white/55 leading-relaxed font-mono">
          Full working rights from 15 December 2026 · eligible for a Temporary
          Graduate visa (subclass 485) with multi-year work rights.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Button
            asChild
            className="h-13 px-8 text-sm font-bold uppercase tracking-wider bg-accent-gold hover:bg-accent-gold/90 text-background shadow-lg shadow-accent-gold/20 hover:scale-[1.02] transition-all"
          >
            <a href="mailto:agrimsh22@gmail.com">
              <Send className="size-4" />
              Send Email
            </a>
          </Button>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Agrim1305"
              target="_blank"
              rel="noopener noreferrer"
              className="size-13 rounded-lg bg-white/5 border border-white/10 hover:border-accent-gold/40 hover:bg-accent-gold/5 flex items-center justify-center text-white/70 hover:text-accent-gold transition-all"
              aria-label="GitHub"
            >
              <FaGithub className="size-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/agrim-sharma-821788302/"
              target="_blank"
              rel="noopener noreferrer"
              className="size-13 rounded-lg bg-white/5 border border-white/10 hover:border-accent-gold/40 hover:bg-accent-gold/5 flex items-center justify-center text-white/70 hover:text-accent-gold transition-all"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}