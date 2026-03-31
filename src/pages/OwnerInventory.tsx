import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export interface InventoryItem {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPrice: number;
  sellPrice: number;
}

export default function OwnerInventory() {
  const { user, t } = useApp();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [minStock, setMinStock] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `businesses/${user.uid}/inventory`));
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem));
      // Sort alphabetically
      fetched.sort((a, b) => a.name.localeCompare(b.name));
      setItems(fetched);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching inventory:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const openModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setQuantity(item.quantity.toString());
      setUnit(item.unit);
      setMinStock(item.minStock.toString());
      setCostPrice(item.costPrice.toString());
      setSellPrice(item.sellPrice.toString());
    } else {
      setEditingItem(null);
      setName('');
      setQuantity('');
      setUnit('pcs');
      setMinStock('');
      setCostPrice('');
      setSellPrice('');
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !quantity || !user) return;
    setSaving(true);

    const itemData = {
      name: name.trim(),
      quantity: Number(quantity) || 0,
      unit,
      minStock: Number(minStock) || 0,
      costPrice: Number(costPrice) || 0,
      sellPrice: Number(sellPrice) || 0,
    };

    try {
      if (editingItem?.id) {
        await updateDoc(doc(db, `businesses/${user.uid}/inventory`, editingItem.id), itemData);
      } else {
        await addDoc(collection(db, `businesses/${user.uid}/inventory`), itemData);
      }
      setShowModal(false);
    } catch (e) {
      console.error("Error saving item:", e);
      alert("Failed to save item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, `businesses/${user.uid}/inventory`, id));
    } catch (e) {
      console.error("Error deleting item:", e);
    }
  };

  const lowStockItems = items.filter(item => item.quantity <= item.minStock);

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />
        <div className="flex justify-between items-center mb-6 mt-4">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <button onClick={() => openModal()} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
            + Add Item
          </button>
        </div>

        {/* Alerts */}
        {lowStockItems.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 flex gap-3 items-start animate-slideUp">
            <span className="text-danger text-xl">⚠️</span>
            <div>
              <p className="font-bold text-danger text-sm">Low Stock Alert</p>
              <p className="text-danger/80 text-xs mt-0.5">
                {lowStockItems.length} {lowStockItems.length === 1 ? 'item is' : 'items are'} running low on stock.
              </p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-text-dim text-xs mb-1">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-text-dim text-xs mb-1">Total Value</p>
            <p className="text-2xl font-bold text-primary">₹{items.reduce((acc, item) => acc + (item.quantity * item.costPrice), 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Inventory List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl border border-dashed border-border bg-card/50">
            <span className="text-5xl block mb-3 opacity-50">📦</span>
            <p className="text-text-dim font-medium">Your inventory is empty</p>
            <p className="text-text-dim text-xs mt-1">Add items to track your stock levels</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => {
              const isLow = item.quantity <= item.minStock;
              return (
                <div key={item.id} className={`p-4 rounded-2xl border transition-all ${isLow ? 'bg-danger/5 border-danger/30' : 'bg-card border-border'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-base flex items-center gap-2">
                        {item.name}
                        {isLow && <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/20 text-danger font-bold">LOW STOCK</span>}
                      </h3>
                      <p className="text-text-dim text-xs mt-0.5">
                        Buy: ₹{item.costPrice} • Sell: ₹{item.sellPrice}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(item)} className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">✏️</button>
                      <button onClick={() => handleDelete(item.id!)} className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center text-sm">🗑️</button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">Stock</p>
                      <p className={`text-xl font-bold leading-none ${isLow ? 'text-danger' : 'text-success'}`}>
                        {item.quantity} <span className="text-xs text-text-dim font-medium">{item.unit}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">Min Alert</p>
                      <p className="text-sm font-semibold">{item.minStock}</p>
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
            <h2 className="text-xl font-bold mb-5">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-text-dim mb-1 block">Item Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Hair Gel" className="input-field w-full" autoFocus />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim mb-1 block">Quantity *</label>
                  <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-text-dim mb-1 block">Unit</label>
                  <select value={unit} onChange={e => setUnit(e.target.value)} className="input-field w-full bg-card">
                    <option value="pcs">Pieces</option>
                    <option value="ml">ml</option>
                    <option value="ltr">Liters</option>
                    <option value="g">Grams</option>
                    <option value="kg">Kg</option>
                    <option value="box">Boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-text-dim mb-1 block">Low Stock Alert (Min Quantity)</label>
                <input type="number" value={minStock} onChange={e => setMinStock(e.target.value)} placeholder="e.g. 5" className="input-field w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim mb-1 block">Cost Price (₹)</label>
                  <input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} placeholder="0" className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-text-dim mb-1 block">Selling Price (₹)</label>
                  <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} placeholder="0" className="input-field w-full" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-card-2 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !name.trim() || !quantity} className="flex-1 btn-primary py-3 text-sm disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
