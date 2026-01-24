import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'sonner';
import { isConnected, requestAccess } from '@stellar/freighter-api';

export const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topping, setTopping] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, txnRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/transactions'),
      ]);
      setWallet(walletRes.data);
      setTransactions(txnRes.data);
    } catch (error) {
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const installed = await isConnected();
      if (!installed) {
        toast.error('Freighter extension not installed');
        return;
      }

      const { address, error } = await requestAccess();

      if (error) {
        toast.error(`Connection failed: ${error}`);
        return;
      }

      if (!address) {
        toast.error('User denied access');
        return;
      }

      setWalletAddress(address);
      toast.success('Wallet connected!');
    } catch (error) {
      console.error(error);
      toast.error(`Connection failed: ${error.message || 'Unknown error'}`);
    }
  };

  const handleTopup = async () => {
    if (!topupAmount || parseFloat(topupAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setTopping(true);
    try {
      await api.post('/wallet/topup', { amount: parseFloat(topupAmount) });
      toast.success('Top-up successful!');
      setShowTopup(false);
      setTopupAmount('');
      fetchWalletData();
    } catch (error) {
      toast.error('Top-up failed');
    } finally {
      setTopping(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground font-mono">Loading wallet...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 md:p-8 lg:p-12 space-y-8" data-testid="wallet-page">
        <div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-2">Manage your USDC balance</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8" data-testid="wallet-balance-card">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Available Balance
              </p>
              <p className="text-5xl font-mono font-bold text-foreground">
                ${wallet?.usdc_balance?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-muted-foreground font-mono mt-2">USDC</p>
            </div>
            <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center shadow-glow-sm">
              <WalletIcon className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setShowTopup(true)}
              data-testid="topup-button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm font-mono uppercase tracking-wide"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>

            {!walletAddress ? (
              <Button
                variant="outline"
                onClick={handleConnectWallet}
                className="font-mono uppercase tracking-wide border-primary text-primary hover:bg-primary/10"
              >
                Connect Freighter
              </Button>
            ) : (
              <div className="flex flex-col justify-center px-4 py-2 border border-primary/20 rounded-md bg-primary/5">
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Connected Wallet</span>
                <span className="text-xs font-mono text-primary font-bold truncate max-w-[150px]">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-mono font-semibold mb-4">Transaction History</h2>
          {transactions.length > 0 ? (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="transactions-table">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Type
                      </th>
                      <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Bond
                      </th>
                      <th className="text-right p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-right p-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Tokens
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, index) => (
                      <tr
                        key={txn.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        data-testid={`transaction-row-${index}`}
                      >
                        <td className="p-4 font-mono text-sm">
                          {new Date(txn.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {txn.transaction_type === 'buy' ? (
                              <>
                                <ArrowUpRight className="w-4 h-4 text-destructive" />
                                <span className="font-mono text-sm text-destructive">Purchase</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="w-4 h-4 text-primary" />
                                <span className="font-mono text-sm text-primary">Deposit</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm">{txn.bond_country}</td>
                        <td className="p-4 font-mono text-sm text-right text-destructive">
                          -${txn.amount.toFixed(2)}
                        </td>
                        <td className="p-4 font-mono text-sm text-right text-primary">
                          +{txn.tokens_received.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 text-center" data-testid="no-transactions-message">
              <p className="text-muted-foreground font-mono">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showTopup} onOpenChange={setShowTopup}>
        <DialogContent className="bg-card border-border" data-testid="topup-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-mono">Add Funds</DialogTitle>
            <DialogDescription className="font-mono text-sm">
              Top up your USDC balance (mock transaction)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="topup-amount" className="font-mono text-sm uppercase tracking-wider">
                Amount (USDC)
              </Label>
              <Input
                id="topup-amount"
                type="number"
                step="0.01"
                min="1"
                data-testid="topup-amount-input"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="bg-input/50 border-input focus-visible:ring-primary font-mono text-lg"
                placeholder="100.00"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTopup(false)}
                data-testid="cancel-topup-button"
                className="flex-1 font-mono uppercase tracking-wide"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTopup}
                disabled={topping}
                data-testid="confirm-topup-button"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm font-mono uppercase tracking-wide"
              >
                {topping ? 'Processing...' : 'Add Funds'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
