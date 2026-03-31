import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  active: boolean;
}

export default function OwnerCoupons() {
  const { user, t } = useApp();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `businesses/${user.uid}/coupons`));
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
      // Sort by expiry date, then active status
      fetched.sort((a, b) => {
        if (a.active !== b.active) return a.active ? -1 : 1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      });
      setCoupons(fetched);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching coupons:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCode(coupon.code);
      setDiscountType(coupon.discountType);
      setDiscountValue(coupon.discountValue.toString());
      setMaxUses(coupon.maxUses.toString());
      setExpiryDate(coupon.expiryDate);
      setActive(coupon.active);
    } else {
      setEditingCoupon(null);
      setCode('');
      setDiscountType('percentage');
      setDiscountValue('');
      setMaxUses('');
      setExpiryDate('');
      setActive(true);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!code.trim() || !discountValue || !user) return;
    setSaving(true);

    const itemData = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue) || 0,
      maxUses: Number(maxUses) || 0,
      currentUses: editingCoupon?.currentUses || 0,
      expiryDate,
      active,
    };

    try {
      if (editingCoupon?.id) {
        await updateDoc(doc(db, `businesses/${user.uid}/coupons`, editingCoupon.id), itemData);
      } else {
        await addDoc(collection(db, `businesses/${user.uid}/coupons`), itemData);
      }
      setShowModal(false);
    } catch (e) {
      console.error("Error saving coupon:", e);
      alert("Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, `businesses/${user.uid}/coupons`, id));
    } catch (e) {
      console.error("Error deleting coupon:", e);
    }
  };

  const isExpired = (dateString: string) => {
    if (!dateString) return false;
    return new Date(dateString).getTime() < new Date().getTime();
  };

  const activeCouponsCount = coupons.filter(c => c.active && !isExpired(c.expiryDate)).length;

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />
        <div className="flex justify-between items-center mb-6 mt-4">
          <h1 className="text-2xl font-bold">Promo Codes</h1>
          <button onClick={() => openModal()} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            + New Coupon
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-text-dim text-xs mb-1">Active Coupons</p>
            <p className="text-2xl font-bold text-success">{activeCouponsCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-text-dim text-xs mb-1">Total Created</p>
            <p className="text-2xl font-bold">{coupons.length}</p>
          </div>
        </div>

        {/* Coupons List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl border border-dashed border-border bg-card/50">
            <span className="text-5xl block mb-3 opacity-50">🎫</span>
            <p className="text-text-dim font-medium">No promo codes yet</p>
            <p className="text-text-dim text-xs mt-1">Create codes to offer discounts to your customers</p>
          </div>
        ) : (
          <div className="space-y-3">
            {coupons.map(coupon => {
              const expired = isExpired(coupon.expiryDate);
              const maxReached = coupon.maxUses > 0 && coupon.currentUses >= coupon.maxUses;
              const usable = coupon.active && !expired && !maxReached;

              return (
                <div key={coupon.id} className={`p-4 rounded-2xl border transition-all ${usable ? 'bg-card border-primary/30' : 'bg-card-2 border-border opacity-70'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-black tracking-widest border border-primary/20 text-sm">
                          {coupon.code}
                        </span>
                        {!usable && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/10 text-danger font-bold uppercase tracking-wide">
                            {expired ? 'Expired' : maxReached ? 'Limit Reached' : 'Inactive'}
                          </span>
                        )}
                      </div>
                      <p className="text-text-dim text-xs">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(coupon)} className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">✏️</button>
                      <button onClick={() => handleDelete(coupon.id!)} className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center text-sm">🗑️</button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">Usage</p>
                      <p className="text-sm font-semibold">
                        {coupon.currentUses} <span className="text-text-dim font-normal">/ {coupon.maxUses || '∞'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">Expires</p>
                      <p className={`text-sm font-semibold ${expired ? 'text-danger' : ''}`}>
                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-3xl p-6 w-full max-w-sm animate-scaleIn border border-border shadow-2xl">
            <h2 className="text-xl font-bold mb-5">{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-text-dim mb-1 block">Promo Code *</label>
                <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" className="input-field w-full font-bold tracking-widest uppercase" autoFocus />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim mb-1 block">Discount Type</label>
                  <select value={discountType} onChange={e => setDiscountType(e.target.value as 'percentage' | 'flat')} className="input-field w-full bg-card">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-dim mb-1 block">Discount Value *</label>
                  <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 100'} className="input-field w-full" />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-dim mb-1 block">Max Uses (Leave empty for unlimited)</label>
                <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="e.g. 50" className="input-field w-full" />
              </div>

              <div>
                <label className="text-xs text-text-dim mb-1 block">Expiry Date</label>
                <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="input-field w-full" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <label htmlFor="couponActive" className="text-sm font-medium">Is Active</label>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-card-2 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !code.trim() || !discountValue} className="flex-1 btn-primary py-3 text-sm disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
