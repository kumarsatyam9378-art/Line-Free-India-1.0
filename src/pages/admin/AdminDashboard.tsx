import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';

const ADMIN_EMAIL = 'satyamkumar56021@gmail.com';

export default function AdminDashboard() {
  const { user, allSalons } = useApp();

  if (!user) return <Navigate to="/barber/auth" replace />;
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) return <Navigate to="/" replace />;

  const stats = useMemo(() => {
    const total = allSalons.length;
    const active = allSalons.filter((s) => s.isOpen).length;
    const flagged = allSalons.filter((s) => (s.rating || 5) < 2.5).length;
    const estRevenue = allSalons.reduce((acc, curr) => acc + (curr.totalEarnings || 0), 0);
    return { total, active, flagged, estRevenue };
  }, [allSalons]);

  return (
    <div className="screen-scroll p-6 pb-24 bg-bg text-text">
      <h1 className="text-2xl font-bold">Platform Admin Dashboard</h1>
      <p className="mt-1 text-text-dim text-sm">Signed in as {ADMIN_EMAIL}</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-text-dim">Total businesses</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-text-dim">Active now</p><p className="text-2xl font-bold text-success">{stats.active}</p></div>
        <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-text-dim">Flagged accounts</p><p className="text-2xl font-bold text-warning">{stats.flagged}</p></div>
        <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-text-dim">Revenue tracked</p><p className="text-2xl font-bold">₹{Math.round(stats.estRevenue)}</p></div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-semibold">Businesses</h2>
        <div className="mt-3 space-y-2">
          {allSalons.slice(0, 100).map((s) => (
            <div key={s.uid} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
              <div>
                <p className="font-medium text-sm">{s.salonName || s.businessName || s.name}</p>
                <p className="text-xs text-text-dim">{s.location || 'N/A'}</p>
              </div>
              <span className={`text-xs font-semibold ${s.isOpen ? 'text-success' : 'text-danger'}`}>{s.isOpen ? 'OPEN' : 'CLOSED'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
