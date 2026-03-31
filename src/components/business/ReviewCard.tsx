// src/components/business/ReviewCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  review: {
    id: string;
    customerName: string;
    customerAvatar?: string;
    rating: number;
    comment: string;
    tags?: string[];
    photos?: string[];
    createdAt: number;
    ownerReply?: string;
  };
  onReplyClick?: (reviewId: string) => void;
  isOwnerView?: boolean;
}

export default function ReviewCard({ review, onReplyClick, isOwnerView }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-3xl bg-card border border-border shadow-sm mb-4 break-inside-avoid"
    >
      {/* Customer Info & Stars */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {review.customerAvatar ? (
            <img src={review.customerAvatar} alt={review.customerName} className="w-10 h-10 rounded-full object-cover border border-border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {review.customerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-sm text-text">{review.customerName}</p>
            <p className="text-[10px] text-text-dim">{formattedDate}</p>
          </div>
        </div>

        <div className="flex gap-0.5 bg-gold/10 px-2 py-1 rounded-full border border-gold/20">
          {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={`text-xs ${s <= review.rating ? 'text-gold' : 'text-text-dim/30'}`}>★</span>
          ))}
        </div>
      </div>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {review.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-background border border-border text-[10px] font-medium text-text-dim">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Review Text */}
      {review.comment && (
        <p className="text-sm text-text/90 leading-relaxed mb-3">{review.comment}</p>
      )}

      {/* Photos Carousel */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex overflow-x-auto gap-2 mb-3 pb-1 no-scrollbar -mx-4 px-4">
          {review.photos.map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt="Review attachment"
              className="h-24 w-24 object-cover rounded-xl shrink-0 border border-border"
            />
          ))}
        </div>
      )}

      {/* Owner Reply */}
      {review.ownerReply ? (
        <div className="mt-4 p-3 rounded-2xl bg-primary/5 border-l-2 border-primary">
          <p className="text-xs font-bold text-primary mb-1">Response from owner</p>
          <p className="text-sm text-text/80">{review.ownerReply}</p>
        </div>
      ) : isOwnerView ? (
        <button
          onClick={() => onReplyClick?.(review.id)}
          className="mt-2 text-xs font-semibold text-primary hover:underline active:opacity-70"
        >
          ↩ Reply to review
        </button>
      ) : null}
    </motion.div>
  );
}
