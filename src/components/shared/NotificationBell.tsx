// src/components/shared/NotificationBell.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationBellProps {
  count: number;
}

export default function NotificationBell({ count }: NotificationBellProps) {
  const navigate = useNavigate();
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setPop(true);
      const timer = setTimeout(() => setPop(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 rounded-full hover:bg-card border border-transparent hover:border-border transition-colors group"
      aria-label="Notifications"
    >
      <svg className="w-6 h-6 text-text group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      {count > 0 && (
        <span
          className={`absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white shadow-sm ring-2 ring-background transition-transform duration-300 ${pop ? 'scale-125' : 'scale-100'}`}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
