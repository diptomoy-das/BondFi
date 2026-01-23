import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wallet, Coins } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/portfolio');
      setPortfolio(response.data);
    } catch (error) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-md p-3 shadow-glow-sm">
          <p className="text-xs font-mono text-muted-foreground">{payload[0].payload.date}</p>
          <p className="text-sm font-mono font-semibold text-primary">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground font-mono">Loading portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 md:p-8 lg:p-12 space-y-8" data-testid="dashboard-page">
        <div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Your investment overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            data-testid="total-value-widget"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Total Value
                </p>
                <p className="text-3xl font-mono font-bold text-foreground mt-2">
                  ${portfolio?.total_value?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:shadow-glow-sm transition-shadow">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            data-testid="total-tokens-widget"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Total Tokens
                </p>
                <p className="text-3xl font-mono font-bold text-foreground mt-2">
                  {portfolio?.total_tokens?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-md bg-secondary/10 flex items-center justify-center group-hover:shadow-glow-sm transition-shadow">
                <Coins className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>

          <div
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            data-testid="holdings-count-widget"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Active Holdings
                </p>
                <p className="text-3xl font-mono font-bold text-foreground mt-2">
                  {portfolio?.holdings?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:shadow-glow-sm transition-shadow">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6" data-testid="yield-chart-container">
          <div className="mb-6">
            <h2 className="text-2xl font-mono font-semibold">Yield Visualization</h2>
            <p className="text-sm text-muted-foreground mt-1">30-day earnings growth</p>
          </div>

          {portfolio?.earnings_history?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolio.earnings_history} data-testid="yield-chart">
                <XAxis
                  dataKey="date"
                  stroke="transparent"
                  tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  stroke="transparent"
                  tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground font-mono">No earnings data yet. Start investing!</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-mono font-semibold mb-4">Your Holdings</h2>
          {portfolio?.holdings?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.holdings.map((holding, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  data-testid={`holding-card-${holding.bond_id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-mono font-semibold text-lg">{holding.country}</h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {holding.tokens.toFixed(2)} tokens
                      </p>
                    </div>
                    <div className="bg-secondary/10 text-secondary border border-secondary/20 font-mono text-xs px-2 py-1 rounded-full">
                      {holding.yield_percentage}% APY
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground font-mono uppercase">Invested</p>
                      <p className="text-sm font-mono font-semibold">${holding.invested.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-mono uppercase">Current Value</p>
                      <p className="text-sm font-mono font-semibold text-primary">
                        ${holding.current_value.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center" data-testid="no-holdings-message">
              <p className="text-muted-foreground font-mono">No holdings yet. Visit the marketplace to start investing.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
