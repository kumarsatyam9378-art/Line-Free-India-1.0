import { useState, useRef } from 'react';
import { useApp, MenuItem } from '../../store/AppContext';
import MenuItemCard from './MenuItemCard';

export default function MenuBuilder() {
  const { barberProfile, saveBarberProfile, uploadPhoto } = useApp();
  const [items, setItems] = useState<MenuItem[]>(barberProfile?.menuItems || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [available, setAvailable] = useState(true);
  const [photo, setPhoto] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = Array.from(new Set(items.map(i => i.category || 'Other').filter(Boolean)));

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setPrice(0);
    setCategory(categories[0] || 'Main Course');
    setIsVeg(true);
    setAvailable(true);
    setPhoto('');
  };

  const editItem = (item: MenuItem) => {
    setEditingId(item.id || null);
    setName(item.name || '');
    setPrice(item.price || 0);
    setCategory(item.category || '');
    setIsVeg(item.isVeg ?? true);
    setAvailable(item.available ?? true);
    setPhoto(item.photo || '');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const url = await uploadPhoto(e.target.files[0], 'menu');
    if (url) setPhoto(url);
    setUploading(false);
  };

  const saveItem = () => {
    if (!name.trim()) return;
    let newItems = [...items];
    if (editingId) {
      newItems = newItems.map(i => i.id === editingId ? { id: editingId, name, price, category, isVeg, available, photo } : i);
    } else {
      newItems.push({ id: Date.now().toString(), name, price, category, isVeg, available, photo });
    }
    setItems(newItems);
    resetForm();
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const saveToProfile = async () => {
    if (!barberProfile) return;
    setSaving(true);
    await saveBarberProfile({ ...barberProfile, menuItems: items });
    setSaving(false);
    alert('Menu saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="p-4 glass-card rounded-2xl border border-border">
        <h3 className="font-bold mb-4">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
        <div className="space-y-3">
          <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl bg-card border border-border" />
          <div className="flex gap-3">
            <input type="number" placeholder="Price (₹)" value={price || ''} onChange={e => setPrice(Number(e.target.value))} className="w-1/2 p-3 rounded-xl bg-card border border-border" />
            <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-1/2 p-3 rounded-xl bg-card border border-border" list="menu-categories" />
            <datalist id="menu-categories">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={isVeg} onChange={e => setIsVeg(e.target.checked)} className="accent-success w-4 h-4" />
              <span>Veg (Green)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} className="accent-primary w-4 h-4" />
              <span>Available</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
             <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
             <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 rounded-xl bg-card border border-border text-sm flex items-center gap-2">
               {uploading ? 'Uploading...' : '📷 Add Photo'}
             </button>
             {photo && <img src={photo} alt="preview" className="w-10 h-10 rounded-lg object-cover" />}
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={saveItem} disabled={!name} className="flex-1 btn-primary py-2 text-sm">
              {editingId ? 'Update Item' : 'Add Item'}
            </button>
            {editingId && <button onClick={resetForm} className="px-4 py-2 rounded-xl bg-card border border-border text-sm">Cancel</button>}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Current Menu ({items.length})</h3>
          <button onClick={saveToProfile} disabled={saving} className="btn-primary py-1.5 px-4 text-sm shadow-lg shadow-primary/20">
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>

        {categories.map(cat => {
          const catItems = items.filter(i => (i.category || 'Other') === cat);
          if (!catItems.length) return null;
          return (
            <div key={cat} className="space-y-2">
              <h4 className="font-semibold text-text-dim border-b border-border pb-1">{cat}</h4>
              <div className="grid gap-2">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                    <MenuItemCard item={item} />
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => editItem(item)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">✏️</button>
                      <button onClick={() => item.id && removeItem(item.id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
