import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/partners/login")({
  component: PartnersLogin,
});

function PartnersLogin() {
  const navigate = useNavigate();
  const [agentId, setAgentId] = useState("VL-2274-A");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    navigate({ to: "/partners/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-6 py-16">
      <div className="w-full max-w-md animate-fade-up">
        <Link to="/" className="text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors">
          ← DAYEA
        </Link>

        <div className="mt-10 card-soft p-10 lg:p-12">
          <p className="eyebrow">Portal II · Secure</p>
          <h1 className="mt-4 font-serif text-3xl">Preferred Partner Program</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Authorized travel advisors only. Your activity is monitored and audited.
          </p>

          <div className="hairline my-8" />

          <form onSubmit={handleSubmit} className="space-y-7">
            <Field label="Agent Corporate ID">
              <input value={agentId} onChange={(e) => setAgentId(e.target.value)} required className="input-line font-mono" placeholder="VL-0000-X" />
            </Field>
            <Field label="Advisor Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-line" placeholder="advisor@luxetravel.com" />
            </Field>
            <Field label="Password">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-line" placeholder="••••••••" />
            </Field>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-current" />
                Trust this device (30 days)
              </label>
              <a href="#" className="underline underline-offset-4 hover:text-foreground">Reset</a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-current animate-pulse" />
                  Authenticating
                </span>
              ) : "Secure Sign In"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              Not a partner yet? <a href="#" className="text-foreground underline-offset-4 underline">Apply</a>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground">
          Demo — any credentials proceed to the dashboard
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2">{label}</span>
      {children}
    </label>
  );
}
