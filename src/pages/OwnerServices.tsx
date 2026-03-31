import { useState, useEffect } from 'react';
import { useApp, ServiceItem } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import { motion, Reorder } from 'framer-motion';

export default function OwnerServices() {
  const { user, db, uploadPhoto } = useApp();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceItem>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Load services directly from business document
  useEffect(() => {
    if (!user) return;
    const fetchServices = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'businesses', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.services) {
            setServices(data.services);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [user, db]);

  const saveServices = async (newServices: ServiceItem[]) => {
    if (!user) return;
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'businesses', user.uid);
      await updateDoc(docRef, { services: newServices });
      setServices(newServices);
    } catch (err) {
      console.error(err);
      alert('Error saving services');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadPhoto(file);
      if (url) {
        setFormData(prev => ({ ...prev, photoUrl: url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveForm = async () => {
    if (!formData.name || !formData.price || !formData.avgTime) {
      alert('Please fill in required fields (Name, Price, Duration)');
      return;
    }

    let updatedServices = [...services];
    if (isEditing === 'new') {
      const newService: ServiceItem = {
        id: Date.now().toString(),
        name: formData.name,
        nameHi: formData.nameHi || '',
        price: Number(formData.price),
        avgTime: Number(formData.avgTime),
        description: formData.description || '',
        photoUrl: formData.photoUrl || '',
        active: true
      };
      updatedServices.push(newService);
    } else {
      updatedServices = updatedServices.map(s => {
        if (s.id === isEditing) {
          return {
            ...s,
            name: formData.name || s.name,
            nameHi: formData.nameHi || s.nameHi,
            price: Number(formData.price || s.price),
            avgTime: Number(formData.avgTime || s.avgTime),
            description: formData.description || s.description,
            photoUrl: formData.photoUrl || s.photoUrl,
          };
        }
        return s;
      });
    }

    await saveServices(updatedServices);
    setIsEditing(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updated = services.filter(s => s.id !== id);
      await saveServices(updated);
    }
  };

  const toggleActive = async (id: string) => {
    const updated = services.map(s => s.id === id ? { ...s, active: !s.active } : s);
    await saveServices(updated);
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Services</h1>
          <button
            onClick={() => {
              setFormData({});
              setIsEditing('new');
            }}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xl shadow-lg shadow-primary/30"
          >
            +
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isEditing ? (
          <div className="glass-card rounded-2xl p-5 mb-6 animate-fadeIn">
            <h2 className="font-bold mb-4">{isEditing === 'new' ? 'Add Service' : 'Edit Service'}</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-dim font-bold uppercase mb-1 block">Photo (Optional)</label>
                <div className="flex items-center gap-4">
                  {(formData.photoUrl || (isEditing !== 'new' && services.find(s=>s.id===isEditing)?.photoUrl)) ? (
                    <img src={formData.photoUrl || services.find(s=>s.id===isEditing)?.photoUrl} alt="Service" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center text-2xl">📸</div>
                  )}
                  <label className="btn-secondary px-4 py-2 text-xs cursor-pointer">
                    {uploadingPhoto ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-dim font-bold uppercase mb-1 block">Name (EN) *</label>
                  <input type="text" className="input-field py-2" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-text-dim font-bold uppercase mb-1 block">Name (HI)</label>
                  <input type="text" className="input-field py-2" value={formData.nameHi || ''} onChange={e => setFormData({...formData, nameHi: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-dim font-bold uppercase mb-1 block">Price (₹) *</label>
                  <input type="number" className="input-field py-2" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs text-text-dim font-bold uppercase mb-1 block">Duration (min) *</label>
                  <input type="number" className="input-field py-2" value={formData.avgTime || ''} onChange={e => setFormData({...formData, avgTime: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-dim font-bold uppercase mb-1 block">Description</label>
                <textarea className="input-field py-2 resize-none h-20" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsEditing(null)} className="flex-1 py-3 rounded-xl font-bold bg-card-2 border border-border text-text">Cancel</button>
                <button onClick={handleSaveForm} className="flex-1 py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30">Save</button>
              </div>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">✂️</p>
            <h3 className="font-bold text-lg mb-1">No services yet</h3>
            <p className="text-text-dim text-sm mb-6">Add services to allow customers to book</p>
            <button onClick={() => setIsEditing('new')} className="btn-primary px-6 py-2">Add First Service</button>
          </div>
        ) : (
          <Reorder.Group axis="y" values={services} onReorder={saveServices} className="space-y-3">
            {services.map((service) => (
              <Reorder.Item key={service.id} value={service}>
                <div className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${service.active !== false ? 'bg-card border-border' : 'bg-card/50 border-border/50 opacity-70'}`}>
                  <div className="text-text-dim cursor-grab active:cursor-grabbing px-2 py-4 -ml-2">
                    <svg width="12" height="24" viewBox="0 0 12 24" fill="currentColor">
                      <circle cx="4" cy="4" r="2"/><circle cx="8" cy="4" r="2"/>
                      <circle cx="4" cy="12" r="2"/><circle cx="8" cy="12" r="2"/>
                      <circle cx="4" cy="20" r="2"/><circle cx="8" cy="20" r="2"/>
                    </svg>
                  </div>

                  {service.photoUrl ? (
                    <img src={service.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-card-2 flex items-center justify-center">✂️</div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold truncate">{service.name}</h3>
                      {service.active === false && <span className="text-[9px] px-1.5 py-0.5 rounded bg-danger/10 text-danger font-bold uppercase">Hidden</span>}
                    </div>
                    <p className="text-xs text-text-dim mt-0.5">₹{service.price} • {service.avgTime} min</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(service.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${service.active !== false ? 'bg-success/10 text-success' : 'bg-card-2 text-text-dim'}`}>
                      {service.active !== false ? '👁' : '🙈'}
                    </button>
                    <button onClick={() => {
                      setFormData(service);
                      setIsEditing(service.id);
                    }} className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center text-xs">
                      🗑
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
