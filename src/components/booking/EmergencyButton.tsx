import { useState } from 'react';

interface EmergencyButtonProps {
  onEmergencyBooking: () => void;
  loading: boolean;
}

export default function EmergencyButton({ onEmergencyBooking, loading }: EmergencyButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="bg-danger/10 border border-danger/30 rounded-2xl p-4 animate-slideUp">
        <h3 className="text-danger font-bold flex items-center gap-2 mb-2">
          <span>🚨</span> Confirm Emergency
        </h3>
        <p className="text-sm text-text-dim mb-4">
          This will skip the queue and create an immediate priority booking. The owner will be alerted instantly.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 btn-secondary py-2.5 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowConfirm(false);
              onEmergencyBooking();
            }}
            disabled={loading}
            className="flex-1 bg-danger text-white rounded-xl font-medium py-2.5 text-sm hover:bg-danger/90 active:scale-[0.98] transition-all"
          >
            {loading ? 'Processing...' : 'Yes, Request Priority'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      disabled={loading}
      className="w-full bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
    >
      <span className="text-xl animate-pulse">🚨</span>
      EMERGENCY / PRIORITY BOOKING
    </button>
  );
}
