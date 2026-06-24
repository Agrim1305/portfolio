import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, FileText, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Hero() {
    return (
        <section id="hero" className="min-h-[calc(100vh-80px)] flex items-center py-16">
            <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-start w-full">
                <div className="space-y-10 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-60 animate-ping" />
                            <span className="relative inline-flex size-2 rounded-full bg-accent-gold" />
                        </span>
                        <span className="font-mono text-xs text-white/85 tracking-wider uppercase">
                            Available for 2027 Graduate Roles
                        </span>
                    </div>

                    <div className="space-y-6">
                        <p className="font-mono text-sm text-accent-gold uppercase tracking-[0.25em] font-semibold">
                            Hi, my name is
                        </p>
                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-white">
                            Agrim Sharma<span className="text-accent-gold">.</span>
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-[1.15] text-white/55 max-w-2xl">
                            I build software that sits between systems and people.
                        </h2>
                    </div>

                    <div className="space-y-5 text-lg text-white/85 leading-relaxed max-w-2xl">
                        <p>
                            Final-year Computer Science student at Adelaide University, majoring in Artificial Intelligence and graduating December 2026. My focus is software engineering and applied AI, shaped as much by leading teams through hard transitions as by writing code.
                        </p>
                        <p>
                            I&apos;ve shipped a full-stack game discovery platform, rebuilt a dormant tennis club to Club of the Year in eighteen months, and I&apos;m currently building two products for small operators I&apos;ve actually met. Looking for graduate and internship roles in <span className="text-white font-semibold">software engineering, AI, data, and analytics</span>.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                            asChild
                            className="h-13 px-7 text-sm font-bold uppercase tracking-wider bg-accent-gold hover:bg-accent-gold/90 text-background shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40 hover:scale-[1.02] transition-all"
                        >
                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                                <FileText className="size-4" />
                                Download Resume
                            </a>
                        </Button>
                        <Button
                            asChild
                            className="h-13 px-7 text-sm font-bold uppercase tracking-wider border border-white/20 bg-white/5 text-white hover:border-accent-gold/60 hover:bg-accent-gold/5 hover:text-accent-gold transition-all"
                        >
                            <a href="#contact">
                                <Send className="size-4" />
                                Get in Touch
                            </a>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <a href="https://github.com/Agrim1305" target="_blank" rel="noopener noreferrer" className="size-11 rounded-lg bg-white/5 border border-white/10 hover:border-accent-gold/40 hover:bg-accent-gold/5 flex items-center justify-center text-white/70 hover:text-accent-gold transition-all" aria-label="GitHub">
                            <FaGithub className="size-5" />
                        </a>
                        <a href="https://www.linkedin.com/in/agrim-sharma-821788302/" target="_blank" rel="noopener noreferrer" className="size-11 rounded-lg bg-white/5 border border-white/10 hover:border-accent-gold/40 hover:bg-accent-gold/5 flex items-center justify-center text-white/70 hover:text-accent-gold transition-all" aria-label="LinkedIn">
                            <FaLinkedin className="size-5" />
                        </a>
                        <a href="mailto:agrimsh22@gmail.com" className="size-11 rounded-lg bg-white/5 border border-white/10 hover:border-accent-gold/40 hover:bg-accent-gold/5 flex items-center justify-center text-white/70 hover:text-accent-gold transition-all" aria-label="Email">
                            <Mail className="size-5" />
                        </a>
                    </div>
                </div>

                <div className="order-1 lg:order-2 flex justify-center lg:justify-end lg:pt-4">
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-accent-gold/30 via-accent-blue/20 to-transparent blur-2xl" />
                        <div className="relative size-48 md:size-64 rounded-full overflow-hidden border-2 border-white/15">
                            <Image
                                src="/headshot.jpg"
                                alt="Agrim Sharma"
                                fill
                                sizes="(max-width: 768px) 192px, 256px"
                                className="object-cover object-top"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}