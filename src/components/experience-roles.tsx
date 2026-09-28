"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { openStory } from "@/components/leadership-story";

type Role = {
  role: string;
  org: string;
  dates: string;
  description: string;
  /** Opens a longer story. Only entries that have one get the button. */
  story?: () => void;
};

const roles: Role[] = [
  {
    role: "Software Engineering Intern, Voice AI",
    org: "Aurivox · Viemo Capital & Consulting",
    dates: "Aug 2026 to Nov 2026",
    description:
      "Chosen as one of four interns from eleven shortlisted students for a 50-day placement with a startup building a voice AI product. I work across the speech-to-text, language model and text-to-speech stack of a voice-first meeting assistant, reporting to the founder and taking an open brief through to a working prototype. It is the first time I have shipped AI features against a founder's brief rather than a marking rubric.",
  },
  {
    role: "President",
    org: "Adelaide University Tennis Club",
    dates: "Jul 2024 to Mar 2026",
    description:
      "Led the club revival covered above: merger, constitution, committee, grants, and the award.",
    story: openStory,
  },
  {
    role: "Assistant Head Coach",
    org: "Adelaide Rising Stars Tennis Academy",
    dates: "Mar 2024 to Present",
    description:
      "I coach 10+ sessions a week at Tea Tree Gully Tennis Club for more than fifty clients, from juniors to adults, one-on-one and in groups. I run junior and performance squads of up to thirty players in a two-hour block, setting the drill plan and directing assistant coaches across four courts. It has made me good at explaining the same idea a few different ways until it clicks, and at keeping a big group moving on one plan.",
  },
  {
    role: "Retail Assistant",
    org: "IGA Supermarkets",
    dates: "Feb 2024 to Oct 2024",
    description:
      "Part-time customer service across two stores while studying full-time. Busy retail floor, steady standards, and a lot of practice juggling work and study at the same time.",
  },
];

// "Aurivox · Viemo Capital" reads as AV, "Adelaide Rising Stars" as AR.
const monogram = (org: string) =>
  org
    .replace("·", "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

// The description's own sentences, word for word, one bullet each.
const sentences = (text: string) => text.split(/(?<=\.)\s+/);

/* One tab per role: rows on desktop (hover or focus to preview), chips on
   mobile. Arrow keys move between them. Every panel stays in the page, the
   inactive ones hidden, so all the text is always there. */
export function ExperienceRoles() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent) {
    const last = roles.length - 1;
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? active === last ? 0 : active + 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? active === 0 ? last : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (to === null) return;
    e.preventDefault();
    setActive(to);
    tabs.current[to]?.focus();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:items-start lg:gap-[60px]">
      <div
        role="tablist"
        aria-label="Roles"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b lg:border-hairline lg:p-0 [&::-webkit-scrollbar]:hidden"
      >
        {roles.map((r, i) => {
          const on = i === active;
          return (
            <button
              key={r.org}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`role-tab-${i}`}
              aria-selected={on}
              aria-controls={`role-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
              className={`group relative h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-300 lg:grid lg:h-auto lg:min-h-[104px] lg:grid-cols-[140px_minmax(0,1fr)_28px] lg:items-center lg:whitespace-normal lg:rounded-none lg:border-0 lg:border-t lg:border-hairline lg:py-4 lg:pl-6 lg:pr-3 lg:text-left lg:hover:bg-ink/[0.04] ${
                on
                  ? "border-ink bg-ink text-paper lg:bg-transparent lg:text-ink"
                  : "border-ink/20 text-ink-soft hover:border-accent lg:text-ink-faint"
              }`}
            >
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 hidden h-[52px] w-[3px] -translate-y-1/2 rounded-full transition-colors duration-300 lg:block ${
                  on ? "bg-accent" : "bg-transparent"
                }`}
              />
              <span className={`hidden font-mono text-[13px] lg:block ${on ? "text-accent" : ""}`}>
                {r.dates}
              </span>
              <span className="lg:flex lg:flex-col lg:gap-1.5">
                <span className="lg:font-display lg:text-2xl lg:font-bold lg:leading-[1.1]">
                  {r.org.split(" · ")[0]}
                  <span className="hidden lg:inline">
                    {r.org.includes(" · ") && ` · ${r.org.split(" · ")[1]}`}
                  </span>
                </span>
                <span className={`hidden text-[15px] font-normal lg:block ${on ? "text-ink-soft" : ""}`}>
                  {r.role}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className={`hidden size-5 transition-[translate,color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
                  on ? "translate-x-1.5 text-accent" : ""
                }`}
              />
            </button>
          );
        })}
      </div>

      {roles.map((r, i) => (
        <article
          key={r.org}
          role="tabpanel"
          id={`role-panel-${i}`}
          aria-labelledby={`role-tab-${i}`}
          hidden={i !== active}
          className="role-panel relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_70%_at_100%_0%,rgb(255_91_46/0.22),rgb(255_91_46/0)_55%),var(--surface)] px-6 pb-6 pt-[26px] shadow-[0_30px_60px_rgb(0_0_0/0.45)] lg:min-h-[520px] lg:rounded-[28px] lg:px-11 lg:py-10"
        >
          <div className="flex items-center gap-3.5">
            <span
              aria-hidden
              className="flex size-[52px] shrink-0 items-center justify-center rounded-[14px] bg-accent font-display text-lg font-extrabold text-paper"
            >
              {monogram(r.org)}
            </span>
            <p className="flex min-w-0 flex-col gap-1 font-mono text-xs">
              <span className="text-ink-soft">{r.org}</span>
              <span className="text-ink-faint">{r.dates}</span>
            </p>
          </div>
          <h3 className="mt-6 font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink lg:mt-7 lg:max-w-[420px] lg:text-[38px]">
            {r.role}
          </h3>
          <ul className="mt-5 flex flex-col gap-3 lg:mt-6">
            {sentences(r.description).map((s) => (
              <li key={s} className="flex gap-3.5 text-base leading-relaxed text-[#D6D3CD] lg:text-[17px]">
                <span aria-hidden className="mt-[11px] size-1.5 shrink-0 rounded-full bg-accent lg:size-[7px]" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          {r.story && (
            <div className="mt-auto border-t border-dashed border-ink/20 pt-5 lg:flex lg:justify-end">
              <button
                type="button"
                data-expand
                onClick={r.story}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-accent bg-accent/10 px-5 text-[15px] font-semibold text-accent-soft transition-[background-color,color,transform] duration-250 hover:translate-x-[3px] hover:bg-accent hover:text-paper motion-reduce:hover:translate-x-0 lg:mt-0 lg:w-auto"
              >
                Read the full story
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
