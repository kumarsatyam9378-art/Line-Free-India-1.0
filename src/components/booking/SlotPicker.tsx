import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeSlot {
  time: string; // e.g. "09:00"
  available: boolean;
}

interface SlotPickerProps {
  date: Date;
  workingHours: { open: string; close: string; isOpen: boolean };
  existingBookings: { time: string; duration: number }[]; // durations in minutes
  totalDuration: number;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SlotPicker({
  date,
  workingHours,
  existingBookings,
  totalDuration,
  selectedTime,
  onSelectTime,
  onNext,
  onBack
}: SlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (!workingHours.isOpen) {
      setSlots([]);
      return;
    }

    // Generate slots every 30 mins
    const newSlots: TimeSlot[] = [];
    const openParts = workingHours.open.split(':').map(Number);
    const closeParts = workingHours.close.split(':').map(Number);

    const startMins = openParts[0] * 60 + openParts[1];
    const endMins = closeParts[0] * 60 + closeParts[1];

    // Create a timeline of booked minutes
    const bookedMins = new Set<number>();
    existingBookings.forEach(b => {
      const parts = b.time.split(':').map(Number);
      const start = parts[0] * 60 + parts[1];
      for (let i = 0; i < b.duration; i++) {
        bookedMins.add(start + i);
      }
    });

    // Check if slot time + totalDuration fits and doesn't overlap bookings
    for (let t = startMins; t + totalDuration <= endMins; t += 30) {
      let isAvailable = true;
      for (let i = 0; i < totalDuration; i++) {
        if (bookedMins.has(t + i)) {
          isAvailable = false;
          break;
        }
      }

      // Also check if time is in the past for today
      const now = new Date();
      if (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      ) {
        const currentMins = now.getHours() * 60 + now.getMinutes();
        if (t <= currentMins) {
          isAvailable = false;
        }
      }

      const h = Math.floor(t / 60).toString().padStart(2, '0');
      const m = (t % 60).toString().padStart(2, '0');
      newSlots.push({ time: `${h}:${m}`, available: isAvailable });
    }

    setSlots(newSlots);
  }, [date, workingHours, existingBookings, totalDuration]);

  // Group slots by Morning/Afternoon/Evening
  const morningSlots = slots.filter(s => {
    const h = parseInt(s.time.split(':')[0]);
    return h < 12;
  });
  const afternoonSlots = slots.filter(s => {
    const h = parseInt(s.time.split(':')[0]);
    return h >= 12 && h < 17;
  });
  const eveningSlots = slots.filter(s => {
    const h = parseInt(s.time.split(':')[0]);
    return h >= 17;
  });

  const renderSlotGroup = (title: string, group: TimeSlot[], icon: string) => {
    if (group.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-text-dim mb-3 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {group.map((slot, i) => {
            const isSelected = selectedTime === slot.time;
            return (
              <motion.button
                key={i}
                whileTap={slot.available ? { scale: 0.95 } : undefined}
                onClick={() => slot.available && onSelectTime(slot.time)}
                disabled={!slot.available}
                className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : slot.available
                    ? 'bg-card border-border hover:border-primary/50 text-text'
                    : 'bg-card-2 border-transparent text-text-dim/30 cursor-not-allowed'
                }`}
              >
                {/* Convert 24h to 12h for display */}
                {(() => {
                  const [h, m] = slot.time.split(':');
                  const hours = parseInt(h);
                  const ampm = hours >= 12 ? 'PM' : 'AM';
                  const displayH = hours % 12 || 12;
                  return `${displayH}:${m} ${ampm}`;
                })()}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-32 px-4 pt-4">
        {!workingHours.isOpen ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-4 opacity-50">😴</div>
            <h3 className="font-bold text-lg mb-2">Closed on this day</h3>
            <p className="text-text-dim text-sm">Please select another date</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-4 opacity-50">⏳</div>
            <h3 className="font-bold text-lg mb-2">No slots available</h3>
            <p className="text-text-dim text-sm">Try selecting a different date</p>
          </div>
        ) : (
          <>
            {renderSlotGroup('Morning', morningSlots, '🌅')}
            {renderSlotGroup('Afternoon', afternoonSlots, '☀️')}
            {renderSlotGroup('Evening', eveningSlots, '🌙')}
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-xl font-bold transition-all bg-card-2 border border-border text-text hover:bg-card active:scale-95"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTime}
          className={`flex-1 py-4 rounded-xl font-bold text-center transition-all ${
            selectedTime
              ? 'bg-gradient-to-r from-primary to-accent text-white active:scale-95 shadow-lg shadow-primary/25 hover:shadow-primary/40'
              : 'bg-card-2 text-text-dim opacity-50 cursor-not-allowed border border-border'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
