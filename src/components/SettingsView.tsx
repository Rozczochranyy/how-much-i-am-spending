import { useState } from 'react';
import { useSettings, Currency } from '../lib/SettingsContext';
import { useAuth } from '../lib/AuthContext';
import { LogOut, Save } from 'lucide-react';

export function SettingsView() {
  const { settings, updateSettings } = useSettings();
  const { logout } = useAuth();
  const [currency, setCurrency] = useState<Currency>(settings.currency);
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings({
      currency,
      monthlyBudget: parseFloat(monthlyBudget) || 0
    });
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-white/60 mt-1">Manage your app preferences and budget.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white/80 block mb-2">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full sm:max-w-xs bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-medium outline-none text-white appearance-none cursor-pointer focus:border-[#4285F4]/50 transition-colors"
              >
                <option value="PLN" className="text-black">PLN - Polish Zloty</option>
                <option value="EUR" className="text-black">EUR - Euro</option>
                <option value="USD" className="text-black">USD - US Dollar</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-white/80 block mb-2">Monthly Budget Limit</label>
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-medium outline-none text-white focus:border-[#4285F4]/50 transition-colors"
                  placeholder="e.g. 5000"
                />
              </div>
              <p className="text-xs text-white/40 mt-2">This is used to show your budget progress in the dashboard.</p>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/90 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-6 text-[#EA4335]">Danger Zone</h2>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full sm:max-w-xs bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/20 border border-[#EA4335]/20 px-6 py-4 rounded-2xl font-bold text-sm transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </section>
      </div>
    </div>
  );
}
