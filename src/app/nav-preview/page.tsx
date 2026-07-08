import { Menu, X } from "lucide-react";

// TEMPORARY page to compare the two mobile nav options. Delete after pick.

const sections = [
  { number: "01", label: "Projects" },
  { number: "02", label: "Leadership" },
  { number: "03", label: "Experience" },
  { number: "04", label: "About" },
  { number: "05", label: "Contact" },
];

export default function NavPreview() {
  return (
    <main className="py-10">
      <p className="px-5 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
        Option A · Horizontal scroll
      </p>
      <div className="mt-3 border-y border-hairline bg-paper py-2">
        <div className="flex items-center gap-2 overflow-x-auto px-5">
          <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-hairline bg-surface p-1">
            {sections.map((s, i) => (
              <span
                key={s.number}
                className={`inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] ${
                  i === 0 ? "bg-accent-wash text-accent" : "text-ink-muted"
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    i === 0 ? "text-accent" : "text-ink-faint"
                  }`}
                >
                  {s.number}
                </span>
                {s.label}
              </span>
            ))}
          </div>
          <span className="inline-flex shrink-0 items-center rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-paper">
            Resume
          </span>
        </div>
      </div>
      <p className="mt-2 px-5 text-sm text-ink-faint">
        Everything fits in one row but Contact and Resume sit off-screen until
        you scroll the bar sideways.
      </p>

      <p className="mt-14 px-5 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
        Option B · Hamburger (shown open)
      </p>
      <div className="mt-3 border-y border-hairline bg-paper">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="font-serif text-lg text-ink">Agrim Sharma</span>
          <X className="size-5 text-ink" />
        </div>
        <div className="border-t border-hairline px-5 pb-5">
          {sections.map((s, i) => (
            <span
              key={s.number}
              className={`flex items-baseline gap-2.5 border-b border-hairline py-3.5 text-base ${
                i === 0 ? "text-accent" : "text-ink"
              }`}
            >
              <span
                className={`font-mono text-[11px] ${
                  i === 0 ? "text-accent" : "text-ink-faint"
                }`}
              >
                {s.number}
              </span>
              {s.label}
            </span>
          ))}
          <span className="mt-4 flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-paper">
            Resume
          </span>
        </div>
      </div>
      <p className="mt-2 px-5 text-sm text-ink-faint">
        Standard mobile pattern. One tap reveals all five sections plus Resume,
        nothing hidden or off-screen. The closed bar is just the wordmark and a{" "}
        <Menu className="inline size-4 align-text-bottom" /> icon.
      </p>
    </main>
  );
}
