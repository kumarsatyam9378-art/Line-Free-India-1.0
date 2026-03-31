import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export default function StatCard({ label, value, prefix = '', icon, trend, trendValue }: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return animation.stop;
  }, [value, count]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border p-4 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl text-primary">
          {icon}
        </div>
        {trend !== 'neutral' && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
        {trend === 'neutral' && trendValue && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-border text-text-dim">
            {trendValue}
          </span>
        )}
      </div>

      <div>
        <p className="text-text-dim text-xs font-medium mb-0.5">{label}</p>
        <div className="flex items-baseline text-2xl font-black">
          {prefix && <span className="text-lg mr-1 text-text-dim">{prefix}</span>}
          <motion.span>{rounded}</motion.span>
        </div>
      </div>
    </motion.div>
  );
}
