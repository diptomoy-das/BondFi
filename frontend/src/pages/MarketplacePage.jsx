import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';
import { buyBondToken } from '../utils/soroban';

export const MarketplacePage = () => {
  const [bonds, setBonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBond, setSelectedBond] = useState(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [buying, setBuying] = useState(false);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    fetchBonds();
    fetchWallet();
  }, []);

  const fetchBonds = async () => {
    try {
      const response = await api.get('/bonds');
      setBonds(response.data);
    } catch (error) {
      toast.error('Failed to load bonds');
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response.data);
    } catch (error) {
      console.error('Failed to load wallet');
    }
  };

  const handleBuyClick = (bond) => {
    setSelectedBond(bond);
    setBuyAmount('');
  };

  const handleBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(buyAmount) < selectedBond.minimum_entry) {
      toast.error(`Minimum entry is $${selectedBond.minimum_entry}`);
      return;
    }

    setBuying(true);
    try {
      // 1. Backend: Mock Payment (USDC deduction)
      await api.post('/transactions/buy', {
        bond_id: selectedBond.id,
        amount: parseFloat(buyAmount),
      });

      // 2. Blockchain: Atomic Swap (Soroban)
      if (wallet && wallet.usdc_balance) {
        try {
          const userAddress = "G...USER_ADDRESS"; // Placeholder for demo
          // Atomic Buy: One transaction handles Payment + Minting
          await buyBondToken(userAddress, parseFloat(buyAmount));
          toast.success("Atomic Swap on Stellar: USDC sent, Bond Tokens received.");
        } catch (e) {
          console.warn("Soroban atomic buy skipped/failed (expected in mock env)", e);
        }
      }

      toast.success(`Successfully purchased ${buyAmount} ${selectedBond.country} bond tokens!`);
      setSelectedBond(null);
      setBuyAmount('');
      fetchWallet();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  };

  const tokensToReceive = buyAmount ? parseFloat(buyAmount).toFixed(2) : '0.00';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground font-mono">Loading bonds...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 md:p-8 lg:p-12 space-y-8" data-testid="marketplace-page">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground mt-2">Active government bonds</p>
          </div>
          {wallet && (
            <div className="bg-card border border-border rounded-lg px-6 py-3" data-testid="wallet-balance-display">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                USDC Balance
              </p>
              <p className="text-2xl font-mono font-bold text-primary">
                ${wallet.usdc_balance.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bonds.map((bond) => (
            <div
              key={bond.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors group"
              data-testid={`bond-card-${bond.id}`}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <img
                    src={bond.flag_url}
                    alt={`${bond.country} flag`}
                    className="w-12 h-12 rounded-md object-cover border border-border"
                  />
                  <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-mono font-semibold text-lg">{bond.country}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{bond.issuer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Annual Yield</p>
                    <p className="text-xl font-mono font-bold text-secondary">{bond.yield_percentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Maturity</p>
                    <p className="text-sm font-mono font-semibold">
                      {new Date(bond.maturity_date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground font-mono uppercase mb-2">Minimum Entry</p>
                  <p className="text-2xl font-mono font-bold text-primary mb-4">
                    ${bond.minimum_entry.toFixed(2)}
                  </p>
                  <Button
                    onClick={() => handleBuyClick(bond)}
                    data-testid={`buy-button-${bond.id}`}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm font-mono uppercase tracking-wide text-sm"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedBond} onOpenChange={() => setSelectedBond(null)}>
        <DialogContent className="bg-card border-border" data-testid="buy-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-mono">
              Buy {selectedBond?.country} Bonds
            </DialogTitle>
            <DialogDescription className="font-mono text-sm">
              Enter the amount in USDC to purchase bond tokens
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Annual Yield
                </span>
                <span className="text-lg font-mono font-bold text-secondary">
                  {selectedBond?.yield_percentage}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Maturity Date
                </span>
                <span className="text-sm font-mono font-semibold">
                  {selectedBond && new Date(selectedBond.maturity_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="font-mono text-sm uppercase tracking-wider">
                Amount (USDC)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min={selectedBond?.minimum_entry}
                data-testid="buy-amount-input"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="bg-input/50 border-input focus-visible:ring-primary font-mono text-lg"
                placeholder={`Min: $${selectedBond?.minimum_entry}`}
              />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">You will receive:</span>
                <span className="text-xl font-mono font-bold text-primary" data-testid="tokens-to-receive">
                  {tokensToReceive} Tokens
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-2">
                1 USDC = 1 Bond Token
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedBond(null)}
                data-testid="cancel-buy-button"
                className="flex-1 font-mono uppercase tracking-wide"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBuy}
                disabled={buying}
                data-testid="confirm-buy-button"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm font-mono uppercase tracking-wide"
              >
                {buying ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
