import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, BarberProfile, TokenEntry } from '../store/AppContext';
import { motion } from 'framer-motion';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import BottomNav from '../components/layout/BottomNav';
import NearbySalonsMap from '../components/maps/NearbySalonsMap';

export default function CustomerHome() {
  const { user, customerProfile, allSalons, unreadCount } = useApp();
  const nav = useNavigate();

  const [activeBooking, setActiveBooking] = useState<TokenEntry | null>(null);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<BarberProfile[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<BarberProfile[]>([]);
  const [bestClinics, setBestClinics] = useState<BarberProfile[]>([]);
  const [beautyWellness, setBeautyWellness] = useState<BarberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning ☀️');
    else if (h < 17) setGreeting('Good afternoon 🌤️');
    else setGreeting('Good evening 🌙');
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen for active bookings today
    const today = new Date().toISOString().split('T')[0];
    const q = query(collection(db, 'tokens'), where('customerId', '==', user.uid));

    const unsub = onSnapshot(q, (snap) => {
      const tokens = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
      // Find an active token for today
      // Using 'waiting' or 'serving' to map to pending/confirmed/in_progress from prompt instructions
      const active = tokens.find(t =>
        t.date === today &&
        (t.status === 'waiting' || t.status === 'serving' || (t as any).status === 'pending' || (t as any).status === 'confirmed' || (t as any).status === 'in_progress')
      );

      if (active) {
        setActiveBooking(active);
      } else {
        setActiveBooking(null);
      }
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    // We are requested to query Firestore, but AppContext syncs all salons to `allSalons`.
    // We will use the allSalons array for these specific filterings to avoid duplicating network requests,
    // and to match the app's architectural pattern of single state source for businesses.

    if (allSalons.length > 0) {
      // Prompt asks for isFeatured=true AND isActive=true limit 5
      // Assuming BarberProfile has isFeatured and isActive, or fallback to simple mapping
      const featured = allSalons.filter(s => (s as any).isFeatured && (s as any).isActive).slice(0, 5);
      // Fallback if no featured exist yet: just use top rated open
      if (featured.length === 0) {
          setFeaturedBusinesses([...allSalons].filter(s => (s.rating || 0) >= 4 && s.isOpen).slice(0, 5));
      } else {
          setFeaturedBusinesses(featured);
      }

      // Top Restaurants: category in ['restaurant', 'cafe']
      setTopRestaurants(allSalons.filter(s => s.businessType === 'men_salon' || s.businessType === 'beauty_parlour' || s.businessType === 'unisex_salon' || s.businessType === 'bridal_studio'));

      // Best Clinics: category in ['clinic', 'hospital']
      setBestClinics(allSalons.filter(s => s.businessType === 'spa' || s.businessType === 'ayurvedic_spa' || s.businessType === 'massage_center' || s.businessType === 'slimming_center'));

      // Beauty & Wellness: category in ['men_salon', 'beauty_parlour', 'unisex_salon', 'spa']
      setBeautyWellness(allSalons.filter(s => s.businessType === 'skin_clinic' || s.businessType === 'hair_transplant_clinic' || s.businessType === 'laser_hair_removal' || s.businessType === 'acupuncture_clinic'));

      setLoading(false);
    } else {
      // if allSalons is empty, perhaps it's still loading
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [allSalons]);

  const CATEGORIES = [
    { name: 'Men Salon', icon: '✂️', id: 'men_salon' },
    { name: 'Beauty Parlour', icon: '💄', id: 'beauty_parlour' },
    { name: 'Unisex Salon', icon: '💇', id: 'unisex_salon' },
    { name: 'Spa', icon: '💆', id: 'spa' },
    { name: 'Skin Clinic', icon: '✨', id: 'skin_clinic' },
    { name: 'Bridal', icon: '👰', id: 'bridal_studio' },
    { name: 'Massage', icon: '🌸', id: 'massage_center' },
    { name: 'Laser Hair', icon: '⚡', id: 'laser_hair_removal' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };


  const nearbySalons = allSalons.filter((salon) => typeof salon.lat === 'number' && typeof salon.lng === 'number').slice(0, 30);
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const BusinessCard = ({ salon, featured = false }: { salon: BarberProfile, featured?: boolean }) => (
    <button
      onClick={() => nav(`/customer/salon/${salon.uid}`)}
      className={`relative flex-shrink-0 text-left overflow-hidden rounded-2xl bg-card border border-border transition-all active:scale-[0.98]
        ${featured ? 'w-64 h-48' : 'w-48 h-56'}`}
    >
      <div className={`w-full ${featured ? 'h-32' : 'h-28'} bg-card-2 flex items-center justify-center overflow-hidden`}>
        {salon.salonImageURL ?
          <img src={salon.salonImageURL} className="w-full h-full object-cover" alt={salon.salonName} /> :
          (salon.photoURL ? <img src={salon.photoURL} className="w-full h-full object-cover" alt={salon.salonName} /> :
          <span className="text-4xl">🏪</span>)
        }
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
          <span className="text-[10px] text-gold font-bold">⭐ {salon.rating || 'New'}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{salon.salonName}</h3>
        {salon.location && <p className="text-text-dim text-xs mt-0.5 truncate">📍 {salon.location}</p>}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full
            ${salon.isOpen && !salon.isBreak ? 'text-success bg-success/10' : salon.isBreak ? 'text-warning bg-warning/10' : 'text-danger bg-danger/10'}`}>
            {salon.isOpen && !salon.isBreak ? '🟢 Open' : salon.isBreak ? '🟡 Break' : '🔴 Closed'}
          </span>
        </div>
      </div>
    </button>
  );

  const SkeletonRow = ({ height }: { height: string }) => (
    <div className="flex gap-4 overflow-x-hidden">
      {[1, 2, 3].map(i => (
        <div key={i} className={`flex-shrink-0 w-48 ${height} rounded-2xl bg-card-2 animate-pulse`} />
      ))}
    </div>
  );

  return (
    <div className="screen-scroll pb-24 bg-background">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 pt-6 space-y-8"
      >
        {/* 1. TOP BAR */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <p className="text-text-dim text-xs mb-0.5">{greeting}</p>
            <h1 className="text-xl font-bold truncate max-w-[200px]">
              Namaste {customerProfile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Guest'}!
            </h1>
            <div className="flex items-center gap-1 mt-1 bg-card-2 w-max px-2 py-0.5 rounded-full border border-border">
              <span className="text-[10px]">📍</span>
              <span className="text-[10px] text-text-dim truncate max-w-[100px]">
                {customerProfile?.location || 'Select City'}
              </span>
            </div>
          </div>
          <button
            aria-label="View notifications"
            onClick={() => nav('/customer/notifications')}
            className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center transition-transform active:scale-95"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold border-2 border-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </motion.div>

        {/* 2. SEARCH BAR */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => nav('/customer/search')}
            className="w-full h-12 rounded-2xl glass-card flex items-center px-4 gap-3 text-text-dim transition-transform active:scale-[0.98] border border-border shadow-sm hover:border-primary/30"
          >
            <span className="text-lg">🔍</span>
            <span className="text-sm">Restaurant, doctor, salon...</span>
          </button>
        </motion.div>

        {/* 3. ACTIVE BOOKING CARD */}
        {activeBooking && (
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary mb-1 block">Active Booking</span>
                <h3 className="font-bold text-lg">{activeBooking.salonName}</h3>
                <p className="text-xs text-text-dim mt-0.5">{activeBooking.selectedServices?.map(s => s.name).join(', ') || 'Service booked'}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-xl font-bold text-primary">#{activeBooking.tokenNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-2.5 border border-border/50">
                <p className="text-[10px] text-text-dim mb-0.5">Est. Wait</p>
                <p className="font-semibold text-sm">{activeBooking.estimatedWaitMinutes} mins</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-2.5 border border-border/50">
                <p className="text-[10px] text-text-dim mb-0.5">Status</p>
                <p className="font-semibold text-sm capitalize">{activeBooking.status}</p>
              </div>
            </div>

            <button
              onClick={() => nav(`/customer/tokens`)}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-medium text-sm transition-transform active:scale-95 shadow-md relative z-10"
            >
              Track Live
            </button>
          </motion.div>
        )}

        {/* 4. CATEGORY PILLS */}
        <motion.div variants={itemVariants}>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => nav(`/customer/search?category=${cat.id}`)}
                className="flex flex-col items-center gap-2 flex-shrink-0 w-16"
              >
                <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-2xl transition-transform active:scale-90 hover:border-primary/50 shadow-sm">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-medium text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 5. FEATURED BUSINESSES */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Featured Places</h2>
          </div>
          {loading ? <SkeletonRow height="h-48" /> : (
            featuredBusinesses.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                {featuredBusinesses.map(salon => (
                  <BusinessCard key={salon.uid} salon={salon} featured={true} />
                ))}
              </div>
            ) : (
              <p className="text-text-dim text-sm">No featured places yet.</p>
            )
          )}
        </motion.div>

        {/* 6. THREE SECTIONS */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Trending Salons ✂️</h2>
            <button onClick={() => nav('/customer/search?category=specialized')} className="text-primary text-xs font-medium">See all</button>
          </div>
          {loading ? <SkeletonRow height="h-56" /> : (
            topRestaurants.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                {topRestaurants.map(salon => <BusinessCard key={salon.uid} salon={salon} />)}
              </div>
            ) : (
              <p className="text-text-dim text-sm italic mb-4">Coming soon to your area.</p>
            )
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4 mt-6">
            <h2 className="font-bold text-lg">Top Rated Wellness 🌸</h2>
            <button onClick={() => nav('/customer/search?category=wellness')} className="text-primary text-xs font-medium">See all</button>
          </div>
          {loading ? <SkeletonRow height="h-56" /> : (
            bestClinics.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                {bestClinics.map(salon => <BusinessCard key={salon.uid} salon={salon} />)}
              </div>
            ) : (
              <p className="text-text-dim text-sm italic mb-4">Coming soon to your area.</p>
            )
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4 mt-6">
            <h2 className="font-bold text-lg">Specialized Care ✨</h2>
            <button onClick={() => nav('/customer/search?category=specialized')} className="text-primary text-xs font-medium">See all</button>
          </div>
          {loading ? <SkeletonRow height="h-56" /> : (
            beautyWellness.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                {beautyWellness.map(salon => <BusinessCard key={salon.uid} salon={salon} />)}
              </div>
            ) : (
              <p className="text-text-dim text-sm italic mb-4">Coming soon to your area.</p>
            )
          )}
        </motion.div>


        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4 mt-6">
            <h2 className="font-bold text-lg">Nearby Map 🗺️</h2>
            <button onClick={() => nav('/customer/search')} className="text-primary text-xs font-medium">Explore</button>
          </div>
          {nearbySalons.length > 0 ? (
            <NearbySalonsMap
              salons={nearbySalons}
              center={
                customerProfile?.lat && customerProfile?.lng
                  ? [customerProfile.lat, customerProfile.lng]
                  : undefined
              }
            />
          ) : (
            <p className="text-text-dim text-sm italic mb-4">Map will appear when nearby salons share GPS coordinates.</p>
          )}
        </motion.div>

        {/* 7. LOYALTY POINTS CARD */}
        <motion.div variants={itemVariants} className="pt-2">
          <div className="p-5 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-gold/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <p className="text-text-dim text-xs mb-1">Your Rewards</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gold">{(customerProfile as any)?.loyaltyPoints || 0}</span>
                <span className="text-sm font-medium">pts</span>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full">
                <span className="text-gold text-xs font-bold uppercase tracking-wider">
                  {(customerProfile as any)?.tier || 'Silver'} Tier
                </span>
              </div>
              <p className="text-[10px] text-text-dim mt-2">Earn more on next visit</p>
            </div>
          </div>
        </motion.div>

      </motion.div>
      <BottomNav role="customer" />
    </div>
  );
}
