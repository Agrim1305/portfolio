import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24">
      <h2 className="lg:hidden text-2xl font-bold mb-6 font-mono uppercase tracking-widest text-accent-gold">Contact</h2>
      <Card className="glass-panel p-8">
        <h3 className="text-2xl font-bold text-white">Let&apos;s talk.</h3>
        <p className="mt-3 text-base text-white/80 leading-relaxed">
          I&apos;m looking for graduate and internship opportunities in software engineering, AI, data, and analytics. Best reached by email — I read everything and reply within a day. Based in Adelaide, open to relocating within Australia.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button asChild className="h-12 px-6 text-sm font-bold uppercase tracking-wider bg-accent-gold hover:bg-accent-gold/90 text-background shadow-lg shadow-accent-gold/20 hover:scale-[1.02] transition-all">
            <a href="mailto:agrimsh22@gmail.com">
              <Send className="size-4" />
              Send Email
            </a>
          </Button>
        </div>
      </Card>
    </section>
  );
}