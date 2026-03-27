const BUDGET_OPTIONS = [
  { value: "under_2k", label: "Under $2k" },
  { value: "2_5k", label: "$2–5k" },
  { value: "5_10k", label: "$5–10k" },
  { value: "10_20k", label: "$10–20k" },
  { value: "20k_plus", label: "$20k+" },
] as const;

interface TenantStep4BudgetContextProps {
  monthlyBudget: string;
  howHeard: string;
  notes: string;
  onMonthlyBudgetChange: (v: string) => void;
  onHowHeardChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  errors: Record<string, string>;
}

export function TenantStep4BudgetContext({
  monthlyBudget,
  howHeard,
  notes,
  onMonthlyBudgetChange,
  onHowHeardChange,
  onNotesChange,
  errors,
}: TenantStep4BudgetContextProps) {
  const inputClass = "w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[#0F2235] placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20 transition-colors hover:border-slate-300";
  const labelClass = "block text-sm text-[#475569] mb-1.5";

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-1">Budget & context</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-4">Monthly budget range helps us match you with the right spaces.</p>

      <div>
        <label className="block text-sm font-medium text-[#0F2235] mb-3">Monthly budget</label>
        <div className="space-y-2">
          {BUDGET_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                monthlyBudget === value
                  ? "border-[#E67451] bg-[#E67451]/5"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="monthly_budget"
                checked={monthlyBudget === value}
                onChange={() => onMonthlyBudgetChange(value)}
                className="w-4 h-4 text-[#E67451] border-slate-300 focus:ring-[#E67451]"
              />
              <span className="font-medium text-[#0F2235]">{label}/mo</span>
            </label>
          ))}
        </div>
        {errors.monthly_budget && <p className="text-xs text-red-500 mt-2">{errors.monthly_budget}</p>}
      </div>

      <div>
        <label className={labelClass}>How did you hear about us? <span className="text-slate-400 font-normal">(optional)</span></label>
        <input
          type="text"
          value={howHeard}
          onChange={(e) => onHowHeardChange(e.target.value)}
          placeholder="Google, LinkedIn, referral, etc."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Additional notes <span className="text-slate-400 font-normal">(optional)</span></label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Anything else we should know?"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
}
