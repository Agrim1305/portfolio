"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "About", num: "01" },
  { id: "currently", label: "Currently", num: "02" },
  { id: "projects", label: "Projects", num: "03" },
  { id: "experience", label: "Experience", num: "04" },
  { id: "certifications", label: "Certifications", num: "05" },
  { id: "awards", label: "Awards", num: "06" },
  { id: "contact", label: "Contact", num: "07" },
];

export function Nav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-semibold text-base tracking-tight">
          Agrim Sharma
        </Link>
        <div className="hidden lg:flex items-center gap-7 text-sm">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`relative transition-colors ${
                active === id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {active === id && (
                <span className="absolute -bottom-[26px] left-0 right-0 h-px bg-foreground" />
              )}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}