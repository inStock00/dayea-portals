import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import villa from "@/assets/villa-interior.jpg";

export const Route = createFileRoute("/dreamers/login")({
  component: DreamersLogin,
});

function DreamersLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sarah@example.com");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
    setTimeout(() => navigate({ to: "/dreamers/lounge" }), 1100);
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
            We don't ask you to remember passwords. Enter your email and we'll send a
            private link to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
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

            <button type="submit" disabled={loading || sent} className="btn-primary w-full relative">
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Spinner /> <span className="ml-3">Sending</span>
                </span>
              )}
              {sent && !loading && <span>✓ Link Sent · Redirecting</span>}
              {!loading && !sent && <span>Request Magic Link</span>}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              First time with us? <a className="underline-offset-4 underline hover:text-foreground" href="#">Begin your stay</a>
            </p>
          </form>

          <div className="mt-16 hairline" />
          <p className="mt-6 text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground">
            Demo — any email proceeds to the lounge
          </p>
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
