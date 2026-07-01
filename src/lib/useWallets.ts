import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  userId: string;
  createdAt: any;
}

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setWallets([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'wallets'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wData: Wallet[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.userId || data.userId === user.uid) {
          wData.push({
            id: doc.id,
            name: data.name,
            balance: typeof data.balance === 'number' ? data.balance : parseFloat(data.balance) || 0,
            userId: data.userId,
            createdAt: data.createdAt,
          });
        }
      });
      wData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setWallets(wData);
      setLoading(false);
    }, (error: any) => {
      if (error.code === 'permission-denied') {
        setWallets([]);
        setLoading(false);
        return;
      }
      console.error("Error fetching wallets:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addWallet = async (data: Omit<Wallet, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error("Not authenticated");
    
    await addDoc(collection(db, 'wallets'), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
  };

  const deleteWallet = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'wallets', id));
  };

  return { wallets, loading, addWallet, deleteWallet };
}
