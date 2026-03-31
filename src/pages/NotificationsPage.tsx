import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';

const NOTIF_ICONS: Record<string, { icon: string; color: string }> = {
  booking: { icon: '🎫', color: 'var(--color-success)' },
  reminder: { icon: '⏰', color: 'var(--color-gold)' },
  review: { icon: '⭐', color: 'var(--color-warning)' },
  system: { icon: '⚙️', color: 'var(--color-primary)' },
  token_ready: { icon: '🎫', color: 'var(--color-success)' },
  token_called: { icon: '🔔', color: 'var(--color-gold)' },
  salon_open: { icon: '💈', color: 'var(--color-primary)' },
  general: { icon: '📢', color: 'var(--color-primary)' },
};

export default function NotificationsPage() {
  const { role, user } = useApp();
  const { notifications, unreadCount, markAsRead, markAllRead, deleteNotification } = useNotifications(user?.uid);
  const nav = useNavigate();
  const [filter, setFilter] = useState<string>('All');
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const handleClick = async (n: any) => {
    if (!n.read) await markAsRead(n.id);
    if (n.data?.salonId && role === 'customer') {
      nav(`/customer/salon/${n.data.salonId}`);
    } else if (n.data?.bookingId && role === 'barber') {
      nav(`/barber/bookings`);
    } else if (n.data?.url) {
      nav(n.data.url);
    }
  };

  const backPath = role === 'barber' ? '/barber/home' : '/customer/home';

  // Apply filters
  const filteredNotifications = useMemo(() => {
    if (filter === 'All') return notifications;
    if (filter === 'Bookings') return notifications.filter(n => n.type === 'booking' || n.type === 'token_ready' || n.type === 'token_called');
    if (filter === 'Reviews') return notifications.filter(n => n.type === 'review');
    if (filter === 'Promos') return notifications.filter(n => n.type === 'promo');
    return notifications;
  }, [notifications, filter]);

  // Group by date
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: typeof notifications } = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    filteredNotifications.forEach(n => {
      const date = new Date(n.createdAt);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups['Today'].push(n);
      } else if (date.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(n);
      } else {
        groups['Earlier'].push(n);
      }
    });

    return groups;
  }, [filteredNotifications]);

  const handleSwipeRight = async (id: string, read: boolean) => {
    if (!read) {
      await markNotificationRead(id);
    }
    setSwipedId(null);
  };

  // Prevent generic dragging behaviour
  const handleDragStart = (e: any) => e.preventDefault();

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="p-6">
        <BackButton to={backPath} />

        {/* Header */}
        <div className="flex items-center justify-between mt-2 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">🔔 Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full border border-primary/20">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-primary text-sm font-semibold hover:underline active:opacity-70 transition-opacity"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar -mx-2 px-2">
          {['All', 'Bookings', 'Reviews', 'Promos'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-text text-background shadow-md'
                  : 'bg-card border border-border text-text-dim hover:text-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-4 shadow-inner border border-border">
              <span className="text-4xl block animate-float">🔕</span>
            </div>
            <h3 className="text-lg font-bold mb-1">All caught up!</h3>
            <p className="text-text-dim text-sm max-w-[200px]">
              {filter === 'All'
                ? "You don't have any notifications right now."
                : `No notifications found for ${filter}.`}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([group, notifs]) => {
              if (notifs.length === 0) return null;

              return (
                <div key={group} className="space-y-3">
                  <h2 className="text-xs font-bold text-text-dim uppercase tracking-wider pl-1 flex items-center gap-2">
                    {group}
                    <div className="flex-1 h-px bg-border/50"></div>
                  </h2>

                  <AnimatePresence>
                    {notifs.map((n, i) => {
                      const iconConfig = NOTIF_ICONS[n.type] || NOTIF_ICONS['general'];

                      return (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                          transition={{ delay: i * 0.05 }}
                          className="relative rounded-2xl overflow-hidden touch-pan-y"
                        >
                          {/* Background actions (Swipe to read / Delete) */}
                          <div className="absolute inset-0 flex items-center justify-between px-6 bg-gradient-to-r from-primary to-danger">
                            <span className="text-white font-bold text-sm">Read</span>
                            <span className="text-white font-bold text-sm">Delete</span>
                          </div>

                          {/* Draggable surface */}
                          <motion.div
                            drag="x"
                            dragConstraints={{ left: -100, right: 100 }}
                            dragElastic={0.2}
                            onDragEnd={(e, info) => {
                              if (info.offset.x > 80) {
                                // Swiped right - mark read
                                handleSwipeRight(n.id, n.read);
                              } else if (info.offset.x < -80) {
                                // Swiped left - delete
                                deleteNotification?.(n.id);
                              }
                            }}
                            className={`relative w-full text-left p-4 rounded-2xl border transition-colors shadow-sm ${
                              n.read
                                ? 'bg-card border-border'
                                : 'bg-background border-primary/30 ring-1 ring-primary/10'
                            }`}
                            onClick={() => handleClick(n)}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner border border-border shrink-0 ${n.read ? 'bg-background grayscale opacity-70' : 'bg-card'}`}
                              >
                                {iconConfig.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                  <p className={`font-bold text-sm truncate ${!n.read ? 'text-text' : 'text-text-dim'}`}>
                                    {n.title}
                                  </p>
                                  <p className="text-text-dim text-[10px] shrink-0 whitespace-nowrap">
                                    {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <p className={`text-xs line-clamp-2 leading-relaxed ${!n.read ? 'text-text/80' : 'text-text-dim'}`}>
                                  {n.body}
                                </p>
                              </div>

                              {!n.read && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 self-center shadow-[0_0_8px_var(--color-primary)]" />
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
