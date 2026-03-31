// src/components/analytics/ServicePopularityChart.tsx
import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface ServicePopularityChartProps {
  data: { name: string; revenue: number; count: number }[];
}

const COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-success)', 'var(--color-gold)', 'var(--color-danger)', 'var(--color-text-dim)'];

export default function ServicePopularityChart({ data }: ServicePopularityChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="revenue"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-popover border border-border rounded-xl p-3 shadow-xl text-xs">
                    <p className="font-bold mb-1">{data.name}</p>
                    <p className="text-primary">₹{data.revenue.toLocaleString('en-IN')}</p>
                    <p className="text-text-dim">{data.count} bookings</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
