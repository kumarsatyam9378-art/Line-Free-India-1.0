import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import MenuBuilder from '../components/food/MenuBuilder';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';

export default function OwnerMenu() {
  const { barberProfile, getBarberTrialDaysLeft, isBarberSubscribed, t } = useApp();
  const hasMenu = BUSINESS_CATEGORIES_INFO.find(c => c.id === barberProfile?.businessType)?.hasMenu;

  if (!barberProfile) return null;

  if (!hasMenu) {
    return (
      <div className="min-h-screen p-6 pb-24">
        <BackButton to="/barber/home" />
        <h1 className="text-2xl font-bold mb-6">Menu Builder</h1>
        <div className="p-8 text-center glass-card rounded-3xl border border-border">
          <span className="text-6xl mb-4 block opacity-50">🍽️</span>
          <p className="text-text-dim text-lg">Menu building is not supported for your business type ({barberProfile.businessType}).</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-24 animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <BackButton to="/barber/home" />
        <h1 className="text-2xl font-bold">Menu Builder</h1>
      </div>

      <div className="bg-card p-5 rounded-2xl border border-border mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl text-primary border border-primary/30">
          QR
        </div>
        <div>
          <h3 className="font-bold">Digital Menu QR</h3>
          <p className="text-xs text-text-dim mt-0.5">Customers scan to view menu</p>
        </div>
        <button onClick={() => window.open(`/menu/${barberProfile.uid}`, '_blank')} className="ml-auto px-4 py-2 bg-card-2 rounded-xl text-sm font-semibold hover:bg-card border border-border transition-colors">
          Preview
        </button>
      </div>

      <MenuBuilder />

      <BottomNav />
    </div>
  );
}
