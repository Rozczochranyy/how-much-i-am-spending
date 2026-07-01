import React, { useState, useEffect, createContext, useContext } from 'react';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { doc as firestoreDoc, onSnapshot as firestoreOnSnapshot, setDoc as firestoreSetDoc } from 'firebase/firestore';

export type Currency = 'PLN' | 'EUR' | 'USD';

interface Settings {
  currency: Currency;
  monthlyBudget: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  formatAmount: (amount: number) => string;
  symbol: string;
}

const defaultSettings: Settings = {
  currency: 'PLN',
  monthlyBudget: 5000,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  formatAmount: (a) => `${a.toFixed(2)} zł`,
  symbol: 'zł'
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    if (!user) return;
    
    const docRef = firestoreDoc(db, 'settings', user.uid);
    const unsubscribe = firestoreOnSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setSettings({ ...defaultSettings, ...doc.data() as Settings });
      } else {
        setSettings(defaultSettings);
      }
    }, (error: any) => {
      if (error.code === 'permission-denied') return;
      console.error("Error fetching settings:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!user) return;
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await firestoreSetDoc(firestoreDoc(db, 'settings', user.uid), updated, { merge: true });
  };

  const symbols = {
    PLN: 'zł',
    EUR: '€',
    USD: '$'
  };

  const currency = settings.currency || 'PLN';
  const symbol = symbols[currency] || 'zł';

  const formatAmount = (amount: number) => {
    if (currency === 'PLN') return `${amount.toFixed(2)} ${symbol}`;
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatAmount, symbol }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
