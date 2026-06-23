import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Agrim Sharma
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </a>
          <a href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">
            Experience
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}