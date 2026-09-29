import { useSyncExternalStore } from "react";

/* Voice state for the assistant. Speech uses the browser's
   own voice (speechSynthesis). Voice starts muted and the visitor's choice is
   remembered. */

type SpeechState = { muted: boolean; talking: boolean };

const STORAGE_KEY = "voice";
const serverState: SpeechState = { muted: true, talking: false };

let state = serverState;
let restored = false;
const listeners = new Set<() => void>();

function set(next: Partial<SpeechState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  if (!restored) {
    restored = true;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "on") state = { ...state, muted: false };
    } catch {
      // Storage blocked: stay muted.
    }
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSpeech() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;

const noSubscribe = () => () => {};

/* False on the server and in browsers without speech, so voice controls only
   render where they work. */
export function useCanSpeak() {
  return useSyncExternalStore(noSubscribe, supported, () => false);
}

// Utterances cancelled by stop() still fire onend later; the generation lets
// those late events be ignored instead of ending the next answer early.
let generation = 0;
let pending = 0;

/* Text as it should be heard: links and list markers are for reading. */
export function forSpeech(text: string) {
  return text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^\s*-\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* Splits streamed text into complete sentences, ready to speak, and the
   remainder that is still arriving. */
export function takeSentences(buffer: string): [string[], string] {
  const parts = buffer.split(/(?<=[.!?])\s+|\n+/);
  const rest = parts.pop() ?? "";
  return [parts.filter((p) => p.trim()), rest];
}

export function speak(text: string) {
  if (state.muted || !supported()) return;
  const words = forSpeech(text);
  if (!words) return;
  const gen = generation;
  const utterance = new SpeechSynthesisUtterance(words);
  utterance.rate = 1.02;
  utterance.onend = utterance.onerror = () => {
    if (gen !== generation) return;
    pending = Math.max(0, pending - 1);
    if (!pending) set({ talking: false });
  };
  pending += 1;
  if (!state.talking) set({ talking: true });
  window.speechSynthesis.speak(utterance);
}

export function stop() {
  generation += 1;
  pending = 0;
  if (supported()) window.speechSynthesis.cancel();
  if (state.talking) set({ talking: false });
}

/* iOS only lets speech start inside a tap, so every tap that may later lead
   to speech (unmuting, sending a question) primes it with a silent utterance. */
export function unlock() {
  if (!state.muted && supported()) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  }
}

export function setMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? "off" : "on");
  } catch {
    // Storage blocked: the choice lasts for this visit only.
  }
  if (muted) stop();
  set({ muted });
  unlock();
}
