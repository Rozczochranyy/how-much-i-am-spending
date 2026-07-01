import { useMemo } from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSettings } from '../lib/SettingsContext';

interface CategoryChartProps {
  transactions: Transaction[];
  period: 'month' | 'year';
  currentDate: Date;
}

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E24AA', '#00ACC1', '#F4511E', '#7CB342', '#3949AB', '#D81B60', '#5E35B1'];

export function CategoryChart({ transactions, period, currentDate }: CategoryChartProps) {
  const { formatAmount } = useSettings();
  const data = useMemo(() => {
    const expenses = transactions.filter(t => {
      const d = new Date(t.date);
      const isPeriodMatch = period === 'month' 
        ? d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
        : d.getFullYear() === currentDate.getFullYear();
      
      return t.type === 'expense' && isPeriodMatch;
    });

    const categoryMap: Record<string, number> = {};
    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, period, currentDate]);

  if (data.length === 0) {
    return (
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center h-48 text-white/40">
        <p>No expense data</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex flex-col h-64">
      <h3 className="text-sm font-medium text-white/60 mb-2">Expenses by Category</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatAmount(value)}
              contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,10,12,0.9)', color: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: 'white' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
