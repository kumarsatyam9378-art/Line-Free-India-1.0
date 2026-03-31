// src/components/analytics/BookingsChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface BookingsChartProps {
  data: { date: string; completed: number; cancelled: number; noShow: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = new Date(label).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    return (
      <div className="bg-popover border border-border rounded-xl p-3 shadow-xl">
        <p className="font-bold text-sm mb-2">{d}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-dim capitalize">{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BookingsChart({ data }: BookingsChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
          <XAxis
            dataKey="date"
            tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { weekday: 'short' })}
            tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--color-text-dim)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} iconType="circle" />
          <Bar dataKey="completed" name="Completed" stackId="a" fill="var(--color-success)" radius={[0, 0, 4, 4]} />
          <Bar dataKey="noShow" name="No Show" stackId="a" fill="var(--color-gold)" />
          <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
