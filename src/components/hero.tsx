import { Button } from "@/components/ui/button";
import { Mail, FileText, ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center py-20">
      <div className="space-y-10">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
            Available for graduate roles · 2026 / 2027
          </span>
        </div>

        <div className="space-y-6">
          <p className="font-mono text-sm text-muted-foreground">Hi, my name is</p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]">
            Agrim Sharma.
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] text-muted-foreground">
            I build software that sits between systems and people.
          </h2>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Final-year Computer Science student at Adelaide University, majoring in Artificial Intelligence. My focus is software engineering and AI, shaped as much by leading teams through hard transitions as by writing code.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild size="lg" className="h-12 px-6">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="size-4" />
              Resume
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-6">
            <a href="https://github.com/Agrim1305" target="_blank" rel="noopener noreferrer">
              <FaGithub className="size-4" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-6">
            <a href="https://www.linkedin.com/in/agrim-sharma-821788302/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="size-4" />
              LinkedIn
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-6">
            <a href="mailto:agrimsh22@gmail.com">
              <Mail className="size-4" />
              Email
            </a>
          </Button>
        </div>

        <div className="pt-12 flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <ArrowDown className="size-3 animate-bounce" />
          <span className="tracking-wider uppercase">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}