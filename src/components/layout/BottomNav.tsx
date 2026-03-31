import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from '../../constants/businessRegistry';

export default function BottomNav({ role }: { role: 'customer' | 'barber' }) {
  const { lang, barberProfile } = useApp();
  const nav = useNavigate();
  const loc = useLocation();

  const bInfo = BUSINESS_CATEGORIES_INFO.find(c => c.id === barberProfile?.businessType);

  const tabs = role === 'customer'
    ? [
        { label: 'Home', icon: '🏠', path: '/customer/home' },
        { label: 'Search', icon: '🔍', path: '/customer/search' },
        { label: 'Tokens', icon: '🎫', path: '/customer/tokens' },
        { label: 'Profile', icon: '👤', path: '/customer/profile' },
      ]
    : [
        { label: 'Home', icon: '🏠', path: '/barber/home' },
        { label: 'Queue', icon: '🧑‍🤝‍🧑', path: '/barber/customers' },
        { label: 'Chats', icon: '💬', path: '/barber/messages' },
        { label: 'Profile', icon: bInfo?.icon || '🏪', path: '/barber/profile' },
      ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/80 backdrop-blur-md border-t border-border flex justify-around p-3 pb-6 z-50">
      {tabs.map((t, i) => {
        const isActive = loc.pathname === t.path;
        return (
          <button
            key={i}
            onClick={() => nav(t.path)}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-primary scale-110' : 'text-text-dim hover:text-text'
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-[10px] font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
