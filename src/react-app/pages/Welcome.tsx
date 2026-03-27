import { Link } from "react-router";
import { ArrowLeft, Building2, Users, Zap, Shield, Clock, TrendingUp } from "lucide-react";
import TruloLogo from "@/react-app/components/TruloLogo";

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
  {
    icon: TrendingUp,
    title: "Monetize Empty Space",
    description: "Turn your unused capacity into a reliable revenue stream.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with entrepreneurs and space owners who share your vision.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Seamless reservations with secure payments and clear terms.",
  },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Hero background image with overlay */}
      <div className="absolute inset-0 h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80"
          alt="City skyline"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 179, 237, 0.25) 0%, rgba(129, 140, 248, 0.1) 40%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full animate-float-delayed"
          style={{
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <TruloLogo />
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </header>

        {/* Hero section */}
        <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 mb-6 opacity-0 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              You're on the waitlist
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 opacity-0 animate-fade-in-up animation-delay-100">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                The future of{" "}
              </span>
              <span className="bg-gradient-to-r from-[#E67451] via-[#d4633e] to-[#E67451]/80 bg-clip-text text-transparent">
                space sharing
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
              Trulo is reimagining how entrepreneurs access space and how property owners maximize their assets.
            </p>
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground mb-10 opacity-0 animate-fade-in-up animation-delay-300">
              What we're building
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl p-5 opacity-0 animate-fade-in-up group hover:scale-[1.02] transition-transform duration-500"
                  style={{ animationDelay: `${350 + index * 80}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E67451]/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-5 h-5 text-[#E67451]" />
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="px-6 py-12 md:py-16">
          <div className="max-w-xl mx-auto">
            <div className="glass-card rounded-2xl p-7 md:p-8 text-center opacity-0 animate-fade-in-up animation-delay-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  We'll be in touch soon
                </h2>
                <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto leading-relaxed">
                  As an early member, you'll get first access to our marketplace and the opportunity to shape what we build.
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-xs">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Early access
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E67451]" />
                    Founder benefits
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Shape the product
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            © 2026 Trulo. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
