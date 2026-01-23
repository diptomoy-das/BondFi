import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '../utils/api';
import { setToken } from '../utils/auth';
import { ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      setToken(response.data.token);
      toast.success('Account created! Welcome to BondFi');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent"></div>
        <img
          src="https://images.unsplash.com/photo-1744070018851-5b2f5a3d1d81?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRpZ2l0YWwlMjBmaW5hbmNlJTIwbmV0d29yayUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc2OTExNTQ1Mnww&ixlib=rb-4.1.0&q=85"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-5xl font-mono font-bold text-primary mb-4">BondFi</h1>
            <p className="text-xl text-foreground/90 mb-6">
              Start your investment journey with government bonds. Safe, accessible, and transparent.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="font-mono">Secured on Stellar Blockchain</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-mono font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground mt-2">Join thousands of student investors</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6" data-testid="register-form">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-mono text-sm uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                data-testid="register-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input/50 border-input focus-visible:ring-primary font-mono"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-sm uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                data-testid="register-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50 border-input focus-visible:ring-primary font-mono"
                placeholder="student@university.edu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-sm uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                data-testid="register-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input/50 border-input focus-visible:ring-primary font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              data-testid="register-submit-button"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm font-mono uppercase tracking-wide"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-mono">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
