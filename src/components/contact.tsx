import { Button } from "@/components/ui/button";
import { Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export function Contact() {
  return (
    <section id="contact" className="py-32">
      <SectionHeading number="07" title="Get in touch" caption="Let's talk" />
      <Card className="p-8 md:p-12">
        <div className="space-y-8 max-w-2xl">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            I&apos;m exploring graduate and internship opportunities in software engineering and AI, with teams that prioritise engineering depth over ticket throughput. Best reached by email — I read everything and reply within a day.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <span>Based in Adelaide · Open to relocating within Australia</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6">
              <a href="mailto:agrimsh22@gmail.com">
                <Mail className="size-4" />
                agrimsh22@gmail.com
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
          </div>
        </div>
      </Card>
    </section>
  );
}