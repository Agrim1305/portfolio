import { Button } from "@/components/ui/button";
import { Mail, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center">
      <div className="space-y-8">
        <div className="size-20 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground">
          AS
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Agrim Sharma
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Final-year Computer Science student at the University of Adelaide, majoring in Artificial Intelligence. Building AI products for small businesses, coaching tennis on the side. Open to graduate roles in software, data, analytics, and applied AI.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="size-4" />
              Resume
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://github.com/Agrim1305" target="_blank" rel="noopener noreferrer">
              <FaGithub className="size-4" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://www.linkedin.com/in/agrim-sharma-821788302/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="size-4" />
              LinkedIn
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="mailto:agrimsh22@gmail.com">
              <Mail className="size-4" />
              Email
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}