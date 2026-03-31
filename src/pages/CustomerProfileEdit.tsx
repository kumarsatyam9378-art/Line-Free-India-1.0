import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';

export default function CustomerProfileEdit() {
  const { user, customerProfile, saveCustomerProfile, signOutUser, deleteAccount, uploadPhoto, allSalons, isFavorite, theme, toggleTheme, t, unreadCount } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState(customerProfile?.name || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [location, setLocation] = useState(customerProfile?.location || '');
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!customerProfile) return;
    await saveCustomerProfile({ ...customerProfile, name: name || customerProfile.name, phone: phone || '', location: location || '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !customerProfile) return;
    setUploading(true);
    try {
      const url = await uploadPhoto(file, `line-free/customers/${user.uid}`);
      await saveCustomerProfile({ ...customerProfile, photoURL: url });
    } catch { toast('Photo upload failed'); }
    setUploading(false);
  };

  const handleLogout = async () => { await signOutUser(); nav('/', { replace: true }); };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    setDeleteError('');
    const result = await deleteAccount();
    if (result.success) {
      nav('/', { replace: true });
    } else {
      setDeleteError(result.error || 'Failed. Please try again.');
      setDeleting(false);
    }
  };

  const favCount = allSalons.filter(s => isFavorite(s.uid)).length;
  const photoURL = customerProfile?.photoURL || user?.photoURL || '';
  const referralCode = customerProfile?.referralCode || `LF${user?.uid.slice(0, 6).toUpperCase()}`;

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/customer/home" />
        <h1 className="text-2xl font-bold mb-5">{t('profile')}</h1>

        {/* Profile Card */}
        <div className="text-center mb-6 p-5 rounded-2xl glass-card">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-card-2 ring-2 ring-primary/30">
              {photoURL ? <img src={photoURL} className="w-20 h-20 object-cover" alt="" /> : <div className="w-20 h-20 flex items-center justify-center text-4xl">👤</div>}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg disabled:opacity-50">
              {uploading ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="text-xs">📷</span>}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          <p className="font-bold text-lg">{name || user?.displayName || 'Customer'}</p>
          <p className="text-text-dim text-sm">{user?.email}</p>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="text-center"><p className="text-xl font-bold gradient-text">{favCount}</p><p className="text-text-dim text-[10px]">Favorites</p></div>
            <div className="w-px bg-border" />
            <div className="text-center"><p className="text-xl font-bold gradient-text">{customerProfile?.totalVisits || 0}</p><p className="text-text-dim text-[10px]">Visits</p></div>
            <div className="w-px bg-border" />
            <div className="text-center"><p className="text-xl font-bold gradient-text">{customerProfile?.subscription ? '⭐' : '—'}</p><p className="text-text-dim text-[10px]">Plan</p></div>
          </div>
        </div>

        {/* Referral */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-dim font-medium">🎁 Your Referral Code</p>
              <p className="text-xl font-bold gradient-text tracking-widest mt-0.5">{referralCode}</p>
              <p className="text-[10px] text-text-dim mt-0.5">Share to earn rewards</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(referralCode); toast('Copied!'); }} className="p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary">
              📋
            </button>
          </div>
        </div>

        {/* Edit Fields */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="text-sm text-text-dim mb-1 block">{t('profile.name')}</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm text-text-dim mb-1 block">{t('profile.phone')}</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="+91 XXXXXXXXXX" type="tel" />
          </div>
          <div>
            <label className="text-sm text-text-dim mb-1 block">{t('profile.location')}</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className="input-field" placeholder="Your city / area" />
          </div>
        </div>

        <button onClick={handleSave} className={`btn-primary w-full mb-3 ${saved ? 'bg-success/80' : ''}`}>
          {saved ? '✅ Saved!' : t('btn.save')}
        </button>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={() => nav('/customer/history')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2 hover:border-primary/30 transition-all">
            <span>📋</span> Visit History
          </button>
          <button onClick={() => nav('/customer/notifications')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2 hover:border-primary/30 transition-all relative">
            <span>🔔</span> Notifications
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
          <button onClick={() => nav('/customer/subscription')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2 hover:border-primary/30 transition-all">
            <span>⭐</span> Subscription
          </button>
          <button onClick={toggleTheme} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center gap-2 hover:border-primary/30 transition-all">
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full p-3 rounded-xl border border-danger/30 text-danger text-sm font-medium mb-4 hover:bg-danger/5 transition-all">
          {t('auth.logout')}
        </button>

        {/* Delete Account */}
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} className="w-full p-3 rounded-xl text-danger/60 text-xs text-center hover:text-danger transition-all">
            {t('delete.account')}
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 animate-fadeIn">
            <p className="text-danger font-bold mb-1">⚠️ Delete Account?</p>
            <p className="text-text-dim text-xs mb-3">This will permanently delete all your data. Type <strong>DELETE</strong> to confirm.</p>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Type DELETE" className="input-field mb-3 border-danger/30 text-center font-bold tracking-widest" />
            {deleteError && <p className="text-danger text-xs mb-2 text-center">{deleteError}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); setDeleteError(''); }} className="flex-1 p-3 rounded-xl border border-border text-sm">Cancel</button>
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
