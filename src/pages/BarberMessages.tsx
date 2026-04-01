import { useState, useEffect, useRef } from 'react';
import { useApp, MessageEntry } from '../store/AppContext';
import BottomNav from '../components/BottomNav';

interface CustomerThread {
  customerId: string;
  customerName: string;
  customerPhoto: string;
  lastMessage: string;
  lastTime: number;
  unread: number;
}

export default function BarberMessages() {
  const { user, barberProfile, useChatMessages, sendMessage } = useApp();
  const salonId = user?.uid || '';

  // Real-time all messages for this salon
  const allMessages = useChatMessages(salonId);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (selectedCustomerId) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [allMessages.length, selectedCustomerId]);

  // Build customer threads from all messages
  const threads = new Map<string, CustomerThread>();
  allMessages.forEach(msg => {
    const cid = msg.customerId || (msg.senderRole === 'customer' ? msg.senderId : null);
    if (!cid) return;
    const existing = threads.get(cid);
    const time = (msg.createdAt as number) || 0;
    const isFromCustomer = msg.senderRole === 'customer' || msg.customerId === cid;
    if (!existing || time > existing.lastTime) {
      threads.set(cid, {
        customerId: cid,
        customerName: msg.customerName || msg.senderName || 'Customer',
        customerPhoto: msg.customerPhoto || msg.senderPhoto || '',
        lastMessage: msg.message,
        lastTime: time,
        unread: (existing?.unread || 0) + (isFromCustomer && !msg.read ? 1 : 0),
      });
    } else if (isFromCustomer && !msg.read) {
      threads.set(cid, { ...existing, unread: existing.unread + 1 });
    }
  });

  const sortedThreads = [...threads.values()].sort((a, b) => b.lastTime - a.lastTime);
  const totalUnread = sortedThreads.reduce((s, t) => s + t.unread, 0);

  // Messages in selected conversation
  const convMessages = selectedCustomerId
    ? allMessages.filter(m => (m.customerId === selectedCustomerId) || (m.senderRole === 'customer' && m.senderId === selectedCustomerId) || (m.senderRole === 'barber' && (m.customerId === selectedCustomerId || m.senderId === selectedCustomerId)))
    : [];

  const selectedThread = selectedCustomerId ? threads.get(selectedCustomerId) : null;

  const handleReply = async () => {
    if (!replyText.trim() || !salonId || !selectedCustomerId || !barberProfile) return;
    setSending(true);
    await sendMessage({
      salonId,
      salonName: barberProfile.salonName,
      senderId: salonId,
      senderName: barberProfile.salonName,
      senderPhoto: barberProfile.photoURL || '',
      senderRole: 'barber',
      customerId: selectedCustomerId,
      customerName: selectedThread?.customerName || 'Customer',
      customerPhoto: selectedThread?.customerPhoto || '',
      message: replyText.trim(),
      createdAt: Date.now(),
      read: false,
    });
    setReplyText('');
    setSending(false);
  };

  const formatTime = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts), now = new Date();
    return d.toDateString() === now.toDateString()
      ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  // ── CONVERSATION VIEW ──
  if (selectedCustomerId && selectedThread) {
    return (
      <div className="min-h-screen flex flex-col animate-fadeIn" style={{ height: '100dvh' }}>
        {/* Header */}
        <div className="p-4 glass-strong flex items-center gap-3 sticky top-0 z-10 border-b border-border/50">
          <button onClick={() => setSelectedCustomerId(null)} className="text-xl text-text-dim">←</button>
          <div className="w-10 h-10 rounded-full bg-card-2 overflow-hidden flex-shrink-0">
            {selectedThread.customerPhoto ? <img src={selectedThread.customerPhoto} className="w-10 h-10 object-cover" alt="" /> : <div className="w-10 h-10 flex items-center justify-center text-xl">👤</div>}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{selectedThread.customerName}</p>
            <p className="text-text-dim text-[10px]">Customer</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {convMessages.length === 0 ? (
            <div className="text-center py-10 text-text-dim text-sm">No messages yet</div>
          ) : convMessages.map((msg, i) => {
            const isBarberMsg = msg.senderRole === 'barber' || msg.senderId === salonId;
            return (
              <div key={msg.id || i} className={`flex mb-2 ${isBarberMsg ? 'justify-end' : 'justify-start'}`}>
                {!isBarberMsg && (
                  <div className="w-7 h-7 rounded-full bg-card-2 overflow-hidden flex-shrink-0 mr-2 mt-1">
                    {selectedThread.customerPhoto ? <img src={selectedThread.customerPhoto} className="w-7 h-7 object-cover" alt="" /> : <div className="w-7 h-7 flex items-center justify-center text-xs">👤</div>}
                  </div>
                )}
                <div className={`max-w-[75%] px-3 py-2.5 rounded-2xl ${isBarberMsg ? 'bg-primary text-white rounded-br-sm' : 'bg-card border border-border rounded-bl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-[9px] mt-1 text-right ${isBarberMsg ? 'text-white/60' : 'text-text-dim'}`}>{formatTime((msg.createdAt as number) || 0)}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply Input */}
        <div className="p-3 glass-strong sticky bottom-0 border-t border-border/50 pb-safe">
          <div className="flex gap-2 items-center">
            <input
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply()}
              placeholder={`Reply to ${selectedThread.customerName}...`}
              className="input-field flex-1 text-sm py-3"
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim() || sending}
              className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform flex-shrink-0"
            >
              {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="text-lg">➤</span>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── THREADS LIST VIEW ──
  return (
    <div className="h-[100dvh] overflow-y-auto pb-24 animate-fadeIn">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">💬 Messages</h1>
            <p className="text-text-dim text-sm">
              {totalUnread > 0 ? <span className="text-primary font-semibold">{totalUnread} unread</span> : 'All caught up ✅'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live
          </div>
        </div>

        {sortedThreads.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3 animate-float">💬</span>
            <p className="text-text-dim font-medium">No messages yet</p>
            <p className="text-text-dim text-xs mt-1">When customers message you, they'll appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedThreads.map((thread, i) => (
              <button
                key={thread.customerId}
                onClick={() => setSelectedCustomerId(thread.customerId)}
                className="w-full p-4 rounded-xl bg-card border border-border text-left flex items-center gap-3 hover:border-primary/30 transition-all active:scale-[0.98] animate-fadeIn"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-card-2 overflow-hidden flex-shrink-0 relative">
                  {thread.customerPhoto ? <img src={thread.customerPhoto} className="w-12 h-12 object-cover" alt="" /> : <div className="w-12 h-12 flex items-center justify-center text-2xl">👤</div>}
                  {thread.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">{thread.unread > 9 ? '9+' : thread.unread}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold text-sm ${thread.unread > 0 ? 'text-text' : 'text-text-dim'}`}>{thread.customerName}</p>
                    <span className="text-[10px] text-text-dim">{formatTime(thread.lastTime)}</span>
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${thread.unread > 0 ? 'font-medium text-text' : 'text-text-dim'}`}>{thread.lastMessage}</p>
                </div>
                <span className="text-text-dim text-sm">›</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
