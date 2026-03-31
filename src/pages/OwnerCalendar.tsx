import { useState, useEffect } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export default function OwnerCalendar() {
  const { user, barberProfile, getSalonTokens } = useApp();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  const fetchTokens = async (d: Date) => {
    if (!user) return;
    setLoading(true);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const tks = await getSalonTokens(user.uid, dateStr);
    setTokens(tks.sort((a,b) => a.tokenNumber - b.tokenNumber));
    setLoading(false);
  };

  useEffect(() => { fetchTokens(date); }, [date, user]);

  const changeDay = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    setDate(newDate);
  };

  const statusColor = (status: string) => ({
    done: 'bg-success/20 border-success/30 text-success',
    waiting: 'bg-warning/20 border-warning/30 text-warning',
    serving: 'bg-primary/20 border-primary/30 text-primary',
    cancelled: 'bg-danger/20 border-danger/30 text-danger',
  }[status] || 'bg-card border-border');

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/barber/home" />
          <h1 className="text-2xl font-bold">Booking Calendar</h1>
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-between bg-card p-3 rounded-2xl border border-border mb-6">
          <button onClick={() => changeDay(-1)} className="p-2 text-xl hover:bg-card-2 rounded-xl">◀</button>
          <div className="text-center">
            <p className="font-bold text-lg">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="text-xs text-text-dim">{date.getFullYear()}</p>
          </div>
          <button onClick={() => changeDay(1)} className="p-2 text-xl hover:bg-card-2 rounded-xl">▶</button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />)}</div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4 opacity-50">📅</span>
            <p className="text-text-dim text-lg">No bookings for this date.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map(token => (
              <div key={token.id} className={`p-4 rounded-2xl border ${statusColor(token.status)}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-bold bg-background/50 px-2 py-0.5 rounded-md">#{token.tokenNumber}</span>
                    <p className="font-bold mt-1 text-text">{token.customerName}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase">{token.status}</span>
                </div>
                <p className="text-sm text-text-dim mb-2">{token.selectedServices.map(s => s.name).join(', ')}</p>
                <div className="flex justify-between text-xs font-medium text-text-dim">
                  <span>⏰ Est: {token.estimatedWaitMinutes}m</span>
                  <span>💰 ₹{token.totalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
