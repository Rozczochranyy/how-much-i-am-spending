import React, { useState } from 'react';
import { useWallets } from '../lib/useWallets';
import { useSettings } from '../lib/SettingsContext';
import { Trash2, Wallet as WalletIcon, Plus, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export function WalletView() {
  const { wallets, loading, addWallet, deleteWallet } = useWallets();
  const { formatAmount } = useSettings();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    setIsSubmitting(true);
    await addWallet({
      name,
      balance: parseFloat(balance)
    });
    setName('');
    setBalance('');
    setIsSubmitting(false);
  };

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Wallets & Investments</h1>
        <p className="text-white/60 mt-1">Track your total net worth across different accounts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List & Total */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <p className="text-white/60 text-sm mb-2">Total Net Worth</p>
            <h2 className="text-5xl font-light tracking-tighter text-white">
              {formatAmount(totalBalance)}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl flex-1">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <WalletIcon className="w-5 h-5 text-[#4285F4]" />
              Your Accounts
            </h3>
            
            <div className="space-y-4">
              {wallets.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No wallets added yet.</p>
                </div>
              ) : (
                wallets.map((w) => (
                  <div key={w.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#4285F4]/20 text-[#4285F4] flex items-center justify-center">
                        <WalletIcon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-lg">{w.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-lg">{formatAmount(w.balance)}</span>
                      <button
                        onClick={() => deleteWallet(w.id)}
                        className="text-white/20 hover:text-[#EA4335] opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Wallet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Add Form */}
        <div className="lg:col-span-4">
          <div className="bg-white text-black border border-white/20 rounded-[32px] p-8 shadow-2xl">
            <h4 className="text-xl font-bold mb-6 text-gray-900">Add Account</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 block mb-2">Account Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Savings, Crypto, Bank"
                  className="w-full bg-black/5 border-none rounded-2xl p-4 font-medium outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 block mb-2">Current Balance</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/5 border-none rounded-2xl p-4 font-mono text-xl outline-none text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#4285F4] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? 'Adding...' : 'Add Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
