import { ArrowRight, Search } from "lucide-react";

interface TenantWelcomeScreenProps {
  email?: string;
  onGetStarted: () => void;
}

export function TenantWelcomeScreen({ email, onGetStarted }: TenantWelcomeScreenProps) {
  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 text-sm text-[#0F2235] mb-6 opacity-0 animate-fade-in-up shadow-sm">
        <Search className="w-4 h-4 text-[#E67451]" />
        Find your space
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 opacity-0 animate-fade-in-up animation-delay-100 text-[#0F2235]">
        Tell us what{" "}
        <span className="text-[#E67451]">you need</span>
      </h1>
      <p className="text-[#475569] text-lg sm:text-xl mb-6 max-w-md mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
        About 2 minutes. Trulo uses a 30-day protected period with 30-day rolling notice — scale up or down as your business evolves.
      </p>
      {email && (
        <p className="text-sm text-slate-500 mb-6 opacity-0 animate-fade-in-up animation-delay-200">
          Continuing as <span className="text-[#475569] font-medium">{email}</span>
        </p>
      )}
      <button
        type="button"
        onClick={onGetStarted}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#E67451] text-white font-medium hover:bg-[#d4633e] transition-all touch-manipulation opacity-0 animate-fade-in-up animation-delay-300 hover:scale-[1.02] active:scale-[0.98] shadow-md"
      >
        Get Started
        <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-xs text-slate-500 mt-8 opacity-0 animate-fade-in-up animation-delay-300">
        Boston commercial spaces. Flexible mid-term rentals.
      </p>
    </div>
  );
}
