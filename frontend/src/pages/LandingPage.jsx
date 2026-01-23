import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, ShieldCheck, DollarSign, BarChart3 } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent"></div>
        
        <nav className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-border backdrop-blur-sm" data-testid="landing-navbar">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-mono font-bold text-primary">BondFi</h1>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              data-testid="nav-login-button"
              className="font-mono uppercase tracking-wide text-sm"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/register')}
              data-testid="nav-register-button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm font-mono uppercase tracking-wide text-sm"
            >
              Get Started
            </Button>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-mono font-bold tracking-tight">
                Invest in Government Bonds
                <br />
                <span className="text-primary">Starting at $1</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access fractional government bonds from top-rated countries. Build your portfolio with transparent, blockchain-verified investments designed for students.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                data-testid="hero-cta-button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-md font-mono uppercase tracking-wide text-sm px-8"
              >
                Start Investing
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                data-testid="hero-signin-button"
                className="border-input hover:bg-accent font-mono uppercase tracking-wide text-sm px-8"
              >
                Sign In
              </Button>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">Verified on Stellar Blockchain</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:border-primary/50 transition-colors" data-testid="feature-low-entry">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-mono font-semibold">Low Entry Barrier</h3>
              <p className="text-muted-foreground text-sm">
                Start investing with just $1. No minimum balance requirements. Perfect for students on a budget.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:border-primary/50 transition-colors" data-testid="feature-transparent">
              <div className="w-12 h-12 rounded-md bg-secondary/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-mono font-semibold">Transparent & Secure</h3>
              <p className="text-muted-foreground text-sm">
                All transactions verified on the Stellar blockchain. Full auditability and transparency guaranteed.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:border-primary/50 transition-colors" data-testid="feature-diversify">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-mono font-semibold">Diversify Globally</h3>
              <p className="text-muted-foreground text-sm">
                Access bonds from multiple countries including US, UK, Germany, Singapore, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 px-6">
        <div className="container mx-auto text-center space-y-8">
          <h3 className="text-3xl font-mono font-bold">Ready to Start?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the new generation of investors. Build wealth with safe, government-backed securities.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            data-testid="footer-cta-button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-md font-mono uppercase tracking-wide text-sm px-8"
          >
            Create Free Account
          </Button>
        </div>
      </div>

      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="font-mono">© 2025 BondFi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
