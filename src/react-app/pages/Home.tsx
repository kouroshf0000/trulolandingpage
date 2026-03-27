import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Building2, Shield, Clock, ChevronDown } from "lucide-react";
import TruloLogo from "@/react-app/components/TruloLogo";
import { LogoCloud } from "@/react-app/components/ui/logo-cloud";
import { Timeline } from "@/react-app/components/ui/timeline";
import { logoUrls } from "@/react-app/logos";

type UserType = "has-space" | "needs-space" | null;

function StatCountUp({ end, suffix, visible, label, accentColor }: { end: number; suffix: string; visible: boolean; label: string; accentColor?: boolean }) {
  const [value, setValue] = useState(0);
  const duration = 2400;
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    let raf: number;
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(end * eased);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [visible, end]);

  return (
    <div className="flex flex-col items-center gap-0.5 transition-all duration-500 ease-out">
      <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${accentColor ? "text-[#E67451]" : "text-[#0F2235]"}`}>
        {value.toFixed(end % 1 ? 1 : 0)}{suffix}
      </span>
      <span className="text-sm text-[#475569] transition-opacity duration-700 delay-200">{label}</span>
    </div>
  );
}

function StatFade({ value, label, accentColor }: { value: string; label: string; accentColor?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-2xl sm:text-3xl font-bold ${accentColor ? "text-[#E67451]" : "text-[#0F2235]"}`}>{value}</span>
      <span className="text-sm text-[#475569]">{label}</span>
    </div>
  );
}

const fillingTheGapLogos = [
  { src: logoUrls.loopnet, alt: "LoopNet" },
  { src: logoUrls.peerspace, alt: "Peerspace" },
  { src: logoUrls.storefront, alt: "The Storefront" },
  { src: logoUrls.cbre, alt: "CBRE" },
  { src: logoUrls.cushmanWakefield, alt: "Cushman & Wakefield" },
  { src: logoUrls.wework, alt: "WeWork" },
];

