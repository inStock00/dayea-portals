import { Link } from "@tanstack/react-router";

export function SiteHeader({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";
  return (
    <header className={`absolute top-0 left-0 right-0 z-20 ${isDark ? "text-background" : "text-foreground"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12 lg:py-8">
        <Link to="/" className="font-serif text-2xl tracking-[0.3em]">DAYEA</Link>
        <nav className="hidden gap-10 text-xs tracking-[0.25em] uppercase md:flex">
          <a href="#about" className="hover:opacity-70 transition-opacity">The Island</a>
          <a href="#about" className="hover:opacity-70 transition-opacity">Villas</a>
          <a href="#portals" className="hover:opacity-70 transition-opacity">Member Access</a>
        </nav>
        <div className="text-xs tracking-[0.25em] uppercase opacity-80">EN · USD</div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-serif text-2xl tracking-[0.3em]">DAYEA</div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Sixteen villas. One private island. A sanctuary for those who return.
            </p>
          </div>
          <div className="text-sm">
            <p className="eyebrow mb-3">Reservations</p>
            <p>+960 400 0016</p>
            <p className="text-muted-foreground">reserve@dayea.com</p>
          </div>
          <div className="text-sm">
            <p className="eyebrow mb-3">Located</p>
            <p>Baa Atoll, Maldives</p>
            <p className="text-muted-foreground">40 minutes by seaplane from Malé</p>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} DAYEA Private Island</span>
          <span className="tracking-[0.2em] uppercase">A Sanctuary Hotel</span>
        </div>
      </div>
    </footer>
  );
}
