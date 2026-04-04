import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';

export default function CustomerProfileEdit() {
  const { user, customerProfile, saveCustomerProfile, signOutUser, deleteAccount, uploadPhoto, allSalons, isFavorite, theme, toggleTheme, lang, setLang, t, unreadCount } = useApp();
  const nav = useNavigate();

  // Personal Info
  const [name, setName] = useState(customerProfile?.name || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [location, setLocation] = useState(customerProfile?.location || '');
  const [dob, setDob] = useState(customerProfile?.dob || '');
  const [gender, setGender] = useState(customerProfile?.gender || '');

  // Preferences
  const [smsAlerts, setSmsAlerts] = useState(customerProfile?.preferences?.smsAlerts ?? true);
  const [promotions, setPromotions] = useState(customerProfile?.preferences?.promotions ?? false);


  // Enhanced Profile Features
  const [email, setEmail] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [hairType, setHairType] = useState('');
  const [skinType, setSkinType] = useState('');

  // Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [privacyPublicProfile, setPrivacyPublicProfile] = useState(false);
  const [privacyShowActivity, setPrivacyShowActivity] = useState(true);

  // Accordion State
  const [openSection, setOpenSection] = useState<string | null>('personal');
  const toggleSection = (sec: string) => setOpenSection(openSection === sec ? null : sec);
  // UI State
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-save debounce for text inputs
  useEffect(() => {
    if (!customerProfile) return;
    const timeoutId = setTimeout(async () => {
      if (
        name !== customerProfile.name ||
        phone !== customerProfile.phone ||
        location !== customerProfile.location ||
        dob !== customerProfile.dob ||
        gender !== customerProfile.gender ||
        smsAlerts !== (customerProfile.preferences?.smsAlerts ?? true) ||
        promotions !== (customerProfile.preferences?.promotions ?? false)
      ) {
        await saveCustomerProfile({
          ...customerProfile,
          name: name || customerProfile.name,
          phone: phone || '',
          location: location || '',
          dob,
          gender,
          preferences: { smsAlerts, promotions }
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [name, phone, location, dob, gender, smsAlerts, promotions, customerProfile, saveCustomerProfile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !customerProfile) return;
    setUploading(true);
    try {
      const url = await uploadPhoto(file, `line-free/customers/${user.uid}`);
      await saveCustomerProfile({ ...customerProfile, photoURL: url });
      toast.success('Profile picture updated');
    } catch { toast.error('Photo upload failed'); }
    setUploading(false);
  };

  const handleLogout = async () => { await signOutUser(); nav('/', { replace: true }); };

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      toast.success('Account deleted');
      nav('/', { replace: true });
    } else {
      toast.error(result.error || 'Failed. Please try again.');
      setDeleting(false);
    }
  };

  const favCount = allSalons.filter(s => isFavorite(s.uid)).length;
  const photoURL = customerProfile?.photoURL || user?.photoURL || '';
  const referralCode = customerProfile?.referralCode || `LF${user?.uid.slice(0, 6).toUpperCase()}`;

  const renderSectionHeader = (title: string, icon: string, sectionKey: string) => (
    <div
      className="flex items-center justify-between mb-3 mt-6 p-3 rounded-2xl bg-card border border-border cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg">{icon}</div>
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <div className={`transform transition-transform ${openSection === sectionKey ? 'rotate-180' : ''}`}>
        ▼
      </div>
    </div>
  );

  return (
    <div className="screen-scroll pb-24 animate-fadeIn overscroll-contain">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <BackButton to="/customer/home" />
            <h1 className="text-2xl font-bold">{t('profile')}</h1>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-card border border-border">
            <span className={`w-2 h-2 rounded-full ${saved ? 'bg-success' : 'bg-primary animate-pulse'}`} />
            {saved ? 'Saved' : 'Auto-saving'}
          </div>
        </div>

        {/* Profile Card */}
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-br from-card to-card-2 border border-border shadow-xl shadow-primary/5 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-card-2 ring-4 ring-primary/20 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-card">
                  {photoURL ? (
                    <img src={photoURL} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-card disabled:opacity-50"
              >
                {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="text-sm">📷</span>}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

            <h2 className="font-bold text-xl mb-1">{name || user?.displayName || 'Customer'}</h2>
            <p className="text-text-dim text-xs mb-4">{user?.email}</p>

            {/* Extended Stats */}
            <div className="flex gap-4 justify-center w-full px-2 pt-4 border-t border-border/50">
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg font-black text-primary">{favCount}</span>
                <span className="text-text-dim text-[9px] uppercase font-bold mt-1">Favorites</span>
              </div>
              <div className="w-px bg-border/50" />
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg font-black text-primary">{customerProfile?.totalVisits || 0}</span>
                <span className="text-text-dim text-[9px] uppercase font-bold mt-1">Visits</span>
              </div>
              <div className="w-px bg-border/50" />
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg font-black text-accent">150</span>
                <span className="text-text-dim text-[9px] uppercase font-bold mt-1">Points</span>
              </div>
              <div className="w-px bg-border/50" />
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg font-black text-success">🔥 3</span>
                <span className="text-text-dim text-[9px] uppercase font-bold mt-1">Streak</span>
              </div>
            </div>

            {/* Completion Bar */}
            <div className="w-full mt-4 pt-3 border-t border-border/50">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] text-text-dim font-medium">Profile Strength</p>
                <p className="text-[10px] font-bold text-primary">85%</p>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-danger via-warning to-success transition-all duration-500" style={{ width: `85%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Referral */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-dim font-medium mb-1 flex items-center gap-1"><span className="text-lg">🎁</span> Your Referral Code</p>
              <p className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-widest">{referralCode}</p>
              <p className="text-[10px] text-text-dim mt-1">Share to earn free rewards</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(referralCode); toast.success('Copied!'); }} className="p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary shadow-lg shadow-primary/10 transition-transform active:scale-95">
              📋 Copy
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <div>
            {renderSectionHeader('Personal Information', '👤', 'personal')}
            {openSection === 'personal' && (
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs text-text-dim block mb-1">{t('profile.name')}</label>
                <input value={name} onChange={e => setName(e.target.value)} className="input-field bg-card-2" placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim block mb-1">{t('profile.phone')}</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field bg-card-2" placeholder="+91 XXXXXXXXXX" type="tel" />
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Date of Birth</label>
                  <input value={dob} onChange={e => setDob(e.target.value)} className="input-field bg-card-2 text-sm" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="input-field bg-card-2 text-sm appearance-none">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">{t('profile.location')}</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} className="input-field bg-card-2" placeholder="Your city" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="input-field bg-card-2" placeholder="your@email.com" type="email" />
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Alt Phone</label>
                  <input value={altPhone} onChange={e => setAltPhone(e.target.value)} className="input-field bg-card-2" placeholder="Emergency contact" type="tel" />
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Health & Style Profile */}
          <div>
            {renderSectionHeader('Health & Style Profile', '🧬', 'health')}
            {openSection === 'health' && (
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Hair Type</label>
                  <select value={hairType} onChange={e => setHairType(e.target.value)} className="input-field bg-card-2 text-sm appearance-none">
                    <option value="">Select...</option>
                    <option value="straight">Straight</option>
                    <option value="wavy">Wavy</option>
                    <option value="curly">Curly</option>
                    <option value="coily">Coily</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Skin Type</label>
                  <select value={skinType} onChange={e => setSkinType(e.target.value)} className="input-field bg-card-2 text-sm appearance-none">
                    <option value="">Select...</option>
                    <option value="dry">Dry</option>
                    <option value="oily">Oily</option>
                    <option value="combination">Combination</option>
                    <option value="sensitive">Sensitive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-dim block mb-1">Blood Group</label>
                  <input value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="input-field bg-card-2" placeholder="e.g. O+" />
                </div>
                <div>
                  <label className="text-xs text-text-dim block mb-1">Allergies (if any)</label>
                  <input value={allergies} onChange={e => setAllergies(e.target.value)} className="input-field bg-card-2" placeholder="e.g. Latex" />
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Preferences */}
          <div>
            {renderSectionHeader('App Preferences', '⚙️', 'prefs')}
            {openSection === 'prefs' && (
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">SMS & Email Alerts</p>
                  <p className="text-xs text-text-dim">Receive booking confirmations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={smsAlerts} onChange={e => setSmsAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
                </label>
              </div>
              <div className="h-px w-full bg-border/50" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Promotional Offers</p>
                  <p className="text-xs text-text-dim">Receive discounts and news</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={promotions} onChange={e => setPromotions(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
                </label>
              </div>

              <div className="h-px w-full bg-border/50" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-xs text-text-dim">App alerts for queue updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={pushNotifications} onChange={e => setPushNotifications(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">WhatsApp Alerts</p>
                  <p className="text-xs text-text-dim">Get tickets via WhatsApp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={whatsappAlerts} onChange={e => setWhatsappAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
                </label>
              </div>

            </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div>
            {renderSectionHeader('Privacy & Security', '🛡️', 'privacy')}
            {openSection === 'privacy' && (
            <div className="bg-card p-4 rounded-2xl border border-border space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Public Profile</p>
                  <p className="text-xs text-text-dim">Allow saloons to see your full name</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={privacyPublicProfile} onChange={e => setPrivacyPublicProfile(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
                </label>
              </div>
              <div className="h-px w-full bg-border/50" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Show Activity</p>
                  <p className="text-xs text-text-dim">Share visit history with favorites</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={privacyShowActivity} onChange={e => setPrivacyShowActivity(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-card-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary border border-border"></div>
                </label>
              </div>
            </div>
            )}
          </div>

          {/* Theme & Language */}
          <div>
            {renderSectionHeader('Display & Language', '🌍', 'display')}
            {openSection === 'display' && (
            <div className="grid grid-cols-2 gap-3 animate-fadeIn">
              <button onClick={toggleTheme} className="p-4 rounded-2xl bg-card border border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
                <span className="text-2xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
                <span className="text-xs font-bold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="p-4 rounded-2xl bg-card border border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
                <span className="text-2xl">🌐</span>
                <span className="text-xs font-bold">{lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
              </button>
            </div>
            )}
          </div>

        </div>

        {/* Danger Zone */}
        <div className="mt-8 pt-6 border-t border-border">
          <button onClick={handleLogout} className="w-full p-4 rounded-2xl border border-danger/30 text-danger text-sm font-bold mb-4 hover:bg-danger/10 transition-colors">
            {t('auth.logout')}
          </button>

          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2 text-danger/50 text-xs hover:text-danger transition-colors font-medium">
              Delete Account
            </button>
          ) : (
            <div className="p-5 rounded-2xl bg-danger/10 border border-danger/30 animate-fadeIn">
              <p className="text-danger font-bold mb-1 flex items-center gap-2"><span>⚠️</span> Danger Zone</p>
              <p className="text-text-dim text-xs mb-4">This action is irreversible. All your visit history, favorites, and rewards will be lost forever. Type <strong>DELETE</strong> to confirm.</p>
              <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="Type DELETE" className="input-field bg-card/50 mb-4 border-danger/30 text-center font-black tracking-widest text-danger placeholder-danger/30" />

              <div className="flex gap-3">
                <button onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }} className="flex-1 p-3 rounded-xl border border-border bg-card text-sm font-bold">Cancel</button>
                <button onClick={handleDeleteAccount} disabled={deleteInput !== 'DELETE' || deleting}
                  className="flex-1 p-3 rounded-xl bg-danger text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                  {deleting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</> : '🗑️ Confirm'}
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
