"use client";

import type { RefObject } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Sheet } from "@/components/sheet";

type Step = { label: string; hint?: string; onClick: () => void } | null;

/* The top of a role's story panel: a photo filling the frame, with the
   title set over a dark gradient at its foot (case studies have their own,
   laid out like their cards; see CaseStudyHero). Only the
   background carries `panel-hero`, so switching crossfades the picture while
   the title slides with the rest (see morphSwitch). */
export function PanelHero({ background, children }: { background: React.ReactNode; children: React.ReactNode }) {
  return (
    <header className="relative flex min-h-[44vh] flex-col justify-end overflow-hidden md:min-h-[min(58vh,560px)]">
      <div className="panel-hero absolute inset-0">{background}</div>
      {/* Keeps the floating buttons legible over a busy picture. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(rgb(20_20_23/0.85),rgb(20_20_23/0))]" />
      <div className="relative bg-[linear-gradient(180deg,rgb(20_20_23/0),rgb(20_20_23/0.85)_45%,rgb(20_20_23/0.97))] px-5 pb-7 pt-28 lg:px-[90px] lg:pb-10 lg:pt-40">
        {children}
      </div>
    </header>
  );
}

/* The large panel a project card or a role grows into. A native <dialog>
   (see Sheet), so focus stays inside it and the page behind is inert; centred
   from md up, a bottom sheet on phones. The hero and the article scroll
   inside it under a floating bar with previous, next and close, and the
   left and right arrow keys step too. */
export function Panel({
  open,
  onClose,
  closeLabel,
  labelledBy,
  prev,
  next,
  bodyRef,
  hero,
  children,
}: {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  labelledBy: string;
  prev: Step;
  next: Step;
  bodyRef: RefObject<HTMLDivElement | null>;
  hero: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      labelledBy={labelledBy}
      className="morph inset-x-0 bottom-0 top-auto h-[calc(100dvh-3rem)] w-full overflow-hidden rounded-t-[26px] border-t border-white/12 bg-sheet md:inset-0 md:m-auto md:h-[92vh] md:w-[min(1100px,calc(100vw-4rem))] md:rounded-[28px] md:border"
    >
      {open && (
        <div
          className="relative h-full"
          onKeyDown={(e) => {
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            const step = e.key === "ArrowLeft" ? prev : e.key === "ArrowRight" ? next : null;
            step?.onClick();
          }}
        >
          {/* Focusable, so a keyboard can scroll a story with nothing to tab
              to; the dialog opens with it focused. */}
          <div
            ref={bodyRef}
            tabIndex={0}
            role="region"
            aria-labelledby={labelledBy}
            className="panel-body thin-scroll h-full overflow-y-auto focus-visible:outline-offset-[-2px]"
          >
            {hero}
            {children}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-2 p-3 lg:p-5">
            <span aria-hidden className="absolute left-1/2 top-2 h-[5px] w-10 -translate-x-1/2 rounded-full bg-ink/40 md:hidden" />
            <span className="flex-1" />
            {[
              { step: prev, Icon: ArrowLeft },
              { step: next, Icon: ArrowRight },
            ].map(({ step, Icon }) =>
              step ? (
                <button
                  key={Icon === ArrowLeft ? "prev" : "next"}
                  type="button"
                  onClick={step.onClick}
                  className="glass pointer-events-auto hidden h-10 items-center gap-2 rounded-full px-4 text-sm text-ink lg:flex"
                >
                  {Icon === ArrowLeft && <Icon className="size-4" aria-hidden />}
                  {step.hint && <span className="sr-only">{step.hint}</span>}
                  {step.label}
                  {Icon === ArrowRight && <Icon className="size-4" aria-hidden />}
                </button>
              ) : null,
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="glass pointer-events-auto mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-ink md:mt-0"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
