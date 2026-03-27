const SPACE_TYPES = [
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "restaurant", label: "Restaurant" },
  { value: "studio", label: "Studio" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed", label: "Mixed-use" },
  { value: "other", label: "Other" },
] as const;

interface Step2SpaceProps {
  propertyAddress: string;
  unitFloor: string;
  spaceType: string;
  sqft: string;
  numUnits: string;
  onPropertyAddressChange: (v: string) => void;
  onUnitFloorChange: (v: string) => void;
  onSpaceTypeChange: (v: string) => void;
  onSqftChange: (v: string) => void;
  onNumUnitsChange: (v: string) => void;
  errors: Record<string, string>;
}

export function Step2Space({
  propertyAddress,
  unitFloor,
  spaceType,
  sqft,
  numUnits,
  onPropertyAddressChange,
  onUnitFloorChange,
  onSpaceTypeChange,
  onSqftChange,
  onNumUnitsChange,
  errors,
}: Step2SpaceProps) {
  const inputClass = "w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[#0F2235] placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20 transition-colors hover:border-slate-300";
  const labelClass = "block text-sm text-[#475569] mb-1.5";

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-1">Tell us about the property</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-4">Your main or first property you’d like to list.</p>

      <div>
        <label className={labelClass}>Property address</label>
        <input
          type="text"
          value={propertyAddress}
          onChange={(e) => onPropertyAddressChange(e.target.value)}
          placeholder="Street address — your main or first property"
          className={inputClass}
        />
        {errors.property_address && <p className="text-xs text-red-500 mt-1">{errors.property_address}</p>}
      </div>

      <div>
        <label className={labelClass}>Suite / floor <span className="text-slate-400 font-normal">(optional)</span></label>
        <input
          type="text"
          value={unitFloor}
          onChange={(e) => onUnitFloorChange(e.target.value)}
          placeholder="Unit number, floor, or 'Full building'"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Space type</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {SPACE_TYPES.map(({ value, label }) => {
            const isSelected = spaceType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onSpaceTypeChange(value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${isSelected
                    ? "bg-[#E67451] text-white border-2 border-[#E67451] shadow-sm"
                    : "bg-white text-[#0F2235] border border-slate-200 hover:border-slate-300"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.space_type && <p className="text-xs text-red-500 mt-2">{errors.space_type}</p>}
      </div>

      <div>
        <label className={labelClass}>Square footage</label>
        <input
          type="number"
          min={1}
          value={sqft}
          onChange={(e) => onSqftChange(e.target.value)}
          placeholder="Total leasable sq ft"
          className={inputClass}
        />
        {errors.sqft && <p className="text-xs text-red-500 mt-1">{errors.sqft}</p>}
      </div>

      <div>
        <label className={labelClass}>Units available</label>
        <input
          type="number"
          min={1}
          value={numUnits}
          onChange={(e) => onNumUnitsChange(e.target.value)}
          placeholder="How many separate units in this listing"
          className={inputClass}
        />
        {errors.num_units && <p className="text-xs text-red-500 mt-1">{errors.num_units}</p>}
      </div>
    </div>
  );
}
