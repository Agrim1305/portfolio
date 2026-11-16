"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MergerBeats } from "@/components/merger-beats";
import { Panel } from "@/components/panel";
import { morphClose, morphOpen, morphSwitch } from "@/lib/morph";
import { Metrics, StarStory } from "@/components/case-study";
import { roles } from "@/lib/experience";
import { STORY_EVENT, type Photo, type StoryRequest } from "@/lib/stories";

// "Viemo Capital" reads as VC, "Adelaide Rising Stars" as AR.
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

// Leadership tells the President role and opens its story, so the list here
// leaves it out; the story itself still opens in this panel.
const listed = roles.filter((r) => r.id !== "president");
// A story's card in the list, or -1 for the story Leadership opens.
const cardOf = (story: number) => listed.indexOf(roles[story]);
// Where a story with no card here came from, and shrinks back to.
const leadershipCard = () => document.querySelector<HTMLElement>("#leadership [data-expand]")?.parentElement ?? null;

/* The rest of a story's photos, after the story: two columns, each photo
   whole, so no shape is cropped to fit. */
function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="columns-1 gap-6 sm:columns-2">
      {photos.map((p) => (
        <figure key={p.src} className="mb-8 break-inside-avoid">
          <div
            className="overflow-hidden rounded-[18px] border-[5px] border-ink shadow-[0_30px_60px_rgb(0_0_0/0.5)]"
          >
            <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width: 1280px) 460px, (min-width: 640px) 45vw, 90vw" className="h-auto w-full" />
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

  // Shrinks the story into what it grew from, or, once it has moved to
  // another role, into that role's card, which then takes focus rather than
  // the button the story first opened from.
  function shrink() {
    const current = storyRef.current;
    if (current === null) return;
    const from = source.current?.isConnected ? source.current : null;
    const home = from ?? panels.current[cardOf(current)] ?? leadershipCard();
    morphClose(home, () => {
      flushSync(() => setStory(null));
      if (!from) home?.querySelector<HTMLElement>("[data-expand]")?.focus({ preventScroll: true });
    });
  }

  useEffect(() => {
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
      if (cardOf(initial) >= 0) setActive(cardOf(initial));
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
      new CustomEvent<StoryRequest>(STORY_EVENT, { detail: { id: listed[i].id, from: panels.current[i] } }),
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
    shrink();
  }

  // The role list behind moves to the new role too, so closing shrinks the
  // story into the card that is now showing.
  function switchStory(i: number) {
    if (story === null) return;
    window.history.replaceState(null, "", `#story-${listed[i].id}`);
    source.current = null;
    morphSwitch(i > cardOf(story) ? 1 : -1, bodyRef.current, () => {
      flushSync(() => {
        setStory(roles.indexOf(listed[i]));
        setActive(i);
      });
      bodyRef.current?.scrollTo({ top: 0 });
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const last = listed.length - 1;
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
  // Previous and next walk the list; the President story stands alone.
  const card = story === null ? -1 : cardOf(story);
  const prev = card > 0 ? card - 1 : null;
  const next = card >= 0 && card < listed.length - 1 ? card + 1 : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:items-start lg:gap-[60px]">
      <div
        role="tablist"
        aria-label="Roles"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b lg:border-hairline lg:p-0 [&::-webkit-scrollbar]:hidden"
      >
        {listed.map((r, i) => {
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

      {listed.map((r, i) => {
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
              <div className="relative mb-6 aspect-[4/3] w-40 overflow-hidden rounded-[22px] border-4 border-paper bg-[#E6E1D9] shadow-[0_20px_40px_rgb(0_0_0/0.5)] lg:absolute lg:right-9 lg:top-9 lg:mb-0">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                  style={{ objectPosition: photo.position }}
                />
              </div>
            )}
            {/* Clear of the photo in the corner, so a long organisation wraps. */}
            <div className={`flex items-center gap-3.5 ${photo ? "lg:pr-44" : ""}`}>
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
            <h3 className="mt-6 font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink lg:mt-7 lg:max-w-[380px] lg:text-[38px]">
              {r.role}
            </h3>
            {r.stats.length > 0 && (
              <Metrics
                small
                metrics={r.stats}
                className={`mt-6 grid-cols-2 ${r.stats.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
              />
            )}
            <ul className="mt-6 flex flex-col gap-3">
              {sentences(r.description)
                .slice(0, 3)
                .map((s) => (
                  <li key={s} className="flex gap-3.5 text-base leading-relaxed text-[#D6D3CD] lg:text-[17px]">
                    <span aria-hidden className="mt-[11px] size-1.5 shrink-0 rounded-full bg-accent lg:size-[7px]" />
                    <span>{s}</span>
                  </li>
                ))}
            </ul>
            <div className="mt-auto flex border-t border-dashed border-ink/20 pt-5 sm:justify-end lg:mt-8">
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

      <Panel
        open={current !== null}
        onClose={close}
        closeLabel="Close"
        labelledBy="story-title"
        prev={prev === null ? null : { label: "Previous role", onClick: () => switchStory(prev) }}
        next={next === null ? null : { label: "Next role", onClick: () => switchStory(next) }}
        bodyRef={bodyRef}
        hero={
          current && (
            // Every role opens the same way: the organisation and dates,
            // the title and the numbers. A role with a photo shows it whole
            // with its caption under it: above the text on a phone, and from
            // lg up in a column of its own beside it, level with the
            // organisation line. Nothing is set over a photo. The top
            // padding clears the panel's floating buttons.
            <header
              className={`px-5 pt-20 lg:px-[90px] lg:pt-24 ${
                current.photos[0] ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start lg:gap-x-12" : ""
              }`}
            >
              {current.photos[0] && (
                <figure className="panel-hero mb-8 lg:order-last lg:mb-0">
                  <Image
                    src={current.photos[0].src}
                    alt={current.photos[0].alt}
                    width={current.photos[0].width}
                    height={current.photos[0].height}
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="h-auto max-h-[min(52vh,480px)] w-auto max-w-full rounded-[18px] lg:max-h-none lg:w-full"
                  />
                  <figcaption className="mt-3 font-mono text-xs text-ink-faint">{current.photos[0].caption}</figcaption>
                </figure>
              )}
              <div>
                <p className="flex flex-wrap gap-x-3 font-mono text-[11px] leading-relaxed lg:text-xs">
                  <span className="text-accent-soft">{current.org}</span>
                  <span className="text-ink-muted">{current.dates}</span>
                </p>
                <h2
                  id="story-title"
                  className="mt-3 max-w-[860px] font-display text-[clamp(2.5rem,1.6rem+3vw,3.75rem)] font-extrabold leading-none tracking-[-0.03em] text-ink"
                >
                  {current.role}
                </h2>
                {current.stats.length > 0 && (
                  <Metrics
                    metrics={current.stats}
                    // Beside a photo the numbers pair up; alone they share a row.
                    className={`mt-8 grid-cols-2 ${
                      current.photos[0] ? "" : current.stats.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"
                    }`}
                  />
                )}
              </div>
            </header>
          )
        }
      >
        {current && (
          <div className="px-5 pb-12 pt-12 lg:px-[90px] lg:pb-[72px] lg:pt-14">
            {current.beats ? (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">The challenge</p>
                <h3 className="mt-3 max-w-[820px] font-display text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
                  Running our side of a two-university club merger
                </h3>
                <div className="mt-8">
                  <MergerBeats beats={current.beats} />
                </div>
              </div>
            ) : current.story ? (
              <StarStory story={current.story} headingAs="h3" />
            ) : (
              <p className="max-w-[760px] text-lg leading-relaxed text-ink-soft lg:text-xl">{current.description}</p>
            )}

            {/* The first photo is the hero; any more follow the story. */}
            {current.photos.length > 1 && (
              <div className="mt-12 lg:mt-14">
                <Gallery photos={current.photos.slice(1)} />
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
