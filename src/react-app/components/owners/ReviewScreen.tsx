import { useEffect, useRef } from "react";
import { BOSTON_AREAS } from "@/shared/bostonAreas";

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  property_manager: "Property Manager",
  broker: "Broker",
};
const SPACE_TYPE_LABELS: Record<string, string> = {
  office: "Office",
  retail: "Retail",
  restaurant: "Restaurant",
  studio: "Studio",
  industrial: "Industrial",
  mixed: "Mixed-use",
  other: "Other",
};
const VACANCY_LABELS: Record<string, string> = {
  vacant_now: "Vacant now",
  available_soon: "Available within 3 months",
  planning_ahead: "Planning ahead",
};
const PORTFOLIO_LABELS: Record<string, string> = {
  "1": "Just 1",
  "2-5": "2–5",
  "6-10": "6–10",
  "10+": "More than 10",
};

interface ReviewData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  companyName: string;
  propertyAddress: string;
  unitFloor: string;
  spaceType: string;
  sqft: string;
  numUnits: string;
  vacancyStatus: string;
  minTermMonths: number;
  portfolioCount: string;
  bostonAreas: string[];
  maAreasOther: string;
}

interface ReviewScreenProps {
  data: ReviewData;
  onEditStep: (step: number) => void;
  turnstileToken: string;
  onTurnstileChange: (token: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error?: string;
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

export function ReviewScreen({
  data,
  onEditStep,
  turnstileToken,
  onSubmit,
  submitting,
  error,
}: ReviewScreenProps) {
  const bostonLabels = data.bostonAreas.map((k) => BOSTON_AREAS[k] ?? k).join(", ");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const el = turnstileRef.current;
    if (!el) return;
    const render = () => {
      const w = (window as unknown as { turnstile?: { render: (el: HTMLElement, o: object) => string } }).turnstile;
      if (w && el && !widgetIdRef.current) {
        widgetIdRef.current = w.render(el, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: "onOwnersTurnstileSuccess",
          theme: "light",
          size: "normal",
        });
      }
    };
    if ((window as unknown as { turnstile?: unknown }).turnstile) render();
    else {
      const id = setInterval(() => {
        if ((window as unknown as { turnstile?: unknown }).turnstile) {
          clearInterval(id);
          render();
        }
      }, 50);
      return () => clearInterval(id);
    }
    return () => {
      const w = (window as unknown as { turnstile?: { remove?: (id: string) => void } }).turnstile;
      if (widgetIdRef.current && w?.remove) {
        w.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="font-serif text-2xl text-[#0F2235]">Ready to submit?</h2>
      <p className="text-[#475569]">Here's what you told us.</p>

      <div className="space-y-4">
        <section className="p-4 rounded-2xl bg-white/90 border border-slate-200/80">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0F2235]">About you</h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-sm text-[#E67451] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-[#475569] mt-2">{data.fullName}</p>
          <p className="text-sm text-[#475569]">{data.email}</p>
          {data.phone && <p className="text-sm text-[#475569]">{data.phone}</p>}
          <p className="text-sm text-[#475569]">{ROLE_LABELS[data.role] ?? data.role}</p>
          {data.companyName && <p className="text-sm text-[#475569]">{data.companyName}</p>}
        </section>

        <section className="p-4 rounded-2xl bg-white/90 border border-slate-200/80">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0F2235]">Your space</h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-sm text-[#E67451] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-[#475569] mt-2">{data.propertyAddress}</p>
          {data.unitFloor && <p className="text-sm text-[#475569]">{data.unitFloor}</p>}
          <p className="text-sm text-[#475569]">{SPACE_TYPE_LABELS[data.spaceType] ?? data.spaceType} · {data.sqft} sq ft · {data.numUnits} unit(s)</p>
        </section>

        <section className="p-4 rounded-2xl bg-white/90 border border-slate-200/80">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0F2235]">Availability</h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-sm text-[#E67451] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-[#475569] mt-2">{VACANCY_LABELS[data.vacancyStatus] ?? data.vacancyStatus}</p>
        </section>

        <section className="p-4 rounded-2xl bg-white/90 border border-slate-200/80">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0F2235]">Portfolio & location</h3>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-sm text-[#E67451] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-[#475569] mt-2">{PORTFOLIO_LABELS[data.portfolioCount] ?? data.portfolioCount} properties</p>
          <p className="text-sm text-[#475569]">{bostonLabels}</p>
          {data.maAreasOther && <p className="text-sm text-[#475569]">Other: {data.maAreasOther}</p>}
        </section>
      </div>

      <div ref={turnstileRef} />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!turnstileToken || submitting}
        className="w-full px-6 py-3 rounded-2xl bg-[#E67451] text-white font-medium hover:bg-[#d4633e] disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation flex items-center justify-center gap-2 shadow-md"
      >
        {submitting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting…
          </>
        ) : (
          "Submit My Space"
        )}
      </button>
    </div>
  );
}
