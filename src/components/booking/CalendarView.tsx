import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  workingDays: string[]; // e.g. ["Mon", "Tue", "Wed"]
}

export default function CalendarView({ selectedDate, onSelectDate, workingDays }: CalendarViewProps) {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    // Generate next 14 days
    const next14Days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      next14Days.push(d);
    }
    setDates(next14Days);
  }, []);

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-bold">Select Date</h2>
        <span className="text-text-dim text-sm font-semibold">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 pb-4 snap-x">
        {dates.map((date, i) => {
          const isSelected =
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate();

          const dayName = getDayName(date);
          const isWorkingDay = workingDays.includes(dayName);
          const today = new Date();
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth();

          return (
            <motion.button
              key={i}
              whileTap={isWorkingDay ? { scale: 0.95 } : undefined}
              onClick={() => isWorkingDay && onSelectDate(date)}
              disabled={!isWorkingDay}
              className={`flex-shrink-0 w-[72px] h-[90px] rounded-2xl flex flex-col items-center justify-center transition-all snap-start relative ${
                isSelected
                  ? 'bg-gradient-to-b from-primary to-accent text-white shadow-lg shadow-primary/30 border-transparent'
                  : isWorkingDay
                  ? 'bg-card border-border hover:border-primary/50 text-text'
                  : 'bg-card-2 border-transparent text-text-dim/30 cursor-not-allowed'
              } border`}
            >
              {isToday && !isSelected && (
                <div className="absolute top-2 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
              {isToday && isSelected && (
                <div className="absolute top-2 w-1.5 h-1.5 rounded-full bg-white" />
              )}

              <span className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                isSelected ? 'text-white/80' : isWorkingDay ? 'text-text-dim' : 'text-text-dim/30'
              }`}>
                {dayName}
              </span>
              <span className={`text-2xl font-black ${
                isSelected ? 'text-white' : isWorkingDay ? 'text-text' : 'text-text-dim/30'
              }`}>
                {date.getDate()}
              </span>
              <span className={`text-[10px] font-bold mt-0.5 ${
                isSelected ? 'text-white/80' : isWorkingDay ? 'text-text-dim' : 'text-text-dim/30'
              }`}>
                {getMonthName(date)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
