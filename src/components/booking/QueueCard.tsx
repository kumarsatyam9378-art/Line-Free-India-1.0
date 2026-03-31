import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface QueueCardProps {
  queueCount: number;
  estimatedWait: number; // in minutes
  isPaused?: boolean;
  isClosed?: boolean;
  opensAt?: string;
  className?: string;
}

export default function QueueCard({
  queueCount,
  estimatedWait,
  isPaused = false,
  isClosed = false,
  opensAt,
  className
}: QueueCardProps) {

  if (isClosed) {
    return (
      <div className={cn("p-4 rounded-2xl border bg-card border-border shadow-sm text-center", className)}>
        <span className="text-3xl block mb-2">🔴</span>
        <h4 className="font-bold text-lg mb-1">Currently Closed</h4>
        <p className="text-text-dim text-sm">{opensAt ? `Opens at ${opensAt}` : "Check back later"}</p>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className={cn("p-4 rounded-2xl border bg-warning/10 border-warning/20 shadow-sm text-center", className)}>
        <span className="text-3xl block mb-2">⏸️</span>
        <h4 className="font-bold text-lg text-warning mb-1">Queue Paused</h4>
        <p className="text-warning/80 text-sm font-medium">Temporarily not accepting tokens</p>
      </div>
    );
  }

  return (
    <div className={cn("p-5 rounded-2xl glass-card border border-border flex items-center justify-between", className)}>
      <div>
        <h4 className="text-sm font-medium text-text-dim mb-1">Live Queue</h4>
        <div className="flex items-baseline gap-2">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={queueCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {queueCount}
            </motion.span>
          </AnimatePresence>
          <span className="text-base font-medium">people waiting</span>
        </div>
      </div>

      <div className="text-right border-l border-border pl-5">
        <h4 className="text-sm font-medium text-text-dim mb-1">Est. Wait</h4>
        <div className="flex items-baseline gap-1 justify-end">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={estimatedWait}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="text-2xl font-bold"
            >
              {estimatedWait > 0 ? `~${estimatedWait}` : "No Wait"}
            </motion.span>
          </AnimatePresence>
          {estimatedWait > 0 && <span className="text-xs font-medium">min</span>}
        </div>
      </div>
    </div>
  );
}
