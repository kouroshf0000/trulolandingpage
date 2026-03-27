import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Link } from "react-router";
import TruloLogo from "@/react-app/components/TruloLogo";
import { TenantWelcomeScreen } from "@/react-app/components/tenants/TenantWelcomeScreen";
import { StepIndicator } from "@/react-app/components/shared/StepIndicator";
import { StepNav } from "@/react-app/components/shared/StepNav";
import { TenantStep1About } from "@/react-app/components/tenants/TenantStep1About";
import { TenantStep2SpaceNeeds } from "@/react-app/components/tenants/TenantStep2SpaceNeeds";
import { TenantStep3LocationTimeline } from "@/react-app/components/tenants/TenantStep3LocationTimeline";
import { TenantStep4BudgetContext } from "@/react-app/components/tenants/TenantStep4BudgetContext";
import TenantReviewScreen from "@/react-app/components/tenants/TenantReviewScreen";

type Screen = "welcome" | 1 | 2 | 3 | 4 | "review";

export default function Tenants() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email");
  const nameParam = searchParams.get("name") ?? "";
  const phoneParam = searchParams.get("phone") ?? "";

  const [screen, setScreen] = useState<Screen>("welcome");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const [fullName, setFullName] = useState(nameParam);
  const [email, setEmail] = useState(() => {
    if (!emailParam) return "";
    try {
      return emailParam.includes("%") ? decodeURIComponent(emailParam) : atob(emailParam);
    } catch {
      return "";
    }
  });
  const [phone, setPhone] = useState(phoneParam);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [spaceTypes, setSpaceTypes] = useState<string[]>([]);
  const [sqftRange, setSqftRange] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [bostonAreas, setBostonAreas] = useState<string[]>([]);
  const [bostonAreasOther, setBostonAreasOther] = useState("");
  const [moveInTimeline, setMoveInTimeline] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    (window as unknown as Record<string, (t: string) => void>).onTenantsTurnstileSuccess = (token: string) =>
      setTurnstileToken(token);
    return () => {
      delete (window as unknown as Record<string, unknown>).onTenantsTurnstileSuccess;
    };
  }, []);

  const validateStep1 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.full_name = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!companyName.trim()) e.company_name = "Company name is required";
    if (!role.trim()) e.role = "Role is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [fullName, email, companyName, role]);

  const validateStep2 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (spaceTypes.length === 0) e.space_types = "Select at least one space type";
    if (!sqftRange) e.sqft_range = "Select square footage range";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [spaceTypes, sqftRange]);

  const validateStep3 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (bostonAreas.length === 0) e.boston_areas = "Select at least one neighborhood";
    if (bostonAreas.includes("other") && !bostonAreasOther.trim())
      e.boston_areas_other = "Please specify the neighborhood";
    if (!moveInTimeline) e.move_in_timeline = "Select move-in timeline";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [bostonAreas, bostonAreasOther, moveInTimeline]);

  const validateStep4 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!monthlyBudget) e.monthly_budget = "Select monthly budget";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [monthlyBudget]);

  const handleContinue = () => {
    setErrors({});
    if (screen === "welcome") {
      setScreen(1);
      return;
    }
    if (screen === 1 && validateStep1()) setScreen(2);
    else if (screen === 2 && validateStep2()) setScreen(3);
    else if (screen === 3 && validateStep3()) setScreen(4);
    else if (screen === 4 && validateStep4()) setScreen("review");
  };

  const handleBack = () => {
    setErrors({});
    if (screen === 1) setScreen("welcome");
    else if (screen === 2) setScreen(1);
    else if (screen === 3) setScreen(2);
    else if (screen === 4) setScreen(3);
    else if (screen === "review") setScreen(4);
  };

  const handleSubmit = async () => {
    const token =
      turnstileToken ||
      (document.querySelector('.tenants-review textarea[name="cf-turnstile-response"]') as HTMLTextAreaElement | null)
        ?.value?.trim();
    if (!token) {
      setSubmitError("Please complete the security check.");
      return;
    }
    setSubmitError(undefined);
    setSubmitting(true);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company_name: companyName.trim(),
      role: role.trim(),
      space_types: spaceTypes,
      sqft_range: sqftRange,
      headcount: headcount || undefined,
      boston_areas: bostonAreas,
      boston_areas_other: bostonAreasOther.trim() || undefined,
      move_in_timeline: moveInTimeline,
      monthly_budget: monthlyBudget,
      how_heard: howHeard.trim() || undefined,
      notes: notes.trim() || undefined,
      "cf-turnstile-response": token,
    };

    try {
      const res = await fetch("/api/tenants/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Trulo-Client": "web" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        navigate("/tenants/confirmed");
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Something went wrong — please try again.");
      }
    } catch {
      setSubmitError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const showStepNav = screen !== "welcome" && screen !== "review";
  const showProgress = typeof screen === "number";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* Warm background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#f9f7f4]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full animate-float-slow"
          style={{
            background: "radial-gradient(circle, rgba(180, 170, 160, 0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full animate-float-delayed"
          style={{
            background: "radial-gradient(circle, rgba(180, 170, 160, 0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Skyline background */}
      <div className="absolute inset-0 min-h-[100vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80"
          alt=""
          className="w-full h-full min-h-[100vh] object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/55 to-background sm:from-background/40 sm:via-background/60 sm:to-background" />
      </div>

      <header className="relative z-10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <TruloLogo />
          </Link>
          <Link
            to="/"
            className="text-sm text-[#475569] hover:text-[#0F2235] transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      {showProgress && (
        <div className="relative z-10">
          <StepIndicator step={screen} />
        </div>
      )}

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-8 pb-20">
        {screen === "welcome" && (
          <div className="opacity-0 animate-fade-in-up">
            <TenantWelcomeScreen
              email={email || undefined}
              onGetStarted={() => setScreen(1)}
            />
          </div>
        )}

        {screen === 1 && (
          <div className="opacity-0 animate-fade-in-up">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <TenantStep1About
                fullName={fullName}
                email={email}
                phone={phone}
                companyName={companyName}
                role={role}
                onFullNameChange={setFullName}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
                onCompanyNameChange={setCompanyName}
                onRoleChange={setRole}
                errors={errors}
              />
            </div>
          </div>
        )}

        {screen === 2 && (
          <div className="opacity-0 animate-fade-in-up">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <TenantStep2SpaceNeeds
                spaceTypes={spaceTypes}
                sqftRange={sqftRange}
                headcount={headcount}
                onSpaceTypesChange={setSpaceTypes}
                onSqftRangeChange={setSqftRange}
                onHeadcountChange={setHeadcount}
                errors={errors}
              />
            </div>
          </div>
        )}

        {screen === 3 && (
          <div className="opacity-0 animate-fade-in-up">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <TenantStep3LocationTimeline
                bostonAreas={bostonAreas}
                bostonAreasOther={bostonAreasOther}
                moveInTimeline={moveInTimeline}
                onBostonAreasChange={setBostonAreas}
                onBostonAreasOtherChange={setBostonAreasOther}
                onMoveInTimelineChange={setMoveInTimeline}
                errors={errors}
              />
            </div>
          </div>
        )}

        {screen === 4 && (
          <div className="opacity-0 animate-fade-in-up">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <TenantStep4BudgetContext
                monthlyBudget={monthlyBudget}
                howHeard={howHeard}
                notes={notes}
                onMonthlyBudgetChange={setMonthlyBudget}
                onHowHeardChange={setHowHeard}
                onNotesChange={setNotes}
                errors={errors}
              />
            </div>
          </div>
        )}

        {screen === "review" && (
          <div className="tenants-review opacity-0 animate-fade-in-up">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <TenantReviewScreen
                data={{
                  fullName,
                  email,
                  phone,
                  companyName,
                  role,
                  spaceTypes,
                  sqftRange,
                  headcount,
                  bostonAreas,
                  bostonAreasOther,
                  moveInTimeline,
                  monthlyBudget,
                  howHeard,
                  notes,
                }}
                onEditStep={(step) => setScreen(step as Screen)}
                turnstileToken={turnstileToken}
                onTurnstileChange={setTurnstileToken}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={submitError}
              />
            </div>
          </div>
        )}

        {showStepNav && (
          <StepNav
            onBack={handleBack}
            onContinue={handleContinue}
            backDisabled={screen === 1}
            continueLabel={screen === 4 ? "Review My Submission →" : "Continue →"}
          />
        )}
      </main>
    </div>
  );
}
