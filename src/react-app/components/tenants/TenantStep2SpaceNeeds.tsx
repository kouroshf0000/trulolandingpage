const SPACE_TYPES = [
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "restaurant", label: "Restaurant" },
  { value: "studio", label: "Studio" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed", label: "Mixed" },
  { value: "other", label: "Other" },
] as const;

const SQFT_RANGES = [
  { value: "under_500", label: "Under 500" },
  { value: "500_1000", label: "500–1,000" },
  { value: "1000_2500", label: "1,000–2,500" },
  { value: "2500_5000", label: "2,500–5,000" },
  { value: "5000_plus", label: "5,000+" },
] as const;

const HEADCOUNT_OPTIONS = [
  { value: "1-5", label: "1–5" },
  { value: "6-10", label: "6–10" },
  { value: "11-25", label: "11–25" },
  { value: "26-50", label: "26–50" },
  { value: "50+", label: "50+" },
] as const;

interface TenantStep2SpaceNeedsProps {
  spaceTypes: string[];
  sqftRange: string;
  headcount: string;
  onSpaceTypesChange: (v: string[]) => void;
  onSqftRangeChange: (v: string) => void;
  onHeadcountChange: (v: string) => void;
  errors: Record<string, string>;
}

export function TenantStep2SpaceNeeds({
  spaceTypes,
  sqftRange,
  headcount,
  onSpaceTypesChange,
  onSqftRangeChange,
  onHeadcountChange,
  errors,
}: TenantStep2SpaceNeedsProps) {
  const toggleSpaceType = (value: string) => {
    if (spaceTypes.includes(value)) {
      onSpaceTypesChange(spaceTypes.filter((t) => t !== value));
    } else {
      onSpaceTypesChange([...spaceTypes, value]);
    }
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-1">Space needs</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-4">Select all space types you're interested in.</p>

      <div>
        <label className="block text-sm text-[#475569] mb-3">Space type</label>
        <div className="flex flex-wrap gap-2">
          {SPACE_TYPES.map(({ value, label }) => {
            const isSelected = spaceTypes.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleSpaceType(value)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all
                  ${isSelected
                    ? "bg-[#E67451] text-white border-2 border-[#E67451] shadow-sm"
                    : "bg-white text-[#0F2235] border-2 border-slate-200 hover:border-slate-300"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.space_types && <p className="text-xs text-red-500 mt-2">{errors.space_types}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0F2235] mb-3">Square footage range</label>
        <div className="space-y-2">
          {SQFT_RANGES.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                sqftRange === value
                  ? "border-[#E67451] bg-[#E67451]/5"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="sqft_range"
                checked={sqftRange === value}
                onChange={() => onSqftRangeChange(value)}
                className="w-4 h-4 text-[#E67451] border-slate-300 focus:ring-[#E67451]"
              />
              <span className="font-medium text-[#0F2235]">{label} sq ft</span>
            </label>
          ))}
        </div>
        {errors.sqft_range && <p className="text-xs text-red-500 mt-2">{errors.sqft_range}</p>}
      </div>

      <div>
        <label className="block text-sm text-[#475569] mb-3">Headcount <span className="text-slate-400 font-normal">(optional)</span></label>
        <div className="flex flex-wrap gap-2">
          {HEADCOUNT_OPTIONS.map(({ value, label }) => {
            const isSelected = headcount === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onHeadcountChange(isSelected ? "" : value)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all
                  ${isSelected
                    ? "bg-[#E67451] text-white border-2 border-[#E67451] shadow-sm"
                    : "bg-white text-[#0F2235] border-2 border-slate-200 hover:border-slate-300"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
