import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BackButton from '../components/BackButton';

export default function BarberOffers() {
  const { barberProfile, saveBarberProfile } = useApp();
  const nav = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage'|'flat'>('percentage');
  const [newValue, setNewValue] = useState('');

  if (!barberProfile) return null;

  const offers = barberProfile.promoCodes || [];

  const handleAdd = async () => {
    if (!newCode || !newValue) return;
    const updated = [...offers, {
      code: newCode.toUpperCase(),
      type: newType,
      value: Number(newValue),
      active: true
    }];
    await saveBarberProfile({ ...barberProfile, promoCodes: updated });
    setShowAdd(false);
    setNewCode('');
    setNewValue('');
  };

  const toggleStatus = async (idx: number) => {
    const updated = [...offers];
    updated[idx].active = !updated[idx].active;
    await saveBarberProfile({ ...barberProfile, promoCodes: updated });
  };

  const handleDelete = async (idx: number) => {
    const updated = offers.filter((_, i) => i !== idx);
    await saveBarberProfile({ ...barberProfile, promoCodes: updated });
  };

  return (
    <div className="min-h-screen p-6 animate-fadeIn">
      <BackButton to="/barber/home" />
      <div className="flex justify-between items-center mt-4 mb-6">
        <h1 className="text-2xl font-bold">Seasonal Offers</h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary py-2 px-4 text-sm w-auto">
          + Add Offer
        </button>
      </div>

      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="text-center py-12 text-text-dim">
            <span className="text-4xl block mb-2">🏷️</span>
            <p>No active offers</p>
          </div>
        ) : (
          offers.map((o, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{o.code}</h3>
                <p className="text-sm text-text-dim">
                  {o.type === 'percentage' ? `${o.value}% OFF` : `₹${o.value} OFF`}
                </p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${o.active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {o.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(idx)} className="p-2 rounded-xl bg-card-2 border border-border">
                  {o.active ? '⏸️' : '▶️'}
                </button>
                <button onClick={() => handleDelete(idx)} className="p-2 rounded-xl bg-danger/10 border border-danger/20 text-danger">
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">New Offer Code</h2>

            <label className="text-xs text-text-dim mb-1 block">Promo Code</label>
            <input value={newCode} onChange={e => setNewCode(e.target.value)} className="input-field mb-4 uppercase" placeholder="e.g. DIWALI50" />

            <label className="text-xs text-text-dim mb-1 block">Discount Type</label>
            <div className="flex gap-2 mb-4">
              <button onClick={() => setNewType('percentage')} className={`flex-1 py-2 rounded-xl text-sm ${newType === 'percentage' ? 'bg-primary text-white' : 'bg-card-2'}`}>Percentage (%)</button>
              <button onClick={() => setNewType('flat')} className={`flex-1 py-2 rounded-xl text-sm ${newType === 'flat' ? 'bg-primary text-white' : 'bg-card-2'}`}>Flat (₹)</button>
            </div>

            <label className="text-xs text-text-dim mb-1 block">Value</label>
            <input type="number" value={newValue} onChange={e => setNewValue(e.target.value)} className="input-field mb-6" placeholder="e.g. 50" />

            <button onClick={handleAdd} className="btn-primary mb-2">Save Offer</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
