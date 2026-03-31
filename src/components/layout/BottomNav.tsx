import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { motion } from 'framer-motion';

export default function BottomNav({ role }: { role: 'customer' | 'barber' }) {
  const { lang, t, unreadCount } = useApp();
  const nav = useNavigate();
  const loc = useLocation();

  const tabs = role === 'customer'
    ? [
        { label: 'Home', icon: 'home', path: '/customer/home' },
        { label: 'Search', icon: 'search', path: '/customer/search' },
        { label: 'Bookings', icon: 'event_available', path: '/customer/tokens' },
        { label: 'Saved', icon: 'favorite', path: '/customer/favorites' },
        { label: 'Profile', icon: 'person', path: '/customer/profile' },
      ]
    : [
        { label: 'Dashboard', icon: 'home', path: '/barber/home' },
        { label: 'Bookings', icon: 'event_available', path: '/barber/customers' },
        { label: 'Chats', icon: 'chat', path: '/barber/messages' },
        { label: 'Analytics', icon: 'bar_chart', path: '/barber/analytics' },
        { label: 'Profile', icon: 'storefront', path: '/barber/profile' },
      ];

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center pb-8 px-4 bg-bg-primary/80 backdrop-blur-2xl border-t border-white/5">
      <div className="fixed bottom-6 mx-auto w-[92%] max-w-md left-0 right-0 rounded-3xl border border-white/10 bg-bg-surface/80 backdrop-blur-2xl flex justify-around items-center py-4 shadow-[0_10px_40px_rgba(var(--color-primary-rgb),0.1)]">
        {tabs.map((t, i) => {
          const isActive = loc.pathname === t.path;
          return (
            <button
              key={i}
              onClick={() => nav(t.path)}
              className={`flex flex-col items-center justify-center transition-all duration-300 relative group w-16 h-12 ${
                isActive ? 'text-primary scale-105' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <span className="material-symbols-outlined text-2xl mb-1 relative z-10 transition-transform group-hover:-translate-y-1" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {t.icon}{isActive && t.icon === 'notifications' && unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></span>}
              </span>

              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-label text-[10px] uppercase tracking-widest font-bold absolute bottom-1"
                >
                  {t.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
