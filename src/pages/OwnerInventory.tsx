import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function OwnerInventory() {
  const { user } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, `businesses/${user.uid}/inventory`), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(list);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleSave = async () => {
    if (!user || !name.trim() || price <= 0) {
      toast.error('Please enter valid product details');
      return;
    }

    try {
      const id = editId || Date.now().toString();
      await setDoc(doc(db, `businesses/${user.uid}/inventory`, id), {
        id, name, price, stock, category
      });
      toast.success(editId ? 'Product updated' : 'Product added');
      resetForm();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (p: Product) => {
    setEditId(p.id);
    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setCategory(p.category || '');
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, `businesses/${user.uid}/inventory`, id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditId(null);
    setName('');
    setPrice(0);
    setStock(0);
    setCategory('');
  };

  return (
    <div className="h-[100dvh] overflow-y-auto pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/settings" />
        <h1 className="text-2xl font-bold mb-5">Inventory Management</h1>

        {!showAddForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-text-dim text-sm">{products.length} products</p>
              <button onClick={() => setShowAddForm(true)} className="btn-primary text-sm py-2 px-4">
                + Add Product
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : products.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-2xl border border-border">
                <p className="text-text-dim">No products in inventory.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.id} className="p-4 bg-card rounded-2xl border border-border flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-base">{p.name}</h3>
                      <p className="text-text-dim text-xs">₹{p.price} • Stock: <span className={p.stock < 5 ? 'text-danger font-bold' : ''}>{p.stock}</span></p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(p)} className="text-primary">✏️</button>
                      <button onClick={() => handleDelete(p.id)} className="text-danger">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card p-5 rounded-2xl border border-border">
            <h2 className="text-lg font-bold mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-dim block mb-1">Product Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Hair Gel" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Price (₹)</label>
                  <input type="number" value={price || ''} onChange={e => setPrice(Number(e.target.value))} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Stock Qty</label>
                  <input type="number" value={stock || ''} onChange={e => setStock(Number(e.target.value))} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-dim block mb-1">Category (Optional)</label>
                <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Cosmetics" className="input-field" />
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
