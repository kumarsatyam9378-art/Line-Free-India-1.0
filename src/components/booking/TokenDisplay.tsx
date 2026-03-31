import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface TokenDisplayProps {
  tokenNumber: number;
  businessName: string;
  selectedServices: string[];
  totalTime: number; // in minutes
  totalPrice: number;
  date: string;
  onViewBookings: () => void;
  className?: string;
}

export default function TokenDisplay({
  tokenNumber,
  businessName,
  selectedServices,
  totalTime,
  totalPrice,
  date,
  onViewBookings,
  className
}: TokenDisplayProps) {

  return (
    <div className={cn("fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden relative"
      >
        {/* Animated Checkmark Sequence */}
        <div className="flex justify-center mb-6 mt-2 relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.8, times: [0, 0.5, 1] }}
              className="w-24 h-24 rounded-full bg-success/20 blur-md"
            />
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-success text-white flex items-center justify-center z-10 shadow-lg shadow-success/30"
          >
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
              className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          </motion.div>
        </div>

        <h2 className="text-xl font-bold text-center mb-1">Booking Confirmed!</h2>
        <p className="text-text-dim text-center text-sm mb-6">{businessName}</p>

        {/* Token Card */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-5 mb-6 text-center shadow-inner relative overflow-hidden">
          {/* Subtle pattern background for token */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)' }}>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-text-dim mb-1">Your Token Number</p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
            className="text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent my-2 drop-shadow-sm"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            #{tokenNumber}
          </motion.div>
          <p className="text-xs font-medium text-text-dim">{date}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-6">
          {selectedServices.map((s, i) => (
            <p key={i} className="text-sm font-medium flex items-center before:content-['•'] before:mr-2 before:text-primary">
              {s}
            </p>
          ))}
        </div>

        <div className="divider opacity-50 mb-4" />

        <div className="flex justify-between items-center font-bold text-lg mb-6">
          <span>Total: <span className="text-sm font-medium text-text-dim ml-1 font-normal">~{totalTime}m</span></span>
          <span className="text-primary">₹{totalPrice}</span>
        </div>

        {/* Actions */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewBookings}
          className="btn-primary w-full shadow-lg shadow-primary/20"
        >
          View My Bookings
        </motion.button>
      </motion.div>
    </div>
  );
}
