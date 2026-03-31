import { useNavigate } from 'react-router-dom';
import { useApp, BarberProfile } from '../../store/AppContext';

export default function SalonCard({ salon }: { salon: BarberProfile }) {
  const { toggleFavorite, isFavorite } = useApp();
  const nav = useNavigate();

  return (
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
}
