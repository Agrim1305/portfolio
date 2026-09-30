import Image from "next/image";

const FIGURE = "/images/avatar/figure.webp";

/* The 3D figure, completely still, in its ringed circle. The whole piece
   fades in with the name-wipe; nothing else moves. */
export function Avatar() {
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
        {/* The render is a 1024px square with room around the figure. Sized
            and placed so the head keeps the reference's size and place in the
            circle (41% of its width, the crown 6% down) and the circle crops
            the chest. */}
        <div className="absolute left-[-4.7%] top-[1.4%] aspect-square w-[109.3%]">
          <Image
            src={FIGURE}
            alt=""
            fill
            sizes="(min-width: 1280px) 180px, (min-width: 768px) 120px, 60px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

