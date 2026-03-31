import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BusinessProfile } from '../../store/AppContext';
import { BusinessCategoryInfo } from '../../constants/businessRegistry';
import { VerifiedBadge } from './BusinessBadges';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface BusinessHeroProps {
  business: BusinessProfile;
  businessType: BusinessCategoryInfo;
  onBack?: () => void;
  onShare?: () => void;
  className?: string;
}

export default function BusinessHero({
  business,
  businessType,
  onBack,
  onShare,
  className
}: BusinessHeroProps) {

  const coverUrl = business.bannerImageURL
    ? `${business.bannerImageURL.split('upload/').join('upload/f_auto,q_auto,w_1200/')}`
    : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';

  const logoUrl = business.photoURL
    ? `${business.photoURL.split('upload/').join('upload/f_auto,q_auto,w_200,c_fill,ar_1:1/')}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(business.businessName || business.name)}&background=random&size=200`;

  const isVerified = (business as any).isVerified || false; // Mock verified status

  return (
    <div className={cn("relative w-full h-[320px] md:h-[400px] overflow-hidden", className)}>
      <motion.img
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        src={coverUrl}
        alt={business.businessName}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* Top Actions */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex justify-between items-center z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
          aria-label="Go Back"
        >
          <span className="text-xl">←</span>
        </button>
        <button
          onClick={onShare}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
          aria-label="Share"
        >
          <span className="text-xl">🔗</span>
        </button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-end gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-xl flex-shrink-0"
          >
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 pb-1"
          >
            <div className="flex items-center gap-2 mb-1">
              {isVerified && <VerifiedBadge />}
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-md shadow-sm border border-white/20" style={{ backgroundColor: businessType.colorPrimary }}>
                {businessType.icon} {businessType.label.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {business.businessName || business.name}
            </h1>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