const features = [
  {
    icon: Building2,
    title: "Flexible Spaces",
    description: "From pop-up retail to production kitchens, find the perfect space for your venture.",
  },
  {
    icon: Clock,
    title: "Flexible Mid-Term Rentals",
    description: "Month-to-month commitments with 30-day rolling notice. Scale as your business grows.",
  },
  {
    icon: Shield,
    title: "Verified Listings & Tenants",
    description: "Every space and business is vetted for quality, safety, and authenticity.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [heroUserType, setHeroUserType] = useState<UserType>(null);
  const [bottomUserType, setBottomUserType] = useState<UserType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showHeroUserTypeError, setShowHeroUserTypeError] = useState(false);
  const [showBottomUserTypeError, setShowBottomUserTypeError] = useState(false);
  
  // Animated text rotation
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["space sharing", "leasing", "commercial space", "workspace", "flex-space"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Scroll reveal
  const aboutSectionRef = useRef<HTMLElement>(null);
  const quoteSectionRef = useRef<HTMLElement>(null);
  const tickerSectionRef = useRef<HTMLElement>(null);
  const timelineSectionRef = useRef<HTMLDivElement>(null);
  const benefitsSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [isTickerVisible, setIsTickerVisible] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [isBenefitsVisible, setIsBenefitsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === aboutSectionRef.current) setIsAboutVisible(true);
          if (entry.target === quoteSectionRef.current) setIsQuoteVisible(true);
          if (entry.target === tickerSectionRef.current) setIsTickerVisible(true);
          if (entry.target === timelineSectionRef.current) setIsTimelineVisible(true);
          if (entry.target === benefitsSectionRef.current) setIsBenefitsVisible(true);
          if (entry.target === footerRef.current) setIsFooterVisible(true);
        });
      },
      { threshold: 0.05 }
    );

    const els = [
      aboutSectionRef.current,
      quoteSectionRef.current,
      tickerSectionRef.current,
      timelineSectionRef.current,
      benefitsSectionRef.current,
      footerRef.current,
    ];
    els.forEach((el) => el && observer.observe(el));
    return () => els.forEach((el) => el && observer.unobserve(el));
  }, []);

  const handleSubmit = async (e: React.FormEvent, source: "hero" | "bottom") => {
    e.preventDefault();
    const userType = source === "hero" ? heroUserType : bottomUserType;
    if (!userType) {
      source === "hero" ? setShowHeroUserTypeError(true) : setShowBottomUserTypeError(true);
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const formEl = e.currentTarget as HTMLFormElement;
    const turnstileEl = formEl.querySelector('textarea[name="cf-turnstile-response"]') as HTMLTextAreaElement | null;
    const turnstileToken = turnstileEl?.value?.trim() ?? "";
    if (turnstileEl && !turnstileToken) {
      alert("Please complete the security check before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Trulo-Client": "web",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          userType,
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          "cf-turnstile-response": turnstileToken || undefined,
        }),
      });

      if (response.ok) {
        const params = new URLSearchParams();
        params.set("email", btoa(trimmedEmail));
        if (name.trim()) params.set("name", name.trim());
        if (phone.trim()) params.set("phone", phone.trim());
        const q = params.toString();
        const path = userType === "has-space" ? "/owners" : "/tenants";
        navigate(`${path}${q ? `?${q}` : ""}`);
      } else {
        let msg = "Something went wrong. Please try again.";
        try {
          const data = await response.json();
          if (data && typeof data.error === "string") msg = data.error;
        } catch {
          /* non-JSON body, use default msg */
        }
        alert(msg);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [quoteSectionRef, tickerSectionRef, aboutSectionRef];

  const scrollToNextSection = () => {
    const vh = window.innerHeight * 0.25;
    for (let i = 0; i < sections.length; i++) {
      const el = sections[i].current;
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top > vh) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    sections[0].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden page-transition">
      {/* Warm, cozy background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#f9f7f4]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(180, 170, 160, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(180, 170, 160, 0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Subtle texture */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero section with form */}
      <section className="flex items-center justify-center px-4 sm:px-6 pt-14 pb-4 sm:pt-20 sm:pb-6 md:pt-28 md:pb-8 relative z-10">
        {/* Skyline background image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80"
            alt="City skyline"
            className="w-full h-full object-cover object-center opacity-40 object-top sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/55 to-background sm:from-background/40 sm:via-background/60 sm:to-background" />
        </div>

        <div className="w-full max-w-md relative z-10 py-2">
          {/* Logo */}
          <div className="flex justify-center mb-5 sm:mb-8 opacity-0 animate-fade-in-up">
            <TruloLogo />
          </div>

          {/* Hero card — floating glass */}
          <div className="glass-card rounded-2xl sm:rounded-[1.5rem] p-6 sm:p-10 md:p-12 opacity-0 animate-scale-in animation-delay-100 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E67451]/15 to-transparent pointer-events-none" />
            {/* Subtle inner gradient glow */}
            {/* Tagline */}
            <div className="text-center mb-6 sm:mb-10">
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal tracking-tight mb-2 sm:mb-4 text-[#0F2235] leading-snug">
                The smarter way to find and fill commercial space
              </h1>
              <p className="text-[#475569] text-sm md:text-base transition-opacity duration-500 ease-out leading-relaxed">
                {heroUserType === "has-space"
                  ? "Stop losing money to vacancy. Get vetted tenants in days."
                  : heroUserType === "needs-space"
                    ? "Flexible space in Boston. 1–6 month terms, no long-term commitment."
                    : "Mid-term commercial rentals. Owners and tenants, connected."}
              </p>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, "hero")} className="space-y-4 sm:space-y-6">
                {/* User type selection */}
                <div>
                  {showHeroUserTypeError && !heroUserType && (
                    <p className="text-xs text-red-400 text-center mb-3 animate-pulse">Please select one</p>
                  )}
                  <div className="flex gap-2 sm:gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => { setHeroUserType("has-space"); setShowHeroUserTypeError(false); }}
                    className={`flex-1 min-h-[44px] sm:min-h-0 px-4 sm:px-5 py-3.5 rounded-2xl border text-sm font-medium relative overflow-hidden group touch-manipulation
                      transition-all duration-500 ease-out ${
                        heroUserType === "has-space"
                        ? "border-[#E67451]/50 bg-white/95 text-[#0F2235] shadow-md scale-[1.02]"
                        : "border-slate-200/80 bg-white/70 text-[#475569] hover:border-slate-300 hover:bg-white/90 hover:text-[#0F2235] hover:scale-[1.02]"
                    }`}
                  >
                    <span className="relative z-10">I have space</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setHeroUserType("needs-space"); setShowHeroUserTypeError(false); }}
                    className={`flex-1 min-h-[44px] sm:min-h-0 px-4 sm:px-5 py-3.5 rounded-2xl border text-sm font-medium relative overflow-hidden group touch-manipulation
                      transition-all duration-500 ease-out ${
                        heroUserType === "needs-space"
                        ? "border-[#E67451]/50 bg-white/95 text-[#0F2235] shadow-md scale-[1.02]"
                        : "border-slate-200/80 bg-white/70 text-[#475569] hover:border-slate-300 hover:bg-white/90 hover:text-[#0F2235] hover:scale-[1.02]"
                    }`}
                  >
                    <span className="relative z-10">I need space</span>
                  </button>
                  </div>
                </div>

                {/* Email input */}
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    onFocus={() => setShowOptionalFields(true)}
                    placeholder={heroUserType === "has-space" ? "Enter your work email" : heroUserType === "needs-space" ? "Enter your business email" : "Enter your email"}
                    required
                    className="w-full min-h-[44px] px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-white border border-slate-200 text-[#0F2235] text-base 
                             placeholder:text-slate-400 focus:outline-none 
                             focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20
                             transition-all duration-500 ease-out
                             hover:border-slate-300"
                  />
                </div>

                {/* Optional fields - appear when email is focused */}
                <div 
                  className={`grid grid-cols-2 gap-2 sm:gap-3 overflow-hidden transition-all duration-500 ease-out ${
                    showOptionalFields 
                      ? "max-h-24 sm:max-h-20 opacity-100" 
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="relative group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="Name (optional)"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-[#0F2235]
                               placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20
                               transition-all duration-500 ease-out hover:border-slate-300"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      placeholder="Phone (optional)"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm text-[#0F2235]
                               placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20
                               transition-all duration-500 ease-out hover:border-slate-300"
                    />
                  </div>
                </div>

                {/* Cloudflare Turnstile - bot protection (CISO Directive 02) */}
                <div
                  className="cf-turnstile"
                  data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                  data-theme="light"
                  data-size="compact"
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!email.trim() || !heroUserType || isSubmitting}
                  className="w-full min-h-[48px] py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold relative overflow-hidden group touch-manipulation
                           bg-[#E67451] text-white
                           hover:bg-[#d4633e] hover:scale-[1.02]
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                           transition-all duration-500 ease-out flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Signing up...
                      </>
                    ) : (
                      <>
                        {heroUserType === "has-space"
                          ? "List My Space"
                          : heroUserType === "needs-space"
                            ? "Find a Space"
                            : "Get Early Access"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </button>
              </form>
          </div>

          {/* Footer text with scroll indicator */}
          <div className="text-center mt-5 sm:mt-8 mb-0 opacity-0 animate-fade-in animation-delay-500">
            <p className="text-xs sm:text-sm text-[#475569] mb-2 sm:mb-4">
              Launching in Boston — be first in.
            </p>
            <button
              onClick={scrollToNextSection}
              type="button"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-sm text-[#475569] hover:text-[#0F2235] active:text-[#0F2235] transition-colors duration-300 group touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Learn more
              <ChevronDown className="w-4 h-4 animate-subtle-bounce" />
            </button>
          </div>
        </div>

      </section>

      {/* Social proof quote */}
      <section ref={quoteSectionRef} className={`relative z-10 px-4 sm:px-6 py-12 sm:py-20 md:py-24 ${isQuoteVisible ? 'scroll-reveal' : 'opacity-0'}`}>
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="font-serif text-base sm:text-xl text-[#475569] leading-relaxed italic">
            &ldquo;Filling in our spaces while we look for long-term tenants provides considerable upside across all our properties.&rdquo;
          </blockquote>
          <footer className="mt-3 sm:mt-4 text-sm text-[#334155]">
            Richard Cohen — CGI Management, 1M+ sq ft Commercial Real Estate Portfolio
          </footer>
        </div>
      </section>

      {/* Filling the gap ticker */}
      <section ref={tickerSectionRef} className={`relative z-10 border-t border-slate-200/80 px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-16 ${isTickerVisible ? 'scroll-reveal' : 'opacity-0'}`}>
        <h2 className="text-center text-sm sm:text-lg font-medium text-[#475569] tracking-tight mb-3 sm:mb-6">
          Filling the gap left by:
        </h2>
        <div className="mx-auto w-full max-w-7xl">
          <LogoCloud logos={fillingTheGapLogos} />
        </div>
      </section>

      {/* Divider: competitor logos → missing middle */}
      <div className="relative z-10 flex justify-center">
        <div className="w-[90%] sm:w-[80%] max-w-4xl mx-auto h-px bg-[rgba(230,116,81,0.35)]" />
      </div>

      {/* About section */}
      <section id="about-section" ref={aboutSectionRef} className="relative z-10 px-4 sm:px-6 py-12 sm:py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          {/* Section header with integrated stats */}
          <div className={`text-center mb-12 sm:mb-20 ${isAboutVisible ? 'scroll-reveal' : ''}`}>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight mb-4 sm:mb-8">
              <span className="text-[#0F2235]">
                The missing middle of{" "}
              </span>
              <span className="text-[#E67451]">
                commercial real estate
              </span>
            </h2>
            <p className="text-sm sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed px-0 sm:px-1 mb-8 sm:mb-12">
              Trulo fills the gap between expensive short-term event spaces and restrictive 3+ year leases — with mid-term commercial rentals built for growing businesses.
            </p>
            {/* Stats row - centered */}
            <div className={`flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-14 gap-y-5 w-full ${isAboutVisible ? 'scroll-reveal scroll-reveal-delay-1' : 'opacity-0'}`}>
              <StatCountUp end={15.5} suffix="%" visible={isAboutVisible} label="Boston vacancy rate" accentColor />
              <StatFade value="~$50K" label="lost per vacancy" accentColor />
              <StatCountUp end={67} suffix="%" visible={isAboutVisible} label="of tenants want flexible terms" accentColor />
            </div>
          </div>

          {/* Features grid */}
          <div>
            <h3 className={`text-center text-xs sm:text-sm font-medium uppercase tracking-widest text-[#475569] mb-8 sm:mb-12 ${isAboutVisible ? 'scroll-reveal scroll-reveal-delay-1' : ''}`}>
              WHAT YOU GET
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`glass-card feature-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 group cursor-pointer select-none
                    hover:scale-[1.01]
                    active:scale-[1.02]
                    ${isAboutVisible ? 'scroll-reveal' : ''}`}
                  style={{ animationDelay: isAboutVisible ? `${0.2 + index * 0.1}s` : '0s' }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#E67451]/10 border border-[#E67451]/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E67451]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 text-[#0F2235]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider: stats/feature cards → How it works */}
          <div className="flex justify-center my-14 sm:my-24">
            <div className="w-[90%] sm:w-[80%] max-w-4xl mx-auto h-px bg-[rgba(230,116,81,0.35)]" />
          </div>

          {/* How it works */}
          <div ref={timelineSectionRef} className={`${isTimelineVisible ? 'scroll-reveal scroll-reveal-delay-1' : 'opacity-0'}`}>
            <Timeline
              lightBg
              title="Simple. Fast. Protected."
              description="Five straightforward steps from listing to done. No long-term commitment required."
              data={[
                { title: "List or Browse", content: <p className="text-sm md:text-base leading-relaxed">Owners list their space. Tenants search by location, size, and term.</p> },
                { title: "Request & Approve", content: <p className="text-sm md:text-base leading-relaxed">Tenant submits a booking request. Owner has 48 hours to approve.</p> },
                { title: "Protected Occupancy", content: <p className="text-sm md:text-base leading-relaxed">Tenant moves in with a 30-day protected occupancy period.</p> },
                { title: "Rolling Notice", content: <p className="text-sm md:text-base leading-relaxed">Either party can exit with 30 days notice after the initial period.</p> },
                { title: "Done", content: <p className="text-sm md:text-base leading-relaxed">Contracts automated. Payments processed. Insurance is part of checkout.</p> },
              ]}
            />
          </div>

          {/* Benefits section */}
          <div ref={benefitsSectionRef} className={`mt-14 sm:mt-24 max-w-2xl mx-auto px-0 ${isBenefitsVisible ? 'scroll-reveal scroll-reveal-delay-1' : 'opacity-0'}`}>
            <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E67451]/12 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-[#0F2235]">
                  Get early access
                </h3>
                <p className="text-sm text-[#475569] mb-4 sm:mb-6 max-w-lg mx-auto leading-relaxed px-1">
                  Get ahead of launch. Early members set the terms.
                </p>
                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e, "bottom")} className="space-y-4 mb-5 sm:mb-6">
                  <div>
                    {showBottomUserTypeError && !bottomUserType && (
                      <p className="text-xs text-red-400 text-center mb-2 sm:mb-3 animate-pulse">Please select one</p>
                    )}
                    <div className="flex gap-2 justify-center mb-3 sm:mb-4">
                      <button
                        type="button"
                        onClick={() => { setBottomUserType("has-space"); setShowBottomUserTypeError(false); }}
                        className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ease-out touch-manipulation ${
                          bottomUserType === "has-space" ? "border-[#E67451]/50 bg-white text-[#0F2235]" : "border-slate-200/80 bg-white/80 text-[#475569] hover:border-slate-300 hover:bg-white hover:text-[#0F2235]"
                        }`}
                      >
                        I have space
                      </button>
                      <button
                        type="button"
                        onClick={() => { setBottomUserType("needs-space"); setShowBottomUserTypeError(false); }}
                        className={`flex-1 min-h-[44px] px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ease-out touch-manipulation ${
                          bottomUserType === "needs-space" ? "border-[#E67451]/50 bg-white text-[#0F2235]" : "border-slate-200/80 bg-white/80 text-[#475569] hover:border-slate-300 hover:bg-white hover:text-[#0F2235]"
                        }`}
                      >
                        I need space
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      placeholder={bottomUserType === "has-space" ? "Enter your work email" : bottomUserType === "needs-space" ? "Enter your business email" : "Enter your email"}
                      required
                      className="flex-1 min-w-0 min-h-[44px] px-4 py-3 rounded-xl bg-white border border-slate-200 text-base text-[#0F2235] placeholder:text-slate-400 focus:outline-none focus:border-[#E67451]/50 focus:ring-2 focus:ring-[#E67451]/20 transition-all duration-300 ease-out hover:border-slate-300"
                    />
                    <button
                      type="submit"
                      disabled={!email.trim() || !bottomUserType || isSubmitting}
                      className="min-h-[44px] px-6 py-3 rounded-2xl font-semibold bg-[#E67451] text-white hover:bg-[#d4633e] hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 ease-out flex items-center justify-center gap-2 shrink-0 touch-manipulation w-full sm:w-auto"
                    >
                      {isSubmitting ? "Signing up..." : bottomUserType === "has-space" ? "List My Space" : bottomUserType === "needs-space" ? "Find a Space" : "Get Early Access"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Cloudflare Turnstile - bot protection (CISO Directive 02) */}
                  <div
                    className="cf-turnstile"
                    data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                    data-theme="light"
                    data-size="compact"
                  />
                </form>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs gap-y-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[#334155] transition-all duration-300 ease-out hover:bg-slate-100 hover:border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Early access
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[#334155] transition-all duration-300 ease-out hover:bg-slate-100 hover:border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67451]" />
                    Founder benefits
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[#334155] transition-all duration-300 ease-out hover:bg-slate-100 hover:border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    No fees at launch
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className={`relative z-10 border-t border-slate-200/80 px-4 sm:px-6 py-8 sm:py-12 text-center pb-[env(safe-area-inset-bottom)] ${isFooterVisible ? 'scroll-reveal scroll-reveal-delay-1' : 'opacity-0'}`}>
        <p className="text-xs text-[#64748b] mb-2">
          Currently launching in the Greater Boston market.
        </p>
        <p className="text-xs text-[#94a3b8]">
          © 2026 Trulo. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
