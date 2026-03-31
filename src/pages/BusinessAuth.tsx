import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function BusinessAuth() {
  const { user, signInWithGoogle, setRole } = useApp();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const selectedType = localStorage.getItem('selected_business_type');
  const selectedLabel = localStorage.getItem('selected_business_label') || 'Business';
  const selectedIcon = localStorage.getItem('selected_business_icon') || '🏪';

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithGoogle();
      if (!res.user) throw new Error('Sign in failed');

      setRole('barber'); // Keep for backward compatibility

      const userDoc = await getDoc(doc(db, 'barbers', res.user.uid));
      if (userDoc.exists()) {
        nav('/barber/home', { replace: true });
      } else {
        nav('/barber/setup', { replace: true });
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign in cancelled');
      } else {
        toast.error('An error occurred during sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!user) return;
    setRole('barber');

    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'barbers', user.uid));
      if (userDoc.exists()) {
        nav('/barber/home', { replace: true });
      } else {
        nav('/barber/setup', { replace: true });
      }
    } catch(error) {
       console.error(error);
       nav('/barber/setup', { replace: true });
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col items-center justify-center p-6 relative">
      <button
        onClick={() => nav('/business/select')}
        className="absolute top-6 left-6 text-text-dim hover:text-text font-medium"
      >
        ← Back
      </button>

      <div className="w-full max-w-sm text-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-card">
          <span className="text-5xl">{selectedIcon}</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">{selectedLabel}</h1>
        <p className="text-text-dim text-sm mb-6">Sign in to manage your business</p>

        <button
          onClick={() => nav('/business/select')}
          className="text-primary text-xs font-medium bg-primary/10 px-3 py-1.5 rounded-full mb-10 hover:bg-primary/20 transition-colors"
        >
          Change business type
        </button>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 bg-card-2 p-3 rounded-xl border border-border">
                <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full" />
                <div className="text-left">
                  <p className="font-medium text-sm">{user.displayName}</p>
                  <p className="text-xs text-text-dim">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Please wait...' : `Continue as ${user.displayName?.split(' ')[0]}`}
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-50 border border-gray-200 shadow-sm"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-medium text-black">Continue with Google</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
