import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initialValue: number;
  issuedTo?: string;
  issuedDate: string;
  isActive: boolean;
}

export default function OwnerGiftCards() {
  const { user } = useApp();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [code, setCode] = useState('');
  const [value, setValue] = useState(500);
  const [issuedTo, setIssuedTo] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, `businesses/${user.uid}/giftcards`), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as GiftCard));
      setGiftCards(list);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleGenerate = async () => {
    if (!user || value <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    const finalCode = code.trim() || `GC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const id = Date.now().toString();

    try {
      await setDoc(doc(db, `businesses/${user.uid}/giftcards`, id), {
        id,
        code: finalCode,
        initialValue: value,
        balance: value,
        issuedTo,
        issuedDate: new Date().toISOString(),
        isActive: true
      });
      toast.success('Gift Card Generated!');
      setShowAddForm(false);
      setCode('');
      setIssuedTo('');
      setValue(500);
    } catch (e) {
      toast.error('Failed to generate');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Revoke this gift card?')) return;
    try {
      await setDoc(doc(db, `businesses/${user.uid}/giftcards`, id), { isActive: false }, { merge: true });
      toast.success('Gift card revoked');
    } catch {
      toast.error('Error revoking card');
    }
  };

  return (
    <div className="h-[100dvh] overflow-y-auto pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/settings" />
        <h1 className="text-2xl font-bold mb-5">Gift Cards</h1>

        {!showAddForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-text-dim text-sm">{giftCards.length} cards issued</p>
              <button onClick={() => setShowAddForm(true)} className="btn-primary text-sm py-2 px-4">
                + Generate New
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : giftCards.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-2xl border border-border">
                <p className="text-text-dim">No gift cards generated yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {giftCards.map((gc) => (
                  <div key={gc.id} className="p-4 bg-card rounded-2xl border border-border flex flex-col gap-2">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-lg font-mono text-primary">{gc.code}</h3>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${gc.isActive ? 'bg-success text-white' : 'bg-card-2 text-text-dim'}`}>
                        {gc.isActive ? 'Active' : 'Revoked'}
                      </span>
                    </div>
                    <p className="text-sm">Balance: <span className="font-bold">₹{gc.balance}</span> / ₹{gc.initialValue}</p>
                    {gc.issuedTo && <p className="text-xs text-text-dim">Issued to: {gc.issuedTo}</p>}
                    {gc.isActive && (
                      <button onClick={() => handleRevoke(gc.id)} className="text-xs text-danger self-end mt-2">Revoke Card</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card p-5 rounded-2xl border border-border">
            <h2 className="text-lg font-bold mb-4">Generate Gift Card</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-dim block mb-1">Custom Code (Optional)</label>
                <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Leave blank for random" className="input-field font-mono" />
              </div>
              <div>
                <label className="text-xs text-text-dim block mb-1">Value (₹)</label>
                <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="text-xs text-text-dim block mb-1">Customer Name / Phone (Optional)</label>
                <input value={issuedTo} onChange={e => setIssuedTo(e.target.value)} placeholder="e.g. John Doe" className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium">Cancel</button>
              <button onClick={handleGenerate} className="flex-1 btn-primary text-sm py-3">Generate</button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
