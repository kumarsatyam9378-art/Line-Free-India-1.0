import { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';

export interface DayHours {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface WeeklyHours {
  mon: DayHours;
  tue: DayHours;
  wed: DayHours;
  thu: DayHours;
  fri: DayHours;
  sat: DayHours;
  sun: DayHours;
}

const defaultDay: DayHours = { isOpen: true, open: '09:00', close: '21:00' };
export const DEFAULT_WEEKLY_HOURS: WeeklyHours = {
  mon: { ...defaultDay },
  tue: { ...defaultDay },
  wed: { ...defaultDay },
  thu: { ...defaultDay },
  fri: { ...defaultDay },
  sat: { ...defaultDay },
  sun: { ...defaultDay, isOpen: false }
};

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' }
] as const;

interface HoursSetupProps {
  hours: WeeklyHours;
  setHours: (hours: WeeklyHours) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function HoursSetup({ hours, setHours, onNext, onBack }: HoursSetupProps) {
  const { t } = useApp();

  const handleToggleDay = (dayKey: keyof WeeklyHours) => {
    setHours({
      ...hours,
      [dayKey]: { ...hours[dayKey], isOpen: !hours[dayKey].isOpen }
    });
  };

  const handleTimeChange = (dayKey: keyof WeeklyHours, field: 'open' | 'close', value: string) => {
    setHours({
      ...hours,
      [dayKey]: { ...hours[dayKey], [field]: value }
    });
  };

  return (
    <div className="flex flex-col animate-fadeIn pb-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Working Hours</h1>
        <p className="text-text-dim text-sm mt-1">Set your weekly schedule</p>
      </div>

      <div className="space-y-4 mb-8">
        {DAYS.map(day => {
          const dayHours = hours[day.key];
          return (
            <div key={day.key} className="p-4 bg-card rounded-2xl border border-border flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleDay(day.key)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${dayHours.isOpen ? 'bg-primary' : 'bg-border'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${dayHours.isOpen ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`font-semibold ${dayHours.isOpen ? 'text-text' : 'text-text-dim line-through'}`}>
                  {day.label}
                </span>
              </div>

              {dayHours.isOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={dayHours.open}
                    onChange={(e) => handleTimeChange(day.key, 'open', e.target.value)}
                    className="bg-bg text-text text-sm p-1 rounded-lg border border-border focus:border-primary focus:outline-none"
                  />
                  <span className="text-text-dim text-xs">to</span>
                  <input
                    type="time"
                    value={dayHours.close}
                    onChange={(e) => handleTimeChange(day.key, 'close', e.target.value)}
                    className="bg-bg text-text text-sm p-1 rounded-lg border border-border focus:border-primary focus:outline-none"
                  />
                </div>
              ) : (
                <span className="text-xs font-medium text-danger bg-danger/10 px-2 py-1 rounded-md">Closed</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-3 rounded-xl font-semibold">
          {t('btn.back') || 'Back'}
        </button>
        <button
          onClick={onNext}
          className="btn-primary flex-1 py-3 rounded-xl font-semibold"
        >
          {t('btn.continue') || 'Continue'}
        </button>
      </div>
    </div>
  );
}
