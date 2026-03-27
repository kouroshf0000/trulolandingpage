interface TenantStep1AboutProps {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  role: string;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onCompanyNameChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  errors: Record<string, string>;
}

export function TenantStep1About({
  fullName,
  email,
  phone,
  companyName,
  role,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onCompanyNameChange,
  onRoleChange,
  errors,
}: TenantStep1AboutProps) {
  const inputClass = "w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-[#0F2235] placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20 transition-colors hover:border-slate-300";
  const labelClass = "block text-sm text-[#475569] mb-1.5";

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="font-serif text-xl text-[#0F2235] mb-1">About you</h2>
      <p className="text-[#475569] text-sm -mt-2 mb-4">We'll use this to reach you with matching spaces.</p>

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
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className={labelClass}>Phone number <span className="text-slate-400 font-normal">(optional)</span></label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Mobile preferred"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Company name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="Your company or business name"
          className={inputClass}
        />
        {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
      </div>

      <div>
        <label className={labelClass}>Your role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          placeholder="e.g. Founder, Operations Manager, Real Estate"
          className={inputClass}
        />
        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
      </div>
    </div>
  );
}
