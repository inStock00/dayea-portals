import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import villa from "@/assets/villa-interior.jpg";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dreamers/login")({
  component: DreamersLogin,
});

const DEMO_EMAIL = "sarah@dayea.demo";
const DEMO_PASSWORD = "DreamerDemo2025";

function DreamersLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
    setTimeout(() => navigate({ to: "/dreamers/lounge" }), 600);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Image */}
      <div className="relative hidden lg:block">
        <img src={villa} alt="" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="font-serif text-2xl tracking-[0.3em]">DAYEA</Link>
          <div>
            <p className="eyebrow text-white/70">Portal I</p>
            <h2 className="mt-4 font-serif text-4xl">The Dreamers Lounge</h2>
            <p className="mt-3 max-w-sm text-sm text-white/80">
              Where the island remembers you. Reserved exclusively for our returning guests.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-background px-6 py-16 lg:px-16">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors lg:hidden">
            ← DAYEA
          </Link>
          <p className="eyebrow mt-8 lg:mt-0">Returning Guest</p>
          <h1 className="mt-4 font-serif text-4xl">Welcome back.</h1>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Sign in with the private credentials we provided. Your stay history follows you across every visit.
          </p>

          <form onSubmit={handleSubmit} className="mt-12 space-y-7">
            <div>
              <label className="eyebrow block mb-3">Your email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="input-line"
                disabled={loading || sent}
              />
            </div>
            <div>
              <label className="eyebrow block mb-3">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-line"
                disabled={loading || sent}
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button type="submit" disabled={loading || sent} className="btn-primary w-full relative">
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner /> <span className="ml-3">Signing in</span>
                </span>
              )}
              {sent && !loading && <span>✓ Welcome back · Redirecting</span>}
              {!loading && !sent && <span>Enter the Lounge</span>}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              First time with us? <a className="underline-offset-4 underline hover:text-foreground" href="#">Begin your stay</a>
            </p>
          </form>

          <div className="mt-16 hairline" />
          <div className="mt-6 space-y-1 text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">
            <p>Demo account · prefilled</p>
            <p className="font-mono normal-case tracking-normal text-[0.7rem]">sarah@dayea.demo</p>
            <p className="font-mono normal-case tracking-normal text-[0.7rem]">DreamerDemo2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
