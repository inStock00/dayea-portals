import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import chef from "@/assets/chef-experience.jpg";
import newVilla from "@/assets/new-villa.jpg";
import spa from "@/assets/spa.jpg";

export const Route = createFileRoute("/dreamers/lounge")({
  component: Lounge,
});

const guest = {
  firstName: "Sarah",
  memberSince: 2019,
  totalStays: 7,
  totalNights: 41,
  preferredVilla: "Villa 4",
  preferences: ["South-facing sunset", "Ashtanga mat in room", "No dairy at breakfast", "Pillow firmness: medium-soft"],
  notes: "Sarah travels twice yearly with her partner James. Birthday: April 12 — Chef Lior always prepares the cardamom cake.",
};

const experiences = [
  {
    id: 1, image: newVilla, title: "Villa 17 · Reef Edge",
    desc: "Our newest overwater sanctuary opens this November. Members are invited 48 hours before public release.",
    badge: "Exclusive Early Access", widget: false, dates: "Nov 4 — Mar 30",
  },
  {
    id: 2, image: chef, title: "An Evening with Chef Lior",
    desc: "A four-hand tasting menu on the sandbar, limited to six couples per night.",
    badge: null, widget: true, price: "from $1,840 / couple",
  },
  {
    id: 3, image: spa, title: "Solstice Wellness Retreat",
    desc: "Seven nights with daily marma-point therapy and silent dawn meditations.",
    badge: "Exclusive Early Access", widget: false, dates: "Jun 19 — Jun 26",
  },
];

function Lounge() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav portal="Dreamers Lounge" name={guest.firstName} />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
        {/* Greeting */}
        <section className="animate-fade-up">
          <p className="eyebrow">Member since {guest.memberSince} · {guest.totalStays} stays</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl">
            Welcome back to your island home, <em className="italic">{guest.firstName}</em>.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Villa 4 is being prepared with frangipani and your preferred pillows. A few new offerings, just for you.
          </p>
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          {/* Experiences */}
          <div className="lg:col-span-2">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-serif text-3xl">Priority Experiences</h2>
              <span className="eyebrow">For your eyes only</span>
            </div>
            <div className="space-y-px bg-border border border-border">
              {experiences.map((exp) => <ExperienceTile key={exp.id} {...exp} />)}
            </div>
          </div>

          {/* Profile sidebar */}
          <aside className="space-y-8">
            <div className="card-soft p-8">
              <p className="eyebrow">Your Profile</p>
              <h3 className="mt-4 font-serif text-2xl">{guest.firstName}'s Sanctuary</h3>
              <dl className="mt-8 space-y-5 text-sm">
                <Row label="Past Stays" value={`${guest.totalStays} stays · ${guest.totalNights} nights`} />
                <Row label="Room Preference" value={`${guest.preferredVilla} lover`} />
                <Row label="Last Visit" value="March 2026" />
              </dl>
            </div>
            <div className="card-soft p-8">
              <p className="eyebrow">Preferences on File</p>
              <ul className="mt-6 space-y-3 text-sm">
                {guest.preferences.map((p) => (
                  <li key={p} className="flex gap-3"><span className="text-accent">·</span>{p}</li>
                ))}
              </ul>
            </div>
            <div className="card-soft p-8 bg-secondary">
              <p className="eyebrow">A Note from the General Manager</p>
              <p className="mt-4 font-serif text-base italic leading-relaxed text-foreground">
                "{guest.notes}"
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4 last:border-0">
      <dt className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function ExperienceTile({ image, title, desc, badge, widget, dates, price }: any) {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const handle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setBooking(true);
  };

  return (
    <article className="group grid bg-card md:grid-cols-[280px_1fr]">
      <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
        <img src={image} alt="" loading="lazy" width={1280} height={896} className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
        {badge && (
          <div className="absolute top-4 left-4 bg-foreground/95 text-background px-3 py-1.5 text-[0.62rem] tracking-[0.25em] uppercase">
            {badge}
          </div>
        )}
      </div>
      <div className="flex flex-col p-8">
        <h3 className="font-serif text-2xl">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>

        {widget ? (
          <div className="mt-6 border border-border p-5 bg-background">
            {!booking ? (
              <>
                <p className="eyebrow mb-4">Reserve · {price}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <label className="block">
                    <span className="text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">Date</span>
                    <input type="date" defaultValue="2026-06-15" className="mt-1 w-full bg-transparent border-b border-border py-1 outline-none focus:border-accent" />
                  </label>
                  <label className="block">
                    <span className="text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">Guests</span>
                    <select className="mt-1 w-full bg-transparent border-b border-border py-1 outline-none focus:border-accent">
                      <option>2 guests</option><option>4 guests</option><option>6 guests</option>
                    </select>
                  </label>
                </div>
                <button onClick={handle} disabled={loading} className="btn-primary mt-5 w-full text-[0.62rem]">
                  {loading ? "Reserving…" : "Reserve Privately"}
                </button>
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-accent text-sm">✓ Held — your villa host will confirm within the hour.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-auto pt-6 flex items-center justify-between gap-4">
            <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{dates}</span>
            <button className="text-xs tracking-[0.25em] uppercase border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors">
              Request Early Access
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function DashboardNav({ portal, name }: { portal: string; name: string }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-serif text-xl tracking-[0.3em]">DAYEA</Link>
          <span className="hidden md:inline text-xs tracking-[0.25em] uppercase text-muted-foreground">{portal}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-sm">Hello, {name}</span>
          <Link to="/" className="text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors">Sign Out</Link>
        </div>
      </div>
    </header>
  );
}
