import { NeighborhoodCheckboxes } from "@/react-app/components/owners/NeighborhoodCheckboxes";

const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1_3_months", label: "Within 1–3 months" },
  { value: "3_6_months", label: "3–6 months out" },
  { value: "planning_ahead", label: "Just planning ahead" },
] as const;

interface TenantStep3LocationTimelineProps {
  bostonAreas: string[];
  bostonAreasOther: string;
  moveInTimeline: string;
  onBostonAreasChange: (v: string[]) => void;
  onBostonAreasOtherChange: (v: string) => void;
  onMoveInTimelineChange: (v: string) => void;
  errors: Record<string, string>;
}

export function TenantStep3LocationTimeline({
  bostonAreas,
  bostonAreasOther,
  moveInTimeline,
  onBostonAreasChange,
  onBostonAreasOtherChange,
  onMoveInTimelineChange,
  errors,
}: TenantStep3LocationTimelineProps) {
  const showOtherInput = bostonAreas.includes("other");
  const inputClass = "w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[#0F2235] placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20 transition-colors hover:border-slate-300";

  return (
    <div className="space-y-10 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-1">Location & timeline</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-6">Where do you want to be? When do you need to move?</p>

      {/* Neighborhoods section */}
      <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
        <label className="block text-sm font-medium text-[#0F2235] mb-3">Boston neighborhoods</label>
        <p className="text-xs text-slate-500 mb-4">Select all areas you're interested in. Tap to toggle.</p>
        <NeighborhoodCheckboxes
          selected={bostonAreas}
          onChange={onBostonAreasChange}
          error={errors.boston_areas}
        />
        {showOtherInput && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <label className="block text-sm font-medium text-[#0F2235] mb-2">Specify neighborhood</label>
            <input
              type="text"
              value={bostonAreasOther}
              onChange={(e) => onBostonAreasOtherChange(e.target.value)}
              placeholder="e.g. Charlestown, Brookline, Newton"
              className={inputClass}
            />
            {errors.boston_areas_other && (
              <p className="text-xs text-red-500 mt-1">{errors.boston_areas_other}</p>
            )}
          </div>
        )}
      </div>

      {/* Timeline section */}
      <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
        <label className="block text-sm font-medium text-[#0F2235] mb-4">Move-in timeline</label>
        <div className="space-y-2">
          {TIMELINE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                moveInTimeline === value
                  ? "border-[#E67451] bg-[#E67451]/5"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="move_in_timeline"
                checked={moveInTimeline === value}
                onChange={() => onMoveInTimelineChange(value)}
                className="w-4 h-4 text-[#E67451] border-slate-300 focus:ring-[#E67451]"
              />
              <span className="font-medium text-[#0F2235]">{label}</span>
            </label>
          ))}
        </div>
        {errors.move_in_timeline && <p className="text-xs text-red-500 mt-2">{errors.move_in_timeline}</p>}
      </div>
    </div>
  );
}
