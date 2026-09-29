"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Sheet } from "@/components/sheet";
import { morphClose, morphOpen } from "@/lib/morph";
import { STORY_EVENT, awardPhoto, mergerStory, type Photo, type StoryRequest } from "@/lib/stories";

type Role = {
  /** Used in the story's address, #story-<id>. */
  id: string;
  role: string;
  org: string;
  dates: string;
  description: string;
  now?: boolean;
  /** Only where the description itself states the number. */
  stat?: { value: string; label: string };
  photos: Photo[];
  /** Told in beats instead of the description. */
  beats?: typeof mergerStory;
};

const roles: Role[] = [
  {
    id: "aurivox",
    role: "Software Engineering Intern, Voice AI",
    org: "Aurivox · Viemo Capital & Consulting",
    dates: "Aug 2026 to Nov 2026",
    description:
      "Chosen as one of four interns from eleven shortlisted students for a 50-day placement with a startup building a voice AI product. I work across the speech-to-text, language model and text-to-speech stack of a voice-first meeting assistant, reporting to the founder and taking an open brief through to a working prototype. It is the first time I have shipped AI features against a founder's brief rather than a marking rubric.",
    now: true,
    stat: { value: "1 of 4", label: "interns chosen from 11" },
    photos: [],
  },
  {
    id: "president",
    role: "President",
    org: "Adelaide University Tennis Club",
    dates: "Jul 2024 to Mar 2026",
    description:
      "Led the club revival covered above: merger, constitution, committee, grants, and the award.",
    stat: { value: "10 → 100+", label: "members" },
    photos: [awardPhoto],
    beats: mergerStory,
  },
  {
    id: "coaching",
    role: "Assistant Head Coach",
    org: "Adelaide Rising Stars Tennis Academy",
    dates: "Mar 2024 to Present",
    description:
      "I coach 10+ sessions a week at Tea Tree Gully Tennis Club for more than fifty clients, from juniors to adults, one-on-one and in groups. I run junior and performance squads of up to thirty players in a two-hour block, setting the drill plan and directing assistant coaches across four courts. It has made me good at explaining the same idea a few different ways until it clicks, and at keeping a big group moving on one plan.",
    now: true,
    stat: { value: "50+", label: "clients" },
    photos: [],
  },
  {
    id: "retail",
    role: "Retail Assistant",
    org: "IGA Supermarkets",
    dates: "Feb 2024 to Oct 2024",
    description:
      "Part-time customer service across two stores while studying full-time. Busy retail floor, steady standards, and a lot of practice juggling work and study at the same time.",
    photos: [],
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

const storyIndex = (hash: string) => roles.findIndex((r) => hash === `#story-${r.id}`);

function NowBadge() {
  return (
    <span className="flex h-[26px] items-center gap-1.5 rounded-full bg-accent/16 px-2.5 text-xs font-semibold text-accent-soft">
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      Now
    </span>
  );
}

/* Photos mounted as tilted prints, laid out for one to three of them. */
function Collage({ photos }: { photos: Photo[] }) {
  const tilts = ["rotate-[2deg]", "-rotate-[3deg]", "rotate-[4deg]"];
  return (
    <div className={`grid gap-5 ${photos.length > 1 ? "grid-cols-2" : ""}`}>
      {photos.slice(0, 3).map((p, i) => (
        <figure key={p.src} className={i === 0 && photos.length === 3 ? "col-span-2" : ""}>
          <div
            className={`relative aspect-[4/3] overflow-hidden rounded-[18px] border-[5px] border-ink shadow-[0_30px_60px_rgb(0_0_0/0.5)] ${tilts[i]}`}
          >
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" />
          </div>
          <figcaption className="mt-4 font-mono text-xs text-ink-muted">{p.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/* One tab per role: rows on desktop (hover or focus to preview), chips on
   mobile. Arrow keys move between them. Every panel stays in the page, the
   inactive ones hidden, so all the text is always there. "Read the full
   story" grows the card into the role's story, which has its own address
   (#story-<id>) so Back closes it and a shared link opens it. */
export function ExperienceRoles() {
  const [active, setActive] = useState(0);
  const [story, setStory] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  // The element the story grew out of, so it can shrink back into it.
  const source = useRef<HTMLElement | null>(null);
  // Whether the open story added a history entry that Back should undo.
  const pushed = useRef(false);
  const storyRef = useRef(story);
  useEffect(() => {
    storyRef.current = story;
  }, [story]);

  useEffect(() => {
    const shrink = () => {
      const current = storyRef.current;
      if (current === null) return;
      const into = source.current?.isConnected ? source.current : panels.current[current];
      morphClose(into, () => flushSync(() => setStory(null)));
    };
    const onPop = () => {
      const i = storyIndex(window.location.hash);
      pushed.current = i >= 0;
      if (i >= 0) setStory(i);
      else shrink();
    };
    const onOpen = (e: Event) => {
      const { id, from } = (e as CustomEvent<StoryRequest>).detail;
      const i = roles.findIndex((r) => r.id === id);
      window.history.pushState(null, "", `#story-${id}`);
      pushed.current = true;
      source.current = from;
      morphOpen(from, () => flushSync(() => setStory(i)));
    };
    // A shared #story-<id> link opens with that story showing, once the page
    // has hydrated.
    const frame = requestAnimationFrame(() => {
      const initial = storyIndex(window.location.hash);
      if (initial < 0) return;
      setActive(initial);
      setStory(initial);
    });
    window.addEventListener("popstate", onPop);
    window.addEventListener(STORY_EVENT, onOpen);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener(STORY_EVENT, onOpen);
    };
  }, []);

  function open(i: number) {
    window.dispatchEvent(
      new CustomEvent<StoryRequest>(STORY_EVENT, { detail: { id: roles[i].id, from: panels.current[i] } }),
    );
  }

  function close() {
    if (pushed.current) {
      pushed.current = false;
      window.history.back(); // the popstate handler shrinks the story away
      return;
    }
    // Opened from a shared link: drop the hash without leaving the page.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    const current = storyRef.current;
    if (current !== null) morphClose(panels.current[current], () => flushSync(() => setStory(null)));
  }

  function switchStory(i: number) {
    window.history.replaceState(null, "", `#story-${roles[i].id}`);
    source.current = null;
    setStory(i);
    setActive(i);
    bodyRef.current?.scrollTo({ top: 0 });
  }

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

  const current = story === null ? null : roles[story];
  const prev = story !== null && story > 0 ? story - 1 : null;
  const next = story !== null && story < roles.length - 1 ? story + 1 : null;

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
              key={r.id}
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

      {roles.map((r, i) => {
        const photo = r.photos[0];
        return (
          <article
            key={r.id}
            ref={(el) => {
              panels.current[i] = el;
            }}
            role="tabpanel"
            id={`role-panel-${i}`}
            aria-labelledby={`role-tab-${i}`}
            hidden={i !== active}
            className="role-panel relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_90%_at_100%_0%,rgb(255_91_46/0.22),rgb(255_91_46/0)_55%),var(--surface)] px-6 pb-6 pt-[26px] shadow-[0_40px_80px_rgb(0_0_0/0.45)] lg:min-h-[520px] lg:rounded-[28px] lg:px-11 lg:py-10"
          >
            {photo && (
              <div className="relative mb-6 aspect-[4/3] w-40 rotate-[4deg] overflow-hidden rounded-[22px] border-4 border-paper bg-[#E6E1D9] shadow-[0_20px_40px_rgb(0_0_0/0.5)] lg:absolute lg:right-9 lg:top-9 lg:mb-0 lg:size-[150px]">
                <Image src={photo.src} alt={photo.alt} fill sizes="160px" className="object-cover" />
              </div>
            )}
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
              {r.now && <NowBadge />}
            </div>
            <h3 className="mt-6 font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink lg:mt-7 lg:max-w-[380px] lg:text-[38px]">
              {r.role}
            </h3>
            {/* Clear of the photo frame in the corner. */}
            <ul className={`mt-5 flex flex-col gap-3 lg:mt-6 ${photo ? "lg:pr-40" : ""}`}>
              {sentences(r.description)
                .slice(0, 3)
                .map((s) => (
                  <li key={s} className="flex gap-3.5 text-base leading-relaxed text-[#D6D3CD] lg:text-[17px]">
                    <span aria-hidden className="mt-[11px] size-1.5 shrink-0 rounded-full bg-accent lg:size-[7px]" />
                    <span>{s}</span>
                  </li>
                ))}
            </ul>
            <div className="mt-auto flex flex-col gap-4 border-t border-dashed border-ink/20 pt-5 sm:flex-row sm:items-center sm:justify-between lg:mt-8">
              {r.stat ? (
                <p className="flex items-baseline gap-3">
                  <span className="whitespace-nowrap font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] text-accent lg:text-[54px]">
                    {r.stat.value}
                  </span>
                  <span className="max-w-[150px] text-sm leading-snug text-ink-muted">{r.stat.label}</span>
                </p>
              ) : (
                <span />
              )}
              <button
                type="button"
                data-expand
                onClick={() => open(i)}
                aria-describedby={`role-tab-${i}`}
                className="flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-full border border-accent bg-accent/10 px-5 text-[15px] font-semibold text-accent-soft transition-[background-color,color,transform] duration-250 hover:translate-x-[3px] hover:bg-accent hover:text-paper motion-reduce:hover:translate-x-0"
              >
                Read the full story
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </article>
        );
      })}

      <Sheet
        open={current !== null}
        onClose={close}
        labelledBy="story-title"
        className="morph inset-x-0 bottom-0 top-auto h-[calc(100dvh-3rem)] w-full overflow-hidden rounded-t-[26px] border-t border-white/12 bg-sheet lg:inset-x-[max(2rem,calc(50vw-600px))] lg:top-6 lg:bottom-6 lg:h-auto lg:w-auto lg:rounded-[28px] lg:border"
      >
        {current && (
          <div ref={bodyRef} className="thin-scroll h-full overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-hairline bg-sheet/90 py-2.5 pl-5 pr-3 backdrop-blur-md lg:h-[72px] lg:py-0 lg:pl-11 lg:pr-7">
              <span aria-hidden className="absolute left-1/2 top-2 h-[5px] w-10 -translate-x-1/2 rounded-full bg-ink/25 lg:hidden" />
              <p className="mt-2 flex min-w-0 flex-1 flex-wrap gap-x-3 font-mono text-[11px] leading-relaxed lg:mt-0 lg:text-xs">
                <span className="text-accent-soft">{current.org}</span>
                <span className="text-ink-faint">{current.dates}</span>
              </p>
              {[
                { i: prev, text: "Previous role", Icon: ArrowLeft },
                { i: next, text: "Next role", Icon: ArrowRight },
              ].map(({ i, text, Icon }) =>
                i === null ? null : (
                  <button
                    key={text}
                    type="button"
                    onClick={() => switchStory(i)}
                    className="hidden h-10 items-center gap-2 rounded-full border border-ink/20 px-4 text-sm text-ink-soft transition-colors hover:text-ink lg:flex"
                  >
                    {text === "Previous role" && <Icon className="size-4" aria-hidden />}
                    {text}
                    {text === "Next role" && <Icon className="size-4" aria-hidden />}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="mt-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-surface-raised text-ink lg:mt-0"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="px-5 pb-12 pt-7 lg:px-16 lg:pb-[72px] lg:pt-12">
              <div
                className={`grid gap-10 lg:items-center lg:gap-14 ${
                  current.photos.length ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]" : ""
                }`}
              >
                <div>
                  {current.now && (
                    <div className="mb-4 flex">
                      <NowBadge />
                    </div>
                  )}
                  <h2
                    id="story-title"
                    className="font-display text-[clamp(2.5rem,1.6rem+3vw,3.75rem)] font-extrabold leading-none tracking-[-0.03em] text-ink"
                  >
                    {current.role}
                  </h2>
                  {current.stat && (
                    <p className="mt-8 inline-flex flex-col gap-2 rounded-2xl border border-hairline bg-surface-raised px-5 py-4">
                      <span className="whitespace-nowrap font-display text-[32px] font-extrabold leading-none tracking-[-0.02em] text-accent">
                        {current.stat.value}
                      </span>
                      <span className="text-[13px] text-ink-muted">{current.stat.label}</span>
                    </p>
                  )}
                </div>
                {current.photos.length > 0 && (
                  <div className="max-lg:order-first">
                    <Collage photos={current.photos} />
                  </div>
                )}
              </div>

              {current.beats ? (
                <div className="mt-14 lg:mt-16">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">The challenge</p>
                  <h3 className="mt-3 max-w-[820px] font-display text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
                    Running our side of a two-university club merger
                  </h3>
                  <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.45fr_1fr] lg:items-start">
                    {current.beats.map((beat) => (
                      <section
                        key={beat.label}
                        className="relative overflow-hidden rounded-[22px] border border-hairline bg-[#1A1A1F] px-[22px] pb-7 pt-6 transition-[transform,border-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-accent/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        {/* The beat's initial, outlined, as a watermark. */}
                        <span
                          aria-hidden
                          className="absolute -right-1.5 -top-6 font-display text-[150px] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(255_91_46/0.35)]"
                        >
                          {beat.label[0]}
                        </span>
                        <h4 className="relative font-mono text-xs uppercase tracking-[0.15em] text-accent-soft">
                          {beat.label}
                        </h4>
                        <p className="relative mt-16 text-base leading-relaxed text-[#D6D3CD]">{beat.text}</p>
                      </section>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-12 max-w-[760px] text-lg leading-relaxed text-ink-soft lg:mt-14 lg:text-xl">
                  {current.description}
                </p>
              )}
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
