import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenEntry } from '../../store/AppContext';
import { useApp } from '../../store/AppContext';
import { toast } from 'react-hot-toast';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export interface LiveQueueDisplayProps {
  businessId: string;
}

export default function LiveQueueDisplay({ businessId }: LiveQueueDisplayProps) {
  const { nextCustomer } = useApp();
  const [tokens, setTokens] = useState<TokenEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const q = query(
      collection(db, 'tokens'),
      where('salonId', '==', businessId),
      where('date', '==', todayStr)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveTokens: TokenEntry[] = [];
      snapshot.forEach((doc) => {
        liveTokens.push({ id: doc.id, ...doc.data() } as TokenEntry);
      });
      setTokens(liveTokens);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to live queue:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [businessId]);

  const waitingTokens = tokens.filter(t => t.status === 'waiting').sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
  const servingTokens = tokens.filter(t => t.status === 'serving');

  const handleNext = async () => {
    await nextCustomer();
    toast.success('Called next customer');
  };

  const handleSkip = async (tokenId: string) => {
    try {
      await updateDoc(doc(db, 'tokens', tokenId), { status: 'cancelled' });
      toast.error('Skipped customer');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading queue...</div>;

  return (
    <div className="bg-card border border-border p-5 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Live Queue</h2>
        <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          {waitingTokens.length} Waiting
        </span>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <h3 className="text-text-dim text-xs uppercase font-bold tracking-wider mb-2">Currently Serving</h3>
        {servingTokens.length > 0 ? (
          servingTokens.map(t => (
            <div key={t.id} className="flex justify-between items-center">
              <div>
                <span className="text-4xl font-black gradient-text">#{t.tokenNumber}</span>
                <p className="font-medium text-lg">{t.customerName}</p>
              </div>
              <button onClick={handleNext} className="btn-primary py-2 px-4 shadow-sm">
                Done & Next
              </button>
            </div>
          ))
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-text-dim">None</span>
            <button onClick={handleNext} disabled={waitingTokens.length === 0} className="btn-primary py-2 px-4 shadow-sm disabled:opacity-50">
              Call Next
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-text-dim text-xs uppercase font-bold tracking-wider">Up Next</h3>
        <AnimatePresence>
          {waitingTokens.length > 0 ? (
            waitingTokens.map(t => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between p-3 rounded-xl bg-card-2 border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-text-dim">#{t.tokenNumber}</span>
                  <div>
                    <p className="font-medium">{t.customerName}</p>
                    <p className="text-xs text-text-dim truncate max-w-[150px]">
                      {t.selectedServices.map(s => s.name).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${t.customerPhone}`} className="p-2 rounded-lg bg-card border border-border text-text-dim hover:text-primary">
                    📞
                  </a>
                  <button onClick={() => t.id && handleSkip(t.id)} className="p-2 rounded-lg bg-card border border-border text-text-dim hover:text-danger">
                    ⏭️
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-text-dim border border-dashed border-border rounded-xl">
              No customers waiting in queue
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
