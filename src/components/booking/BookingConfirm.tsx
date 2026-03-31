import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

interface BookingConfirmProps {
  tokenNumber: number;
  salonName: string;
  services: string[];
  date: string;
  time?: string;
  totalAmount: number;
  onShare: () => void;
  onViewBookings: () => void;
  onTrackLive: () => void;
}

export default function BookingConfirm({
  tokenNumber,
  salonName,
  services,
  date,
  time,
  totalAmount,
  onShare,
  onViewBookings,
  onTrackLive
}: BookingConfirmProps) {
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowFlash(false), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col h-full bg-background items-center pt-10 pb-24 px-4 relative overflow-hidden">
      {/* Flash Effect */}
      {showFlash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white z-50 pointer-events-none"
        />
      )}

      {/* Confetti Background (simplified CSS approach) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, x: Math.random() * 400 - 200, opacity: 1, scale: Math.random() + 0.5 }}
            animate={{ y: 800, rotate: 360 }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
            className={`absolute top-0 left-1/2 w-3 h-3 rounded-full ${['bg-primary', 'bg-accent', 'bg-success', 'bg-warning'][Math.floor(Math.random() * 4)]}`}
          />
        ))}
      </div>

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-6"
      >
        <svg className="w-12 h-12 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            d="M20 6L9 17l-5-5"
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-2xl font-bold mb-2 text-center"
      >
        Booking Confirmed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-text-dim text-center mb-8"
      >
        Your appointment has been successfully booked.
      </motion.p>

      {/* Token Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, delay: 0.8 }}
        className="w-full glass-card rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -ml-10 -mb-10" />

        <div className="relative z-10 text-center mb-6">
          <p className="text-text-dim text-sm uppercase tracking-widest font-bold mb-2">Token Number</p>
          <div className="text-6xl font-black gradient-text flex justify-center">
            #
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onUpdate={(latest) => {
                  const el = document.getElementById("token-number");
                  if (el && typeof latest === "number") {
                    el.innerText = Math.floor(latest * tokenNumber).toString();
                  }
                }}
                transition={{ duration: 1, delay: 1 }}
              />
              <span id="token-number">{tokenNumber}</span>
            </motion.span>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 space-y-4 relative z-10">
          <div>
            <p className="text-text-dim text-xs">Business</p>
            <p className="font-bold">{salonName}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-text-dim text-xs">Date & Time</p>
              <p className="font-bold">{date} {time ? `• ${time}` : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-text-dim text-xs">Amount</p>
              <p className="font-bold">₹{totalAmount}</p>
            </div>
          </div>
          <div>
            <p className="text-text-dim text-xs">Services</p>
            <p className="font-bold text-sm truncate">{services.join(', ')}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-8 flex justify-center bg-white p-4 rounded-2xl w-max mx-auto relative z-10">
          <QRCodeSVG value={`token:${tokenNumber}|salon:${salonName}|date:${date}`} size={100} />
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full mt-8 space-y-3"
      >
        <div className="flex gap-3">
          <button
            onClick={onTrackLive}
            className="flex-1 py-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/25 active:scale-95 transition-all"
          >
            Track Live
          </button>
          <button
            onClick={onShare}
            className="w-14 rounded-xl font-bold bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 flex items-center justify-center text-xl active:scale-95 transition-all"
          >
            📲
          </button>
        </div>
        <button
          onClick={onViewBookings}
          className="w-full py-4 rounded-xl font-bold bg-card-2 border border-border text-text hover:bg-card active:scale-95 transition-all"
        >
          View My Bookings
        </button>
      </motion.div>
    </div>
  );
}
