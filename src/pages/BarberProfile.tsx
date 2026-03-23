import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, ServiceItem } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export default function BarberProfile() {
  const { user, barberProfile, saveBarberProfile, syncPending, signOutUser, deleteAccount, uploadPhoto, theme, toggleTheme, unreadCount, t } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState(barberProfile?.name || '');
  const [salonName, setSalonName] = useState(barberProfile?.salonName || '');
  const [location, setLocation] = useState(barberProfile?.location || '');
  const [phone, setPhone] = useState(barberProfile?.phone || '');
  const [upiId, setUpiId] = useState(barberProfile?.upiId || '');
  const [businessHours, setBusinessHours] = useState(barberProfile?.businessHours || '');
  const [bio, setBio] = useState(barberProfile?.bio || '');
  const [instagram, setInstagram] = useState(barberProfile?.instagram || '');
  const [services, setServices] = useState<ServiceItem[]>(barberProfile?.services || []);
  const [saved, setSaved] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newTime, setNewTime] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!barberProfile) return;
    await saveBarberProfile({ ...barberProfile, name: name || barberProfile.name, salonName: salonName || barberProfile.salonName, location, phone, upiId, businessHours, bio, instagram, services });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !barberProfile) return;
    setUploading(true);
    try {
      const url = await uploadPhoto(file, `line-free/barbers/${user.uid}`);
      await saveBarberProfile({ ...barberProfile, photoURL: url });
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !barberProfile) return;
    setUploadingBanner(true);
    try {
      const url = await uploadPhoto(file, `line-free/salons/${user.uid}`);
      await saveBarberProfile({ ...barberProfile, salonImageURL: url });
    } catch { alert('Upload failed'); }
    setUploadingBanner(false);
  };

  const addService = () => {
    if (!newName.trim()) return;
    setServices([...services, { id: Date.now().toString(), name: newName.trim(), price: parseInt(newPrice) || 0, avgTime: parseInt(newTime) || 15 }]);
    setNewName(''); setNewPrice(''); setNewTime(''); setShowAdd(false);
  };
  const removeService = (id: string) => setServices(services.filter(s => s.id !== id));

  const handleLogout = async () => { await signOutUser(); nav('/', { replace: true }); };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    const result = await deleteAccount();
    if (result.success) nav('/', { replace: true });
    else { setDeleteError(result.error || 'Failed'); setDeleting(false); }
  };

  const handleShare = () => {
    const text = `Check out my salon "${barberProfile?.salonName}" on Line Free! 💈\n📍 ${location}\n📞 ${phone}\n\nServices:\n${services.map(s => `• ${s.name} - ₹${s.price}`).join('\n')}\n\nBook your token online — skip the queue! 🎫`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const fields = [name, salonName, location, phone, upiId];
  const completion = Math.round(((fields.filter(f => f.trim()).length + (services.length > 0 ? 1 : 0)) / (fields.length + 1)) * 100);
  const referralCode = barberProfile?.referralCode || `LF${user?.uid.slice(0, 6).toUpperCase()}`;

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />
        <h1 className="text-2xl font-bold mb-5">{t('profile')}</h1>

        {/* Banner Photo */}
        <div className="relative h-32 rounded-2xl bg-card-2 mb-4 overflow-hidden">
          {barberProfile?.salonImageURL ? (
            <img src={barberProfile.salonImageURL} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">💈</div>
          )}
          <button onClick={() => bannerRef.current?.click()} disabled={uploadingBanner}
            className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-medium backdrop-blur flex items-center gap-1">
            {uploadingBanner ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : '📷'} {uploadingBanner ? 'Uploading...' : 'Change Banner'}
          </button>
        </div>
        <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />

        {/* Avatar + Info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-card-2 ring-2 ring-primary/30">
              {barberProfile?.photoURL ? <img src={barberProfile.photoURL} className="w-16 h-16 object-cover" alt="" /> : <div className="w-16 h-16 flex items-center justify-center text-3xl">💈</div>}
            </div>
            <button onClick={() => avatarRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
              {uploading ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <span className="text-[10px]">📷</span>}
            </button>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div>
            <p className="font-bold">{salonName || barberProfile?.salonName || 'My Salon'}</p>
            <p className="text-text-dim text-sm">{user?.email}</p>
            {barberProfile?.rating && <p className="text-gold text-xs font-semibold mt-0.5">⭐ {barberProfile.rating} ({barberProfile.totalReviews || 0} reviews)</p>}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mb-5 p-3 rounded-xl bg-card border border-border">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Profile Completion</p>
            <p className="text-sm font-bold gradient-text">{completion}%</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completion}%` }} />
          </div>
          {completion < 100 && <p className="text-text-dim text-[10px] mt-1.5">Complete profile to attract more customers!</p>}
        </div>

        {syncPending && (
          <div className="mb-4 p-2 rounded-lg bg-primary/10 flex items-center gap-2 justify-center">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-primary text-[11px]">Syncing...</p>
          </div>
        )}

        {/* Referral Code */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-dim">🎁 Your Referral Code</p>
              <p className="text-xl font-bold gradient-text tracking-widest">{referralCode}</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(referralCode); alert('Copied!'); }} className="p-2 rounded-xl bg-primary/20 text-primary text-sm">📋</button>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4 mb-5">
          {[
            { label: t('profile.name'), val: name, set: setName, placeholder: 'Owner name' },
            { label: t('profile.salonName'), val: salonName, set: setSalonName, placeholder: 'Salon name' },
            { label: t('profile.location'), val: location, set: setLocation, placeholder: 'Area, City' },
            { label: t('profile.phone'), val: phone, set: setPhone, placeholder: '+91 XXXXXXXXXX', type: 'tel' },
            { label: 'UPI ID', val: upiId, set: setUpiId, placeholder: 'yourname@upi' },
            { label: 'Business Hours', val: businessHours, set: setBusinessHours, placeholder: '9 AM - 8 PM' },
            { label: 'Bio', val: bio, set: setBio, placeholder: 'Tell customers about your salon...' },
            { label: 'Instagram', val: instagram, set: setInstagram, placeholder: '@username' },
          ].map(({ label, val, set, placeholder, type }) => (
            <div key={label}>
              <label className="text-sm text-text-dim mb-1 block">{label}</label>
              <input value={val} onChange={e => set(e.target.value)} placeholder={placeholder} type={type || 'text'} className="input-field" />
            </div>
          ))}
        </div>

        {/* Services */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">{t('services')}</h3>
            <button onClick={() => setShowAdd(v => !v)} className="text-primary text-sm font-medium">+ {t('services.add')}</button>
          </div>
          {showAdd && (
            <div className="p-4 rounded-2xl bg-card border border-primary/20 mb-3 animate-fadeIn space-y-3">
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Service name" className="input-field" />
              <div className="flex gap-2">
                <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price ₹" className="input-field" type="number" />
                <input value={newTime} onChange={e => setNewTime(e.target.value)} placeholder="Time (min)" className="input-field" type="number" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 p-3 rounded-xl border border-border text-sm">{t('btn.cancel')}</button>
                <button onClick={addService} className="flex-1 btn-primary text-sm">{t('services.add')}</button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {services.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-text-dim text-xs">₹{s.price} • ~{s.avgTime}min</p>
                </div>
                <button onClick={() => removeService(s.id)} className="w-7 h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center text-sm">×</button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className={`btn-primary w-full mb-3 ${saved ? 'bg-success' : ''}`}>
          {saved ? '✅ Saved!' : t('btn.save')}
        </button>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={handleShare} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2">
            <span>📱</span> Share Salon
          </button>
          <button onClick={() => nav('/barber/analytics')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2">
            <span>📊</span> Analytics
          </button>
          <button onClick={() => nav('/barber/notifications')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2 relative">
            <span>🔔</span> Notifications
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center">{unreadCount}</span>}
          </button>
          <button onClick={toggleTheme} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2">
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <button onClick={handleLogout} className="w-full p-3 rounded-xl border border-danger/30 text-danger text-sm font-medium mb-4 hover:bg-danger/5 transition-all">
          {t('auth.logout')}
        </button>

        {/* Delete Account */}
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} className="w-full p-2 text-danger/50 text-xs hover:text-danger transition-all">
            {t('delete.account')}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 animate-fadeIn">
            <p className="text-danger font-bold mb-1">⚠️ Delete Salon Account?</p>
            <p className="text-text-dim text-xs mb-3">All salon data, tokens, reviews will be deleted. Type <strong>DELETE</strong> to confirm.</p>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Type DELETE" className="input-field mb-3 border-danger/30 text-center font-bold tracking-widest" />
            {deleteError && <p className="text-danger text-xs mb-2 text-center">{deleteError}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }} className="flex-1 p-3 rounded-xl border border-border text-sm">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={deleteInput !== 'DELETE' || deleting}
                className="flex-1 p-3 rounded-xl bg-danger text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</> : '🗑️ Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
