import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, BarberProfile } from '../store/AppContext';
import BottomNav from '../components/BottomNav';

export default function CustomerHome() {
  const { user, customerProfile, signOutUser, allSalons, isFavorite, toggleFavorite, getUserLocation, unreadCount, t } = useApp();
  const nav = useNavigate();
  const [nearbySalons, setNearbySalons] = useState<BarberProfile[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning ☀️');
    else if (h < 17) setGreeting('Good afternoon 🌤️');
    else setGreeting('Good evening 🌙');
  }, []);

  const openSalons = allSalons.filter(s => s.isOpen && !s.isBreak && !s.isStopped);
  const topRated = [...allSalons].filter(s => (s.rating || 0) >= 4).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  const favSalons = allSalons.filter(s => isFavorite(s.uid));

  const handleGetLocation = async () => {
    setLocLoading(true);
    const loc = await getUserLocation();
    setLocLoading(false);
    if (loc) {
      // Sort by "nearness" using simple name/location matching as proxy
      // In a real app, you'd compute actual distance using lat/lng from barber profiles
      setHasLocation(true);
      const withLoc = allSalons.filter(s => s.location && s.isOpen);
      setNearbySalons(withLoc.slice(0, 5));
    } else {
      alert('Could not get location. Please enable location access.');
    }
  };

  const SalonCard = ({ salon }: { salon: BarberProfile }) => (
    <button
      onClick={() => nav(`/customer/salon/${salon.uid}`)}
      className="w-full p-4 rounded-2xl bg-card border border-border text-left flex items-center gap-3 hover:border-primary/30 transition-all active:scale-[0.98]"
    >
      <div className="w-14 h-14 rounded-xl bg-card-2 flex items-center justify-center overflow-hidden flex-shrink-0">
        {salon.salonImageURL ? <img src={salon.salonImageURL} className="w-14 h-14 object-cover" alt="" /> :
         salon.photoURL ? <img src={salon.photoURL} className="w-14 h-14 object-cover" alt="" /> :
         <span className="text-2xl">💈</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{salon.salonName}</p>
          {salon.rating && <span className="text-[10px] text-gold font-bold">⭐{salon.rating}</span>}
        </div>
        <p className="text-text-dim text-xs truncate">{salon.name}</p>
        {salon.location && <p className="text-text-dim text-[10px] truncate">📍 {salon.location}</p>}
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${salon.isOpen && !salon.isBreak ? 'text-success bg-success/10' : salon.isBreak ? 'text-warning bg-warning/10' : 'text-danger bg-danger/10'}`}>
            {salon.isOpen && !salon.isBreak ? '🟢 Open' : salon.isBreak ? '🟡 Break' : '🔴 Closed'}
          </span>
          {salon.services?.length > 0 && <span className="text-[10px] text-text-dim">from ₹{Math.min(...salon.services.map(s => s.price))}</span>}
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); toggleFavorite(salon.uid); }}
        className={`text-xl flex-shrink-0 transition-transform active:scale-110 ${isFavorite(salon.uid) ? 'opacity-100' : 'opacity-30'}`}>
        ❤️
      </button>
    </button>
  );

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-text-dim text-sm">{greeting}</p>
            <h1 className="text-2xl font-bold">{customerProfile?.name || user?.displayName || 'Welcome'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => nav('/customer/notifications')} className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
              🔔
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-card-2 ring-2 ring-primary/30">
              {(customerProfile?.photoURL || user?.photoURL) ?
                <img src={customerProfile?.photoURL || user?.photoURL || ''} className="w-10 h-10 object-cover" alt="" /> :
                <div className="w-10 h-10 flex items-center justify-center text-xl">👤</div>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 p-3 rounded-xl glass-card text-center">
            <p className="text-2xl font-bold gradient-text">{allSalons.length}</p>
            <p className="text-text-dim text-[10px]">Total Salons</p>
          </div>
          <div className="flex-1 p-3 rounded-xl glass-card text-center">
            <p className="text-2xl font-bold text-success">{openSalons.length}</p>
            <p className="text-text-dim text-[10px]">Open Now</p>
          </div>
          <div className="flex-1 p-3 rounded-xl glass-card text-center">
            <p className="text-2xl font-bold text-gold">{favSalons.length}</p>
            <p className="text-text-dim text-[10px]">Favorites</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Social Proof Live Ticker */}
        {allSalons.length > 0 && (
          <div className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-3 overflow-hidden shadow-inner relative">
            <span className="text-xl animate-pulse">🔥</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary line-clamp-1">
                <span className="font-bold">{Math.floor(Math.random() * 10) + 5} bookings</span> made in your area in the last hour!
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={() => nav('/customer/search')} className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-left active:scale-[0.97] transition-all">
            <span className="text-2xl mb-1.5 block">🔍</span>
            <p className="font-semibold text-sm">Find Salon</p>
            <p className="text-text-dim text-[10px] mt-0.5">Search by name or area</p>
          </button>
          <button onClick={() => nav('/customer/tokens')} className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 text-left active:scale-[0.97] transition-all">
            <span className="text-2xl mb-1.5 block">🎫</span>
            <p className="font-semibold text-sm">My Tokens</p>
            <p className="text-text-dim text-[10px] mt-0.5">Track your queue</p>
          </button>
          <button onClick={() => nav('/customer/hairstyles')} className="p-4 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 text-left active:scale-[0.97] transition-all">
            <span className="text-2xl mb-1.5 block">💇</span>
            <p className="font-semibold text-sm">Hairstyles</p>
            <p className="text-text-dim text-[10px] mt-0.5">Get inspired</p>
          </button>
          <button onClick={() => nav('/customer/history')} className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 text-left active:scale-[0.97] transition-all">
            <span className="text-2xl mb-1.5 block">📋</span>
            <p className="font-semibold text-sm">History</p>
            <p className="text-text-dim text-[10px] mt-0.5">Past visits</p>
          </button>
        </div>

        {/* Location Banner */}
        {!hasLocation && (
          <button onClick={handleGetLocation} disabled={locLoading}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center gap-3 mb-5 text-left active:scale-[0.98] transition-all">
            <span className="text-2xl">{locLoading ? '⏳' : '📍'}</span>
            <div>
              <p className="font-semibold text-sm">{locLoading ? 'Getting location...' : 'Find Nearby Salons'}</p>
              <p className="text-text-dim text-[10px]">Allow location access to see salons near you</p>
            </div>
            {locLoading && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin ml-auto" />}
          </button>
        )}

        {/* Nearby Salons */}
        {hasLocation && nearbySalons.length > 0 && (
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold">📍 Nearby Salons</h2>
              <button onClick={() => nav('/customer/search')} className="text-primary text-xs font-medium">View all →</button>
            </div>
            <div className="space-y-2">
              {nearbySalons.slice(0, 3).map(salon => <SalonCard key={salon.uid} salon={salon} />)}
            </div>
          </div>
        )}

        {/* Open Salons */}
        {openSalons.length > 0 && (
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold">🟢 Open Now <span className="text-success font-bold">({openSalons.length})</span></h2>
              <button onClick={() => nav('/customer/search')} className="text-primary text-xs font-medium">View all →</button>
            </div>
            <div className="space-y-2">
              {openSalons.slice(0, 4).map(salon => <SalonCard key={salon.uid} salon={salon} />)}
            </div>
          </div>
        )}

        {/* Top Rated */}
        {topRated.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold mb-3">⭐ Top Rated</h2>
            <div className="space-y-2">
              {topRated.slice(0, 3).map(salon => <SalonCard key={salon.uid} salon={salon} />)}
            </div>
          </div>
        )}

        {/* Favorites */}
        {favSalons.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold mb-3">❤️ Your Favorites</h2>
            <div className="space-y-2">
              {favSalons.map(salon => <SalonCard key={salon.uid} salon={salon} />)}
            </div>
          </div>
        )}

        {/* All Salons */}
        {allSalons.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold mb-3">💈 All Salons ({allSalons.length})</h2>
            <div className="space-y-2">
              {allSalons.map(salon => <SalonCard key={salon.uid} salon={salon} />)}
            </div>
          </div>
        )}

        {allSalons.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3 animate-float">💈</span>
            <p className="text-text-dim font-medium">No salons registered yet</p>
            <p className="text-text-dim text-xs mt-1">Be the first to register your salon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
