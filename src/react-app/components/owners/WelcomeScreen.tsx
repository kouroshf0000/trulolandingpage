import { ArrowRight, Building2 } from "lucide-react";

interface WelcomeScreenProps {
  email?: string;
  onGetStarted: () => void;
}

export function WelcomeScreen({ email, onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-slate-200/80 text-sm text-[#0F2235] mb-6 opacity-0 animate-fade-in-up shadow-sm">
        <Building2 className="w-4 h-4 text-[#E67451]" />
        List your space
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 opacity-0 animate-fade-in-up animation-delay-100 text-[#0F2235]">
        Tell us about{" "}
        <span className="text-[#E67451]">your space</span>
      </h1>
      <p className="text-[#475569] text-lg sm:text-xl mb-6 max-w-md mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
        About 2 minutes. We review every submission personally and will reach out within 24 hours.
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
        Boston commercial spaces only. Free to list.
      </p>
    </div>
  );
}
