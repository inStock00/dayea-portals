import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/dayea-hero.jpg";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="dark" />

      {/* Hero */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img
          src={hero}
          alt="DAYEA private island at twilight"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white animate-fade-in">
          <p className="eyebrow text-white/80">Baa Atoll · Maldives</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
            A private island, <br className="hidden sm:block" />
            <em className="italic font-light opacity-90">for those who return.</em>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Sixteen villas drawn into the lagoon. Step inside your member sanctuary.
          </p>
          <a
            href="#portals"
            className="mt-12 inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-white hover:opacity-70 transition-opacity"
          >
            <span>Enter Member Portals</span>
            <span className="h-px w-12 bg-white" />
          </a>
        </div>
      </section>

      {/* Portals */}
      <section id="portals" className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Member Access</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Two doors, one sanctuary</h2>
            <p className="mt-4 text-muted-foreground">
              Whether you are returning to your villa or curating journeys on behalf of your clients,
              your private space awaits.
            </p>
          </div>

          <div className="mt-16 grid gap-px bg-border md:grid-cols-2 border border-border">
            <PortalCard
              eyebrow="Portal I"
              title="Dayea Dreamers"
              subtitle="The VIP return guest lounge"
              description="Priority access to new villas, private chef nights and seasonal experiences — reserved for those who have stayed before."
              to="/dreamers/login"
              cta="Enter Lounge"
            />
            <PortalCard
              eyebrow="Portal II"
              title="Preferred Partner Program"
              subtitle="For verified luxury travel advisors"
              description="Real-time production tracking, commission ledgers, and unlocked client perks for our trusted agency network."
              to="/partners/login"
              cta="Advisor Sign In"
            />
          </div>
        </div>
      </section>

      {/* Quiet pledge */}
      <section className="bg-secondary py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Our Promise</p>
          <p className="mt-6 font-serif text-2xl italic leading-relaxed md:text-3xl">
            “We measure success not by occupancy, but by how often you return.
            The island remembers your room, your preferences, your stories.”
          </p>
          <p className="mt-6 text-xs tracking-[0.25em] uppercase text-muted-foreground">— The DAYEA Family</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function PortalCard({
  eyebrow, title, subtitle, description, to, cta,
}: { eyebrow: string; title: string; subtitle: string; description: string; to: string; cta: string }) {
  return (
    <div className="group relative flex flex-col bg-card p-10 lg:p-14 transition-colors duration-500 hover:bg-secondary">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-6 font-serif text-3xl md:text-4xl">{title}</h3>
      <p className="mt-2 italic text-muted-foreground">{subtitle}</p>
      <p className="mt-8 text-sm leading-relaxed text-muted-foreground max-w-md">
        {description}
      </p>
      <div className="mt-12 flex-1" />
      <Link to={to} className="btn-primary self-start">
        {cta}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
