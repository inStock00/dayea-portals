import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/partners/dashboard")({
  component: PartnerDashboard,
});

const agency = {
  name: "Voyage Lumière",
  advisor: "Claire Beaumont",
  agentId: "VL-2274-A",
  tier: "Platinum Atelier",
};

const metrics = {
  base: { current: 218, target: 300, label: "Room Nights YTD" },
  seasonal: { current: 64, target: 120, label: "Low-Season Nights" },
  los: { current: 71, target: 80, label: "% of 5+ Night Bookings" },
};

const initialClients = [
  { name: "Mr. & Mrs. Aldridge", villa: "Villa 9", arrival: "2026-06-04", nights: 7, status: "Confirmed", commission: 4280 },
  { name: "Hartley Family", villa: "Villa 12 + 13", arrival: "2026-07-22", nights: 10, status: "Confirmed", commission: 9100 },
  { name: "Ms. Okafor", villa: "Villa 2", arrival: "2026-09-15", nights: 5, status: "Hold", commission: 2150 },
  { name: "Dr. Tanaka", villa: "Villa 7", arrival: "2026-10-03", nights: 6, status: "Confirmed", commission: 3640 },
  { name: "The Reyes Honeymoon", villa: "Villa 17", arrival: "2026-11-18", nights: 9, status: "Awaiting deposit", commission: 5980 },
];

const perks = [
  { title: "Complimentary Spa Package", client: "Aldridge · Villa 9", status: "Unlocked" },
  { title: "Private Helicopter Transfer", client: "Hartley Family", status: "Pending" },
  { title: "Sandbar Dinner for Two", client: "Reyes Honeymoon", status: "Unlocked" },
  { title: "Sunrise Snorkel with Marine Biologist", client: "Dr. Tanaka", status: "Unlocked" },
];

function PartnerDashboard() {
  const [lowSeason, setLowSeason] = useState(false);
  const [exporting, setExporting] = useState(false);

  const filtered = lowSeason
    ? initialClients.filter((c) => ["05","06","09","10"].includes(c.arrival.slice(5,7)))
    : initialClients;

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
          <div className="flex items-center gap-10">
            <Link to="/" className="font-serif text-xl tracking-[0.3em]">DAYEA</Link>
            <span className="hidden md:inline text-xs tracking-[0.25em] uppercase text-muted-foreground">Preferred Partner</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right text-xs">
              <div className="font-medium">{agency.advisor}</div>
              <div className="text-muted-foreground">{agency.name} · {agency.agentId}</div>
            </div>
            <Link to="/" className="text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors">Sign Out</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
        <section className="flex flex-wrap items-end justify-between gap-6 animate-fade-up">
          <div>
            <p className="eyebrow">{agency.tier}</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">{agency.name} — Production Atlas</h1>
            <p className="mt-3 text-muted-foreground">Year to date through May 2026.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setLowSeason((v) => !v)} className={lowSeason ? "btn-primary" : "btn-ghost"}>
              {lowSeason ? "✓ Low-Season" : "Filter Low-Season"}
            </button>
            <button onClick={handleExport} disabled={exporting} className="btn-ghost">
              {exporting ? "Preparing…" : "Export Booking Data"}
            </button>
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-14 grid gap-px bg-border border border-border md:grid-cols-3">
          <MetricCard
            eyebrow="The Base Tracker"
            label={metrics.base.label}
            current={metrics.base.current}
            target={metrics.base.target}
            unit="nights"
          />
          <MetricCard
            eyebrow="Seasonal Incentive"
            label={metrics.seasonal.label}
            current={metrics.seasonal.current}
            target={metrics.seasonal.target}
            unit="nights"
            highlight
          />
          <MetricCard
            eyebrow="LOS Loyalty"
            label={metrics.los.label}
            current={metrics.los.current}
            target={metrics.los.target}
            unit="%"
            isPercent
          />
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* Clients table */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-serif text-3xl">My Clients</h2>
              <span className="text-xs text-muted-foreground">{filtered.length} active bookings</span>
            </div>
            <div className="border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr className="text-left">
                    <Th>Guest</Th><Th>Villa</Th><Th>Arrival</Th><Th>Nights</Th><Th>Status</Th><Th className="text-right">Commission</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.name} className="border-t border-border hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-4 font-medium">{c.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{c.villa}</td>
                      <td className="px-4 py-4 font-mono text-xs">{c.arrival}</td>
                      <td className="px-4 py-4">{c.nights}</td>
                      <td className="px-4 py-4">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-4 py-4 text-right font-mono">${c.commission.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-foreground/30 bg-secondary">
                    <td colSpan={5} className="px-4 py-4 eyebrow">Projected Payout</td>
                    <td className="px-4 py-4 text-right font-mono font-medium">
                      ${filtered.reduce((s, c) => s + c.commission, 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Perks */}
          <section>
            <h2 className="font-serif text-3xl mb-6">Perks Unlocked</h2>
            <div className="card-soft p-2">
              {perks.map((p, i) => (
                <div key={i} className={`flex items-start gap-4 p-5 ${i < perks.length - 1 ? "border-b border-border" : ""}`}>
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${p.status === "Unlocked" ? "bg-accent" : "bg-muted-foreground/40"}`} />
                  <div className="flex-1">
                    <div className="font-serif text-lg leading-tight">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.client}</div>
                  </div>
                  <span className={`text-[0.62rem] tracking-[0.22em] uppercase ${p.status === "Unlocked" ? "text-accent" : "text-muted-foreground"}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="eyebrow mt-6">Tier preview</p>
            <p className="mt-2 text-sm text-muted-foreground">
              48 nights from your next tier upgrade — <span className="text-foreground">Diamond Atelier</span>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-[0.62rem] tracking-[0.22em] uppercase font-medium text-muted-foreground ${className}`}>{children}</th>;
}

function MetricCard({ eyebrow, label, current, target, unit, isPercent, highlight }: {
  eyebrow: string; label: string; current: number; target: number; unit: string; isPercent?: boolean; highlight?: boolean;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className={`p-8 lg:p-10 bg-card ${highlight ? "bg-secondary" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-serif text-5xl">{isPercent ? current : current}</span>
        <span className="text-sm text-muted-foreground">{isPercent ? "%" : `/ ${target} ${unit}`}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      <div className="mt-6">
        <div className="h-px w-full bg-border relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-px bg-foreground transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.62rem] tracking-[0.2em] uppercase text-muted-foreground">
          <span>{pct}% achieved</span>
          <span>Goal {isPercent ? `${target}%` : `${target}`}</span>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls = s.includes("confirm") ? "bg-accent/15 text-accent border-accent/30"
    : s.includes("hold") ? "bg-muted text-foreground border-border"
    : "bg-secondary text-muted-foreground border-border";
  return (
    <span className={`inline-block px-2.5 py-1 text-[0.6rem] tracking-[0.18em] uppercase border ${cls}`}>
      {status}
    </span>
  );
}
