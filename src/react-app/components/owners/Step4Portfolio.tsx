import { NeighborhoodCheckboxes } from "./NeighborhoodCheckboxes";

const PORTFOLIO_OPTIONS = [
  { value: "1", label: "Just 1" },
  { value: "2-5", label: "2–5" },
  { value: "6-10", label: "6–10" },
  { value: "10+", label: "More than 10" },
] as const;

interface Step4PortfolioProps {
  portfolioCount: string;
  bostonAreas: string[];
  maAreasOther: string;
  onPortfolioCountChange: (v: string) => void;
  onBostonAreasChange: (v: string[]) => void;
  onMaAreasOtherChange: (v: string) => void;
  errors: Record<string, string>;
}

export function Step4Portfolio({
  portfolioCount,
  bostonAreas,
  maAreasOther,
  onPortfolioCountChange,
  onBostonAreasChange,
  onMaAreasOtherChange,
  errors,
}: Step4PortfolioProps) {
  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-1">Portfolio & location</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-4">Tell us about your properties and where they’re located.</p>

      <div>
        <label className="block text-sm font-medium text-[#0F2235] mb-3">Properties you own or manage</label>
        <div className="flex flex-wrap gap-2">
          {PORTFOLIO_OPTIONS.map(({ value, label }) => {
            const isSelected = portfolioCount === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onPortfolioCountChange(value)}
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
        {errors.portfolio_count && <p className="text-xs text-red-500 mt-2">{errors.portfolio_count}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0F2235] mb-3">Boston neighborhoods</label>
        <p className="text-xs text-slate-500 mb-3">Select all areas where you have space. Tap to toggle.</p>
        <NeighborhoodCheckboxes selected={bostonAreas} onChange={onBostonAreasChange} error={errors.boston_areas} />
      </div>

      <div className={bostonAreas.includes("other") ? "p-4 rounded-2xl bg-slate-50 border border-slate-200" : ""}>
        <label className="block text-sm font-medium text-[#0F2235] mb-2">
          {bostonAreas.includes("other")
            ? "Specify neighborhood or other MA area"
            : "Other MA areas "}
          {!bostonAreas.includes("other") && (
            <span className="text-slate-400 font-normal">(optional)</span>
          )}
        </label>
        <input
          type="text"
          value={maAreasOther}
          onChange={(e) => onMaAreasOtherChange(e.target.value)}
          placeholder={bostonAreas.includes("other") ? "e.g. Charlestown, Worcester, Cambridge" : "E.g. Worcester, Cambridge, Somerville — leave blank if Boston only"}
          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[#0F2235] placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20 transition-colors hover:border-slate-300"
        />
      </div>
    </div>
  );
}
