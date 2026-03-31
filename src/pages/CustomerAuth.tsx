import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import BackButton from '../components/BackButton';
import Button from '../components/ui/Button';

export default function CustomerAuth() {
  const { signInWithGoogle, getCustomerFullHistory, t } = useApp();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await signInWithGoogle();
      if (res?.user) {
        const hist = await getCustomerFullHistory(res.user.uid);
        if (hist.length > 0) {
          nav('/customer/home', { replace: true });
        } else {
          nav('/customer/setup', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-6 animate-fadeIn royal-gradient bg-surface text-on-surface relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary opacity-20 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent opacity-10 blur-[100px] pointer-events-none rounded-full" />

      <BackButton to="/role" />

      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-sm mx-auto w-full">
        <div className="w-24 h-24 rounded-[2rem] glass-card border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 opacity-50" />
          <span className="material-symbols-outlined text-5xl text-primary z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
            person_add
          </span>
        </div>

        <h1 className="text-4xl font-black font-headline tracking-tighter text-white mb-2 uppercase leading-none">
          {t('role.customer') || 'Customer'} <span className="text-primary italic">Access</span>
        </h1>
        <p className="text-on-surface-variant text-sm tracking-wide font-label uppercase mb-12">
          Save time, skip the line
        </p>

        <div className="space-y-4 w-full">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 text-left border-white/5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">queue</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Book in seconds</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">218+ Business types</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 text-left border-white/5">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <span className="material-symbols-outlined">track_changes</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Track your queue live</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Don't wait in store</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 text-left border-white/5">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">stars</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Review & Earn</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Loyalty points</p>
            </div>
          </div>
        </div>

        {error && <p className="text-danger text-sm mt-8 font-bold">{error}</p>}

        <div className="mt-12 w-full">
          <Button onClick={login} loading={loading} className="w-full h-14 bg-white text-bg-surface hover:bg-white/90 shadow-[0_8px_32px_rgba(255,255,255,0.15)] flex gap-3 text-lg items-center justify-center border-none">
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 39.869 -11.514 38.739 -14.754 38.739 C -19.444 38.739 -23.494 41.439 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            <span className="font-bold text-bg-primary tracking-tight">{t('auth.google') || 'Continue with Google'}</span>
          </Button>

          <p className="mt-8 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-relaxed">
            By continuing, you agree to our<br/>
            <a href="#" className="text-primary underline decoration-primary/50 underline-offset-2">Terms of Service</a> & <a href="#" className="text-primary underline decoration-primary/50 underline-offset-2">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
