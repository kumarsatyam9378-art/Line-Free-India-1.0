import { useState, useEffect, useRef } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';

type EnrichedToken = TokenEntry & {
  liveQueuePos: number;
  liveWaitMinutes: number;
  liveServingNumber: number | null;
  peopleAhead: number;
};

// ── WhatsApp reminder message builder ──
function buildWhatsAppReminder(token: TokenEntry, queuePos: number, waitMin: number): string {
  const lines = [
    `🔔 *Line Free — Queue Reminder*`,
    ``,
    `💈 *${token.salonName}*`,
    `🎫 Your Token: *#${token.tokenNumber}*`,
    `📋 Services: ${token.selectedServices.map(s => s.name).join(', ')}`,
    `💰 Total: ₹${token.totalPrice}`,
    ``,
    queuePos === 1
      ? `✅ *You're NEXT! Head to the salon now.*`
      : `⏳ *${queuePos - 1} ${queuePos - 1 === 1 ? 'person' : 'people'} ahead of you.*`,
    waitMin > 0 ? `⏰ Est. wait: ~${waitMin} min` : ``,
    ``,
    `_Sent via Line Free App 🚀_`,
  ].filter(l => l !== undefined);
  return lines.join('\n');
}

export default function CustomerTokens() {
  const { user, getCustomerTokens, cancelToken, t } = useApp();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [enriched, setEnriched] = useState<Map<string, EnrichedToken>>(new Map());
  const [loading, setLoading] = useState(true);
  const salonListeners = useRef<Map<string, () => void>>(new Map());

  // Load today's tokens for this customer
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getCustomerTokens(user.uid).then(t => {
      setTokens(t.sort((a, b) => b.tokenNumber - a.tokenNumber));
      setLoading(false);
    });
  }, [user]);

  // For each active waiting token → subscribe to that salon's token collection in real-time
  useEffect(() => {
    const activeTokens = tokens.filter(t => t.status === 'waiting' || t.status === 'serving');

    // Clean up listeners no longer needed
    salonListeners.current.forEach((unsub, salonId) => {
      const stillNeeded = activeTokens.some(t => t.salonId === salonId);
      if (!stillNeeded) { unsub(); salonListeners.current.delete(salonId); }
    });

    // Create new listeners
    activeTokens.forEach(myToken => {
      if (salonListeners.current.has(myToken.salonId)) return; // already listening

      const today = myToken.date;
      const q = query(
        collection(db, 'tokens'),
        where('salonId', '==', myToken.salonId),
        where('date', '==', today)
      );

      const unsub = onSnapshot(q, (snap) => {
        const allSalonTokens = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
        const serving = allSalonTokens.find(t => t.status === 'serving');
        const waitingBefore = allSalonTokens.filter(
          t => t.status === 'waiting' && t.tokenNumber < myToken.tokenNumber
        );
        const queuePos = waitingBefore.length + 1;
        // Estimated wait = sum of time of all tokens ahead + serving token remaining
        const waitMin = waitingBefore.reduce((s, t) => s + t.totalTime, 0);

        // Update enriched data for this token
        setEnriched(prev => {
          const next = new Map(prev);
          next.set(myToken.id!, {
            ...myToken,
            liveQueuePos: queuePos,
            liveWaitMinutes: waitMin,
            liveServingNumber: serving?.tokenNumber ?? null,
            peopleAhead: waitingBefore.length,
          });
          return next;
        });

        // Also update the base token status if it changed
        setTokens(prev => prev.map(t => {
          const updated = allSalonTokens.find(st => st.id === t.id);
          return updated ? { ...t, status: updated.status } : t;
        }));
      });

      salonListeners.current.set(myToken.salonId, unsub);
    });

    return () => {};
  }, [tokens]);

  // Cleanup all listeners on unmount
  useEffect(() => {
    return () => { salonListeners.current.forEach(unsub => unsub()); };
  }, []);

  const handleCancel = async (tokenId: string) => {
    if (!confirm('Cancel this token?')) return;
    await cancelToken(tokenId);
    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: 'cancelled' } : t));
  };

  const handleWhatsAppReminder = (token: TokenEntry, queuePos: number, waitMin: number) => {
    const msg = buildWhatsAppReminder(token, queuePos, waitMin);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleShareToken = (token: TokenEntry) => {
    const e = enriched.get(token.id!);
    const text = [
      `🎫 *My Line Free Token*`,
      `💈 ${token.salonName}`,
      `🔢 Token #${token.tokenNumber}`,
      `📅 Date: ${token.date}`,
      e ? `⏳ ${e.peopleAhead} people ahead of me` : ``,
      e ? `⏰ Est. wait: ~${e.liveWaitMinutes} min` : ``,
      `💰 ₹${token.totalPrice}`,
      `📋 ${token.selectedServices.map(s => s.name).join(', ')}`,
      ``,
      `_Track live on Line Free 🚀_`,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const activeTokens = tokens.filter(t => t.status === 'waiting' || t.status === 'serving');
  const completedTokens = tokens.filter(t => t.status === 'done' || t.status === 'cancelled');

  // Countdown timer display
  const formatCountdown = (minutes: number) => {
    if (minutes <= 0) return 'Any moment now!';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  return (
    <div className="screen-scroll pb-24 animate-fadeIn">
      <div className="p-6">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold">{t('tokens')}</h1>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-success font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>
        </div>
        <p className="text-text-dim text-sm mb-6">Real-time queue tracking</p>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-text-dim text-sm mt-3">Loading tokens...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4 animate-float">🎫</span>
            <p className="font-semibold text-lg">No active tokens</p>
            <p className="text-text-dim text-sm mt-1 max-w-xs mx-auto">Book a token at any salon to track your queue live here!</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── ACTIVE TOKENS ── */}
            {activeTokens.length > 0 && (
              <div>
                <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Active Bookings
                </h2>
                <div className="space-y-4">
                  {activeTokens.map(token => {
                    const e = enriched.get(token.id!);
                    const isServing = token.status === 'serving';

                    return (
                      <div key={token.id} className={`rounded-2xl overflow-hidden border relative ${isServing ? 'border-success/40 bg-success/5' : 'border-primary/20 bg-card'}`}>
                        {/* Top status bar */}
                        <div className={`h-1 w-full ${isServing ? 'bg-success' : 'bg-gradient-to-r from-primary to-accent'}`} />

                        <div className="p-5">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-bold text-lg">{token.salonName}</p>
                              <p className="text-text-dim text-xs mt-0.5">📅 {token.date}</p>
                            </div>
                            <div className={`text-center p-2.5 rounded-xl min-w-[60px] ${isServing ? 'bg-success/10 border border-success/30' : 'bg-card-2 border border-border'}`}>
                              <p className="text-[10px] text-text-dim uppercase tracking-wide font-semibold">Token</p>
                              <p className={`text-2xl font-black leading-none mt-0.5 ${isServing ? 'text-success' : 'gradient-text'}`}>
                                #{token.tokenNumber}
                              </p>
                            </div>
                          </div>

                          {/* ── SERVING STATE ── */}
                          {isServing && (
                            <div className="mb-4 p-4 rounded-xl bg-success/10 border border-success/30 flex items-center gap-3">
                              <span className="text-3xl">✂️</span>
                              <div>
                                <p className="font-bold text-success">It's your turn!</p>
                                <p className="text-success/80 text-xs mt-0.5">Please go to the barber now</p>
                              </div>
                              <div className="ml-auto">
                                <div className="w-3 h-3 rounded-full bg-success animate-ping" />
                              </div>
                            </div>
                          )}

                          {/* ── WAITING STATE — Live Queue Card ── */}
                          {!isServing && e && (
                            <div className="mb-4">
                              {/* Big countdown */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-3 text-center">
                                <p className="text-text-dim text-xs uppercase tracking-widest mb-1">Estimated Wait</p>
                                <p className="text-4xl font-black gradient-text">{formatCountdown(e.liveWaitMinutes)}</p>
                                {e.peopleAhead === 0
                                  ? <p className="text-success text-xs font-semibold mt-1">🔔 You're next!</p>
                                  : <p className="text-text-dim text-xs mt-1">{e.peopleAhead} {e.peopleAhead === 1 ? 'person' : 'people'} ahead of you</p>
                                }
                              </div>

                              {/* Queue progress */}
                              <div className="p-3 rounded-xl bg-card-2/60 border border-border">
                                <div className="flex justify-between text-xs mb-2">
                                  <span className="text-text-dim">Now serving</span>
                                  <span className="text-text-dim">Your token</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm mb-2">
                                  <span className="text-accent">#{e.liveServingNumber ?? '—'}</span>
                                  <span className="gradient-text">#{token.tokenNumber}</span>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full h-2 rounded-full bg-card overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                                    style={{
                                      width: `${Math.max(8, 100 - (e.peopleAhead / Math.max(1, e.liveQueuePos + e.peopleAhead)) * 100)}%`
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-[9px] text-text-dim mt-1">
                                  <span>Position #{e.liveQueuePos}</span>
                                  <span className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-success animate-pulse" />
                                    Live
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Loading enriched data */}
                          {!isServing && !e && (
                            <div className="mb-4 p-4 rounded-xl bg-card-2/50 border border-border flex items-center gap-3">
                              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              <p className="text-text-dim text-sm">Loading live queue data...</p>
                            </div>
                          )}

                          {/* Services */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {token.selectedServices.map((s, i) => (
                              <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-card-2 border border-border">{s.name}</span>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="flex justify-between items-center pt-3 border-t border-border/50">
                            <div>
                              <p className="font-bold">₹{token.totalPrice}</p>
                              <p className="text-text-dim text-[10px]">~{token.totalTime} min service</p>
                            </div>
                            <div className="flex gap-2">
                              {/* WhatsApp Reminder */}
                              <button
                                onClick={() => handleWhatsAppReminder(token, e?.liveQueuePos ?? 1, e?.liveWaitMinutes ?? token.estimatedWaitMinutes)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 text-xs font-semibold active:scale-95 transition-transform"
                              >
                                <span>📲</span> Remind
                              </button>
                              {/* Share */}
                              <button
                                onClick={() => handleShareToken(token)}
                                className="w-9 h-9 rounded-xl bg-card-2 border border-border flex items-center justify-center active:scale-95 transition-transform"
                              >
                                🔗
                              </button>
                              {/* Cancel */}
                              {token.status === 'waiting' && token.id && (
                                <button
                                  onClick={() => handleCancel(token.id!)}
                                  className="w-9 h-9 rounded-xl bg-danger/10 text-danger border border-danger/20 flex items-center justify-center active:scale-95 transition-transform"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── COMPLETED TOKENS ── */}
            {completedTokens.length > 0 && (
              <div>
                <h2 className="font-bold text-base mb-3 text-text-dim">Past Bookings</h2>
                <div className="space-y-2">
                  {completedTokens.slice(0, 5).map(token => (
                    <div key={token.id} className="p-4 rounded-xl bg-card border border-border opacity-70">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-sm">{token.salonName}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          token.status === 'done' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                        }`}>
                          {token.status === 'done' ? '✅ Done' : '❌ Cancelled'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-text-dim">
                        <span>📅 {token.date} • Token #{token.tokenNumber}</span>
                        <span className="font-semibold">₹{token.totalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
