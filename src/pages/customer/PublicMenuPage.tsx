import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, BarberProfile } from '../../store/AppContext';
import MenuDisplay from '../../components/food/MenuDisplay';

export default function PublicMenuPage() {
  const { id } = useParams<{ id: string }>();
  const { getSalonById, t } = useApp();
  const [salon, setSalon] = useState<BarberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) getSalonById(id).then(s => { setSalon(s); setLoading(false); });
  }, [id, getSalonById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-dim text-lg">Loading Menu...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="text-center">
          <span className="text-6xl mb-4 block opacity-50">🍽️</span>
          <h1 className="text-2xl font-bold mb-2">Business Not Found</h1>
          <p className="text-text-dim text-lg">The menu you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text p-6 pb-24 font-sans animate-fadeIn">
      {/* Header */}
      <div className="relative h-48 rounded-3xl overflow-hidden mb-6 glass-card shadow-2xl border border-border shadow-black/20">
        <img src={salon.bannerImageURL || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'}
          alt={salon.salonName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
          <img src={salon.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(salon.salonName)}&background=random`}
            alt="Logo" className="w-16 h-16 rounded-2xl border-2 border-background object-cover shadow-lg" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white drop-shadow-md truncate">{salon.salonName}</h1>
            <p className="text-sm text-white/80 drop-shadow flex items-center gap-1">
              📍 {salon.location}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-primary">Menu</h2>
           <p className="text-text-dim text-sm mt-1">{salon.menuItems?.length || 0} items available</p>
         </div>
      </div>

      <MenuDisplay items={salon.menuItems || []} />
    </div>
  );
}
