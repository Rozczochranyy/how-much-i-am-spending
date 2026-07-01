# 🪙 CoinJar - Specyfikacja Produktu

## 1. Wizja i Cel Projektu
**CoinJar** to nowoczesna, minimalistyczna i wysoce responsywna aplikacja internetowa do zarządzania finansami osobistymi (Personal Finance Tracker). Jej głównym celem jest uproszczenie procesu śledzenia codziennych wydatków i przychodów, oferując użytkownikowi przejrzysty wgląd w jego budżet bez zbędnego natłoku informacji. Aplikacja stawia na elegancję, estetykę (Glassmorphism, nowoczesny Dark Mode) oraz płynność działania.

## 2. Główne Funkcjonalności (Core Features)
* **Bezpieczny dostęp:** Logowanie za pomocą konta Google (Firebase Authentication), gwarantujące bezpieczeństwo danych bez konieczności pamiętania kolejnego hasła.
* **Dashboard (Panel Główny):** Wizualne podsumowanie finansów pokazujące całkowity balans, przychody i wydatki. Pozwala na płynną nawigację pomiędzy miesiącami i latami.
* **Zarządzanie transakcjami:** Błyskawiczne dodawanie nowych przychodów i wydatków. Formularz obsługuje wprowadzanie kwoty, daty, automatyczną kategoryzację oraz opcjonalne, szczegółowe opisy tekstowe (np. "Czynsz - Lipiec" czy "Kawa na mieście").
* **Inteligentne wyszukiwanie i filtrowanie:** Zaawansowana lista transakcji pozwalająca na błyskawiczne znalezienie konkretnego wydatku dzięki wyszukiwarce tekstowej (szukającej w nazwie kategorii i opisie) oraz filtrom typu (wszystkie / tylko wydatki / tylko przychody).
* **Cloud Sync:** Natychmiastowa synchronizacja danych w chmurze (Firebase Firestore). Użytkownik ma dostęp do swoich finansów z dowolnego urządzenia w czasie rzeczywistym.
* **Mobile-First & PWA:** Aplikacja w pełni przystosowana do działania na urządzeniach mobilnych (dolne menu nawigacyjne, dotykowe interfejsy), przypominająca w odczuciu natywną aplikację na telefon.

## 3. Grupa Docelowa
Osoby ceniące sobie minimalizm, estetykę i prostotę. Użytkownicy, którzy chcą mieć szybki, ładnie zaprezentowany wgląd w to, na co wydają pieniądze, bez konieczności obsługi skomplikowanych, przeładowanych tabelami systemów księgowych.

## 4. Architektura Techniczna (Tech Stack)
* **Frontend:** React 18, TypeScript, Vite
* **Stylizacja:** Tailwind CSS (wykorzystanie nowoczesnych efektów rozmycia i szklanych paneli)
* **Backend / Baza danych:** Firebase (Cloud Firestore)
* **Autoryzacja:** Firebase Auth (Google Sign-In)
* **Ikony i identyfikacja:** Lucide React, dedykowane Logo SVG

## 5. Załącznik Techniczny: Kluczowy Kod Źródłowy
Poniżej znajduje się aktualny kod najważniejszych komponentów aplikacji.

-e 
### `src/types.ts`
```typescript
export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: number;
}

export const EXPENSE_CATEGORIES = [
  'Bills', 'Health', 'Car', 'Grocerry', 'Fun', 'Trip', 
  'Restaurants', 'Clothes', 'Hygiens stuffs', 'Gifts', 'eletronics'
];

export const INCOME_CATEGORIES = [
  'Salary', 'Extra money'
];
-e ```

-e 
### `src/App.tsx`
```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './lib/AuthContext';
import { SettingsProvider } from './lib/SettingsContext';
import { Dashboard } from './components/Dashboard';
import { SettingsView } from './components/SettingsView';
import { WalletView } from './components/WalletView';
import { LogoIcon } from './components/LogoIcon';
import { useState } from 'react';
import { LayoutDashboard, Wallet, Settings as SettingsIcon } from 'lucide-react';

function Main() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'wallet' | 'settings'>('dashboard');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glass-panel p-8 rounded-[40px] border border-white/10 max-w-md w-full text-center relative overflow-hidden z-10 shadow-2xl bg-white/5 backdrop-blur-xl">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-md mx-auto mb-6">
            <LogoIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">CoinJar</h1>
          <p className="text-white/60 mb-8">Sign in to manage your budget and track your expenses.</p>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-white text-black py-4 rounded-3xl font-bold text-sm shadow-xl hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 sm:p-4 bg-black/50 backdrop-blur-xl border-t border-white/10 sm:bottom-auto sm:top-0 sm:border-t-0 sm:border-b flex justify-center">
        <div className="flex items-center gap-2 max-w-7xl w-full justify-center sm:justify-start">
          <div className="hidden sm:flex items-center gap-2 mr-8">
            <LogoIcon className="w-8 h-8 text-white" />
            <span className="font-bold tracking-tight">CoinJar</span>
          </div>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-2 px-4 py-3 sm:py-2 rounded-2xl transition-colors ${currentView === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
          </button>
          <button 
            onClick={() => setCurrentView('wallet')}
            className={`flex items-center gap-2 px-4 py-3 sm:py-2 rounded-2xl transition-colors ${currentView === 'wallet' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Wallet</span>
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={`flex items-center gap-2 px-4 py-3 sm:py-2 rounded-2xl transition-colors ${currentView === 'settings' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Settings</span>
          </button>
        </div>
      </nav>
      <div className="pt-8 sm:pt-24 pb-24 sm:pb-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'wallet' && <WalletView />}
        {currentView === 'settings' && <SettingsView />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <div className="min-h-screen relative overflow-hidden text-white">
          <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4285F4] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#34A853] rounded-full mix-blend-screen filter blur-[100px] opacity-15 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-24 left-1/4 w-[500px] h-64 bg-[#EA4335] rounded-full mix-blend-screen filter blur-[140px] opacity-10 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 min-h-screen">
            <Main />
          </div>
        </div>
      </SettingsProvider>
    </AuthProvider>
  );
}
-e ```

-e 
### `src/components/Dashboard.tsx`
```typescript
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
-e ```

-e 
### `src/components/TransactionForm.tsx`
```typescript
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
-e ```

-e 
### `src/components/TransactionList.tsx`
```typescript
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
                  className="text-white/20 hover:text-[#EA4335] opacity-0 group-hover:opacity-100 transition-all"
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
-e ```

-e 
### `src/components/LogoIcon.tsx`
```typescript
import React from 'react';

export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="7" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="30" y="15" width="40" height="10" rx="5" />
      <path d="M35 25 C 20 35, 15 55, 25 75 C 35 90, 65 90, 75 75 C 85 55, 80 35, 65 25" />
      <circle cx="50" cy="55" r="16" />
      <path d="M55 49 C 50 45, 43 47, 43 55 C 43 63, 50 65, 55 61" />
    </svg>
  );
}
-e ```

