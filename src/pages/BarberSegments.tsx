import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BackButton from '../components/BackButton';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function BarberSegments() {
  const { user, barberProfile } = useApp();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState({ new: 0, regular: 0, vip: 0, atRisk: 0 });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const q = query(collection(db, 'tokens'), where('salonId', '==', user.uid), where('status', '==', 'done'));
      const snap = await getDocs(q);
      const visits = new Map<string, number>();
      const lastVisit = new Map<string, number>();
      const now = Date.now();

      snap.forEach(doc => {
        const t = doc.data();
        if (!t.customerId) return;
        visits.set(t.customerId, (visits.get(t.customerId) || 0) + 1);
        const lV = lastVisit.get(t.customerId) || 0;
        if (t.createdAt > lV) lastVisit.set(t.customerId, t.createdAt);
      });

      let newC = 0, regC = 0, vipC = 0, atRiskC = 0;

      visits.forEach((count, cid) => {
         const lastMs = lastVisit.get(cid) || 0;
         const daysSince = (now - lastMs) / 86400000;

         if (count === 1) newC++;
         else if (count >= 5) vipC++;
         else regC++;

         if (daysSince > 30) atRiskC++;
      });

      setSegments({ new: newC, regular: regC, vip: vipC, atRisk: atRiskC });
      setLoading(false);
    };
    loadData();
  }, [user]);

  if (!barberProfile) return null;

  return (
    <div className="min-h-screen p-6 animate-fadeIn pb-24">
      <BackButton to="/barber/home" />
      <h1 className="text-2xl font-bold mt-4 mb-6">Customer Segments</h1>

      {loading ? (
        <div className="text-center py-10">Loading segments...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
            <span className="text-3xl block mb-2">👶</span>
            <p className="text-2xl font-bold">{segments.new}</p>
            <p className="text-sm font-semibold">New</p>
            <p className="text-[10px] text-text-dim">1 visit total</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-2xl p-4">
            <span className="text-3xl block mb-2">🧑‍🤝‍🧑</span>
            <p className="text-2xl font-bold">{segments.regular}</p>
            <p className="text-sm font-semibold">Regular</p>
            <p className="text-[10px] text-text-dim">2-4 visits</p>
          </div>

          <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 rounded-2xl p-4">
            <span className="text-3xl block mb-2">👑</span>
            <p className="text-2xl font-bold">{segments.vip}</p>
            <p className="text-sm font-semibold">VIP</p>
            <p className="text-[10px] text-text-dim">5+ visits</p>
          </div>

          <div className="bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/20 rounded-2xl p-4">
            <span className="text-3xl block mb-2">⚠️</span>
            <p className="text-2xl font-bold">{segments.atRisk}</p>
            <p className="text-sm font-semibold">At Risk</p>
            <p className="text-[10px] text-text-dim">{'>'}30 days since last</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-card border border-border rounded-xl p-4">
        <h3 className="font-bold mb-2">Actionable Insights</h3>
        <p className="text-xs text-text-dim mb-4">You have {segments.atRisk} customers who haven't visited in over 30 days. Send them a special offer to win them back!</p>
        <button onClick={() => nav('/barber/offers')} className="btn-primary py-2 text-sm w-full mb-3">Create Win-Back Offer</button>
        <button onClick={() => nav('/barber/customer-list?filter=atRisk')} className="btn-secondary py-2 text-sm w-full">View At-Risk Customers</button>
      </div>
    </div>
  );
}
