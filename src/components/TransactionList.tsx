import { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { Trash2, ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSettings } from '../lib/SettingsContext';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const { formatAmount } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const search = searchQuery.toLowerCase();
      const matchesSearch = t.category.toLowerCase().includes(search) || 
                            (t.description?.toLowerCase().includes(search) ?? false);
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h3 className="text-2xl font-light italic text-white/90">Recent Transactions</h3>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search category or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-9 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer"
            >
              <option value="all" className="bg-[#09090b]">All</option>
              <option value="expense" className="bg-[#09090b]">Expense</option>
              <option value="income" className="bg-[#09090b]">Income</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-white/40 py-8">
            {transactions.length === 0 ? "No transactions found." : "No transactions match your search."}
          </div>
        ) : (
          filteredTransactions.map((t) => (
            <div key={t.id} className="group flex items-center justify-between p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  t.type === 'income' ? 'bg-[#34A853]/20 text-[#34A853]' : 'bg-[#EA4335]/20 text-[#EA4335]'
                )}>
                  {t.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white">{t.category}</p>
                    {t.description && (
                      <span className="text-sm text-white/60 font-light truncate max-w-[120px] sm:max-w-[200px]">
                        - {t.description}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-tighter mt-1">
                    {t.type} • {format(new Date(t.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className={cn(
                  "text-lg font-mono",
                  t.type === 'income' ? 'text-[#34A853]' : 'text-[#EA4335]'
                )}>
                  {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                </p>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-white/20 hover:text-[#EA4335] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all p-2 -mr-2"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
