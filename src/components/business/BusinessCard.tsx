import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BusinessProfile } from '../../store/AppContext';
import { BusinessCategoryInfo } from '../../constants/businessRegistry';
import { OpenBadge, VerifiedBadge, PopularBadge } from './BusinessBadges';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface BusinessCardProps {
  business: BusinessProfile;
  businessType: BusinessCategoryInfo;
  variant?: 'list' | 'grid' | 'featured';
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  onPress?: () => void;
  className?: string;
}

export default function BusinessCard({
  business,
  businessType,
  variant = 'list',
  onFavorite,
  isFavorite = false,
  onPress,
  className
}: BusinessCardProps) {

  const coverUrl = business.bannerImageURL
    ? `${business.bannerImageURL.split('upload/').join('upload/f_auto,q_auto,w_800/')}`
    : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';

  const logoUrl = business.photoURL
    ? `${business.photoURL.split('upload/').join('upload/f_auto,q_auto,w_150,c_fill,ar_1:1/')}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(business.businessName || business.name)}&background=random`;

  const rating = business.rating || 0;
  const reviewCount = business.totalReviews || 0;

  // Fake distance for UI if not available
  const distance = "2.3 km";

  // Estimate wait time based on queue
  const isQueueBased = !businessType.hasTimedSlots;
  const queueWait = isQueueBased
    ? (business.currentToken < business.totalTokensToday
        ? `${(business.totalTokensToday - business.currentToken) * (businessType.defaultServices[0]?.avgTime || 15)} min wait`
        : 'No Wait')
    : 'Book Now';

  const cardMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
  };

  const isVerified = (business as any).isVerified || false; // Mock verified status
  const isPopular = reviewCount > 10 && rating > 4.5;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) onFavorite(business.uid);
  };

  if (variant === 'grid') {
    return (
      <motion.div
        {...cardMotion}
        onClick={onPress}
        className={cn(
          "bg-card border border-border rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow",
          className
        )}
      >
        <div className="relative h-32 bg-card-2">
          <img src={coverUrl} alt={business.businessName} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>

          <div className="absolute bottom-2 left-2 flex gap-1">
            <span className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold text-white",
            )} style={{ backgroundColor: businessType.colorPrimary }}>
              {businessType.icon} {businessType.label}
            </span>
          </div>
        </div>

        <div className="p-3 relative">
          <img
            src={logoUrl}
            alt="Logo"
            className="absolute -top-8 right-3 w-12 h-12 rounded-full border-2 border-card object-cover bg-card shadow-sm"
          />

          <h3 className="font-bold text-sm leading-tight text-text truncate pr-12">{business.businessName || business.name}</h3>

          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className="text-gold">★</span>
            <span className="font-semibold">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
            {reviewCount > 0 && <span className="text-text-dim">({reviewCount})</span>}
            <span className="text-text-dim mx-1">•</span>
            <span className="text-text-dim">{distance}</span>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <OpenBadge isOpen={business.isOpen && !business.isStopped} />
            <span className="text-xs font-semibold text-primary">{queueWait}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        {...cardMotion}
        onClick={onPress}
        className={cn(
          "relative h-[280px] w-full rounded-2xl overflow-hidden cursor-pointer group shadow-md",
          className
        )}
      >
        <img src={coverUrl} alt={business.businessName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isPopular && <PopularBadge />}
          {isVerified && <VerifiedBadge />}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-2 py-0.5 rounded-md text-xs font-bold text-white shadow-sm",
            )} style={{ backgroundColor: businessType.colorPrimary }}>
              {businessType.icon} {businessType.label}
            </span>
            <span className="text-white text-xs font-medium px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm border border-white/20">
              {distance}
            </span>
          </div>

          <h3 className="font-bold text-2xl text-white mb-1">{business.businessName || business.name}</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-white/90">
              <span className="text-gold">★</span>
              <span className="font-semibold">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
              {reviewCount > 0 && <span className="opacity-80">({reviewCount})</span>}
            </div>

            <OpenBadge isOpen={business.isOpen && !business.isStopped} />
          </div>
        </div>
      </motion.div>
    );
  }

  // Default List Variant
  return (
    <motion.div
      {...cardMotion}
      onClick={onPress}
      className={cn(
        "flex gap-3 bg-card border border-border rounded-2xl p-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-card-2">
        <img src={coverUrl} alt={business.businessName} className="w-full h-full object-cover" loading="lazy" />

        <button
          onClick={handleFavoriteClick}
          className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-xs"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        <img
          src={logoUrl}
          alt="Logo"
          className="absolute bottom-1 left-1 w-8 h-8 rounded-full border-2 border-white object-cover bg-white shadow-sm"
        />
      </div>

      <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-0.5">
            <span className="text-[10px] font-bold tracking-wider" style={{ color: businessType.colorPrimary }}>
              {businessType.label.toUpperCase()}
            </span>
            {isVerified && <VerifiedBadge />}
          </div>

          <h3 className="font-bold text-base leading-tight text-text truncate max-w-[200px]">{business.businessName || business.name}</h3>

          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className="text-gold">★</span>
            <span className="font-semibold text-text">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
            {reviewCount > 0 && <span className="text-text-dim">({reviewCount})</span>}
            <span className="text-text-dim mx-1">•</span>
            <span className="text-text-dim">{distance}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <OpenBadge isOpen={business.isOpen && !business.isStopped} />
          <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-lg">
            {queueWait}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
