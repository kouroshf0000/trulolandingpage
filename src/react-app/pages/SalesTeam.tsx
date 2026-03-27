import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { LogOut, User, LayoutGrid, BookOpen } from "lucide-react";
import TruloLogo from "@/react-app/components/TruloLogo";

type View = "pipeline" | "playbook";

type UserData = { email: string };

export default function SalesTeam() {
  const [view, setView] = useState<View>("pipeline");
  const [user, setUser] = useState<UserData | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/users/me", { credentials: "include" });
      if (res.ok) {
        const u = await res.json();
        setUser(u);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSubmitting(true);
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(data.error || "Sign in failed");
          return;
        }
        setUser({ email });
      } finally {
        setSubmitting(false);
      }
    },
    [email, password]
  );

  const logout = useCallback(async () => {
    await fetch("/api/logout", { credentials: "include" });
    setUser(null);
  }, []);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#E67451] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#475569]">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f9f7f4] flex flex-col">
        <header className="relative z-10 px-6 py-5">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <TruloLogo />
            </Link>
            <Link
              to="/"
              className="text-sm text-[#475569] hover:text-[#0F2235] transition-colors"
            >
              ← Back
            </Link>
          </div>
        </header>
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
          <div className="glass-card rounded-2xl p-8 md:p-10 max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E67451]/10 text-[#E67451] mb-6">
              <User className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0F2235] mb-2">
              Sales Team
            </h1>
            <p className="text-[#475569] mb-6">
              Sign in to access the pipeline and playbook.
            </p>
            <form onSubmit={login} className="space-y-4 text-left">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0F2235] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-[#0F2235] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#E67451]/30 focus:border-[#E67451]"
                  placeholder="contact@jointrulo.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#0F2235] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-[#0F2235] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#E67451]/30 focus:border-[#E67451]"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#E67451] text-white font-medium hover:bg-[#d4633e] transition-colors disabled:opacity-70"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f9f7f4]">
      <header className="flex-shrink-0 bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-full px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <TruloLogo />
            </Link>
            <div className="h-5 w-px bg-[#e2e8f0]" />
            <nav className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView("pipeline")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === "pipeline"
                    ? "bg-[#E67451]/10 text-[#E67451] border border-[#E67451]/30"
                    : "bg-transparent text-[#475569] border border-[#e2e8f0] hover:text-[#0F2235] hover:border-[#cbd5e1]"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Pipeline
              </button>
              <button
                type="button"
                onClick={() => setView("playbook")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === "playbook"
                    ? "bg-[#E67451]/10 text-[#E67451] border border-[#E67451]/30"
                    : "bg-transparent text-[#475569] border border-[#e2e8f0] hover:text-[#0F2235] hover:border-[#cbd5e1]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Playbook
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#475569]">
              <div className="w-8 h-8 rounded-full bg-[#E67451]/20 flex items-center justify-center">
                <span className="text-[#E67451] font-semibold text-sm">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
              <span className="max-w-[140px] truncate">{user.email}</span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0F2235] transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 min-h-0">
        <iframe
          key={view}
          src={view === "pipeline" ? "/pipeline.html" : "/playbook.html"}
          title={view === "pipeline" ? "Trulo Pipeline" : "Trulo Sales Playbook"}
          className="w-full h-full border-0 block"
        />
      </div>
    </div>
  );
}
