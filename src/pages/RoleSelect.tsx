import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

export default function RoleSelect() {
  const { setRole, t } = useApp();
  const nav = useNavigate();

  const selectCustomer = () => {
    setRole('customer');
    nav('/customer/auth');
  };

  const selectBusinessOwner = () => {
    setRole('barber'); // Keep 'barber' role internally for backward compat
    // Navigate to business type selection FIRST
    nav('/business/select');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-4xl">🏪</span>
        </div>
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Line Free
        </h1>
        <p className="text-text-dim text-sm mt-1">लाइन फ्री • Queue Management for India</p>
      </div>

      <div className="w-full space-y-3 max-w-xs">
        {/* CUSTOMER */}
        <button
          onClick={selectCustomer}
          className="w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-4 active:scale-[0.98] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-3xl">👤</span>
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold text-lg">Customer</p>
            <p className="text-text-dim text-sm">Book token, skip the line</p>
          </div>
          <span className="text-text-dim">→</span>
        </button>

        {/* BUSINESS OWNER */}
        <button
          onClick={selectBusinessOwner}
          className="w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-4 active:scale-[0.98] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-3xl">🏪</span>
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold text-lg">Business Owner</p>
            <p className="text-text-dim text-sm">Manage queue, grow business</p>
          </div>
          <span className="text-text-dim">→</span>
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 flex gap-6 text-center">
        <div>
          <p className="text-xl font-extrabold gradient-text">500+</p>
          <p className="text-text-dim text-[10px]">Businesses</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-xl font-extrabold gradient-text">10K+</p>
          <p className="text-text-dim text-[10px]">Customers</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="text-xl font-extrabold gradient-text">218+</p>
          <p className="text-text-dim text-[10px]">Business Types</p>
        </div>
      </div>

      <button onClick={() => nav('/language')} className="mt-8 text-text-dim text-sm hover:text-primary transition-colors">
        ← Change Language
      </button>
    </div>
  );
}