import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp, BarberProfile } from '../store/AppContext';

export default function CustomerChat() {
  const { salonId } = useParams<{ salonId: string }>();
  const { user, customerProfile, useChatMessages, sendMessage, getSalonById, allSalons, markNotificationRead, notifications } = useApp();
  const nav = useNavigate();
  const [salon, setSalon] = useState<BarberProfile | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Real-time messages via onSnapshot
  const messages = useChatMessages(salonId || '');

  useEffect(() => {
    if (salonId) {
      const found = allSalons.find(s => s.uid === salonId);
      if (found) setSalon(found);
      else getSalonById(salonId).then(setSalon);
    }
  }, [salonId, allSalons]);

  // Auto-scroll on new messages
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim() || !salonId || !user || !salon) return;
    setSending(true);
    await sendMessage({
      salonId,
      salonName: salon.salonName,
      senderId: user.uid,
      senderName: customerProfile?.name || user.displayName || 'Customer',
      senderPhoto: customerProfile?.photoURL || user.photoURL || '',
      senderRole: 'customer',
      // legacy
      customerId: user.uid,
      customerName: customerProfile?.name || user.displayName || 'Customer',
      customerPhoto: customerProfile?.photoURL || user.photoURL || '',
      message: text.trim(),
      createdAt: Date.now(),
      read: false,
    });
    setText('');
    setSending(false);
  };

  const formatTime = (ts: any) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  // Group by date
  const grouped: { date: string; msgs: typeof messages }[] = [];
  messages.forEach(msg => {
    const d = new Date(msg.createdAt || 0);
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const label = d.toDateString() === today.toDateString() ? 'Today'
      : d.toDateString() === yesterday.toDateString() ? 'Yesterday'
      : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const last = grouped[grouped.length - 1];
    if (last && last.date === label) last.msgs.push(msg);
    else grouped.push({ date: label, msgs: [msg] });
  });

  return (
    <div className="min-h-screen flex flex-col animate-fadeIn" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="p-4 glass-strong flex items-center gap-3 sticky top-0 z-10 border-b border-border/50">
        <button onClick={() => nav(-1)} className="text-xl text-text-dim">←</button>
        <div className="w-10 h-10 rounded-full bg-card-2 overflow-hidden flex-shrink-0">
          {salon?.photoURL ? <img src={salon.photoURL} className="w-10 h-10 object-cover" alt="" /> : <div className="w-10 h-10 flex items-center justify-center text-xl">💈</div>}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{salon?.salonName || 'Salon'}</p>
          <p className="text-text-dim text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            {salon?.isOpen ? 'Open now' : 'Closed'}
          </p>
        </div>
        {salon?.phone && <a href={`tel:${salon.phone}`} className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary">📞</a>}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ overflowAnchor: 'none' }}>
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-3">💬</span>
            <p className="text-text-dim font-medium">No messages yet</p>
            <p className="text-text-dim text-xs mt-1">Ask {salon?.salonName || 'the salon'} anything!</p>
          </div>
        ) : (
          <>
            {grouped.map((group, gi) => (
              <div key={gi}>
                <div className="text-center mb-3">
                  <span className="text-[10px] text-text-dim bg-card px-3 py-1 rounded-full">{group.date}</span>
                </div>
                {group.msgs.map((msg, i) => {
                  const isMine = (msg.senderId || msg.customerId) === user?.uid;
                  const isBarberMsg = msg.senderRole === 'barber';
                  return (
                    <div key={msg.id || i} className={`flex mb-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                      {!isMine && (
                        <div className="w-7 h-7 rounded-full bg-card-2 overflow-hidden flex-shrink-0 mr-2 mt-1">
                          {(isBarberMsg ? salon?.photoURL : msg.senderPhoto || msg.customerPhoto) ? (
                            <img src={(isBarberMsg ? salon?.photoURL : msg.senderPhoto || msg.customerPhoto) || ''} className="w-7 h-7 object-cover" alt="" />
                          ) : <div className="w-7 h-7 flex items-center justify-center text-xs">{isBarberMsg ? '💈' : '👤'}</div>}
                        </div>
                      )}
                      <div className={`max-w-[75%] px-3 py-2.5 rounded-2xl ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-card border border-border rounded-bl-sm'}`}>
                        {!isMine && (
                          <p className="text-[10px] font-semibold text-primary mb-0.5">
                            {isBarberMsg ? `${salon?.salonName || 'Salon'} 💈` : (msg.senderName || msg.customerName)}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-[9px] mt-1 text-right ${isMine ? 'text-white/60' : 'text-text-dim'}`}>{formatTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 glass-strong sticky bottom-0 border-t border-border/50">
        <div className="flex gap-2 items-center">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Message ${salon?.salonName || 'salon'}...`}
            className="input-field flex-1 text-sm py-3"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 transition-all active:scale-95 flex-shrink-0"
          >
            {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="text-lg">➤</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
