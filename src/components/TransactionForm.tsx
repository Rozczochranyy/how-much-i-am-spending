import React, { useState } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TransactionType } from '../types';
import { cn } from '../lib/utils';
import { getCategoryIcon } from './CategoryIcon';
import { useSettings } from '../lib/SettingsContext';

interface TransactionFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { symbol } = useSettings();

  // Update category when type changes
  React.useEffect(() => {
    setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount) {
      setError('Please enter an amount');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    const txData: any = {
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    };
    
    setIsSubmitting(true);
    try {
      await onSubmit(txData);
      setAmount('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-white/20 rounded-[40px] p-8 text-black flex flex-col justify-between shadow-2xl">
      <div>
        <h4 className="text-xl font-bold mb-6 text-gray-900">Quick Add</h4>
        
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory(''); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300",
              type === 'expense' 
                ? "bg-[#EA4335]/10 text-[#EA4335] border border-[#EA4335]/20" 
                : "bg-black/5 text-gray-400 hover:bg-black/10"
            )}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory(''); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300",
              type === 'income' 
                ? "bg-[#34A853]/10 text-[#34A853] border border-[#34A853]/20" 
                : "bg-black/5 text-gray-400 hover:bg-black/10"
            )}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 block mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-black/30">{symbol}</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black/5 border-none rounded-2xl py-4 pl-10 pr-4 font-mono text-2xl outline-none focus:ring-2 ring-black/10 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 block mb-2">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[160px] overflow-y-auto p-1 pb-2 scrollbar-thin scrollbar-thumb-black/10">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all text-center border",
                    category === cat 
                      ? type === 'expense'
                        ? "border-[#EA4335] bg-[#EA4335]/10 text-[#EA4335] shadow-sm shadow-[#EA4335]/20" 
                        : "border-[#34A853] bg-[#34A853]/10 text-[#34A853] shadow-sm shadow-[#34A853]/20"
                      : "border-transparent bg-black/5 text-gray-500 hover:bg-black/10 hover:text-gray-900"
                  )}
                  title={cat}
                >
                  {getCategoryIcon(cat, "w-6 h-6 mb-1")}
                  <span className="text-[9px] uppercase font-bold tracking-tighter truncate w-full px-1">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 block mb-2">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Rent, Groceries, etc."
                className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-medium outline-none text-gray-900"
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-black/40 block mb-2">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm font-medium outline-none text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-[#4285F4] text-white py-4 rounded-3xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-transform disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
