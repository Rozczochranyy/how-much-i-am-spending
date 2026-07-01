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
