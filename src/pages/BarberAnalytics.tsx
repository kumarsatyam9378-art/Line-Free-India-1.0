import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { generateMonthlyReport } from '../utils/generateReport';
import { calculateDailyRevenue, findPeakHours, getServiceBreakdown, calculateRetentionRate, Booking } from '../utils/analytics';
import RevenueChart from '../components/analytics/RevenueChart';
import BookingsChart from '../components/analytics/BookingsChart';
import PeakHoursChart from '../components/analytics/PeakHoursChart';
import ServicePopularityChart from '../components/analytics/ServicePopularityChart';

export default function BarberAnalytics() {
  const { barberProfile, getSalonTokens, user } = useApp();
  const [range, setRange] = useState<7 | 14 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const fetchTokens = async () => {
      try {
        const allTokens: Booking[] = [];
        // Fetch tokens day by day using the existing method
        for (let i = 0; i < range; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().slice(0, 10);

          const tks = await getSalonTokens(user.uid, dateStr);
          // Map to the Booking interface expected by analytics utils
          const mappedTks = tks.map((t: any) => ({
            id: t.id,
            createdAt: t.createdAt,
            date: t.date,
            time: t.time || '00:00', // tokens might not have exact time, fallback to 00:00
            status: t.status === 'done' ? 'completed' : t.status === 'cancelled' ? 'cancelled' : 'booked',
            totalPrice: t.totalPrice || 0,
            services: t.selectedServices || [],
            customerId: t.customerId || ''
          })) as Booking[];

          allTokens.push(...mappedTks);
        }
        setBookings(allTokens);
      } catch (err) {
        console.error('Error fetching analytics tokens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [range, user, getSalonTokens]);

  const dailyStats = calculateDailyRevenue(bookings, range);
  const peakHours = findPeakHours(bookings);
  const serviceBreakdown = getServiceBreakdown(bookings);
  const retention = calculateRetentionRate(bookings);

  const totalRevenue   = dailyStats.reduce((s, d) => s + d.revenue, 0);
  const totalCustomers = dailyStats.reduce((s, d) => s + d.completed, 0);
  const totalCancelled = dailyStats.reduce((s, d) => s + d.cancelled, 0);
  const activeDays     = dailyStats.filter(d => d.completed > 0).length;
  const avgPerDay      = activeDays > 0 ? Math.round(totalRevenue / activeDays) : 0;

  const handleDownloadPDF = async () => {
    if (!barberProfile || dailyStats.length === 0) return;
    setGenerating(true);
    try {
      const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      // Map back to DayStat format for the legacy report generator
      const mappedStats = dailyStats.map(d => ({
        date: d.date,
        dayName: new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        revenue: d.revenue,
        count: d.completed,
        cancelled: d.cancelled
      }));
      await generateMonthlyReport(mappedStats, barberProfile, month);
    } catch (e) {
      console.error('PDF error:', e);
      alert('PDF generation failed. Please try again.');
    }
    setGenerating(false);
  };

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">📊 Analytics</h1>
            <p className="text-text-dim text-xs mt-0.5">{barberProfile?.salonName}</p>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
          {([7, 14, 30, 90] as const).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${range === r ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-card border border-border text-text-dim hover:text-text'}`}>
              {r === 7 ? 'Week' : r === 30 ? 'Month' : r === 90 ? '3 Months' : `${r} Days`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-3xl bg-card animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-3xl bg-card border border-border shadow-sm">
                <p className="text-[10px] text-text-dim uppercase tracking-wider font-semibold mb-1">Revenue</p>
                <p className="text-2xl font-black text-primary">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-success mt-1">↑ from previous</p>
              </div>
              <div className="p-4 rounded-3xl bg-card border border-border shadow-sm">
                <p className="text-[10px] text-text-dim uppercase tracking-wider font-semibold mb-1">Customers</p>
                <p className="text-2xl font-black text-text">{totalCustomers}</p>
                <p className="text-[10px] text-text-dim mt-1">served</p>
              </div>
              <div className="p-4 rounded-3xl bg-card border border-border shadow-sm">
                <p className="text-[10px] text-text-dim uppercase tracking-wider font-semibold mb-1">Avg / Day</p>
                <p className="text-2xl font-black text-gold">₹{avgPerDay.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-text-dim mt-1">{activeDays} active days</p>
              </div>
              <div className="p-4 rounded-3xl bg-card border border-border shadow-sm">
                <p className="text-[10px] text-text-dim uppercase tracking-wider font-semibold mb-1">Retention</p>
                <p className="text-2xl font-black text-accent">{retention.retentionRate.toFixed(0)}%</p>
                <p className="text-[10px] text-text-dim mt-1">return rate</p>
              </div>
            </div>

            {/* ── Revenue Chart ── */}
            <div className="p-4 rounded-3xl bg-card border border-border mb-6 shadow-sm">
              <h3 className="font-bold text-sm mb-4">💰 Revenue Trend</h3>
              <RevenueChart data={dailyStats.reverse()} />
            </div>

            {/* ── Bookings Chart ── */}
            <div className="p-4 rounded-3xl bg-card border border-border mb-6 shadow-sm">
              <h3 className="font-bold text-sm mb-4">👥 Bookings Over Time</h3>
              <BookingsChart data={dailyStats} />
            </div>

            {/* ── Peak Hours Heatmap ── */}
            <div className="p-4 rounded-3xl bg-card border border-border mb-6 shadow-sm overflow-hidden">
              <h3 className="font-bold text-sm mb-4">🔥 Peak Hours</h3>
              <PeakHoursChart data={peakHours} />
            </div>

            {/* ── Service Popularity ── */}
            {serviceBreakdown.length > 0 && (
              <div className="p-4 rounded-3xl bg-card border border-border mb-6 shadow-sm">
                <h3 className="font-bold text-sm mb-4">✨ Service Popularity</h3>
                <ServicePopularityChart data={serviceBreakdown} />
              </div>
            )}

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

            {/* Rating */}
            {barberProfile?.rating ? (
              <div className="p-4 rounded-3xl bg-card border border-border shadow-sm mt-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center">
                  <p className="text-2xl font-black text-gold">{barberProfile.rating}</p>
                </div>
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
