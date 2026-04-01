import { useState, useEffect } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export default function CustomerHistory() {
  const { user, getCustomerFullHistory } = useApp();
  const nav = useNavigate();
  const [history, setHistory] = useState<TokenEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'done' | 'cancelled'>('all');

  useEffect(() => {
    if (!user) return;
    getCustomerFullHistory(user.uid).then(h => { setHistory(h); setLoading(false); });
  }, [user]);

  const filtered = filter === 'all' ? history : history.filter(t => t.status === filter);
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

  return (
    <div className="h-[100dvh] overflow-y-auto pb-24 animate-fadeIn">
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

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {(['all', 'done', 'cancelled'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white' : 'bg-card border border-border text-text-dim'}`}>
              {f === 'all' ? 'All' : f === 'done' ? '✅ Completed' : '❌ Cancelled'} ({f === 'all' ? history.length : history.filter(t => t.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-card animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">📋</span>
            <p className="text-text-dim">No visits yet</p>
            <button onClick={() => nav('/customer/search')} className="btn-primary mt-4 text-sm px-6 py-2">Find a Salon</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((token, i) => (
              <div key={token.id || i} className="p-4 rounded-2xl bg-card border border-border animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{token.salonName}</p>
                    <p className="text-text-dim text-xs mt-0.5">Token #{token.tokenNumber} • {token.date}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor(token.status)}`}>
                    {statusLabel(token.status)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {token.selectedServices.map((s, j) => (
                    <span key={j} className="text-[10px] bg-card-2 px-2 py-0.5 rounded-full">{s.name}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-text-dim text-xs">~{token.totalTime} min</p>
                  <p className={`font-bold ${token.status === 'done' ? 'text-success' : 'text-text-dim'}`}>
                    {token.status === 'done' ? `₹${token.totalPrice}` : token.status === 'cancelled' ? 'Cancelled' : `₹${token.totalPrice}`}
                  </p>
                </div>
                {/* Rating for done tokens */}
                {token.status === 'done' && token.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-xs ${s <= token.rating! ? 'text-gold' : 'text-text-dim'}`}>★</span>
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
