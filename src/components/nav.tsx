"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "projects", number: "01", label: "Projects" },
  { id: "leadership", number: "02", label: "Leadership" },
  { id: "experience", number: "03", label: "Experience" },
  { id: "about", number: "04", label: "About" },
  { id: "contact", number: "05", label: "Contact" },
];

function Brackets() {
  return (
    <>
      <span className="nav-bracket tl" aria-hidden />
      <span className="nav-bracket tr" aria-hidden />
      <span className="nav-bracket bl" aria-hidden />
      <span className="nav-bracket br" aria-hidden />
    </>
  );
}

/* The site mark, mirroring app/icon.svg (the favicon) so the logo is identical
   in the tab and on the page. */
function Logo() {
  return (
    <svg viewBox="0 0 64 64" className="size-10" aria-hidden>
      <defs>
        <linearGradient id="as-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1320" />
          <stop offset="100%" stopColor="#0d1420" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#as-logo-grad)" />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="12.5"
        fill="none"
        stroke="#e0b65c"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      <text
        x="32"
        y="33"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="34"
        fontWeight="700"
        fill="#e8bd5e"
        textAnchor="middle"
        dominantBaseline="central"
        letterSpacing="-1"
      >
        AS
      </text>
    </svg>
  );
}

export function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Highlight the last section whose top has passed a line a third of the way
    // down the viewport. A plain scroll listener, since the browser pauses rAF
    // in background tabs.
    const update = () => {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(sections[sections.length - 1].id);
        return;
      }
      const line = window.scrollY + window.innerHeight / 3;
      let current = "";
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= line) {
          current = id;
        }
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#top"
          aria-label="Agrim Sharma, back to top"
          className="inline-flex size-10 items-center justify-center rounded-[11px] transition-opacity hover:opacity-80"
        >
          <Logo />
        </a>

        {/* Desktop: numbered links with a bracket selection marker, Resume CTA */}
        <div className="hidden items-center gap-5 sm:flex">
          <nav className="flex items-center gap-1">
            {sections.map(({ id, number, label }) => {
              const isActive = active === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`nav-link relative px-3.5 py-2 text-sm transition-colors ${
                    isActive ? "text-accent" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Brackets />
                  <span className="inline-flex items-baseline gap-1.5">
                    <span
                      className={`font-mono text-[11px] ${
                        isActive ? "text-accent" : "text-ink-faint"
                      }`}
                    >
                      {number}
                    </span>
                    {label}
                  </span>
                </a>
              );
            })}
          </nav>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center rounded-md bg-accent px-5 text-sm font-semibold text-paper transition-colors hover:bg-accent/85"
          >
            Resume
          </a>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex size-11 items-center justify-center rounded-md text-ink sm:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="border-t border-hairline bg-paper px-5 pb-5 sm:hidden">
          {sections.map(({ id, number, label }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-baseline gap-2.5 border-b border-hairline py-3.5 text-base ${
                  isActive ? "text-accent" : "text-ink"
                }`}
              >
                <span
                  className={`font-mono text-[11px] ${
                    isActive ? "text-accent" : "text-ink-faint"
                  }`}
                >
                  {number}
                </span>
                {label}
              </a>
            );
          })}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-paper"
          >
            Resume
          </a>
        </nav>
      )}
    </header>
  );
}
