import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';

export default function OwnerSettings() {
  const { user, barberProfile, saveBarberProfile, t } = useApp();
  const nav = useNavigate();

  // Working Hours State
  const defaultHours = { start: '09:00', end: '20:00', isOpen: true };
  const [schedule, setSchedule] = useState<Record<string, { start: string, end: string, isOpen: boolean }>>({});

  // Settings State
  const [breakStart, setBreakStart] = useState('13:00');
  const [breakEnd, setBreakEnd] = useState('14:00');
  const [hasBreak, setHasBreak] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [maxCapacity, setMaxCapacity] = useState(10);

  // Holidays
  const [blockedDates, setBlockedDates] = useState<string[]>(barberProfile?.blockedDates || []);
  const [newHoliday, setNewHoliday] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (barberProfile) {
      // Initialize schedule from profile if exists, else defaults
      try {
        const profileSchedule = barberProfile.businessHours ? JSON.parse(barberProfile.businessHours) : {};
        const initialSchedule: any = {};
        days.forEach(day => {
          initialSchedule[day] = profileSchedule[day] || { ...defaultHours };
        });
        setSchedule(initialSchedule);
      } catch {
        const initialSchedule: any = {};
        days.forEach(day => { initialSchedule[day] = { ...defaultHours }; });
        setSchedule(initialSchedule);
      }

      setBlockedDates(barberProfile.blockedDates || []);
      setMaxCapacity(barberProfile.maxCapacity || 10);

      // We can store autoConfirm and break settings in the businessHours JSON string or add new fields.
      // For simplicity, we'll store them in a meta field or just append to businessHours JSON.
      try {
        const profileMeta = barberProfile.businessHours ? JSON.parse(barberProfile.businessHours).meta || {} : {};
        if (profileMeta.autoConfirm !== undefined) setAutoConfirm(profileMeta.autoConfirm);
        if (profileMeta.breakStart) setBreakStart(profileMeta.breakStart);
        if (profileMeta.breakEnd) setBreakEnd(profileMeta.breakEnd);
        if (profileMeta.hasBreak !== undefined) setHasBreak(profileMeta.hasBreak);
      } catch {}
    }
  }, [barberProfile]);

  const handleSave = async () => {
    if (!barberProfile) return;

    const settingsData = {
      ...schedule,
      meta: { autoConfirm, breakStart, breakEnd, hasBreak }
    };

    try {
      await saveBarberProfile({
        ...barberProfile,
        businessHours: JSON.stringify(settingsData),
        blockedDates,
        maxCapacity
      });
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const updateSchedule = (day: string, field: 'start' | 'end' | 'isOpen', value: any) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const addHoliday = () => {
    if (!newHoliday) return;
    if (blockedDates.includes(newHoliday)) {
      toast.error('Date already added');
      return;
    }
    setBlockedDates([...blockedDates, newHoliday]);
    setNewHoliday('');
  };

  const removeHoliday = (date: string) => {
    setBlockedDates(blockedDates.filter(d => d !== date));
  };

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />
        <h1 className="text-2xl font-bold mb-5">Hours & Settings</h1>

        {/* Working Hours */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">🕒 Working Hours</h2>
          <div className="space-y-2 bg-card p-4 rounded-2xl border border-border">
            {days.map(day => (
              <div key={day} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3 w-32">
                  <input
                    type="checkbox"
                    checked={schedule[day]?.isOpen}
                    onChange={e => updateSchedule(day, 'isOpen', e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary bg-card-2 border-border"
                  />
                  <span className={`text-sm font-medium ${schedule[day]?.isOpen ? 'text-text' : 'text-text-dim line-through'}`}>{day.substring(0, 3)}</span>
                </div>

                {schedule[day]?.isOpen ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={schedule[day]?.start}
                      onChange={e => updateSchedule(day, 'start', e.target.value)}
                      className="bg-card-2 text-xs p-1.5 rounded-lg border border-border outline-none focus:border-primary/50"
                    />
                    <span className="text-text-dim text-xs">-</span>
                    <input
                      type="time"
                      value={schedule[day]?.end}
                      onChange={e => updateSchedule(day, 'end', e.target.value)}
                      className="bg-card-2 text-xs p-1.5 rounded-lg border border-border outline-none focus:border-primary/50"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-danger font-medium px-4">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Break Time */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">☕ Break Time</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={hasBreak} onChange={e => setHasBreak(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
            </label>
          </div>

          {hasBreak && (
            <div className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4 animate-fadeIn">
              <div className="flex-1">
                <label className="text-xs text-text-dim block mb-1">Start Time</label>
                <input type="time" value={breakStart} onChange={e => setBreakStart(e.target.value)} className="w-full bg-card-2 text-sm p-2 rounded-xl border border-border outline-none focus:border-primary/50" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-text-dim block mb-1">End Time</label>
                <input type="time" value={breakEnd} onChange={e => setBreakEnd(e.target.value)} className="w-full bg-card-2 text-sm p-2 rounded-xl border border-border outline-none focus:border-primary/50" />
              </div>
            </div>
          )}
        </div>

        {/* Holidays */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">🌴 Holidays / Blocked Dates</h2>
          <div className="bg-card p-4 rounded-2xl border border-border">
            <div className="flex gap-2 mb-4">
              <input
                type="date"
                value={newHoliday}
                onChange={e => setNewHoliday(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="flex-1 bg-card-2 text-sm p-2 rounded-xl border border-border outline-none focus:border-primary/50"
              />
              <button onClick={addHoliday} className="bg-primary/20 text-primary font-bold px-4 rounded-xl text-sm">Add</button>
            </div>

            {blockedDates.length === 0 ? (
              <p className="text-xs text-text-dim text-center py-2">No holidays added.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {blockedDates.sort().map(date => (
                  <span key={date} className="flex items-center gap-2 text-xs font-medium bg-danger/10 text-danger px-3 py-1.5 rounded-lg border border-danger/20">
                    {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    <button onClick={() => removeHoliday(date)} className="w-4 h-4 rounded-full bg-danger/20 hover:bg-danger text-white flex items-center justify-center transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* General Settings */}
        <div className="mb-8 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">⚙️ Operational Settings</h2>

          <div className="bg-card p-4 rounded-2xl border border-border flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-Confirm Bookings</p>
              <p className="text-xs text-text-dim">Automatically accept new appointments.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={autoConfirm} onChange={e => setAutoConfirm(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success border border-border"></div>
            </label>
          </div>

          <div className="bg-card p-4 rounded-2xl border border-border flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Max Capacity (Live Queue)</p>
              <p className="text-xs text-text-dim">Stop taking tokens if queue reaches limit.</p>
            </div>
            <input
              type="number"
              value={maxCapacity}
              onChange={e => setMaxCapacity(parseInt(e.target.value) || 0)}
              className="w-16 bg-card-2 text-sm p-2 rounded-xl border border-border outline-none focus:border-primary/50 text-center font-bold"
            />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary w-full py-4 shadow-lg shadow-primary/20 sticky bottom-20 z-10">
          Save Settings
        </button>

      </div>
      <BottomNav />
    </div>
  );
}
