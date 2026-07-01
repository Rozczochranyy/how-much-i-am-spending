import { useState } from 'react';
import { useTransactions } from '../lib/useTransactions';
import { useAuth } from '../lib/AuthContext';
import { SummaryCards } from './SummaryCards';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { CategoryChart } from './CategoryChart';
import { LogoIcon } from './LogoIcon';
import { format, subMonths, addMonths, subYears, addYears } from 'date-fns';
import { ChevronLeft, ChevronRight, Download, Calendar, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Transaction } from '../types';

export function Dashboard() {
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();
  const { logout, user } = useAuth();
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    if (period === 'month') setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subYears(currentDate, 1));
  };

  const handleNext = () => {
    if (period === 'month') setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addYears(currentDate, 1));
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => 
        [t.date, t.type, `"${t.category}"`, t.amount].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `spending_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const periodLabel = period === 'month' 
    ? format(currentDate, 'MMMM yyyy')
    : format(currentDate, 'yyyy');

  const filteredTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    if (period === 'month') {
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    } else {
      return d.getFullYear() === currentDate.getFullYear();
    }
  });

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-full gap-8">
      {/* Header */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
            <LogoIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">CoinJar</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">{periodLabel} Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm">
            <button 
              onClick={() => setPeriod('month')}
              className={cn("px-4 sm:px-6 py-1.5 rounded-full text-sm font-medium transition-all", period === 'month' ? "bg-white text-black" : "text-white/60 hover:text-white")}
            >
              Monthly
            </button>
            <button 
              onClick={() => setPeriod('year')}
              className={cn("px-4 sm:px-6 py-1.5 rounded-full text-sm font-medium transition-all", period === 'year' ? "bg-white text-black" : "text-white/60 hover:text-white")}
            >
              Yearly
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-xl text-sm transition-colors text-white"
              title="Export to CSV"
            >
              <Download className="w-4 h-4 text-[#4285F4]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-xl text-sm transition-colors text-white"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="flex items-center justify-between sm:justify-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white/60" />
          </button>
          <div className="flex items-center gap-2 text-xl font-semibold min-w-[160px] sm:min-w-[200px] justify-center">
            <Calendar className="w-5 h-5 text-[#4285F4]" />
            {periodLabel}
          </div>
          <button onClick={handleNext} className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      <main className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Sidebar: Balance & Budget */}
        <section className="xl:col-span-3 flex flex-col gap-6 order-1">
          <SummaryCards transactions={transactions} period={period} currentDate={currentDate} />
        </section>

        {/* Quick Add Section */}
        <section className="xl:col-span-3 flex flex-col gap-6 order-2 xl:order-3">
          <TransactionForm onSubmit={addTransaction} />
          <CategoryChart transactions={transactions} period={period} currentDate={currentDate} />
        </section>

        {/* Main: Transactions */}
        <section className="xl:col-span-6 flex flex-col h-[500px] xl:h-[800px] order-3 xl:order-2">
          <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
        </section>
      </main>
    </div>
  );
}
