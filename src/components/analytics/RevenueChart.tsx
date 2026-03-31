// src/components/analytics/RevenueChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedDate = new Date(label).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
    return (
      <div className="bg-popover border border-border rounded-xl p-3 shadow-xl">
        <p className="text-text-dim text-xs mb-1">{formattedDate}</p>
        <p className="text-primary font-bold">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
          <XAxis
            dataKey="date"
            tickFormatter={(val) => {
              const d = new Date(val);
              return d.toLocaleDateString('en-IN', { weekday: 'short' });
            }}
            tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(val) => `₹${val}`}
            tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-primary)"
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--color-background)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
