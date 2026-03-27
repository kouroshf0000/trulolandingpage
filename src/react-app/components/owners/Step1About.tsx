interface Step1AboutProps {
  fullName: string;
  email: string;
  phone: string;
  role: "owner" | "property_manager" | "broker" | "";
  companyName: string;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onRoleChange: (v: "owner" | "property_manager" | "broker") => void;
  onCompanyNameChange: (v: string) => void;
  errors: Record<string, string>;
}

export function Step1About({
  fullName,
  email,
  phone,
  role,
  companyName,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onRoleChange,
  onCompanyNameChange,
  errors,
}: Step1AboutProps) {
  const inputClass = "w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[#0F2235] placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20 transition-colors hover:border-slate-300";
  const labelClass = "block text-sm text-[#475569] mb-1.5";

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-1">About you</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-4">We’ll use this to reach you during onboarding.</p>

      <div>
        <label className={labelClass}>Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="First and last name"
          className={inputClass}
        />
        {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
      </div>

      <div>
        <label className={labelClass}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="your@email.com"
          className={inputClass}
        />
        {errors.waitlist_email && <p className="text-xs text-red-500 mt-1">{errors.waitlist_email}</p>}
      </div>

      <div>
        <label className={labelClass}>Phone number <span className="text-slate-400 font-normal">(optional)</span></label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Mobile preferred — for our onboarding call"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Your role</label>
        <div className="flex flex-wrap gap-2">
          {(["owner", "property_manager", "broker"] as const).map((r) => {
            const label = r.replace("_", " ");
            const isSelected = role === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onRoleChange(r)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium capitalize transition-all
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
        {errors.role && <p className="text-xs text-red-500 mt-2">{errors.role}</p>}
      </div>

      <div>
        <label className={labelClass}>Company / Building <span className="text-slate-400 font-normal">(optional)</span></label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="LLC name, building name, or leave blank"
          className={inputClass}
        />
      </div>
    </div>
  );
}
