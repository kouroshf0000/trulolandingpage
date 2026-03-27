import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Link } from "react-router";
import TruloLogo from "@/react-app/components/TruloLogo";
import { WelcomeScreen } from "@/react-app/components/owners/WelcomeScreen";
import { StepIndicator } from "@/react-app/components/shared/StepIndicator";
import { StepNav } from "@/react-app/components/shared/StepNav";
import { Step1About } from "@/react-app/components/owners/Step1About";
import { Step2Space } from "@/react-app/components/owners/Step2Space";
import { Step3Availability } from "@/react-app/components/owners/Step3Availability";
import { Step4Portfolio } from "@/react-app/components/owners/Step4Portfolio";
import { ReviewScreen } from "@/react-app/components/owners/ReviewScreen";

type Role = "owner" | "property_manager" | "broker";
type Screen = "welcome" | 1 | 2 | 3 | 4 | "review";

export default function Owners() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email");
  const nameParam = searchParams.get("name") ?? "";
  const phoneParam = searchParams.get("phone") ?? "";

  const [screen, setScreen] = useState<Screen>("welcome");
  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const [role, setRole] = useState<Role | "">("");
  const [companyName, setCompanyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [unitFloor, setUnitFloor] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [sqft, setSqft] = useState("");
  const [numUnits, setNumUnits] = useState("1");
  const [vacancyStatus, setVacancyStatus] = useState("");
  const [portfolioCount, setPortfolioCount] = useState("");
  const [bostonAreas, setBostonAreas] = useState<string[]>([]);
  const [maAreasOther, setMaAreasOther] = useState("");

  const validateStep1 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.full_name = "Full name is required";
    if (!email.trim()) e.waitlist_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.waitlist_email = "Invalid email";
    if (!role) e.role = "Select your role";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [fullName, email, role]);

  const validateStep2 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!propertyAddress.trim() || propertyAddress.trim().length < 5) e.property_address = "Property address is required";
    if (!spaceType) e.space_type = "Select space type";
    const s = parseInt(sqft, 10);
    if (!sqft || isNaN(s) || s <= 0) e.sqft = "Enter valid square footage";
    const n = parseInt(numUnits, 10);
    if (!numUnits || isNaN(n) || n <= 0) e.num_units = "Enter valid number of units";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [propertyAddress, spaceType, sqft, numUnits]);

  const validateStep3 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!vacancyStatus) e.vacancy_status = "Select current status";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [vacancyStatus]);

  const validateStep4 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!portfolioCount) e.portfolio_count = "Select portfolio count";
    if (bostonAreas.length === 0) e.boston_areas = "Select at least one neighborhood";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [portfolioCount, bostonAreas]);

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
    setSubmitError(undefined);
    setSubmitting(true);

    const phoneVal = phone.trim();
    const payload = {
      waitlist_email: email.trim(),
      full_name: fullName.trim(),
      phone: phoneVal || undefined,
      role,
      company_name: companyName.trim() || undefined,
      property_address: propertyAddress.trim(),
      unit_floor: unitFloor.trim() || undefined,
      space_type: spaceType,
      sqft: parseInt(sqft, 10),
      num_units: parseInt(numUnits, 10),
      vacancy_status: vacancyStatus,
      min_term_months: 1,
      portfolio_count: portfolioCount,
      boston_areas: bostonAreas,
      ma_areas_other: maAreasOther.trim() || undefined,
    };

    try {
      const res = await fetch("/api/owners/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Trulo-Client": "web" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        navigate("/owners/confirmed");
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
            <WelcomeScreen
            email={email || undefined}
            onGetStarted={() => {
              setScreen(1);
            }}
          />
          </div>
        )}

        {screen === 1 && (
          <div className="opacity-0 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-6 md:p-8">
          <Step1About
            fullName={fullName}
            email={email}
            phone={phone}
            role={role}
            companyName={companyName}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
            onRoleChange={setRole}
            onCompanyNameChange={setCompanyName}
            errors={errors}
          />
          </div>
          </div>
        )}

        {screen === 2 && (
          <div className="opacity-0 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-6 md:p-8">
          <Step2Space
            propertyAddress={propertyAddress}
            unitFloor={unitFloor}
            spaceType={spaceType}
            sqft={sqft}
            numUnits={numUnits}
            onPropertyAddressChange={setPropertyAddress}
            onUnitFloorChange={setUnitFloor}
            onSpaceTypeChange={setSpaceType}
            onSqftChange={setSqft}
            onNumUnitsChange={setNumUnits}
            errors={errors}
          />
          </div>
          </div>
        )}

        {screen === 3 && (
          <div className="opacity-0 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-6 md:p-8">
          <Step3Availability
            vacancyStatus={vacancyStatus}
            onVacancyStatusChange={setVacancyStatus}
            errors={errors}
          />
          </div>
          </div>
        )}

        {screen === 4 && (
          <div className="opacity-0 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-6 md:p-8">
          <Step4Portfolio
            portfolioCount={portfolioCount}
            bostonAreas={bostonAreas}
            maAreasOther={maAreasOther}
            onPortfolioCountChange={setPortfolioCount}
            onBostonAreasChange={setBostonAreas}
            onMaAreasOtherChange={setMaAreasOther}
            errors={errors}
          />
          </div>
          </div>
        )}

        {screen === "review" && (
          <div className="owners-review opacity-0 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <ReviewScreen
              data={{
                fullName,
                email,
                phone,
                role,
                companyName,
                propertyAddress,
                unitFloor,
                spaceType,
                sqft,
                numUnits,
                vacancyStatus,
                minTermMonths: 1,
                portfolioCount,
                bostonAreas,
                maAreasOther,
              }}
              onEditStep={(step) => setScreen(step as Screen)}
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
