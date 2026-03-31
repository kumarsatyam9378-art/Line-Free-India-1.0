import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';
import BottomNav from '../components/layout/BottomNav';
import { getBusinessDashboardConfig } from '../constants/businessUIConfig';

export default function BarberHome() {
  const { user, barberProfile, toggleSalonOpen, toggleSalonBreak, toggleSalonStop, continueTokens, nextCustomer, unreadCount, getSalonTokens, getTodayEarnings, t } = useApp();
  const nav = useNavigate();

  const [waitingCount, setWaitingCount] = useState(0);
  const [currentCustomerName, setCurrentCustomerName] = useState('');
  const [todayTokensCount, setTodayTokensCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);

  useEffect(() => {
    if (!user || !barberProfile) return;
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const loadTokens = async () => {
      try {
        const tks = await getSalonTokens(user.uid, todayStr);
        setTodayTokensCount(tks.length);
        const w = tks.filter(t => t.status === 'waiting').sort((a, b) => a.tokenNumber - b.tokenNumber);
        setWaitingCount(w.length);
        const s = tks.filter(t => t.status === 'serving');
        if (s.length > 0) setCurrentCustomerName(s[0].customerName);
        else setCurrentCustomerName('');
      } catch (e) { console.error('Error loading tokens:', e); }
    };
    loadTokens();
    const iv = setInterval(loadTokens, 10000);

    const loadEarnings = async () => {
      const e = await getTodayEarnings();
      setTodayEarnings(e);
    };
    loadEarnings();

    return () => clearInterval(iv);
  }, [user, barberProfile, getSalonTokens, getTodayEarnings]);

  if (!barberProfile) return null;

  const bInfo = BUSINESS_CATEGORIES_INFO.find(c => c.id === barberProfile.businessType)
                || BUSINESS_CATEGORIES_INFO.find(c => c.id === 'other')!;

  const dashConfig = getBusinessDashboardConfig(barberProfile.businessType);

  return (
    <div className={`min-h-screen pb-24 ${bInfo.designTheme} bg-bg text-text animate-fadeIn`}>
      {/* HEADER */}
      <div className={`p-6 bg-gradient-to-br from-[var(--cat-primary,#6C63FF)]/10 to-[var(--cat-accent,#4ECDC4)]/5 rounded-b-3xl`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-card flex items-center justify-center border-2 border-primary/20 shadow-sm shadow-primary/10">
              {barberProfile.salonImageURL ? (
                <img src={barberProfile.salonImageURL} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-2xl">{bInfo.icon}</span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{barberProfile.businessName || barberProfile.salonName}</h1>
              <p className="text-text-dim text-xs mt-0.5 capitalize">{bInfo.label} • {bInfo.terminology?.provider || 'Owner'}</p>
            </div>
          </div>
          <button onClick={() => nav('/barber/notifications')} className="relative p-2 bg-card rounded-full shadow-sm">
            <span>🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full border-2 border-card text-[8px] font-bold text-white flex justify-center items-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* OPEN/CLOSED TOGGLE CARD */}
        <div className="mt-6 bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${barberProfile.isOpen ? 'bg-success animate-pulse' : 'bg-danger'}`} />
            <div>
              <p className="font-semibold">{barberProfile.isOpen ? 'Accepting Orders/Bookings' : 'Closed Currently'}</p>
              <p className="text-xs text-text-dim">{barberProfile.isOpen ? 'Customers can join queue' : 'No new customers'}</p>
            </div>
          </div>
          <button
            onClick={toggleSalonOpen}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              barberProfile.isOpen ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'bg-success/10 text-success hover:bg-success/20'
            }`}
          >
            {barberProfile.isOpen ? 'Close' : 'Open'}
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="p-6 pb-2">
        <h2 className="font-semibold mb-3">Today's Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-2xl">👥</span>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="text-text-dim text-xs mt-2">{dashConfig.todayLabel}</p>
            <p className="text-2xl font-bold">{todayTokensCount}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <span className="text-2xl">💵</span>
              <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">+5%</span>
            </div>
            <p className="text-text-dim text-xs mt-2">Revenue</p>
            <p className="text-2xl font-bold">₹{todayEarnings}</p>
          </div>
        </div>
      </div>

      {/* QUEUE CONTROLS (Only for businesses that use a queue) */}
      {!bInfo.hasTimedSlots && (
        <div className="p-6 pb-2">
          <div className="bg-card border border-border p-5 rounded-3xl text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full -ml-10 -mb-10 blur-xl" />
            <h2 className="text-text-dim font-medium mb-1 z-10 relative">{t('queue.current')}</h2>
            <div className="text-7xl font-black gradient-text mb-2 z-10 relative tracking-tighter">
              #{barberProfile.currentToken || 0}
            </div>
            {currentCustomerName && (
              <p className="text-primary font-medium mb-4 bg-primary/10 inline-block px-3 py-1 rounded-full text-sm z-10 relative">
                Now Serving: {currentCustomerName}
              </p>
            )}

            <button onClick={nextCustomer} disabled={!barberProfile.isOpen || barberProfile.isStopped} className="w-full btn-primary py-4 text-lg mt-2 shadow-lg shadow-primary/30 z-10 relative disabled:opacity-50 disabled:shadow-none">
              {t('queue.next')} →
            </button>

            <div className="flex justify-between items-center mt-5 pt-5 border-t border-border z-10 relative">
              <div>
                <p className="text-3xl font-bold text-text">{waitingCount}</p>
                <p className="text-text-dim text-[10px] uppercase tracking-wider">{t('queue.waiting')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleSalonBreak} className={`px-4 py-2 rounded-xl text-sm font-medium border ${barberProfile.isBreak ? 'bg-warning/20 border-warning text-warning' : 'border-border text-text hover:bg-card-2'}`}>
                  {barberProfile.isBreak ? t('salon.endBreak') : t('salon.break')}
                </button>
                <button onClick={barberProfile.isStopped ? continueTokens : toggleSalonStop} className={`px-4 py-2 rounded-xl text-sm font-medium border ${barberProfile.isStopped ? 'bg-success/20 border-success text-success' : 'border-border text-danger hover:bg-danger/10 hover:border-danger/30'}`}>
                  {barberProfile.isStopped ? t('queue.continue') : t('queue.stop')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS GRID (Dynamic based on business type) */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Quick Actions</h2>
          <button onClick={() => nav('/barber/more')} className="text-xs text-primary font-medium">See All →</button>
        </div>

        <div className="grid grid-cols-4 gap-y-4 gap-x-2">
          {bInfo.hasTimedSlots && (
            <button onClick={() => nav('/barber/calendar')} className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">📅</div>
              <span className="text-[10px] text-text-dim font-medium text-center leading-tight">Appointments</span>
            </button>
          )}

          <button onClick={() => nav('/barber/customers')} className="flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">🧑‍🤝‍🧑</div>
            <span className="text-[10px] text-text-dim font-medium text-center leading-tight">{!bInfo.hasTimedSlots ? 'Live Queue' : dashConfig.customerNoun + 's'}</span>
          </button>

          {bInfo.hasMenu && (
            <button onClick={() => nav('/barber/digital-menu')} className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">📖</div>
              <span className="text-[10px] text-text-dim font-medium text-center leading-tight">Menu</span>
            </button>
          )}

          {bInfo.id === 'restaurant' && (
            <button onClick={() => nav('/barber/tables')} className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">🪑</div>
              <span className="text-[10px] text-text-dim font-medium text-center leading-tight">Tables</span>
            </button>
          )}

          {bInfo.id === 'hospital' || bInfo.id === 'clinic' ? (
            <button onClick={() => nav('/barber/patient-vault')} className="flex flex-col items-center gap-1 group">
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">🗂️</div>
              <span className="text-[10px] text-text-dim font-medium text-center leading-tight">Patients</span>
            </button>
          ) : null}

          <button onClick={() => nav('/barber/staff')} className="flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">👔</div>
            <span className="text-[10px] text-text-dim font-medium text-center leading-tight">Staff</span>
          </button>

          <button onClick={() => nav('/barber/analytics')} className="flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">📊</div>
            <span className="text-[10px] text-text-dim font-medium text-center leading-tight">Analytics</span>
          </button>

          <button onClick={() => nav('/barber/qr')} className="flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">📱</div>
            <span className="text-[10px] text-text-dim font-medium text-center leading-tight">My QR</span>
          </button>

          <button onClick={() => nav('/barber/expenses')} className="flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl group-hover:border-primary/50 group-hover:shadow-md transition-all">🧾</div>
            <span className="text-[10px] text-text-dim font-medium text-center leading-tight">Expenses</span>
          </button>

        </div>
      </div>

      <BottomNav role="barber" />
    </div>
  );
}
