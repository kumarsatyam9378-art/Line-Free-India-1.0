import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  validUntil: string;
  isActive: boolean;
}

export default function OwnerCoupons() {
  const { user } = useApp();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [validUntil, setValidUntil] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, `businesses/${user.uid}/coupons`), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
      setCoupons(list);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleSave = async () => {
    if (!user || !code.trim() || discountValue <= 0 || !validUntil) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    try {
      const id = editId || Date.now().toString();
      await setDoc(doc(db, `businesses/${user.uid}/coupons`, id), {
        id,
        code: code.toUpperCase(),
        discountType,
        discountValue,
        validUntil,
        isActive
      });
      toast.success(editId ? 'Coupon updated' : 'Coupon added');
      resetForm();
    } catch (err) {
      toast.error('Failed to save coupon');
    }
  };

  const handleEdit = (c: Coupon) => {
    setEditId(c.id);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setValidUntil(c.validUntil);
    setIsActive(c.isActive);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, `businesses/${user.uid}/coupons`, id));
      toast.success('Coupon deleted');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditId(null);
    setCode('');
    setDiscountValue(0);
    setValidUntil('');
    setIsActive(true);
  };

  return (
    <div className="h-[100dvh] overflow-y-auto pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/settings" />
        <h1 className="text-2xl font-bold mb-5">Coupons & Promos</h1>

        {!showAddForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-text-dim text-sm">{coupons.length} coupons</p>
              <button onClick={() => setShowAddForm(true)} className="btn-primary text-sm py-2 px-4">
                + Add Coupon
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : coupons.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-2xl border border-border">
                <p className="text-text-dim">No coupons active.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 bg-card rounded-2xl border border-border flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-primary">{c.code}</h3>
                        <p className="text-text-dim text-xs">
                          {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`} • Valid till {new Date(c.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${c.isActive ? 'bg-success text-white' : 'bg-card-2 text-text-dim'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-border pt-2">
                      <button onClick={() => handleEdit(c)} className="text-primary text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-danger text-sm font-medium">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card p-5 rounded-2xl border border-border">
            <h2 className="text-lg font-bold mb-4">{editId ? 'Edit Coupon' : 'New Coupon'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-dim block mb-1">Coupon Code</label>
                <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. DIWALI20" className="input-field uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Discount Type</label>
                  <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="input-field">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Value</label>
                  <input type="number" value={discountValue || ''} onChange={e => setDiscountValue(Number(e.target.value))} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-dim block mb-1">Valid Until</label>
                <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="input-field" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} id="isActive" />
                <label htmlFor="isActive" className="text-sm">Is Active?</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={resetForm} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary text-sm py-3">Save</button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
