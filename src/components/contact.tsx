import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Based in Adelaide. Available from December 2026, or earlier for the right opportunity. Best reached by email.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="mailto:agrimsh22@gmail.com">
            <Mail className="size-4" />
            agrimsh22@gmail.com
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
      </div>
    </section>
  );
}