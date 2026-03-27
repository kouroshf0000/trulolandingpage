import { ArrowLeft } from "lucide-react";

interface StepNavProps {
  onBack: () => void;
  onContinue: () => void;
  backDisabled?: boolean;
  continueLabel?: string;
  loading?: boolean;
}

export function StepNav({
  onBack,
  onContinue,
  backDisabled = false,
  continueLabel = "Continue →",
  loading = false,
}: StepNavProps) {
  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#0F2235] disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={loading}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#E67451] text-white text-sm font-medium hover:bg-[#d4633e] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all touch-manipulation shadow-md"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting…
            </>
          ) : (
            continueLabel
          )}
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-4">
        Trulo reviews all submissions within 24 hours.
      </p>
    </div>
  );
}
