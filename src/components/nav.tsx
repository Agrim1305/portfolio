"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "awards", label: "Beyond Code" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      observer.observe(element);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-nav">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-8">
          <Link
            href="/"
            className="size-11 shrink-0 rounded-xl bg-gradient-to-br from-accent-gold/30 to-accent-blue/20 border border-white/15 flex items-center justify-center font-mono text-sm font-bold text-white hover:border-accent-gold/60 hover:scale-105 transition-all"
            aria-label="Home"
          >
            AS
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {sections.map(({ id, label }) => (
              <Link
                key={id}
                href={`#${id}`}
                className={`group relative px-4 lg:px-5 py-2.5 rounded-xl text-base font-medium transition-colors duration-200 ${
                  active === id ? "text-accent-gold" : "text-white/65 hover:text-white"
                }`}
              >
                <span className="relative z-10">{label}</span>
                <span
                  className={`absolute inset-0 rounded-xl bg-white/[0.06] border border-white/[0.06] transition-all duration-200 ease-out ${
                    active === id
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                />
                <span
                  className={`absolute -bottom-px left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-to-r from-accent-gold/0 via-accent-gold to-accent-gold/0 transition-all duration-300 ${
                    active === id ? "w-10 opacity-100" : "w-0 opacity-0 group-hover:w-10 group-hover:opacity-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex shrink-0 px-5 py-2.5 rounded-xl text-base font-semibold bg-accent-gold/15 border border-accent-gold/40 text-accent-gold hover:bg-accent-gold/25 hover:scale-105 transition-all"
          >
            Resume
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6">
          <nav className="space-y-2">
            {sections.map(({ id, label }) => (
              <Link
                key={id}
                href={`#${id}`}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-4 rounded-lg text-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                {label}
              </Link>
            ))}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-4 rounded-lg text-lg font-semibold text-accent-gold bg-accent-gold/10 border border-accent-gold/30 mt-4"
            >
              Resume →
            </a>
          </nav>
        </div>
      )}
    </>
  );
}