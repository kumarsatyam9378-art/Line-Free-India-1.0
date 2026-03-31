import { useState, useEffect } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import { openWhatsApp } from '../lib/whatsapp';

export default function BarberCustomers() {
  const { user, nextCustomer, getTodayEarnings, barberProfile, t } = useApp();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [editingWait, setEditingWait] = useState<string | null>(null); // tokenId
  const [customWait, setCustomWait] = useState('');
  const [savingWait, setSavingWait] = useState(false);

  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })();

  // ✅ Real-time listener for today's tokens
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tokens'), where('salonId', '==', user.uid));
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
      const todayTokens = all.filter(t => t.date === today);
      todayTokens.sort((a, b) => a.tokenNumber - b.tokenNumber);
      setTokens(todayTokens);
    }, err => console.warn('Tokens listener:', err));
    return () => unsub();
  }, [user, today]);

  // Reload earnings every 15s
  useEffect(() => {
    const load = async () => { const e = await getTodayEarnings(); setEarnings(e); };
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, [user]);

  const handleNext = async () => {
    await nextCustomer();
  };

  // ✅ Barber can set custom wait time for a token
  const handleSetWaitTime = async (tokenId: string, minutes: number) => {
    setSavingWait(true);
    try {
      await updateDoc(doc(db, 'tokens', tokenId), { estimatedWaitMinutes: minutes, totalTime: minutes });
    } catch (e) { console.error(e); }
    setSavingWait(false);
    setEditingWait(null);
    setCustomWait('');
  };

  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const servingToken  = tokens.find(t => t.status === 'serving');
  const doneTokens    = tokens.filter(t => t.status === 'done');
  const cancelledCount = tokens.filter(t => t.status === 'cancelled').length;

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold">{t('queue.customers')}</h1>
          <div className="flex items-center gap-1.5 text-[10px] text-success font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live
          </div>
        </div>
        <p className="text-text-dim text-sm mb-4">{t('today')} · {waitingTokens.length} waiting</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <div className="p-3 rounded-xl glass-card text-center">
            <p className="text-lg font-bold text-gold">₹{earnings}</p>
            <p className="text-[9px] text-text-dim">Revenue</p>
          </div>
          <div className="p-3 rounded-xl glass-card text-center">
            <p className="text-lg font-bold text-success">{doneTokens.length}</p>
            <p className="text-[9px] text-text-dim">Done</p>
          </div>
          <div className="p-3 rounded-xl glass-card text-center">
            <p className="text-lg font-bold text-warning">{waitingTokens.length}</p>
            <p className="text-[9px] text-text-dim">Waiting</p>
          </div>
          <div className="p-3 rounded-xl glass-card text-center">
            <p className="text-lg font-bold text-danger">{cancelledCount}</p>
            <p className="text-[9px] text-text-dim">Cancelled</p>
          </div>
        </div>

        {/* Next Customer Button */}
        <button
          onClick={handleNext}
          disabled={waitingTokens.length === 0 && !servingToken}
          className="w-full p-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg mb-5 disabled:opacity-40 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          {servingToken
            ? `✅ Done #${servingToken.tokenNumber} → Call Next`
            : waitingTokens.length > 0
            ? `▶️ Call Token #${waitingTokens[0]?.tokenNumber}`
            : '👥 No customers waiting'}
        </button>

        {/* Currently Serving */}
        {servingToken && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-success mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Currently Serving
            </h3>
            <div className="p-4 rounded-2xl bg-success/10 border border-success/30">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">#{servingToken.tokenNumber} · {servingToken.customerName}</p>
                  <p className="text-sm text-text-dim mt-0.5">{servingToken.selectedServices.map(s => s.name).join(', ')}</p>
                  <p className="text-sm font-semibold text-success mt-1">₹{servingToken.totalPrice} · ~{servingToken.totalTime}min</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {servingToken.customerPhone && (
                    <a href={`tel:${servingToken.customerPhone}`} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">📞</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Waiting Queue */}
        {waitingTokens.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-warning mb-2">⏳ Waiting Queue ({waitingTokens.length})</h3>
            <div className="space-y-2">
              {waitingTokens.map((token, i) => (
                <div key={token.id} className="p-3 rounded-xl bg-card border border-border animate-fadeIn" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary flex-shrink-0">
                      {token.tokenNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{token.customerName}</p>
                      <p className="text-text-dim text-xs truncate">{token.selectedServices.map(s => s.name).join(', ')}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold">₹{token.totalPrice}</p>
                      <p className="text-xs text-text-dim">~{token.estimatedWaitMinutes}min</p>
                    </div>
                    {token.customerPhone && (
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => { e.preventDefault(); openWhatsApp(token.customerPhone!, `Hi ${token.customerName}, this is regarding your token #${token.tokenNumber} at ${barberProfile?.salonName}.`); }}
                          className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                          title="WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.405 0 0 5.405 0 12.031c0 2.115.55 4.18 1.59 6l-1.565 5.717 5.842-1.536A11.968 11.968 0 0012.031 24c6.626 0 12.031-5.405 12.031-12.031C24.062 5.405 18.657 0 12.031 0zm0 21.986c-1.783 0-3.528-.48-5.06-1.39l-3.376.887.904-3.292C3.492 16.516 3.014 14.302 3.014 12.03 3.014 7.062 7.062 3.014 12.03 3.014c4.968 0 9.016 4.048 9.016 9.016 0 4.968-4.048 9.016-9.016 9.016zm4.945-6.73c-.27-.135-1.597-.79-1.843-.88-.246-.09-.425-.135-.605.135-.18.27-.695.88-.85.1.06-.156.126-.403-.045-.694-.135-.292-.27-1.597-.835-2.227-1.485-.63-.135-.135-.306-.135-.486 0-.27.18-.742-.427-1.687-.833-2.564-.383-.833-.923-.27-1.057-.27-1.844-.27-.246 0-.648.09-.985.495-.337.405-.985.967-.985 2.362 0 1.395 1.012 2.744 1.147 2.924.135.18 1.99 3.04 4.82 4.262 2.83 1.222 2.83.81 3.348.765.518-.045 1.597-.652 1.822-1.282.225-.63.225-1.17.157-1.282-.068-.112-.248-.18-.518-.315z"/></svg>
                        </button>
                        <a href={`tel:${token.customerPhone}`} className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors text-lg" title="Call">📞</a>
                      </div>
                    )}
                  </div>

                  {/* ✅ Set custom wait time */}
                  <div className="mt-2 flex items-center gap-2">
                    {editingWait === token.id ? (
                      <>
                        <input
                          type="number"
                          value={customWait}
                          onChange={e => setCustomWait(e.target.value)}
                          placeholder="Wait time (min)"
                          className="input-field flex-1 text-xs py-1.5"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSetWaitTime(token.id!, parseInt(customWait) || token.totalTime)}
                          disabled={savingWait || !customWait}
                          className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold disabled:opacity-50"
                        >
                          {savingWait ? '...' : 'Set'}
                        </button>
                        <button onClick={() => { setEditingWait(null); setCustomWait(''); }} className="px-2 py-1.5 rounded-lg border border-border text-xs text-text-dim">✕</button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setEditingWait(token.id!); setCustomWait(String(token.estimatedWaitMinutes || token.totalTime)); }}
                        className="text-[10px] text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
                      >
                        ⏱ Set custom wait time
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {doneTokens.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-text-dim mb-2">✅ Done ({doneTokens.length})</h3>
            <div className="space-y-2">
              {doneTokens.map(token => (
                <div key={token.id} className="p-3 rounded-xl bg-card border border-border flex items-center gap-3 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center font-bold text-success text-sm">{token.tokenNumber}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{token.customerName}</p>
                    <p className="text-text-dim text-xs">{token.selectedServices.map(s => s.name).join(', ')}</p>
                  </div>
                  <p className="text-sm font-semibold text-success">₹{token.totalPrice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tokens.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3 animate-float">👥</span>
            <p className="text-text-dim font-medium">No customers today yet</p>
            <p className="text-text-dim text-xs mt-1">
              {barberProfile?.isOpen ? 'Waiting for customers to book tokens...' : 'Open your salon to start receiving tokens'}
            </p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
