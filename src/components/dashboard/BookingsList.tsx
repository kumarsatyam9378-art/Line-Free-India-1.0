import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenEntry } from '../../store/AppContext';
import { useApp } from '../../store/AppContext';

export interface BookingsListProps {
  businessId: string;
}

export default function BookingsList({ businessId }: BookingsListProps) {
  const { getSalonTokens } = useApp();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const fetchTokens = async () => {
      try {
        const tks = await getSalonTokens(businessId, todayStr);
        setTokens(tks);
      } catch (err) {
        console.error("Failed to load live queue", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [businessId, getSalonTokens]);

  const upcomingAppointments = tokens.filter(t => t.status === 'waiting' && t.isAdvanceBooking).sort((a, b) => (a.advanceDate || '').localeCompare(b.advanceDate || ''));

  if (loading) return <div className="text-center p-4 text-text-dim">Loading appointments...</div>;

  return (
    <div className="bg-card border border-border p-5 rounded-3xl shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Today's Appointments</h2>
        <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          {upcomingAppointments.length} Upcoming
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(t => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-start justify-between p-4 rounded-xl bg-card-2 border border-border group"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                    {t.advanceDate?.split('at ')[1] || 'TBD'}
                  </div>
                  <div>
                    <p className="font-bold text-base text-text">{t.customerName}</p>
                    <p className="text-sm text-text-dim mt-0.5 truncate max-w-[180px]">
                      {t.selectedServices.map(s => s.name).join(', ')}
                    </p>
                    <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={`tel:${t.customerPhone}`} className="p-2 rounded-lg bg-card border border-border text-text hover:text-primary transition-colors">
                    📞
                  </a>
                  <a href={`https://wa.me/91${t.customerPhone}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-card border border-border text-text hover:text-[#25D366] transition-colors">
                    💬
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-text-dim border border-dashed border-border rounded-xl bg-card-2">
              <span className="text-4xl block mb-2 opacity-50">📅</span>
              <p>No more appointments today</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
