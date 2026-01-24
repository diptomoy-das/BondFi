import { useState } from 'react';
import { AnimatedList } from "@/components/magicui/animated-list";
import Marquee from "@/components/magicui/marquee";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import RetroGrid from "@/components/magicui/retro-grid";
import DotPattern from "@/components/magicui/dot-pattern";
import NumberTicker from "@/components/magicui/number-ticker";
import ShinyButton from "@/components/magicui/shiny-button"; // New Import
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, DollarSign, BarChart3, Globe } from 'lucide-react';
import { cn } from "@/lib/utils";

// --- BENTO GRID DATA ---
const features = [
  {
    Icon: DollarSign,
    name: "Low Entry Barrier",
    description: "Start investing with just $1. No minimum balance requirements. Perfect for students on a budget.",
    href: "/register",
    cta: "Learn more",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    background: <div className="absolute right-0 top-10 opacity-10 text-primary text-9xl font-bold select-none">$</div>,
  },
  {
    Icon: ShieldCheck,
    name: "Transparent & Secure",
    description: "All transactions verified on the Stellar blockchain. Full auditability and transparency guaranteed.",
    href: "/",
    cta: "View Ledger",
    className: "lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    background: <div className="absolute right-2 top-2 h-full w-full bg-gradient-to-br from-secondary/20 to-transparent opacity-50" />,
  },
  {
    Icon: BarChart3,
    name: "Diversify Globally",
    description: "Access bonds from US, UK, Germany, Singapore, and more to protect your wealth.",
    href: "/marketplace",
    cta: "Explore Market",
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    background: <div className="absolute inset-0 bg-primary/5" />,
  },
  {
    Icon: Globe,
    name: "Stellar Powered",
    description: "Lightning fast settlements and ultra-low fees powered by the Stellar network.",
    href: "/",
    cta: "Tech Specs",
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    background: <div className="absolute inset-0 bg-secondary/5" />,
  },
];

// --- ANIMATED LIST DATA ---
const notifications = [
  { name: "Investment Received", description: "Student from Singapore invested $5 in US Treasury", time: "just now", icon: "💰" },
  { name: "New Bond Available", description: "UK Gilt 10Y Bonds now open for fractional entry", time: "2m ago", icon: "🇬🇧" },
  { name: "Yield Paid", description: "Monthly interest distributed to 1,200 investors", time: "5m ago", icon: "📈" },
  { name: "Verification Success", description: "Bond asset batch #402 verified on Stellar", time: "10m ago", icon: "🛡️" },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  const [hoveredButton, setHoveredButton] = useState(null);

  // Helper to get animation props based on hover state
  const getButtonAnimation = (btnType) => {
    const isHovered = hoveredButton === btnType;
    const isOtherHovered = hoveredButton && hoveredButton !== btnType;
    return {
      "--x": "-100%",
      scale: isHovered ? 1.1 : (isOtherHovered ? 0.9 : 1),
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden min-h-[90vh] flex flex-col">
        {/* Magic UI Background Layers */}
        <RetroGrid className="opacity-40" />
        <DotPattern
          className={cn("[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] opacity-50")}
        />

        <nav className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-border backdrop-blur-sm" data-testid="landing-navbar">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-mono font-bold text-primary">BondFi</h1>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')} className="font-mono uppercase tracking-wide text-sm">
              Sign In
            </Button>
            {/* UPDATED: Shiny Button in Navbar */}
            <ShinyButton
              text="Get Started"
              onClick={() => navigate('/register')}
              className="px-6 py-2"
            />
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 flex-grow flex items-center justify-center py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-mono font-bold tracking-tight">
                Invest in Government Bonds
                <br />
                <span className="text-primary flex items-center justify-center gap-3">
                  Starting at $<NumberTicker value={1} className="text-primary" />
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mono">
                Access fractional government bonds from top-rated countries. Build your portfolio with transparent, blockchain-verified investments designed for students.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              {/* UPDATED: Coupled Hover Effects */}
              <ShinyButton
                text="Start Investing"
                onClick={() => navigate('/register')}
                className="px-10 py-4 text-base"
                onMouseEnter={() => setHoveredButton('invest')}
                onMouseLeave={() => setHoveredButton(null)}
                animate={getButtonAnimation('invest')}
              />
              <ShinyButton
                text="Sign In"
                onClick={() => navigate('/login')}
                className="px-10 py-4 text-base bg-background/50 hover:bg-background/80 border-primary/20"
                onMouseEnter={() => setHoveredButton('signin')}
                onMouseLeave={() => setHoveredButton(null)}
                animate={getButtonAnimation('signin')}
              />
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">Verified on Stellar Blockchain</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="py-24 px-6 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <BentoGrid className="lg:grid-rows-2 max-w-5xl mx-auto">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </div>

      {/* --- LIVE ACTIVITY SECTION --- */}
      <div className="py-24 bg-background border-b border-border overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-mono font-bold mb-4 tracking-tighter">Live Ecosystem Activity</h3>
            <p className="text-muted-foreground font-mono leading-relaxed">
              See how students globally are securing their future with fractional government bonds.
              Every transaction is recorded transparently on-chain.
            </p>
          </div>

          <div className="relative h-[400px] w-full max-w-[400px] mx-auto overflow-hidden p-6 bg-card/10 rounded-2xl border border-border shadow-glow-sm">
            <AnimatedList delay={2500}>
              {notifications.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/80 backdrop-blur-md mb-4 shadow-sm">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="flex flex-row items-center gap-2 text-lg font-medium">
                      <span className="text-sm font-mono font-bold">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.time}</span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </AnimatedList>
          </div>
        </div>
      </div>

      {/* --- MARQUEE SECTION --- */}
      <div className="py-16 bg-card/10 border-b border-border">
        <div className="container mx-auto">
          <h4 className="text-center text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-10">
            Available Global Securities
          </h4>
          <Marquee pauseOnHover className="[--duration:40s] [--gap:3rem]">
            {["US Treasury", "UK Gilt", "German Bund", "Singapore SGS", "Japan JGB", "India G-Sec"].map((bond) => (
              <div key={bond} className="flex items-center gap-3 px-8 py-4 rounded-xl border border-border bg-background shadow-glow-sm transition-transform hover:scale-105">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-sm font-bold tracking-tight">{bond}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      {/* --- CALL TO ACTION SECTION --- */}
      <div className="py-32 px-6">
        <div className="container mx-auto text-center space-y-8">
          <h3 className="text-4xl font-mono font-bold tracking-tighter">Ready to Start?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
            Join the new generation of investors. Build wealth with safe, government-backed securities.
          </p>
          {/* UPDATED: Shiny Button in Footer CTA */}
          <ShinyButton
            text="Create Free Account"
            onClick={() => navigate('/register')}
            className="px-12 py-5 text-lg"
          />
          <p className="text-[10px] font-mono text-muted-foreground mt-8 uppercase tracking-widest">
            © 2025 BondFi · Verified on Stellar
          </p>
        </div>
      </div>

      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="font-mono italic">Invest wisely. Securities involve risk.</p>
        </div>
      </footer>
    </div>
  );
};