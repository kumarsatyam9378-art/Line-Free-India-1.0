import { useState, useEffect } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';

export interface CustomerStat {
  customerId: string;
  name: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
}

export default function BarberCustomers() {
  const { user, nextCustomer, getTodayEarnings, barberProfile, t } = useApp();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [editingWait, setEditingWait] = useState<string | null>(null); // tokenId
  const [customWait, setCustomWait] = useState('');
  const [savingWait, setSavingWait] = useState(false);

  // New states for Customer Tab
  const [activeTab, setActiveTab] = useState<'queue' | 'customers'>('queue');
  const [customerStats, setCustomerStats] = useState<CustomerStat[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Customer details modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerStat | null>(null);
  const [customerHistory, setCustomerHistory] = useState<TokenEntry[]>([]);
  const [customerNotes, setCustomerNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

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

  // Load full token history and process customer stats
  useEffect(() => {
    if (!user || activeTab !== 'customers') return;
    setLoadingCustomers(true);

    const loadCustomerStats = async () => {
      try {
        const q = query(collection(db, 'tokens'), where('salonId', '==', user.uid));
        const snap = await getDocs(q);
        const allTokens = snap.docs.map(d => d.data() as TokenEntry);

        const statsMap = new Map<string, CustomerStat>();

        allTokens.forEach(t => {
          if (t.status !== 'done') return;

          const existing = statsMap.get(t.customerId) || {
            customerId: t.customerId,
            name: t.customerName || 'Unknown Customer',
            phone: t.customerPhone || '',
            totalVisits: 0,
            totalSpent: 0,
            lastVisit: '',
          };

          existing.totalVisits += 1;
          existing.totalSpent += (t.totalPrice || 0);

          if (!existing.lastVisit || new Date(t.date) > new Date(existing.lastVisit)) {
            existing.lastVisit = t.date;
          }

          // Use latest name/phone
          if (t.customerName) existing.name = t.customerName;
          if (t.customerPhone) existing.phone = t.customerPhone;

          statsMap.set(t.customerId, existing);
        });

        const statsArray = Array.from(statsMap.values());
        statsArray.sort((a, b) => b.totalVisits - a.totalVisits);
        setCustomerStats(statsArray);
      } catch (e) {
        console.error("Error loading customer stats:", e);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomerStats();
  }, [user, activeTab]);

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

  const handleCustomerClick = async (customer: CustomerStat) => {
    setSelectedCustomer(customer);
    setCustomerNotes('');
    try {
      // Load history
      const q = query(
        collection(db, 'tokens'),
        where('salonId', '==', user!.uid),
        where('customerId', '==', customer.customerId)
      );
      const snap = await getDocs(q);
      const history = snap.docs.map(d => d.data() as TokenEntry).filter(t => t.status === 'done');
      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCustomerHistory(history);

      // Load notes
      const noteDoc = await getDoc(doc(db, `businesses/${user!.uid}/customers`, customer.customerId));
      if (noteDoc.exists() && noteDoc.data().notes) {
        setCustomerNotes(noteDoc.data().notes);
      }
    } catch (e) {
      console.error("Error loading customer details:", e);
    }
  };

  const handleSaveNotes = async () => {
    if (!user || !selectedCustomer) return;
    setSavingNotes(true);
    try {
      await setDoc(doc(db, `businesses/${user.uid}/customers`, selectedCustomer.customerId), {
        notes: customerNotes,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("Error saving notes:", e);
    } finally {
      setSavingNotes(false);
    }
  };

  const filteredCustomers = customerStats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  const getTier = (visits: number) => {
    if (visits >= 10) return { label: 'Gold', color: 'text-gold bg-gold/10 border-gold/20' };
    if (visits >= 5) return { label: 'Silver', color: 'text-primary bg-primary/10 border-primary/20' };
    return { label: 'Bronze', color: 'text-[#CD7F32] bg-[#CD7F32]/10 border-[#CD7F32]/20' };
  };

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
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'queue' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card border border-border text-text-dim'}`}
          >
            📋 Live Queue
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'customers' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card border border-border text-text-dim'}`}
          >
            👥 Customers
          </button>
        </div>

        {activeTab === 'queue' ? (
          <>

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
                      <a href={`tel:${token.customerPhone}`} className="text-primary text-lg">📞</a>
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
        </>
        ) : (
          <div className="animate-fadeIn">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Search customers by name or phone..."
              className="input-field w-full mb-4"
            />

            {loadingCustomers ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-10 p-6 rounded-2xl bg-card border border-dashed border-border">
                <p className="text-text-dim">No customers found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCustomers.map(customer => {
                  const tier = getTier(customer.totalVisits);
                  return (
                    <div
                      key={customer.customerId}
                      onClick={() => handleCustomerClick(customer)}
                      className="p-4 rounded-xl bg-card border border-border flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all hover:border-primary/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-card-2 flex items-center justify-center font-bold text-lg border border-border/50">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate flex items-center gap-2">
                          {customer.name}
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tier.color} uppercase tracking-wider`}>
                            {tier.label}
                          </span>
                        </p>
                        <p className="text-text-dim text-xs truncate">{customer.phone || 'No phone'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-primary text-sm">₹{customer.totalSpent}</p>
                        <p className="text-[10px] text-text-dim">{customer.totalVisits} visits</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col justify-end p-4 sm:p-6 sm:items-center sm:justify-center">
          <div className="bg-bg w-full sm:max-w-md rounded-3xl p-6 shadow-2xl animate-slideUp max-h-[85vh] flex flex-col border border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-text-dim text-sm">{selectedCustomer.phone || 'No phone number'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 rounded-full bg-card-2 flex items-center justify-center text-text-dim hover:text-text transition-colors">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Total Spent</p>
                <p className="font-bold text-primary">₹{selectedCustomer.totalSpent}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Visits</p>
                <p className="font-bold">{selectedCustomer.totalVisits}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border text-center">
                <p className="text-[10px] text-text-dim uppercase tracking-wider mb-1">Tier</p>
                <p className={`font-bold ${getTier(selectedCustomer.totalVisits).color.split(' ')[0]}`}>
                  {getTier(selectedCustomer.totalVisits).label}
                </p>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-5 custom-scrollbar">
              {/* Notes Section */}
              <div>
                <h3 className="text-sm font-bold mb-2 flex justify-between items-center">
                  Private Notes
                  <span className="text-[10px] text-text-dim font-normal">Only you can see this</span>
                </h3>
                <div className="relative">
                  <textarea
                    value={customerNotes}
                    onChange={e => setCustomerNotes(e.target.value)}
                    placeholder="Add preferences, favorite styles, allergies..."
                    className="input-field w-full h-24 resize-none text-sm leading-relaxed"
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="absolute bottom-2 right-2 px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold disabled:opacity-50 shadow-md"
                  >
                    {savingNotes ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* History Section */}
              <div>
                <h3 className="text-sm font-bold mb-3">Visit History</h3>
                {customerHistory.length === 0 ? (
                  <p className="text-text-dim text-xs italic">No past visits recorded.</p>
                ) : (
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                    {customerHistory.map((visit, i) => (
                      <div key={visit.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-bg bg-primary/20 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-shrink-0 relative z-10 text-xs font-bold">
                          #{visit.tokenNumber}
                        </div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl bg-card border border-border shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold">{new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="text-xs font-bold text-primary">₹{visit.totalPrice}</span>
                          </div>
                          <p className="text-[10px] text-text-dim leading-tight">
                            {visit.selectedServices?.map(s => s.name).join(', ') || 'No services listed'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
