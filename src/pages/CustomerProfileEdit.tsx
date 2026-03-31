import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import Button from '../components/ui/Button';

export default function CustomerProfileEdit() {
  const { user, customerProfile, saveCustomerProfile, signOutUser, deleteAccount, toggleTheme, theme } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState(customerProfile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [location, setLocation] = useState(customerProfile?.location || '');

  const handleSave = async () => {
    if (!customerProfile) return;
    await saveCustomerProfile({ ...customerProfile, name, phone, location });
    nav('/customer/home');
  };

  if (!customerProfile) return null;

  return (
    <div className="min-h-[100dvh] pb-24 bg-surface text-on-surface royal-gradient">
      <div className="pt-12 px-6 pb-6 bg-surface/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-black text-white tracking-tighter">Your Profile</h1>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mt-1">Settings & Info</p>
        </div>
        <button onClick={toggleTheme} className="w-12 h-12 rounded-full glass-card flex items-center justify-center border-white/10 hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>

      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-surface-container-highest border-2 border-primary/20 shadow-lg relative group">
            {customerProfile.photoURL ? (
              <img src={customerProfile.photoURL} className="w-full h-full object-cover" alt="" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">person</span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-white">edit</span>
            </div>
          </div>
          <p className="font-headline font-bold text-white text-xl">{customerProfile.name}</p>
          <p className="text-on-surface-variant text-xs">{user?.email}</p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto">
          <div className="glass-card p-4 rounded-2xl border border-white/5 focus-within:border-primary/50 transition-colors">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent text-white font-medium focus:outline-none" />
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 focus-within:border-primary/50 transition-colors">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Phone Number</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full bg-transparent text-white font-medium focus:outline-none" placeholder="+91" />
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 focus-within:border-primary/50 transition-colors">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">City / Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-transparent text-white font-medium focus:outline-none" placeholder="Ranchi" />
          </div>

          <Button onClick={handleSave} className="w-full mt-6">Save Changes</Button>

          <div className="h-px bg-white/5 my-8" />

          <Button variant="secondary" onClick={() => { signOutUser(); nav('/role'); }} className="w-full text-warning border-warning/20">
            Log Out
          </Button>

          <Button variant="ghost" onClick={deleteAccount} className="w-full text-danger hover:bg-danger/10">
            Delete Account
          </Button>
        </div>
      </div>

      <BottomNav role="customer" />
    </div>
  );
}
