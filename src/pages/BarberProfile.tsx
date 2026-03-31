import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, ServiceItem } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';

export default function BarberProfile() {
  const { user, barberProfile, saveBarberProfile, syncPending, signOutUser, deleteAccount, theme, toggleTheme, unreadCount, t } = useApp();
  const nav = useNavigate();

  // Basic Info State
  const [name, setName] = useState(barberProfile?.name || '');
  const [salonName, setSalonName] = useState(barberProfile?.salonName || '');
  const [bio, setBio] = useState(barberProfile?.bio || '');

  // Contact & Social
  const [phone, setPhone] = useState(barberProfile?.phone || '');
  const [instagram, setInstagram] = useState(barberProfile?.instagram || '');
  const [website, setWebsite] = useState(barberProfile?.website || '');

  // Location
  const [location, setLocation] = useState(barberProfile?.location || '');

  // Advanced Settings
  const [upiId, setUpiId] = useState(barberProfile?.upiId || '');

  // Services
  const [services, setServices] = useState<ServiceItem[]>(barberProfile?.services || []);
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceTime, setNewServiceTime] = useState('');

  // UI State
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Debounced auto-save
  useEffect(() => {
    if (!barberProfile) return;
    const timeoutId = setTimeout(async () => {
      // Check if values actually changed
      if (
        name !== barberProfile.name ||
        salonName !== barberProfile.salonName ||
        bio !== barberProfile.bio ||
        phone !== barberProfile.phone ||
        instagram !== barberProfile.instagram ||
        website !== barberProfile.website ||
        location !== barberProfile.location ||
        upiId !== barberProfile.upiId ||
        JSON.stringify(services) !== JSON.stringify(barberProfile.services)
      ) {
        await saveBarberProfile({
          ...barberProfile,
          name: name || barberProfile.name,
          salonName: salonName || barberProfile.salonName,
          bio,
          phone,
          instagram,
          website,
          location,
          upiId,
          services
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(timeoutId);
  }, [name, salonName, bio, phone, instagram, website, location, upiId, services, barberProfile, saveBarberProfile]);

  const addService = () => {
    if (!newServiceName.trim()) return;
    setServices([...services, { id: Date.now().toString(), name: newServiceName.trim(), price: parseInt(newServicePrice) || 0, avgTime: parseInt(newServiceTime) || 15 }]);
    setNewServiceName(''); setNewServicePrice(''); setNewServiceTime(''); setShowAddService(false);
  };
  const removeService = (id: string) => setServices(services.filter(s => s.id !== id));

  const handleLogout = async () => { await signOutUser(); nav('/', { replace: true }); };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      toast.success('Account deleted');
      nav('/', { replace: true });
    } else {
      toast.error(result.error || 'Failed to delete account');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    const text = `Check out "${salonName || barberProfile?.salonName}" on Line Free! 💈\n📍 ${location}\n📞 ${phone}\n\nBook your token online — skip the queue! 🎫`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const fields = [name, salonName, location, phone, bio, upiId];
  const completion = Math.round(((fields.filter(f => f && f.trim()).length + (services.length > 0 ? 1 : 0)) / (fields.length + 1)) * 100);
  const referralCode = barberProfile?.referralCode || `LF${user?.uid.slice(0, 6).toUpperCase()}`;

  const renderSectionHeader = (title: string, icon: string) => (
    <div className="flex items-center gap-2 mb-3 mt-6">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm">{icon}</div>
      <h2 className="text-sm font-bold">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <BackButton to="/barber/home" />
            <h1 className="text-2xl font-bold">Business Profile</h1>
          </div>
          <button
            onClick={() => nav(`/customer/salon/${user?.uid}`)}
            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            👁️ Preview
          </button>
        </div>

        {/* Sync Status & Completion */}
        <div className="mb-5 flex items-center justify-between p-3 rounded-2xl bg-card border border-border">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-text-dim">Profile Completion</p>
              <p className="text-xs font-bold gradient-text">{completion}%</p>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="w-px h-8 bg-border mx-4" />

          <div className="w-20 flex flex-col items-center justify-center">
            {syncPending ? (
              <>
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mb-1" />
                <span className="text-[10px] text-primary font-medium">Syncing...</span>
              </>
            ) : saved ? (
              <>
                <span className="text-success text-sm mb-0.5">✓</span>
                <span className="text-[10px] text-success font-medium">Saved</span>
              </>
            ) : (
              <>
                <span className="text-text-dim text-sm mb-0.5">☁️</span>
                <span className="text-[10px] text-text-dim font-medium">Up to date</span>
              </>
            )}
          </div>
        </div>

        {/* Referral Code */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-dim">🎁 Your Referral Code</p>
              <p className="text-xl font-bold gradient-text tracking-widest">{referralCode}</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(referralCode); toast.success('Copied!'); }} className="p-2 rounded-xl bg-primary/20 text-primary text-sm">📋</button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            {renderSectionHeader('Basic Info', '📝')}
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4">
              <div>
                <label className="text-xs text-text-dim block mb-1">Business Name</label>
                <input value={salonName} onChange={e => setSalonName(e.target.value)} placeholder="e.g. Royal Cuts" className="input-field bg-card-2" />
              </div>
              <div>
                <label className="text-xs text-text-dim block mb-1">Owner Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="input-field bg-card-2" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            {renderSectionHeader('Description & Story', '📖')}
            <div className="bg-card p-4 rounded-2xl border border-border">
              <label className="text-xs text-text-dim block mb-1">Business Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell customers what makes your business special..."
                className="input-field bg-card-2 min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            {renderSectionHeader('Location Details', '📍')}
            <div className="bg-card p-4 rounded-2xl border border-border">
              <label className="text-xs text-text-dim block mb-1">Full Address</label>
              <textarea
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Street address, City, State"
                className="input-field bg-card-2 min-h-[80px] resize-none"
              />
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            {renderSectionHeader('Contact & Social', '📞')}
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4">
              <div>
                <label className="text-xs text-text-dim block mb-1">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" type="tel" className="input-field bg-card-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Instagram</label>
                  <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@username" className="input-field bg-card-2" />
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Website (Optional)</label>
                  <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.example.com" className="input-field bg-card-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Services Setup */}
          <div>
            {renderSectionHeader('Services & Menu', '✂️')}
            <div className="bg-card p-4 rounded-2xl border border-border">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-text-dim">{services.length} services added</p>
                <button onClick={() => setShowAddService(v => !v)} className="text-primary text-xs font-bold">+ Add Service</button>
              </div>

              {showAddService && (
                <div className="p-4 rounded-xl bg-card-2 border border-primary/20 mb-4 animate-fadeIn space-y-3">
                  <input value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="Service name" className="input-field text-sm" />
                  <div className="flex gap-2">
                    <input value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} placeholder="Price ₹" className="input-field text-sm" type="number" />
                    <input value={newServiceTime} onChange={e => setNewServiceTime(e.target.value)} placeholder="Time (min)" className="input-field text-sm" type="number" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setShowAddService(false)} className="flex-1 p-2 rounded-lg border border-border text-xs font-medium">Cancel</button>
                    <button onClick={addService} className="flex-1 bg-primary text-white p-2 rounded-lg text-xs font-bold">Add Service</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {services.length === 0 ? (
                  <p className="text-xs text-center text-text-dim py-4">No services added yet.</p>
                ) : (
                  services.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-card-2 border border-border/50 group">
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-text-dim text-[10px] mt-0.5">₹{s.price} • ~{s.avgTime} min</p>
                      </div>
                      <button onClick={() => removeService(s.id)} className="w-8 h-8 rounded-full bg-danger/10 text-danger flex items-center justify-center text-sm opacity-50 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            {renderSectionHeader('Advanced Settings', '⚙️')}
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4">
              <div>
                <label className="text-xs text-text-dim block mb-1">UPI ID (For Payments)</label>
                <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="input-field bg-card-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 gap-3 mt-8 mb-6">
          <button onClick={() => nav('/barber/gallery')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center justify-center gap-2">
            <span>🖼️</span> Gallery
          </button>
          <button onClick={() => nav('/barber/staff')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center justify-center gap-2">
            <span>👥</span> Staff
          </button>
          <button onClick={() => nav('/barber/settings')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center justify-center gap-2">
            <span>🕒</span> Hours
          </button>
          <button onClick={handleShare} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center justify-center gap-2">
            <span>📱</span> Share
          </button>
          <button onClick={() => nav('/barber/notifications')} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center justify-center gap-2 relative">
            <span>🔔</span> Alerts
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-danger rounded-full" />}
          </button>
          <button onClick={toggleTheme} className="p-3 rounded-xl border border-border bg-card text-sm font-medium flex items-center justify-center gap-2">
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span> Theme
          </button>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-border">
          <button onClick={handleLogout} className="w-full p-4 rounded-2xl border border-danger/30 text-danger text-sm font-bold mb-4 hover:bg-danger/10 transition-colors">
            {t('auth.logout')}
          </button>

          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2 text-danger/50 text-xs hover:text-danger transition-colors">
              Delete Business Account
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 animate-fadeIn">
              <p className="text-danger font-bold mb-1">⚠️ Danger Zone</p>
              <p className="text-text-dim text-xs mb-3">Deleting your account will erase all profile data, staff, tokens, and history permanently. Type <strong>DELETE</strong> to confirm.</p>
              <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Type DELETE" className="input-field bg-card/50 mb-3 border-danger/30 text-center font-bold tracking-widest text-danger placeholder-danger/30" />

              <div className="flex gap-2">
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }} className="flex-1 p-3 rounded-xl border border-border bg-card text-sm font-medium">Cancel</button>
                <button onClick={handleDeleteAccount} disabled={deleteInput !== 'DELETE' || deleting}
                  className="flex-1 p-3 rounded-xl bg-danger text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</> : '🗑️ Delete'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
