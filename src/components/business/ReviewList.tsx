// src/components/business/ReviewList.tsx
import React, { useState, useMemo } from 'react';
import ReviewCard from './ReviewCard';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  tags?: string[];
  photos?: string[];
  createdAt: number;
  ownerReply?: string;
}

interface ReviewListProps {
  reviews: Review[];
  onReplyClick?: (reviewId: string) => void;
  isOwnerView?: boolean;
}

export default function ReviewList({ reviews, onReplyClick, isOwnerView }: ReviewListProps) {
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest');

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, breakdown: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const breakdown = [0, 0, 0, 0, 0];
    reviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) breakdown[r.rating - 1]++; });
    return { avg: (sum / reviews.length).toFixed(1), breakdown };
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sort === 'newest') return b.createdAt - a.createdAt;
      if (sort === 'highest') return b.rating - a.rating;
      if (sort === 'lowest') return a.rating - b.rating;
      return 0;
    });
  }, [reviews, sort]);

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <span className="text-4xl block mb-3 opacity-50">⭐</span>
        <p className="text-text-dim font-medium">No reviews yet</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Card */}
      <div className="p-5 rounded-3xl bg-card border border-border mb-6 flex items-center gap-6 shadow-sm">
        <div className="text-center">
          <p className="text-4xl font-black text-text">{stats.avg}</p>
          <div className="flex justify-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className={`text-sm ${s <= parseFloat(stats.avg) ? 'text-gold' : 'text-text-dim/30'}`}>★</span>
            ))}
          </div>
          <p className="text-xs text-text-dim font-medium">{reviews.length} reviews</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const count = stats.breakdown[star - 1];
            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-text-dim w-3">{star}</span>
                <span className="text-gold text-xs">★</span>
                <div className="flex-1 h-2 bg-background rounded-full overflow-hidden border border-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-lg">Reviews</h3>
        <select
          value={sort}
          onChange={(e: any) => setSort(e.target.value)}
          className="bg-transparent border-none text-sm font-semibold text-primary outline-none focus:ring-0 cursor-pointer"
        >
          <option value="newest" className="bg-popover text-text">Newest</option>
          <option value="highest" className="bg-popover text-text">Highest Rated</option>
          <option value="lowest" className="bg-popover text-text">Lowest Rated</option>
        </select>
      </div>

      {/* Review List */}
      <div className="space-y-4 columns-1 md:columns-2 gap-4">
        <AnimatePresence>
          {sortedReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              onReplyClick={onReplyClick}
              isOwnerView={isOwnerView}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
