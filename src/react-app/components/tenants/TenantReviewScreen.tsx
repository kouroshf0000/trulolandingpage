import { useEffect, useRef } from "react";
import { BOSTON_AREAS } from "@/shared/bostonAreas";

const SPACE_TYPE_LABELS: Record<string, string> = {
  office: "Office",
  retail: "Retail",
  restaurant: "Restaurant",
  studio: "Studio",
  industrial: "Industrial",
  mixed: "Mixed",
  other: "Other",
};
const SQFT_LABELS: Record<string, string> = {
  under_500: "Under 500",
  "500_1000": "500–1,000",
  "1000_2500": "1,000–2,500",
  "2500_5000": "2,500–5,000",
  "5000_plus": "5,000+",
};
const HEADCOUNT_LABELS: Record<string, string> = {
  "1-5": "1–5",
  "6-10": "6–10",
  "11-25": "11–25",
  "26-50": "26–50",
  "50+": "50+",
};
const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  "1_3_months": "Within 1–3 months",
  "3_6_months": "3–6 months out",
  planning_ahead: "Just planning ahead",
};
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
const BUDGET_LABELS: Record<string, string> = {
  under_2k: "Under $2k",
  "2_5k": "$2–5k",
  "5_10k": "$5–10k",
  "10_20k": "$10–20k",
  "20k_plus": "$20k+",
};

interface TenantReviewData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  role: string;
  spaceTypes: string[];
  sqftRange: string;
  headcount: string;
  bostonAreas: string[];
  bostonAreasOther: string;
  moveInTimeline: string;
  monthlyBudget: string;
  howHeard: string;
  notes: string;
}

interface TenantReviewScreenProps {
  data: TenantReviewData;
  onEditStep: (step: number) => void;
  turnstileToken: string;
  onTurnstileChange: (token: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error?: string;
}

function TenantReviewScreen({
  data,
  onEditStep,
  turnstileToken,
  onSubmit,
  submitting,
  error,
}: TenantReviewScreenProps) {
  const bostonLabels = [
    ...data.bostonAreas.filter((k) => k !== "other").map((k) => BOSTON_AREAS[k] ?? k),
    ...(data.bostonAreas.includes("other") && data.bostonAreasOther
      ? [data.bostonAreasOther]
      : data.bostonAreas.includes("other")
        ? ["Other"]
        : []),
  ].join(", ");
  const spaceTypeLabels = data.spaceTypes.map((t) => SPACE_TYPE_LABELS[t] ?? t).join(", ");
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
          callback: "onTenantsTurnstileSuccess",
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
          <p className="text-sm text-[#475569]">{data.companyName}</p>
          <p className="text-sm text-[#475569]">{data.role}</p>
        </section>

        <section className="p-4 rounded-2xl bg-white/90 border border-slate-200/80">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0F2235]">Space needs</h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-sm text-[#E67451] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-[#475569] mt-2">{spaceTypeLabels}</p>
          <p className="text-sm text-[#475569]">{SQFT_LABELS[data.sqftRange] ?? data.sqftRange} sq ft</p>
          {data.headcount && (
            <p className="text-sm text-[#475569]">{HEADCOUNT_LABELS[data.headcount] ?? data.headcount} people</p>
          )}
        </section>

        <section className="p-4 rounded-2xl bg-white/90 border border-slate-200/80">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0F2235]">Location & timeline</h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-sm text-[#E67451] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-[#475569] mt-2">{bostonLabels}</p>
          <p className="text-sm text-[#475569]">{TIMELINE_LABELS[data.moveInTimeline] ?? data.moveInTimeline}</p>
        </section>

        <section className="p-4 rounded-2xl bg-white/90 border border-slate-200/80">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-[#0F2235]">Budget & context</h3>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-sm text-[#E67451] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-[#475569] mt-2">{BUDGET_LABELS[data.monthlyBudget] ?? data.monthlyBudget}/mo</p>
          {data.howHeard && <p className="text-sm text-[#475569]">Heard: {data.howHeard}</p>}
          {data.notes && <p className="text-sm text-[#475569] mt-2">{data.notes}</p>}
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
          "Submit"
        )}
      </button>
    </div>
  );
}

export default TenantReviewScreen;
