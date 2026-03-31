import { useApp } from '../../store/AppContext';
import SalonCard from '../../components/business/SalonCard';
import BottomNav from '../../components/BottomNav';
import BackButton from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';

export default function CustomerFavorites() {
  const { allSalons, isFavorite, toggleFavorite } = useApp();
  const nav = useNavigate();

  const favSalons = allSalons.filter(s => isFavorite(s.uid));

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/customer/profile" />
          <h1 className="text-2xl font-bold">Your Favorites</h1>
        </div>

        {favSalons.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4 opacity-50">❤️</span>
            <p className="text-text-dim text-lg">You haven't added any favorites yet.</p>
            <button onClick={() => nav('/customer/search')} className="btn-primary mt-6 text-sm px-6 py-2">
              Discover Places
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favSalons.map(salon => (
              <div key={salon.uid} className="relative">
                 <SalonCard salon={salon} />
                 <button onClick={(e) => { e.stopPropagation(); toggleFavorite(salon.uid); }}
                    className="absolute top-4 right-4 text-2xl drop-shadow-md z-10 transition-transform active:scale-110 opacity-100 hover:scale-110">
                    ❤️
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
