import { useState, useEffect } from 'react';
import { useApp, DayStat } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { generateMonthlyReport } from '../utils/generateReport';

export default function BarberAnalytics() {
  const { getBarberFullStats, barberProfile } = useApp();
  const [range, setRange] = useState<7 | 14 | 30>(30);
  const [stats, setStats] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBarberFullStats(range).then(data => { setStats(data); setLoading(false); });
  }, [range]);

  const totalRevenue   = stats.reduce((s, d) => s + d.revenue, 0);
  const totalCustomers = stats.reduce((s, d) => s + d.count, 0);
  const totalCancelled = stats.reduce((s, d) => s + d.cancelled, 0);
  const activeDays     = stats.filter(d => d.count > 0).length;
  const avgPerDay      = activeDays > 0 ? Math.round(totalRevenue / activeDays) : 0;
  const bestDay        = stats.reduce((b, d) => d.revenue > (b?.revenue || 0) ? d : b, stats[0]);
  const maxRevenue     = Math.max(...stats.map(d => d.revenue), 1);
  const maxCount       = Math.max(...stats.map(d => d.count), 1);

  const handleDownloadPDF = async () => {
    if (!barberProfile || stats.length === 0) return;
    setGenerating(true);
    try {
      const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      await generateMonthlyReport(stats, barberProfile, month);
    } catch (e) {
      console.error('PDF error:', e);
      alert('PDF generation failed. Please try again.');
    }
    setGenerating(false);
  };

  return (
    <div className="h-[100dvh] overflow-y-auto pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">📊 Analytics</h1>
            <p className="text-text-dim text-xs mt-0.5">{barberProfile?.salonName}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Range selector */}
            <div className="flex gap-1 p-1 bg-card rounded-xl border border-border">
              {([7, 14, 30] as const).map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${range === r ? 'bg-primary text-white shadow' : 'text-text-dim'}`}>
                  {r}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-2xl bg-card animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
                <p className="text-[10px] text-text-dim uppercase tracking-wide mb-1">Revenue</p>
                <p className="text-2xl font-black text-success">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-text-dim mt-1">{range} days</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <p className="text-[10px] text-text-dim uppercase tracking-wide mb-1">Customers</p>
                <p className="text-2xl font-black gradient-text">{totalCustomers}</p>
                <p className="text-[10px] text-text-dim mt-1">served</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20">
                <p className="text-[10px] text-text-dim uppercase tracking-wide mb-1">Avg / Day</p>
                <p className="text-2xl font-black text-gold">₹{avgPerDay.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-text-dim mt-1">{activeDays} active days</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/20">
                <p className="text-[10px] text-text-dim uppercase tracking-wide mb-1">Cancelled</p>
                <p className="text-2xl font-black text-danger">{totalCancelled}</p>
                <p className="text-[10px] text-text-dim mt-1">tokens</p>
              </div>
            </div>

            {/* ── Best Day ── */}
            {bestDay && bestDay.revenue > 0 && (
              <div className="p-4 rounded-2xl bg-gold/5 border border-gold/20 mb-5 flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <p className="text-xs text-text-dim">Best Day ({range}d)</p>
                  <p className="font-bold">{bestDay.dayName}</p>
                  <p className="text-gold font-semibold text-sm">₹{bestDay.revenue.toLocaleString('en-IN')} — {bestDay.count} customers</p>
                </div>
              </div>
            )}

            {/* ── Revenue Bar Chart ── */}
            <div className="p-4 rounded-2xl bg-card border border-border mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">💰 Revenue Trend</h3>
                <p className="text-xs text-text-dim">max ₹{maxRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex items-end gap-0.5" style={{ height: 72 }}>
                {stats.map((d, i) => {
                  const h    = Math.max(3, (d.revenue / maxRevenue) * 72);
                  const isToday = d.date === new Date().toISOString().slice(0, 10);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          isToday ? 'bg-gradient-to-t from-primary to-primary/50' :
                          d.revenue > 0 ? 'bg-success/50' : 'bg-card-2/40'
                        }`}
                        style={{ height: h }}
                      />
                      {/* Hover tooltip */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none border border-border shadow">
                        ₹{d.revenue}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[8px] text-text-dim">{stats[0]?.dayName?.split(',')[0]}</p>
                <p className="text-[8px] text-primary font-bold">Today</p>
              </div>
            </div>

            {/* ── Customer Count Chart ── */}
            <div className="p-4 rounded-2xl bg-card border border-border mb-5">
              <h3 className="font-semibold text-sm mb-4">👥 Customer Volume</h3>
              <div className="flex items-end gap-0.5" style={{ height: 48 }}>
                {stats.map((d, i) => {
                  const h = Math.max(3, (d.count / maxCount) * 48);
                  const isToday = d.date === new Date().toISOString().slice(0, 10);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group relative">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          isToday ? 'bg-gradient-to-t from-accent to-accent/50' :
                          d.count > 0 ? 'bg-primary/30' : 'bg-card-2/30'
                        }`}
                        style={{ height: h }}
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 border border-border shadow">
                        {d.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Download Report PDF Button ── */}
            <button
              onClick={handleDownloadPDF}
              disabled={generating || totalRevenue === 0}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold flex items-center justify-center gap-3 mb-5 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  📄 Download Revenue Report
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">PDF</span>
                </>
              )}
            </button>
            {totalRevenue === 0 && (
              <p className="text-center text-text-dim text-xs -mt-3 mb-5">No revenue data to generate report</p>
            )}

            {/* ── Daily Table ── */}
            <div className="p-4 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-sm mb-3">📋 Daily Breakdown</h3>
              <div className="space-y-0 max-h-72 overflow-y-auto">
                {/* Table header */}
                <div className="flex text-[9px] text-text-dim font-semibold uppercase tracking-wide pb-2 border-b border-border">
                  <span className="flex-1">Day</span>
                  <span className="w-14 text-center">Cust.</span>
                  <span className="w-14 text-center">Cancelled</span>
                  <span className="w-16 text-right">Revenue</span>
                </div>
                {[...stats].reverse().map((d, i) => (
                  <div key={i} className={`flex items-center py-2 border-b border-border/40 last:border-0 text-sm ${d.count === 0 ? 'opacity-40' : ''}`}>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{d.dayName}</p>
                    </div>
                    <span className={`w-14 text-center text-xs font-bold ${d.count > 0 ? 'text-success' : 'text-text-dim'}`}>
                      {d.count || '—'}
                    </span>
                    <span className={`w-14 text-center text-xs ${d.cancelled > 0 ? 'text-danger' : 'text-text-dim'}`}>
                      {d.cancelled || '—'}
                    </span>
                    <span className={`w-16 text-right text-xs font-bold ${d.revenue > 0 ? 'text-text' : 'text-text-dim'}`}>
                      {d.revenue > 0 ? `₹${d.revenue}` : '—'}
                    </span>
                  </div>
                ))}
              </div>
              {/* Totals row */}
              <div className="flex items-center py-2.5 border-t-2 border-primary/30 mt-1 text-sm font-bold">
                <span className="flex-1 text-xs gradient-text">Total</span>
                <span className="w-14 text-center text-xs text-success">{totalCustomers}</span>
                <span className="w-14 text-center text-xs text-danger">{totalCancelled}</span>
                <span className="w-16 text-right text-xs gradient-text">₹{totalRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Rating */}
            {barberProfile?.rating ? (
              <div className="p-4 rounded-2xl bg-gold/5 border border-gold/20 mt-4 flex items-center gap-4">
                <p className="text-4xl font-black text-gold">{barberProfile.rating}</p>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Overall Rating</p>
                  <p className="text-text-dim text-xs">{barberProfile.totalReviews || 0} reviews</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`text-sm ${s <= Math.round(barberProfile.rating || 0) ? 'text-gold' : 'text-text-dim'}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
