import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp, TokenEntry } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BottomNav from '../components/layout/BottomNav';

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  lastVisit: number;
  totalVisits: number;
  totalSpent: number;
}

export default function BarberCustomerList() {
  const { user, barberProfile, pushNotification } = useApp();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'new'|'regular'|'vip'|'atRisk'>('all');
  const [sendingMsg, setSendingMsg] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const f = searchParams.get('filter');
    if (f === 'atRisk' || f === 'vip' || f === 'new' || f === 'regular') {
      setFilter(f);
    }
  }, [location]);

  useEffect(() => {
    const loadCustomers = async () => {
      if (!user) return;
      const q = query(collection(db, 'tokens'), where('salonId', '==', user.uid), where('status', '==', 'done'));
      const snap = await getDocs(q);

      const cMap = new Map<string, CustomerData>();

      snap.forEach(doc => {
        const t = doc.data() as TokenEntry;
        if (!t.customerId) return;

        if (!cMap.has(t.customerId)) {
          cMap.set(t.customerId, {
            id: t.customerId,
            name: t.customerName || 'Unknown',
            phone: t.customerPhone || '',
            lastVisit: t.createdAt,
            totalVisits: 1,
            totalSpent: t.totalPrice || 0
          });
        } else {
          const c = cMap.get(t.customerId)!;
          c.totalVisits += 1;
          c.totalSpent += (t.totalPrice || 0);
          if (t.createdAt > c.lastVisit) c.lastVisit = t.createdAt;
          cMap.set(t.customerId, c);
        }
      });

      setCustomers(Array.from(cMap.values()));
      setLoading(false);
    };
    loadCustomers();
  }, [user]);

  const getFiltered = () => {
    const now = Date.now();
    return customers.filter(c => {
      const daysSince = (now - c.lastVisit) / 86400000;
      if (filter === 'new') return c.totalVisits === 1;
      if (filter === 'regular') return c.totalVisits >= 2 && c.totalVisits < 5;
      if (filter === 'vip') return c.totalVisits >= 5;
      if (filter === 'atRisk') return daysSince > 30;
      return true;
    }).sort((a, b) => b.lastVisit - a.lastVisit);
  };

  const filtered = getFiltered();

  const handleSendMassMessage = async () => {
    if (!filtered.length) return alert('No customers in this segment');
    const msg = prompt(`Enter message to send to ${filtered.length} customers in ${filter} segment:`);
    if (!msg) return;

    setSendingMsg(true);
    let sent = 0;
    for (const c of filtered) {
       try {
         await pushNotification(c.id, {
            title: `Message from ${barberProfile?.salonName || 'Salon'}`,
            body: msg,
            type: 'general',
            data: { salonId: user?.uid }
         });
         sent++;
       } catch (e) { console.error('Error sending:', e); }
    }
    setSendingMsg(false);
    alert(`Sent message to ${sent} customers!`);
  };

  return (
    <div className="min-h-screen p-6 pb-24 animate-fadeIn">
      <h1 className="text-2xl font-bold mb-1">Customer Database</h1>
      <p className="text-text-dim text-sm mb-4">Total: {customers.length} unique customers</p>

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${filter === 'all' ? 'bg-primary text-white' : 'bg-card border border-border text-text-dim'}`}>All</button>
        <button onClick={() => setFilter('new')} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${filter === 'new' ? 'bg-blue-500 text-white' : 'bg-card border border-border text-text-dim'}`}>👶 New</button>
        <button onClick={() => setFilter('regular')} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${filter === 'regular' ? 'bg-green-500 text-white' : 'bg-card border border-border text-text-dim'}`}>🧑‍🤝‍🧑 Regular</button>
        <button onClick={() => setFilter('vip')} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${filter === 'vip' ? 'bg-gold text-black' : 'bg-card border border-border text-text-dim'}`}>👑 VIP</button>
        <button onClick={() => setFilter('atRisk')} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${filter === 'atRisk' ? 'bg-danger text-white' : 'bg-card border border-border text-text-dim'}`}>⚠️ At Risk</button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold">{filtered.length} customers</p>
        <button onClick={handleSendMassMessage} disabled={sendingMsg || filtered.length === 0} className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg font-bold">
          {sendingMsg ? 'Sending...' : '📢 Message All'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading customers...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-2 text-text-dim">👥</span>
          <p className="text-text-dim">No customers in this segment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="p-4 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card-2 flex items-center justify-center text-xl flex-shrink-0">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{c.name}</p>
                <div className="flex gap-2 text-[10px] text-text-dim mt-0.5">
                  <span>{c.totalVisits} visits</span>
                  <span>•</span>
                  <span>₹{c.totalSpent} spent</span>
                </div>
                <p className="text-[10px] text-primary mt-1">
                  Last visit: {new Date(c.lastVisit).toLocaleDateString()}
                </p>
              </div>
              {c.phone && (
                <a href={`tel:${c.phone}`} className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success flex-shrink-0">
                  📞
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav role="barber" />
    </div>
  );
}
