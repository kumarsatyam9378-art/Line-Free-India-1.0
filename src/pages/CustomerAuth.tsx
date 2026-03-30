import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import BackButton from '../components/BackButton';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

export default function CustomerAuth() {
  const { signInWithGoogle, user, setRole, t } = useApp();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      setRole('customer');
      const uid = (result as any)?.user?.uid || user?.uid;
      if (uid) {
        try {
          const snap = await getDoc(doc(db, 'customers', uid));
          if (snap.exists()) {
            toast.success('Login successful!');
            nav('/customer/home', { replace: true });
            return;
          }
        } catch {}
      }
      toast.success('Account created!');
      nav('/customer/setup', { replace: true });
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const errorObj = err as { code?: string, message?: string };
      if (errorObj.code === 'auth/popup-closed-by-user') {
        toast.error('Popup closed. Please try again.');
      } else if (errorObj.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups for this site.');
      } else {
        toast.error(errorObj.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      toast.success('OTP sent to your phone');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.error('Phone authentication is coming soon! Please use Google Sign-in for now.');
    }, 1000);
  };

  const handleContinueAsExisting = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'customers', user.uid));
      if (snap.exists()) {
        nav('/customer/home', { replace: true });
      } else {
        nav('/customer/setup', { replace: true });
      }
    } catch {
      nav('/customer/setup', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col p-6 animate-fadeIn gradient-bg-animated text-white">
        <BackButton to="/role" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-card-2 flex items-center justify-center mb-4 ring-2 ring-white/30 overflow-hidden shadow-xl">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-20 h-20 rounded-full object-cover" alt="" />
            ) : (
              <span className="text-4xl">👤</span>
            )}
          </div>
          <p className="text-xl font-bold mb-1">{user.displayName || 'User'}</p>
          <p className="text-white/70 text-sm mb-8">{user.email}</p>
          <button
            onClick={handleContinueAsExisting}
            disabled={loading}
            className="w-full max-w-xs p-4 rounded-xl bg-white text-primary font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : null}
            {loading ? 'Loading...' : `${t('btn.continue')} →`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-bg-animated text-white relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="p-4 relative z-10 flex justify-between items-center">
        <BackButton to="/role" />
        <div className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
          Customer Portal
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 shadow-2xl border border-white/20">
            <span className="text-4xl">✂️</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 drop-shadow-md">Line Free India</h1>
          <p className="text-white/80 font-medium">Skip the queue, save your time</p>
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md glass-card p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl bg-black/20"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <button
              onClick={() => { setIsLogin(!isLogin); setOtpSent(false); setPhone(''); setOtp(''); }}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {isLogin ? 'Register instead' : 'Login instead'}
            </button>
          </div>

          <div className="space-y-4">
            {!otpSent ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="text-white/70 font-medium">🇮🇳 +91</span>
                    <div className="h-5 w-px bg-white/20 ml-3" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Phone number"
                    className="w-full pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                    style={{ paddingLeft: '110px' }}
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length < 10}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : null}
                  {loading ? 'Sending...' : 'Get OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Sent to +91 {phone}</span>
                  <button onClick={() => setOtpSent(false)} className="text-sm text-white hover:underline">Edit</button>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white text-center tracking-[0.5em] text-lg font-medium placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-bold shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : null}
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full p-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-3 hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {loading && !otpSent && phone.length === 0 ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              Google
            </button>
          </div>
        </motion.div>

        <p className="text-white/50 text-xs mt-8 text-center max-w-xs">
          By continuing you agree to our <Link to="#" className="underline hover:text-white transition-colors">Terms of Service</Link> & <Link to="#" className="underline hover:text-white transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
