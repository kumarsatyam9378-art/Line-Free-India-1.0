import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function OpenBadge({ isOpen, className }: { isOpen: boolean; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
      isOpen
        ? "bg-success/10 text-success border border-success/20"
        : "bg-error/10 text-error border border-error/20",
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full animate-pulse",
        isOpen ? "bg-success" : "bg-error"
      )} />
      {isOpen ? 'Open Now' : 'Closed'}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 bg-[#1DA1F2]/10 text-[#1DA1F2] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-[#1DA1F2]/20",
      className
    )}>
      <span className="text-[12px]">✓</span> Verified
    </span>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 bg-gradient-to-r from-gold/20 to-gold/10 text-gold px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-gold/20",
      className
    )}>
      <span className="text-[12px]">⭐</span> Featured
    </span>
  );
}

export function PopularBadge({ className }: { className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 bg-gradient-to-r from-primary to-accent text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm",
      className
    )}>
      <span className="text-[12px]">🔥</span> Popular
    </span>
  );
}
