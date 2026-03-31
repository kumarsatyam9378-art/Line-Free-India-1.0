import { MenuItem } from '../../store/AppContext';

export default function MenuItemCard({ item, action }: { item: MenuItem; action?: React.ReactNode }) {
  return (
    <div className={`flex gap-3 w-full items-start ${!item.available ? 'opacity-50' : ''}`}>
      {item.photo && (
        <img src={item.photo} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-border shadow-md" />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 border-2 flex items-center justify-center p-[1px] ${item.isVeg ? 'border-success' : 'border-danger'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-success' : 'bg-danger'}`} />
          </div>
          <h4 className="font-bold leading-tight">{item.name}</h4>
        </div>
        <p className="font-bold text-gold mt-1">₹{item.price}</p>
        {item.category && <p className="text-[10px] text-text-dim mt-0.5">{item.category}</p>}
      </div>
      {action && <div className="ml-2">{action}</div>}
    </div>
  );
}
