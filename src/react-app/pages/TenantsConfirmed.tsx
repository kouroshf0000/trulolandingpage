import { Link } from "react-router";
import TruloLogo from "@/react-app/components/TruloLogo";

function TenantsConfirmed() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col">
      {/* Warm background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#f9f7f4]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full animate-float-slow"
          style={{
            background: "radial-gradient(circle, rgba(180, 170, 160, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full animate-float-delayed"
          style={{
            background: "radial-gradient(circle, rgba(180, 170, 160, 0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Skyline background */}
      <div className="absolute inset-0 min-h-[100vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80"
          alt=""
          className="w-full h-full min-h-[100vh] object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/55 to-background" />
      </div>

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

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg mx-auto text-center opacity-0 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-sm text-emerald-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Thank you
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F2235] mb-4">
            Thanks for reaching out.
          </h1>
          <p className="text-[#475569] text-lg mb-6 leading-relaxed">
            We review every submission personally and will match you with spaces that fit.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200 shadow-sm mb-8">
            <span className="text-[#0F2235] font-medium">You will receive a response in 24 hours or less.</span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E67451] text-white font-medium hover:bg-[#d4633e] transition-all touch-manipulation shadow-md"
          >
            ← Back to Trulo
          </Link>
          <p className="text-sm text-slate-500 mt-8">
            Questions?{" "}
            <a href="mailto:hello@jointrulo.com" className="text-[#475569] hover:text-[#0F2235] transition-colors">
              hello@jointrulo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TenantsConfirmed;
