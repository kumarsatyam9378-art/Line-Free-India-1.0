import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';
import BottomNav from '../components/layout/BottomNav';
import StatCard from '../components/dashboard/StatCard';
import LiveQueueDisplay from '../components/dashboard/LiveQueueDisplay';
import BookingsList from '../components/dashboard/BookingsList';
import { db } from '../firebase';
import { collection, query, where, limit, onSnapshot, getDocs } from 'firebase/firestore';

export default function BarberHome() {
  const { user, barberProfile, toggleSalonOpen, unreadCount, getSalonTokens } = useApp();
  const nav = useNavigate();

  const [waitingCount, setWaitingCount] = useState(0);
  const [todayTokensCount, setTodayTokensCount] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !barberProfile) return;
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // Load recent reviews
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('businessId', '==', user.uid), limit(3));
        const snapshot = await getDocs(q);
        const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentReviews(fetchedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();

    // Setup listener for today's completed bookings (revenue & count)
    const bookingsRef = collection(db, 'bookings');
    const todayBookingsQuery = query(
      bookingsRef,
      where('businessId', '==', user.uid),
      where('bookedFor', '==', todayStr)
    );

    const unsubscribeBookings = onSnapshot(todayBookingsQuery, (snapshot) => {
      let tokens = 0;
      let earnings = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        tokens++;
        if (data.status === 'completed') {
          earnings += Number(data.finalAmount || data.amount || 0);
        }
      });
      setTodayTokensCount(tokens);
      setTodayEarnings(earnings);
    });

    const loadQueueCount = async () => {
      try {
        const tks = await getSalonTokens(user.uid, todayStr);
        const w = tks.filter(t => t.status === 'waiting');
        setWaitingCount(w.length);
      } catch (e) { console.error(e); }
    };
    loadQueueCount();

    return () => {
      unsubscribeBookings();
    };
  }, [user, barberProfile, getSalonTokens]);

  if (!barberProfile) return null;

  const bInfo = BUSINESS_CATEGORIES_INFO.find(c => c.id === barberProfile.businessType)
                || BUSINESS_CATEGORIES_INFO.find(c => c.id === 'other')!;

  return (
    <div className={`min-h-screen pb-24 ${bInfo.designTheme} bg-bg text-text animate-fadeIn`}>
      {/* HEADER */}
      <div className={`p-6 bg-gradient-to-br from-[var(--cat-primary,#6C63FF)]/10 to-[var(--cat-accent,#4ECDC4)]/5 rounded-b-3xl`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-card flex items-center justify-center border-2 border-primary/20 shadow-sm shadow-primary/10">
              {barberProfile.logoUrl || barberProfile.salonImageURL ? (
                <img src={barberProfile.logoUrl || barberProfile.salonImageURL} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <span className="text-xl">{bInfo.icon}</span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight truncate max-w-[150px]">{barberProfile.businessName || barberProfile.salonName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <button
                   onClick={toggleSalonOpen}
                   className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors border ${barberProfile.isOpen ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'}`}
                 >
                   <div className={`w-1.5 h-1.5 rounded-full ${barberProfile.isOpen ? 'bg-success animate-pulse' : 'bg-danger'}`} />
                   {barberProfile.isOpen ? 'Accepting Bookings' : 'Paused'}
                 </button>
              </div>
            </div>
          </div>

          <button onClick={() => nav('/barber/notifications')} className="relative p-2.5 bg-card rounded-full shadow-sm border border-border/50 text-text-dim hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            {unreadCount > 0 && (
              <span className="absolute 0 right-0 w-4 h-4 bg-danger rounded-full border-2 border-card text-[9px] font-bold text-white flex justify-center items-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TODAY STATS */}
      <div className="p-6 pb-2">
        <h2 className="font-semibold mb-3">Today's Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Revenue"
            value={todayEarnings}
            prefix="₹"
            icon="💵"
            trend="up"
            trendValue="5%"
          />
          <StatCard
            label={bInfo.terminology?.noun || 'Bookings'}
            value={todayTokensCount}
            icon="👥"
            trend="up"
            trendValue="12%"
          />
          <StatCard
            label="Waiting Now"
            value={waitingCount}
            icon="⏳"
            trend="neutral"
            trendValue=""
          />
          <StatCard
            label="Rating"
            value={barberProfile.rating || 0}
            icon="⭐"
            trend="neutral"
            trendValue=""
          />
        </div>
      </div>

      {/* LIVE SECTION (Queue or Timed Slots) */}
      {!bInfo.hasTimedSlots ? (
        <div className="p-6 pb-2">
           <LiveQueueDisplay
             businessId={user?.uid || ''}
           />
        </div>
      ) : (
        <div className="p-6 pb-2">
           <BookingsList
              businessId={user?.uid || ''}
           />
        </div>
      )}

      {/* QUICK ACTIONS GRID */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-3 gap-y-4 gap-x-2">
          <button onClick={() => nav('/barber/bookings')} className="flex flex-col items-center gap-2 group">
             <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-md transition-all">📅</div>
             <span className="text-xs text-text-dim font-medium text-center leading-tight">Bookings</span>
          </button>
          <button onClick={() => nav('/barber/analytics')} className="flex flex-col items-center gap-2 group">
             <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-md transition-all">📊</div>
             <span className="text-xs text-text-dim font-medium text-center leading-tight">Analytics</span>
          </button>
          <button onClick={() => nav('/barber/customers')} className="flex flex-col items-center gap-2 group">
             <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-md transition-all">🧑‍🤝‍🧑</div>
             <span className="text-xs text-text-dim font-medium text-center leading-tight">Customers</span>
          </button>
          <button onClick={() => nav('/barber/gallery')} className="flex flex-col items-center gap-2 group">
             <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-md transition-all">🖼️</div>
             <span className="text-xs text-text-dim font-medium text-center leading-tight">Gallery</span>
          </button>
          <button onClick={() => nav('/barber/services')} className="flex flex-col items-center gap-2 group">
             <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-md transition-all">✂️</div>
             <span className="text-xs text-text-dim font-medium text-center leading-tight">Services</span>
          </button>
          <button onClick={() => nav('/barber/settings')} className="flex flex-col items-center gap-2 group">
             <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl group-hover:border-primary/50 group-hover:shadow-md transition-all">⚙️</div>
             <span className="text-xs text-text-dim font-medium text-center leading-tight">Settings</span>
          </button>
        </div>
      </div>

      {/* RECENT REVIEWS */}
      <div className="p-6 pt-0 pb-12">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Recent Reviews</h2>
          <button onClick={() => nav('/barber/reviews')} className="text-xs text-primary font-medium">See All →</button>
        </div>
        {recentReviews.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentReviews.map(review => (
              <div key={review.id} className="bg-card border border-border p-4 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-[10px] font-bold">
                       {review.customerName?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium text-sm">{review.customerName || 'Anonymous User'}</span>
                  </div>
                  <div className="flex text-warning text-xs">
                     {'⭐'.repeat(Math.round(review.rating || 5))}
                  </div>
                </div>
                <p className="text-sm text-text-dim line-clamp-2">{review.comment || 'No comment provided.'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border p-6 rounded-2xl text-center">
             <span className="text-2xl mb-2 block">⭐</span>
             <p className="text-sm text-text-dim">No reviews yet.</p>
          </div>
        )}
      </div>

      <BottomNav role="barber" />
    </div>
  );
}
