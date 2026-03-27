interface StepIndicatorProps {
  step: number;
  total?: number;
}

export function StepIndicator({ step, total = 4 }: StepIndicatorProps) {
  const pct = (step / total) * 100;
  return (
    <div className="w-full px-6 pb-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-[#475569] mb-2">
          Step {step} of {total}
        </p>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E67451] to-[#d4633e] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
