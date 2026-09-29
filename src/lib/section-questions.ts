import { useEffect, useRef, useState, type RefObject } from "react";
import { flushSync } from "react-dom";
import { projects } from "@/lib/projects";

/* One question per section, offered above the docked cloud. Approved wording;
   the Projects one names the card in view. */
const QUESTIONS: Record<string, (card: number) => string> = {
  projects: (card) => `How was ${projects[card]?.title ?? projects[0].title} built?`,
  leadership: () => "How did Agrim merge two tennis clubs?",
  experience: () => "What does Agrim do at Aurivox?",
  google: () => "What did Agrim learn from his Google mentor?",
  court: () => "How did tennis shape how Agrim works?",
  about: () => "What does Agrim value in his work?",
  contact: () => "Is he eligible to work in Australia?",
};

// How long the page must be still before a question comes up.
const REST_MS = 250;
const STORE = "asked";

export type Question = { id: string; text: string; seen: boolean };

/* Sections whose question has been shown this visit. sessionStorage can be
   unavailable (blocked storage), in which case every visit starts fresh. */
function asked(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(STORE) ?? "[]"));
  } catch {
    return new Set();
  }
}
function remember(id: string) {
  try {
    sessionStorage.setItem(STORE, JSON.stringify([...asked().add(id)]));
  } catch {}
}

/* The section in view: the one showing the most of itself, as long as that is
   at least 40% of the section or of the screen, whichever is smaller (a
   pinned section is several screens tall). */
function sectionInView() {
  let best: string | null = null;
  let most = 0;
  for (const id of Object.keys(QUESTIONS)) {
    const r = document.getElementById(id)?.getBoundingClientRect();
    if (!r) continue;
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (visible >= 0.4 * Math.min(r.height, window.innerHeight) && visible > most) {
      best = id;
      most = visible;
    }
  }
  return best;
}

/* Anything a visitor reads or uses: text (aria-hidden labels included, since
   they are still on screen), media, controls, and anything with a fill or a
   shadow, which is a card, a pill or a line. Bare layout boxes are not. */
function isContent(el: Element) {
  if (el.matches("html, body, main, section, header, footer")) return false;
  // A hit test lands on the innermost element: an icon's <path>, a <span> in
  // a link. What it belongs to is what counts.
  if (el.closest("img, svg, video, canvas, input, textarea, select, button, a")) return true;
  if ([...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim())) return true;
  const s = getComputedStyle(el);
  return s.backgroundColor !== "rgba(0, 0, 0, 0)" || s.backgroundImage !== "none" || s.boxShadow !== "none";
}

/* Whether a box sits over content. Asks the page what it shows at a fine
   grid of points across the box, looking past `ignore` (the assistant's own
   corner). Decoration without pointer events never comes back from a hit
   test, so a glow or a backdrop never counts. */
function coversContent(box: DOMRect, ignore: Element) {
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 5; j++) {
      const hit = document
        .elementsFromPoint(box.left + (box.width * i) / 10, box.top + (box.height * j) / 5)
        .find((el) => !ignore.contains(el));
      if (hit && isContent(hit)) return true;
    }
  }
  return false;
}

/* Which section's question to offer, and whether it can show unprompted.
   Nothing is offered while the page moves; once it has been still for a
   moment, the section in view is checked: a question dismissed, sent, or
   already shown on an earlier stay in that section waits for the next visit.
   `bubble` is the bubble element: the question renders into it first,
   invisibly, so its real box can be checked against the page, and it `fits`
   only if nothing readable is under it. Seeing it, as a bubble or a tooltip,
   is what uses up the visit. */
export function useSectionQuestion(active: boolean, bubble: RefObject<HTMLElement | null>, corner: RefObject<HTMLElement | null>) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [fits, setFits] = useState(false);
  // The section the page is resting in, whether its question has been seen
  // there, and whether it is done for this visit.
  const stay = useRef<{ id: string | null; seen: boolean; done: boolean }>({ id: null, seen: false, done: false });

  useEffect(() => {
    if (!active) return;
    let rest = 0;
    const check = () => {
      const id = sectionInView();
      // A question seen on an earlier stay in this section is done.
      if (id !== stay.current.id) stay.current = { id, seen: false, done: id ? asked().has(id) : false };
      if (!id || stay.current.done) return;
      const card = Number(document.getElementById("projects")?.dataset.active ?? 0);
      flushSync(() => setQuestion({ id, text: QUESTIONS[id](card), seen: stay.current.seen }));
      const box = bubble.current?.getBoundingClientRect();
      const clear = Boolean(box && corner.current && !coversContent(box, corner.current));
      setFits(clear);
      if (clear) see(id);
    };
    const onMove = () => {
      setQuestion(null);
      setFits(false);
      clearTimeout(rest);
      rest = window.setTimeout(check, REST_MS);
    };
    rest = window.setTimeout(check, REST_MS);
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove, { passive: true });
    return () => {
      clearTimeout(rest);
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, [active, bubble, corner]);

  function see(id: string) {
    stay.current.seen = true;
    remember(id);
    setQuestion((q) => q && { ...q, seen: true });
  }

  return {
    question: active ? question : null,
    fits,
    // Shown as a tooltip: that counts as seen, and clears the dot.
    see: () => question && !question.seen && see(question.id),
    // Dismissed or sent: gone until the next visit.
    done() {
      stay.current.done = true;
      if (question) remember(question.id);
      setQuestion(null);
    },
  };
}
