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
