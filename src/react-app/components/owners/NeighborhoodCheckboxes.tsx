import { BOSTON_AREAS } from "@/shared/bostonAreas";

interface NeighborhoodCheckboxesProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: string;
}

export function NeighborhoodCheckboxes({ selected, onChange, error }: NeighborhoodCheckboxesProps) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(BOSTON_AREAS).map(([key, label]) => {
          const isSelected = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all select-none
                ${isSelected
                  ? "bg-[#E67451] text-white border-2 border-[#E67451] shadow-sm"
                  : "bg-white text-[#0F2235] border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-slate-500 mt-3">
          {selected.length} neighborhood{selected.length !== 1 ? "s" : ""} selected
        </p>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
