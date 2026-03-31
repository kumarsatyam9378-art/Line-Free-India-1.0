import { useState, useEffect } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

function EmptyState({ tab, onAction }: { tab: string; onAction: () => void }) {
  const content = {
    active: { icon: '🎫', title: 'No active bookings', desc: 'You have no ongoing appointments.', btn: 'Book Now' },
    upcoming: { icon: '📅', title: 'No upcoming bookings', desc: 'Your schedule is clear.', btn: 'Explore Salons' },
    completed: { icon: '✅', title: 'No past visits', desc: 'You haven\'t completed any visits yet.', btn: 'Find a Salon' },
    cancelled: { icon: '❌', title: 'No cancelled bookings', desc: 'You have no cancellations.', btn: null }
  }[tab] || { icon: '📋', title: 'Nothing here', desc: 'No bookings found.', btn: 'Explore Salons' };

  return (
    <div className="text-center py-16">
      <span className="text-5xl block mb-3">{content.icon}</span>
      <h3 className="font-bold text-lg">{content.title}</h3>
      <p className="text-text-dim text-sm mt-1">{content.desc}</p>
      {content.btn && (
        <button onClick={onAction} className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold active:scale-95 transition-all">
          {content.btn}
        </button>
      )}
    </div>
  );
}

export default function CustomerHistory() {
  const { user, getCustomerFullHistory } = useApp();
  const nav = useNavigate();
  const [history, setHistory] = useState<TokenEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'upcoming' | 'completed' | 'cancelled'>('completed');

  useEffect(() => {
    if (!user) return;
    getCustomerFullHistory(user.uid).then(h => { setHistory(h); setLoading(false); });
  }, [user]);

  const isTodayOrPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d <= today;
  };

  const isFuture = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d > today;
  };

  const filtered = history.filter(t => {
    if (filter === 'active') return (t.status === 'waiting' || t.status === 'serving') && isTodayOrPast(t.date);
    if (filter === 'upcoming') return (t.status === 'waiting' || t.status === 'serving') && isFuture(t.date);
    if (filter === 'completed') return t.status === 'done';
    if (filter === 'cancelled') return t.status === 'cancelled';
    return true;
  });

  const totalSpent = history.filter(t => t.status === 'done').reduce((s, t) => s + t.totalPrice, 0);
  const totalVisits = history.filter(t => t.status === 'done').length;

  const statusColor = (status: string) => ({
    done: 'text-success bg-success/10 border-success/30',
    waiting: 'text-warning bg-warning/10 border-warning/30',
    serving: 'text-primary bg-primary/10 border-primary/30',
    cancelled: 'text-danger bg-danger/10 border-danger/30',
  }[status] || '');

  const statusLabel = (status: string) => ({
    done: '✅ Done', waiting: '⏳ Waiting', serving: '✂️ Serving', cancelled: '❌ Cancelled'
  }[status] || status);

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ] as const;

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/customer/profile" />
        <h1 className="text-2xl font-bold mb-4">📋 Visit History</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-2xl glass-card text-center">
            <p className="text-2xl font-bold gradient-text">{totalVisits}</p>
            <p className="text-[10px] text-text-dim">Total Visits</p>
          </div>
          <div className="p-3 rounded-2xl glass-card text-center">
            <p className="text-2xl font-bold text-gold">₹{totalSpent}</p>
            <p className="text-[10px] text-text-dim">Total Spent</p>
          </div>
          <div className="p-3 rounded-2xl glass-card text-center">
            <p className="text-2xl font-bold text-success">{totalVisits > 0 ? Math.round(totalSpent / totalVisits) : 0}</p>
            <p className="text-[10px] text-text-dim">Avg / Visit</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-card border border-border text-text-dim'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-card animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState tab={filter} onAction={() => nav('/customer/search')} />
        ) : (
          <div className="space-y-3">
            {filtered.map((token, i) => (
              <div key={token.id || i} className="p-4 rounded-2xl bg-card border border-border animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">{token.salonName}</p>
                    <p className="text-text-dim text-xs mt-0.5">Token #{token.tokenNumber} • {token.date} {token.time ? `• ${token.time}` : ''}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor(token.status)}`}>
                    {statusLabel(token.status)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {token.selectedServices.map((s, j) => (
                    <span key={j} className="text-[10px] bg-card-2 px-2 py-0.5 rounded-full border border-border">{s.name}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border/50">
                  <p className={`font-bold ${token.status === 'done' ? 'text-text' : 'text-text-dim'}`}>
                    {token.status === 'cancelled' ? 'Cancelled' : `₹${token.totalPrice}`}
                  </p>

                  <div className="flex gap-2">
                    {token.status === 'done' && !token.rating && (
                      <button className="px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-bold border border-warning/20">
                        Write Review
                      </button>
                    )}
                    <button
                      onClick={() => nav(`/customer/salon/${token.salonId}`)}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20"
                    >
                      Book Again
                    </button>
                  </div>
                </div>

                {/* Rating for done tokens */}
                {token.status === 'done' && token.rating && (
                  <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/50">
                    <span className="text-xs text-text-dim mr-1">Your rating:</span>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-sm ${s <= token.rating! ? 'text-gold' : 'text-text-dim/30'}`}>★</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
