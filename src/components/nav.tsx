"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "awards", label: "Beyond Code" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string>("");

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

  return (
    <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-3 pointer-events-none">
      <nav className="pointer-events-auto max-w-[calc(100vw-1.5rem)]">
        <div
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2 sm:py-2.5 rounded-full shadow-2xl shadow-black/50 border border-white/10 backdrop-blur-2xl overflow-x-auto scrollbar-none"
          style={{ background: "hsl(220 25% 8% / 0.92)" }}
        >
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`group relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors duration-200 whitespace-nowrap ${
                active === id ? "text-accent-gold" : "text-white/70 hover:text-white"
              }`}
            >
              <span className="relative z-10">{label}</span>
              <span
                className={`absolute inset-0 rounded-full bg-white/[0.08] transition-all duration-200 ease-out ${
                  active === id
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                }`}
              />
            </a>
          ))}

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 sm:ml-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold bg-accent-gold/20 border border-accent-gold/40 text-accent-gold hover:bg-accent-gold/30 transition-all whitespace-nowrap"
          >
            Resume
          </a>
        </div>
      </nav>
    </div>
  );
}