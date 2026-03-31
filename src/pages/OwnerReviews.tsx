// src/pages/OwnerReviews.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import BackButton from '../components/BackButton';
import BottomNav from '../components/BottomNav';
import ReviewList from '../components/business/ReviewList';
import toast from 'react-hot-toast';

export default function OwnerReviews() {
  const { user, profile } = useApp();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'reviews'),
          where('businessId', '==', user.uid)
          // orderBy('createdAt', 'desc') // Requires index
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort manually if index is not ready
        data.sort((a: any, b: any) => b.createdAt - a.createdAt);
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        ownerReply: replyText,
        updatedAt: Date.now()
      });

      setReviews(reviews.map(r =>
        r.id === reviewId ? { ...r, ownerReply: replyText } : r
      ));

      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply posted');
    } catch (err) {
      console.error('Error replying:', err);
      toast.error('Failed to post reply');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/home" />

        <div className="flex items-center justify-between mt-2 mb-6">
          <h1 className="text-2xl font-black tracking-tight">⭐ Reviews</h1>
          <div className="bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-bold border border-gold/20 flex items-center gap-1">
            {profile?.rating || '0.0'} ★
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-32 rounded-3xl bg-card animate-pulse" />
            <div className="h-48 rounded-3xl bg-card animate-pulse" />
            <div className="h-48 rounded-3xl bg-card animate-pulse" />
          </div>
        ) : (
          <ReviewList
            reviews={reviews}
            isOwnerView={true}
            onReplyClick={(id) => setReplyingTo(id)}
          />
        )}
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-all animate-slideUp">
            <h3 className="text-xl font-bold mb-4">Reply to Review</h3>
            <textarea
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Thank you for your feedback! We're glad you enjoyed..."
              className="w-full bg-background border border-border rounded-2xl p-4 text-sm h-32 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                className="flex-1 py-3.5 rounded-2xl font-bold bg-background border border-border text-text hover:bg-border/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReplySubmit(replyingTo)}
                disabled={!replyText.trim()}
                className="flex-1 py-3.5 rounded-2xl font-bold bg-primary text-white disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
