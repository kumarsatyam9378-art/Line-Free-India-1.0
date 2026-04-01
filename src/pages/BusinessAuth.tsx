import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BackButton from '../components/BackButton';

export default function BusinessAuth() {
  const { signInWithGoogle, user, setRole, t } = useApp();
  const nav = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedType = localStorage.getItem('selected_business_type');
  const selectedLabel = localStorage.getItem('selected_business_label');
  const selectedIcon = localStorage.getItem('selected_business_icon');

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      setRole('barber');

      const uid = (result as any)?.user?.uid || user?.uid;
      if (uid) {
        try {
          const snap = await getDoc(doc(db, 'barbers', uid));
          if (snap.exists()) {
            nav('/barber/home', { replace: true });
            return;
          }
        } catch {}
      }
      nav('/barber/setup', { replace: true });
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const e = err as { code?: string; message?: string };
      if (e.code === 'auth/popup-closed-by-user') {
        setError('Popup closed. Please try again.');
      } else if (e.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else {
        setError(e.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsExisting = async () => {
    if (!user) return;
    setLoading(true);
    try {
      setRole('barber');
      const snap = await getDoc(doc(db, 'barbers', user.uid));
      if (snap.exists()) {
        nav('/barber/home', { replace: true });
      } else {
        nav('/barber/setup', { replace: true });
      }
    } catch {
      nav('/barber/setup', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col p-6 animate-fadeIn">
        <BackButton to="/business/select" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-card-2 flex items-center justify-center mb-4 ring-2 ring-primary/30 overflow-hidden shadow-lg">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-20 h-20 rounded-full" alt="" />
            ) : (
              <span className="text-4xl">🏪</span>
            )}
          </div>
          <p className="text-lg font-semibold mb-1">{user.displayName || 'Business Owner'}</p>
          <p className="text-text-dim text-sm mb-8">{user.email}</p>
          <button
            onClick={handleContinueAsExisting}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {loading ? 'Loading...' : `Continue as ${user.displayName || 'Owner'} →`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 animate-fadeIn">
      <BackButton to="/business/select" />

      <div className="flex-1 flex flex-col items-center justify-center mt-[-10vh]">
        {selectedType ? (
          <div className="mb-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl mb-4 relative">
              <span className="text-5xl drop-shadow-md">{selectedIcon || '🏪'}</span>
              <div className="absolute -bottom-2 -right-2 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-bg">
                Selected
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">{selectedLabel || 'Business'}</h1>
            <Link to="/business/select" className="text-primary text-sm font-medium hover:underline">
              Change business type
            </Link>
          </div>
        ) : (
          <div className="mb-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-xl">
              <span className="text-5xl drop-shadow-md">🏪</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Business Owner</h1>
            <p className="text-text-dim text-center px-4">Manage your queue and grow your business online</p>
          </div>
        )}

        {error && (
          <div className="w-full max-w-xs mb-4 p-3 rounded-xl bg-danger/20 border border-danger/30 text-sm text-center">
            {error}
          </div>
        )}

        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-white text-gray-800 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50 shadow-md"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            {loading ? 'Logging in...' : t('auth.google')}
          </button>
        </div>

        <p className="text-text-dim text-xs mt-8 text-center max-w-xs">
          30-day free trial included. No credit card required.
        </p>
      </div>
    </div>
  );
}
