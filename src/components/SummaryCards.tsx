import { useMemo } from 'react';
import { Transaction } from '../types';
import { DollarSign, AlertCircle, CheckCircle2, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettings } from '../lib/SettingsContext';

interface SummaryCardsProps {
  transactions: Transaction[];
  period: 'month' | 'year';
  currentDate: Date;
}

export function SummaryCards({ transactions, period, currentDate }: SummaryCardsProps) {
  const { formatAmount, settings } = useSettings();
  const { income, expense, balance } = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      if (period === 'month') {
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      } else {
        return d.getFullYear() === currentDate.getFullYear();
      }
    });

    filtered.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [transactions, period, currentDate]);

  const monthlyBudget = settings?.monthlyBudget || 0;
  
  const activeBudget = period === 'month' ? monthlyBudget : monthlyBudget * 12;
  const budgetPercentage = activeBudget > 0 ? Math.min((expense / activeBudget) * 100, 100) : 0;
  const isOverBudget = expense > activeBudget;
  const remainingBudget = activeBudget - expense;

  return (
    <div className="flex flex-col h-full gap-6">
      <div className={cn(
        "border rounded-[32px] p-6 backdrop-blur-xl flex-1 flex flex-col justify-between transition-colors",
        isOverBudget 
          ? "bg-[#EA4335]/10 border-[#EA4335]/30" 
          : "bg-white/5 border-white/10"
      )}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1 flex items-center gap-2">
                <Target className="w-4 h-4" />
                {period === 'month' ? 'Monthly' : 'Yearly'} Budget
              </p>
              <h2 className="text-4xl font-light tracking-tighter text-white">
                {formatAmount(activeBudget)}
              </h2>
            </div>
            {isOverBudget ? (
              <div className="bg-[#EA4335]/20 text-[#EA4335] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-[#EA4335]/30">
                <AlertCircle className="w-3 h-3" /> Over Budget
              </div>
            ) : (
              <div className="bg-[#34A853]/20 text-[#34A853] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-[#34A853]/30">
                <CheckCircle2 className="w-3 h-3" /> On Track
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60 font-medium">Spent so far</span>
                <span className={cn("font-semibold", isOverBudget ? "text-[#EA4335]" : "text-white")}>
                  {formatAmount(expense)}
                </span>
              </div>
              <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out absolute top-0 left-0", 
                    isOverBudget 
                      ? "bg-[#EA4335] shadow-[0_0_12px_rgba(234,67,53,0.8)]" 
                      : budgetPercentage > 85 
                        ? "bg-[#FBBC05] shadow-[0_0_12px_rgba(251,188,5,0.8)]" 
                        : "bg-[#34A853] shadow-[0_0_12px_rgba(52,168,83,0.8)]"
                  )} 
                  style={{ width: `${budgetPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
              <span className="text-white/60 text-sm font-medium">
                {isOverBudget ? "Exceeded By" : "Remaining Amount"}
              </span>
              <span className={cn(
                "text-2xl font-semibold tracking-tight",
                isOverBudget ? "text-[#EA4335]" : "text-[#34A853]"
              )}>
                {formatAmount(Math.abs(remainingBudget))}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-4 rounded-2xl bg-[#4285F4]/10 border border-[#4285F4]/20 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <TrendingUp className="w-8 h-8 text-[#4285F4]" />
            </div>
            <span className="text-white/60 text-xs mb-1 uppercase tracking-wider font-semibold z-10">Total Income</span>
            <span className="text-[#4285F4] font-medium text-xl z-10">{formatAmount(income)}</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#EA4335]/10 border border-[#EA4335]/20 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <TrendingDown className="w-8 h-8 text-[#EA4335]" />
            </div>
            <span className="text-white/60 text-xs mb-1 uppercase tracking-wider font-semibold z-10">Total Expense</span>
            <span className="text-[#EA4335] font-medium text-xl z-10">{formatAmount(expense)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
