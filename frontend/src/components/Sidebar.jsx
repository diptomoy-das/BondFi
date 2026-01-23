import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Wallet, BookOpen, LogOut, ShieldCheck } from 'lucide-react';
import { removeToken } from '../utils/auth';
import { toast } from 'sonner';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/marketplace', icon: TrendingUp },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Education', path: '/education', icon: BookOpen },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm h-screen sticky top-0" data-testid="sidebar">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-mono font-bold text-primary">BondFi</h1>
        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
          Fractional Bonds
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.name.toLowerCase()}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-mono text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-glow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-md">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
            Verified on Stellar
          </span>
        </div>
        <button
          onClick={handleLogout}
          data-testid="logout-button"
          className="flex items-center gap-3 px-4 py-3 rounded-md font-mono text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
