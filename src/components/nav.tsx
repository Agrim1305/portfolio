"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { Sheet } from "@/components/sheet";
import { openAsk } from "@/components/ask-agrim";
import { scrollToSection } from "@/lib/scroll-lock";

const sections = [
  { id: "projects", label: "Projects" },
  { id: "leadership", label: "Leadership" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function Wordmark() {
  return (
    <Link
      href="/#top"
      prefetch={false}
      aria-label="Agrim Sharma, back to top"
      className="flex min-h-11 items-center font-display text-xl font-extrabold tracking-tight text-ink"
    >
      agrim<span className="text-accent">.</span>
    </Link>
  );
}

export function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  // Section links point into the home page, so prefetching them (on by
  // default) would only re-download the page the visitor is already on.
  useEffect(() => {
    // Highlight the last section whose top has passed a line a third of the way
    // down the viewport. A plain scroll listener, since the browser pauses rAF
    // in background tabs.
    const update = () => {
      // Case study pages share this nav but have none of the home sections.
      if (!document.getElementById("projects")) return;
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

  // On the home page, close the menu first and scroll once the page unlocks.
  // Elsewhere the link navigates to the home page as normal.
  function goTo(e: React.MouseEvent, id: string) {
    const el = document.getElementById(id);
    setOpen(false);
    if (!el) return;
    e.preventDefault();
    requestAnimationFrame(() => scrollToSection(el));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/70 backdrop-blur-lg lg:border-0 lg:bg-transparent lg:bg-gradient-to-b lg:from-paper lg:via-paper/80 lg:to-transparent lg:backdrop-blur-none">
      <div className="wrap flex h-16 items-center justify-between gap-4 lg:h-24">
        <Wordmark />

        <nav
          aria-label="Sections"
          className="glass hidden h-14 items-center gap-0.5 rounded-full px-1.5 lg:flex"
        >
          {sections.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <Link
                key={id}
                href={`/#${id}`}
                prefetch={false}
                aria-current={isActive ? "true" : undefined}
                className={`flex h-11 items-center rounded-full px-[18px] text-[15px] transition-colors duration-300 ${
                  isActive
                    ? "bg-ink font-medium text-paper"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="lift flex h-11 items-center rounded-full border border-ink/20 px-4 text-sm text-ink lg:glass lg:h-[52px] lg:px-6 lg:text-[15px] lg:font-medium"
          >
            Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex size-11 flex-col items-center justify-center gap-[5px] rounded-full bg-ink lg:hidden"
          >
            <span className="h-0.5 w-[18px] rounded-full bg-paper" />
            <span className="h-0.5 w-[18px] rounded-full bg-paper" />
          </button>
        </div>
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        label="Menu"
        className="h-dvh w-full border-0 bg-paper"
      >
        <div className="flex h-full flex-col px-5 pb-8 pt-3">
          <div className="flex h-[52px] items-center justify-between">
            <span className="font-display text-xl font-extrabold tracking-tight">
              agrim<span className="text-accent">.</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex size-11 items-center justify-center rounded-full border border-ink/20 text-ink"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Sections" className="mt-9 flex flex-col">
            {sections.map(({ id, label }) => (
              <Link
                key={id}
                href={`/#${id}`}
                prefetch={false}
                onClick={(e) => goTo(e, id)}
                aria-current={active === id ? "true" : undefined}
                className="border-b border-hairline py-3.5 font-display text-[44px] font-extrabold leading-tight tracking-[-0.035em] text-ink transition-colors active:text-accent aria-[current=true]:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openAsk();
            }}
            className="glass mt-auto flex h-[58px] items-center gap-3 rounded-2xl px-[18px] text-left text-base text-ink-soft"
          >
            <Sparkles className="size-4 text-accent" aria-hidden />
            Ask AI about Agrim
          </button>
        </div>
      </Sheet>
    </header>
  );
}
