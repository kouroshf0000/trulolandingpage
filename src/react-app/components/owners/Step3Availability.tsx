const VACANCY_OPTIONS = [
  { value: "vacant_now", label: "Vacant now", desc: "Ready to lease immediately" },
  { value: "available_soon", label: "Available within 3 months", desc: "Space will be ready soon" },
  { value: "planning_ahead", label: "Planning ahead", desc: "Considering listing in the future" },
] as const;

interface Step3AvailabilityProps {
  vacancyStatus: string;
  onVacancyStatusChange: (v: string) => void;
  errors: Record<string, string>;
}

export function Step3Availability({
  vacancyStatus,
  onVacancyStatusChange,
  errors,
}: Step3AvailabilityProps) {
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-4">When is the space available?</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-4">Pick the option that best describes your situation today.</p>

      <div className="space-y-3">
        {VACANCY_OPTIONS.map(({ value, label, desc }) => (
          <label
            key={value}
            className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              vacancyStatus === value
                ? "border-[#E67451] bg-[#E67451]/5"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="vacancy"
              checked={vacancyStatus === value}
              onChange={() => onVacancyStatusChange(value)}
              className="mt-1 w-4 h-4 text-[#E67451] border-slate-300 focus:ring-[#E67451]"
            />
            <div>
              <span className="font-medium text-[#0F2235] block">{label}</span>
              <span className="text-sm text-slate-500">{desc}</span>
            </div>
          </label>
        ))}
      </div>
      {errors.vacancy_status && <p className="text-xs text-red-500 mt-2">{errors.vacancy_status}</p>}
    </div>
  );
}
