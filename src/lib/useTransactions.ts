import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { Transaction } from '../types';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          amount: typeof d.amount === 'number' ? d.amount : parseFloat(d.amount) || 0
        };
      }) as Transaction[];
      
      // Filter out transactions that belong to other users, but keep legacy transactions without a userId
      const userTransactions = data.filter(t => !t.userId || t.userId === user.uid);
      
      // Sort client-side
      userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactions(userTransactions);
      setLoading(false);
    }, (error: any) => {
      if (error.code === 'permission-denied') {
        setTransactions([]);
        setLoading(false);
        return;
      }
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'transactions'), {
        ...data,
        userId: user.uid,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return { transactions, loading, addTransaction, deleteTransaction };
}
