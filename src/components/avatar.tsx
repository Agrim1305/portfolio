"use client";

import Image from "next/image";
import { Play, Square } from "lucide-react";
import { setMuted, speak, stop, useCanSpeak, useSpeech } from "@/lib/speech";

const FIGURE = "/images/avatar/figure.webp";

/* The 3D figure, completely still, in its ringed circle. The whole piece
   fades in with the name-wipe; nothing else moves. */
export function Avatar() {
  const { talking } = useSpeech();
  const canSpeak = useCanSpeak();

  function hearMe() {
    if (talking) {
      stop();
      return;
    }
    setMuted(false);
    const intro = document.getElementById("hero-intro")?.textContent;
    if (intro) speak(intro);
  }

  return (
    <div className="hero-fade relative aspect-square w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_91_46/0.22),rgb(255_91_46/0.06)_42%,transparent_68%)]"
      />
      <div aria-hidden className="absolute -inset-[4%] rounded-full border border-dashed border-accent/35" />
      <div
        role="img"
        aria-label="3D avatar of Agrim"
        className="absolute inset-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_40%,#26262C,#151518_70%)] shadow-[inset_0_0_0_3px_rgb(255_91_46/0.55),0_40px_90px_rgb(0_0_0/0.5)]"
      >
        {/* The figure is 560 x 600: full width, dropped slightly so the
            circle crops the chest, as in the reference. */}
        <div className="absolute inset-x-0 top-[3.9%] aspect-[560/600]">
          <Image
            src={FIGURE}
            alt=""
            fill
            sizes="(min-width: 1280px) 500px, (min-width: 1024px) 420px, 322px"
            priority
          />
        </div>
      </div>

      {canSpeak && (
        <button
          type="button"
          onClick={hearMe}
          aria-pressed={talking}
          className="glass lift absolute -right-4 top-[68%] z-10 flex h-12 items-center gap-2.5 rounded-full pl-1.5 pr-5 text-[15px] font-semibold text-ink lg:top-[62%] lg:h-[52px] lg:pl-2"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-paper">
            {talking ? (
              <Square className="size-3 fill-current" aria-hidden />
            ) : (
              <Play className="size-3.5 translate-x-px fill-current" aria-hidden />
            )}
          </span>
          Hear me
        </button>
      )}
    </div>
  );
}

/* The figure's face, cropped into a circle for the chat header. */
export function AvatarHead({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative block overflow-hidden rounded-full bg-[#26262C] ${className}`}>
      <span className="absolute left-[-58%] top-[-23%] h-[231%] w-[215%]">
        <Image src={FIGURE} alt="" fill sizes="120px" />
      </span>
    </span>
  );
}
