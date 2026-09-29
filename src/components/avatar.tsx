"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Square } from "lucide-react";
import { setMuted, speak, stop, useCanSpeak, useSpeech } from "@/lib/speech";

const HEADS = ["/images/avatar/head-0.webp", "/images/avatar/head-1.webp", "/images/avatar/head-2.webp"];
const LAYER_SIZES = "(min-width: 1280px) 448px, (min-width: 1024px) 380px, 280px";

/* The mouth frames the avatar needs right now. The two talking frames are
   only fetched once speech first starts, so a visitor who never turns the
   voice on never downloads them. */
function useMouthFrames(talking: boolean) {
  const [warm, setWarm] = useState(false);
  if (talking && !warm) setWarm(true);
  return warm ? HEADS : HEADS.slice(0, 1);
}

/* The layers are laid out in the design's own units: a 520 x 540 box whose
   circle frame is 420 across. Every position is a percentage of that box, so
   the avatar scales as one piece. The clip keeps the body inside the circle
   while the head is free to rise above its rim. */
export function Avatar() {
  const ref = useRef<HTMLDivElement>(null);
  const { talking, frame } = useSpeech();
  const canSpeak = useCanSpeak();
  const heads = useMouthFrames(talking);

  // Head and eyes follow the pointer. Fine pointers only, and never under
  // reduced motion. Written straight to CSS variables, so no re-render.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const clamp = (n: number) => Math.max(-1, Math.min(1, n));
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const nx = clamp((x - (r.left + r.width / 2)) / (window.innerWidth / 2));
        const ny = clamp((y - (r.top + r.height * 0.45)) / (window.innerHeight / 2));
        el.style.setProperty("--nx", nx.toFixed(3));
        el.style.setProperty("--ny", ny.toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--nx", "0");
      el.style.setProperty("--ny", "0");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

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
    <div ref={ref} className="avatar relative aspect-[520/540] w-full">
      <div
        aria-hidden
        className="glow-pulse pointer-events-none absolute left-1/2 top-[50%] aspect-square w-[123%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_91_46/0.3),rgb(255_91_46/0.08)_42%,transparent_68%)]"
      />

      <svg
        aria-hidden
        viewBox="-10 60 520 540"
        className="hero-frame absolute inset-0 size-full overflow-visible"
        fill="none"
      >
        <circle cx="250" cy="330" r="238" stroke="#F1EFEA" strokeOpacity="0.12" strokeWidth="1.5" />
        <circle
          className="ring-spin"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          cx="250"
          cy="330"
          r="256"
          stroke="#FF5B2E"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="2 12"
        />
      </svg>

      {talking && (
        <span aria-hidden className="absolute left-[9.615%] top-[11.111%] h-[77.778%] w-[80.769%]">
          <span className="talk-ring absolute inset-0 rounded-full border-[3px] border-accent" />
          <span className="talk-ring absolute inset-0 rounded-full border-2 border-accent/60 [animation-delay:0.6s]" />
        </span>
      )}

      <div
        aria-hidden
        className="hero-frame absolute left-[9.615%] top-[11.111%] h-[77.778%] w-[80.769%] rounded-full bg-[linear-gradient(160deg,#FF5B2E,rgb(255_255_255/0.1)_45%,rgb(255_255_255/0.04))] p-[1.154%] shadow-[0_40px_80px_rgb(0_0_0/0.6)]"
      >
        <div className="size-full rounded-full bg-[radial-gradient(circle_at_50%_35%,#3A3A42,#17171A_75%)]" />
      </div>

      <div
        role="img"
        aria-label="3D avatar of Agrim"
        className="hero-photo absolute inset-0 [clip-path:url(#avatar-clip)]"
      >
        <div className="absolute left-[6.923%] top-[4.444%] h-[88.889%] w-[86.154%]">
          <div className="avatar-breathe absolute inset-0">
            <Image src="/images/avatar/body.webp" alt="" fill sizes={LAYER_SIZES} loading="eager" />
            <div className="avatar-head absolute inset-0">
              <div className="avatar-idle absolute inset-0 drop-shadow-[0_18px_24px_rgb(0_0_0/0.45)]">
                {heads.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    fill
                    sizes={LAYER_SIZES}
                    loading="eager"
                    className={frame === i ? "opacity-100" : "opacity-0"}
                  />
                ))}
                <div className="avatar-eyes absolute inset-0">
                  <Image
                    src="/images/avatar/iris.webp"
                    alt=""
                    fill
                    sizes={LAYER_SIZES}
                    loading="eager"
                    className="avatar-iris"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {canSpeak && (
        <button
          type="button"
          onClick={hearMe}
          aria-pressed={talking}
          className="glass lift absolute -right-4 top-[62%] z-10 flex h-12 items-center gap-2.5 rounded-full pl-1.5 pr-5 text-[15px] font-semibold text-ink lg:top-[37%] lg:h-[52px] lg:pl-2"
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

      <svg aria-hidden width="0" height="0" className="absolute">
        <clipPath id="avatar-clip" clipPathUnits="objectBoundingBox">
          <path d="M0.10769 0 H0.89231 V0.5 A0.39231 0.37778 0 0 1 0.10769 0.5 Z" />
        </clipPath>
      </svg>
    </div>
  );
}

/* The avatar's face alone, cropped into a circle for the chat header. It
   shares the mouth frames, so it lip-syncs along with the big one. */
export function AvatarHead({ className = "" }: { className?: string }) {
  const { talking, frame } = useSpeech();
  const heads = useMouthFrames(talking);
  return (
    <span aria-hidden className={`relative block overflow-hidden rounded-full bg-[#E6E1D9] ${className}`}>
      <span className="absolute left-[-73%] top-[-23%] h-[263%] w-[246%]">
        {heads.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            // The big avatar's sizes, so the browser picks the same files it
            // already has and the face shows the moment the chat opens.
            sizes={LAYER_SIZES}
            className={frame === i ? "opacity-100" : "opacity-0"}
          />
        ))}
        <span className="avatar-eyes absolute inset-0">
          <Image src="/images/avatar/iris.webp" alt="" fill sizes={LAYER_SIZES} />
        </span>
      </span>
    </span>
  );
}
